const express = require("express");
const bodyParser = require("body-parser");
const awsServerlessExpressMiddleware = require("aws-serverless-express/middleware");
const {
  addExternalLinkToCustomer,
  createCustomer,
  createCustomerMainAddress,
  createCustomerSecondaryAddress,
  createJob,
  deleteCustomer,
  deleteExternalLinkFromCustomer,
  deleteJob,
  deleteMainAddressFromCustomer,
  deleteTaxDataFromCustomer,
  deleteSecondaryAddressFromCustomer,
  editCustomer,
  editCustomerMainAddress,
  editExternalLinkFromCustomer,
  editJob,
  editSecondaryAddressFromCustomer,
  getAddresses,
  getCustomer,
  getCustomerAddresses,
  getCustomerMainAddress,
  getCustomerSecondaryAddress,
  getCustomers,
  getJob,
  getJobAddresses,
  getJobCustomers,
  getJobs,
  setCustomerTaxData,
} = require("./db");
const {
  validateCustomer,
  validateTaxData,
  validateCustomerAddress,
} = require("./validation");
const {
  mapAddressIDsFromQuery,
  mapJobFromRequestBody,
  mapJobFilters,
} = require("./mapper");
const {
  extractAuthData,
  getUserInfo,
  getJobUsers,
} = require("./authentication");

const { emailCustomerAboutJob } = require("./mailer");

// declare a new express app
const app = express();
app.use(bodyParser.json());
app.use(awsServerlessExpressMiddleware.eventContext());

// Enable CORS for all methods
app.use(async function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");
  req.authData = await extractAuthData(req);
  next();
});

// GET requests

app.get("/addresses", async function (req, res) {
  const nextTokenParam = req.query?.nextToken;
  const searchInput = req.query?.search;
  const excludedAddresses = mapAddressIDsFromQuery(req.query?.excludedIds);
  const includedAddresses = mapAddressIDsFromQuery(req.query?.includedIds);
  const { items, nextToken } = await getAddresses(
    nextTokenParam,
    searchInput,
    excludedAddresses,
    includedAddresses
  );
  res.json({ addresses: items, nextToken });
});

app.get("/customers", async function (req, res) {
  const nextTokenParam = req.query?.nextToken;
  const searchInput = req.query?.search;
  const { items, nextToken } = await getCustomers(nextTokenParam, searchInput);
  res.json({ customers: items, nextToken });
});

app.get("/customers/:customerId", async function (req, res) {
  const id = req.params.customerId;
  const customer = await getCustomer(id);
  if (!customer) {
    res.status(404).json({ error: "Customer not found" });
    return;
  }
  res.json({ customer });
});

app.get("/customers/:customerId/addresses", async function (req, res) {
  try {
    const id = req.params.customerId;
    const nextTokenParam = req.query?.nextToken;
    const { items: addresses, nextToken } = await getCustomerAddresses(
      id,
      nextTokenParam
    );
    res.json({ addresses, nextToken });
  } catch (e) {
    if (e.message === "Customer not found") {
      res.status(404).json({ error: e.message });
      return;
    }
    throw e;
  }
});

app.get("/customers/:customerId/main-address", async function (req, res) {
  try {
    const customerId = req.params.customerId;
    const mainAddress = await getCustomerMainAddress(customerId);
    res.json({ mainAddress });
  } catch (e) {
    if (e.message === "Customer not found") {
      res.status(404).json({ error: e.message });
      return;
    }
    throw e;
  }
});

app.get(
  "/customers/:customerId/secondary-address/:addressId",
  async function (req, res) {
    try {
      const customerId = req.params.customerId;
      const addressId = req.params.addressId;
      const secondaryAddress = await getCustomerSecondaryAddress(
        customerId,
        addressId
      );
      res.json({ secondaryAddress });
    } catch (e) {
      if (e.message === "Customer not found") {
        res.status(404).json({ error: e.message });
        return;
      }
      throw e;
    }
  }
);

app.get("/jobs", async function (req, res) {
  const { addressId, customerId, from, to } = mapJobFilters(req.query);
  const order = req.query?.order;
  const paginate = req.query?.paginate !== "false";
  const nextTokenParam = req.query?.nextToken;
  const userSub = req.authData?.userSub;
  const groups = req.authData?.groups;
  const isAdmin = groups?.includes("Admin");
  let { items: jobs, nextToken } = await getJobs(
    {
      addressId,
      customerId,
      from,
      to,
      // Filter only for non-admins
      assignedTo: isAdmin ? undefined : userSub,
    },
    order,
    nextTokenParam,
    paginate
  );
  if (isAdmin) {
    jobs = await getJobUsers(jobs);
  } else {
    jobs = jobs.map((job) => ({
      ...job,
      assignedTo: undefined,
    }));
  }
  res.json({ jobs, nextToken });
});

app.get("/jobs/:jobId", async function (req, res) {
  const jobId = req.params.jobId;
  const userSub = req.authData?.userSub;
  const job = await getJob(jobId);
  const groups = req.authData?.groups;
  const isAdmin = groups?.includes("Admin");
  if (job.assignedTo !== userSub && !isAdmin) {
    res.status(403).json({ error: "You are not allowed to access this job" });
    return;
  }
  if (!job) {
    res.status(404).json({ error: "Job not found" });
    return;
  }
  if (isAdmin) {
    const userInfo = await getUserInfo(job.assignedTo);
    job.assignedTo = userInfo;
  } else {
    job.assignedTo = undefined;
  }
  res.json({ job });
});

app.get("/jobs/:jobId/addresses", async function (req, res) {
  const jobId = req.params.jobId;
  const nextTokenParam = req.query?.nextToken;
  const { addresses, nextToken } = await getJobAddresses(jobId, nextTokenParam);
  res.json({ addresses, nextToken });
});

// POST requests

app.post("/customers", async function (req, res) {
  try {
    const customer = req.body;
    validateCustomer(customer);
    const createdCustomer = await createCustomer(customer);
    res.json({ customer: createdCustomer });
  } catch (e) {
    if (e.message === "This email already exists") {
      res.status(400).json({ error: e.message });
      return;
    }
    if (e.message === "Email is required") {
      res.status(400).json({ error: e.message });
      return;
    }
    throw e;
  }
});

app.post("/customers/:customerId/external-link", async function (req, res) {
  try {
    const customerId = req.params.customerId;
    const { url } = req.body;
    const insertedUrl = await addExternalLinkToCustomer(customerId, url);
    res.json({ url: insertedUrl });
  } catch (e) {
    if (e.message === "Customer not found") {
      res.status(404).json({ error: e.message });
      return;
    }
    throw e;
  }
});

app.post("/customers/:customerId/main-address", async function (req, res) {
  try {
    const customerId = req.params.customerId;
    const mainAddress = req.body;
    validateCustomerAddress(mainAddress);
    const insertedMainAddress = await createCustomerMainAddress(
      customerId,
      mainAddress
    );
    res.json({ mainAddress: insertedMainAddress });
  } catch (e) {
    if (e.message === "Street is required") {
      res.status(400).json({ error: e.message });
      return;
    }
    if (e.message === "City is required") {
      res.status(400).json({ error: e.message });
      return;
    }
    if (e.message === "State is required") {
      res.status(400).json({ error: e.message });
      return;
    }
    if (e.message === "Postcode is required") {
      res.status(400).json({ error: e.message });
      return;
    }
    if (e.message === "Customer not found") {
      res.status(404).json({ error: e.message });
      return;
    }
    throw e;
  }
});

app.post("/customers/:customerId/tax-data", async function (req, res) {
  try {
    const customerId = req.params.customerId;
    const taxData = req.body;
    validateTaxData(taxData);
    const insertedTaxData = await setCustomerTaxData(customerId, taxData);
    res.json({ taxData: insertedTaxData });
  } catch (e) {
    if (e.message === "Tax ID is required") {
      res.status(400).json({ error: e.message });
      return;
    }
    if (e.message === "Company name is required") {
      res.status(400).json({ error: e.message });
      return;
    }
    if (e.message === "Company address is required") {
      res.status(400).json({ error: e.message });
      return;
    }
    if (e.message === "Customer not found") {
      res.status(404).json({ error: e.message });
      return;
    }
    throw e;
  }
});

app.post("/customers/:customerId/secondary-address", async function (req, res) {
  try {
    const customerId = req.params.customerId;
    const secondaryAddress = req.body;
    validateCustomerAddress(secondaryAddress);
    const insertedSecondaryAddress = await createCustomerSecondaryAddress(
      customerId,
      secondaryAddress
    );
    res.json({ secondaryAddress: insertedSecondaryAddress });
  } catch (e) {
    if (e.message === "Street is required") {
      res.status(400).json({ error: e.message });
      return;
    }
    if (e.message === "City is required") {
      res.status(400).json({ error: e.message });
      return;
    }
    if (e.message === "State is required") {
      res.status(400).json({ error: e.message });
      return;
    }
    if (e.message === "Postcode is required") {
      res.status(400).json({ error: e.message });
      return;
    }
    if (e.message === "Customer not found") {
      res.status(404).json({ error: e.message });
      return;
    }
    throw e;
  }
});

app.post("/jobs", async function (req, res) {
  try {
    const job = req.body;
    const userSub = req.authData?.userSub;
    const groups = req.authData?.groups;
    const isAdmin = groups?.includes("Admin");
    // The job is assigned to the user that is creating it by default
    let assignedTo = userSub;
    // If the user is an admin and the job has an assignedTo field, use that value
    // instead of the user that is creating the job
    if (isAdmin && job?.assignedTo) {
      assignedTo = job.assignedTo;
    }
    const mappedJob = mapJobFromRequestBody(job, assignedTo);
    const createdJob = await createJob(mappedJob);
    res.json({ job: createdJob });
  } catch (e) {
    if (e.message === "Address does not exist") {
      res.status(400).json({ error: e.message });
      return;
    }
    throw e;
  }
});

app.post("/notifications/job-created/:jobId", async function (req, res) {
  const jobId = req.params.jobId;
  const job = await getJob(jobId);
  if (!job) {
    res.status(404).json({ error: "Job not found" });
    return;
  }
  const customers = await getJobCustomers(jobId);
  for (const customer of customers) {
    await emailCustomerAboutJob(customer, job);
  }
  res.json({ message: "Notification sent" });
});

// PUT requests

app.put("/customers/:customerId", async function (req, res) {
  try {
    const id = req.params.customerId;
    const customer = req.body;
    validateCustomer(customer);
    const updatedCustomer = await editCustomer(id, customer);
    res.json({ customer: updatedCustomer });
  } catch (e) {
    if (e.message === "Email is required") {
      res.status(400).json({ error: e.message });
      return;
    }
    if (e.message === "This email already exists") {
      res.status(400).json({ error: e.message });
      return;
    }
    throw e;
  }
});

app.put(
  "/customers/:customerId/external-link/:index",
  async function (req, res) {
    const id = req.params.customerId;
    const index = req.params.index;
    const url = req.body.url;
    const newUrl = await editExternalLinkFromCustomer(id, index, url);
    res.json({ url: newUrl });
  }
);

app.put("/customers/:customerId/main-address", async function (req, res) {
  try {
    const id = req.params.customerId;
    const address = req.body;
    const updatedAddress = await editCustomerMainAddress(id, address);
    res.json({ mainAddress: updatedAddress });
  } catch (e) {
    if (e.message === "Email is required") {
      res.status(400).json({ error: e.message });
      return;
    }
    if (e.message === "This email already exists") {
      res.status(400).json({ error: e.message });
      return;
    }
    throw e;
  }
});

app.put(
  "/customers/:customerId/secondary-addresses/:address_id",
  async function (req, res) {
    const customerId = req.params.customerId;
    const addressId = req.params.address_id;
    const updatedAddress = req.body;
    const newAddress = await editSecondaryAddressFromCustomer(
      customerId,
      addressId,
      updatedAddress
    );
    res.json({ secondaryAddress: newAddress });
  }
);

app.put("/customers/:customerId/tax-data", async function (req, res) {
  try {
    const customerId = req.params.customerId;
    const taxData = req.body;
    validateTaxData(taxData);
    const updatedTaxData = await setCustomerTaxData(customerId, taxData);
    res.json({ taxData: updatedTaxData });
  } catch (e) {
    if (e.message === "Tax ID is required") {
      res.status(400).json({ error: e.message });
      return;
    }
    if (e.message === "Company name is required") {
      res.status(400).json({ error: e.message });
      return;
    }
    if (e.message === "Company address is required") {
      res.status(400).json({ error: e.message });
      return;
    }
    if (e.message === "Customer not found") {
      res.status(404).json({ error: e.message });
      return;
    }
    throw e;
  }
});

app.put("/jobs/:jobId", async function (req, res) {
  const jobId = req.params.jobId;
  const job = req.body;
  const mappedJob = mapJobFromRequestBody(job);
  const updatedJob = await editJob(jobId, mappedJob);
  res.json({ job: updatedJob });
});

// DELETE requests

app.delete("/customers/:customerId", async function (req, res) {
  const id = req.params.customerId;
  await deleteCustomer(id);
  res.json({ message: "Customer deleted" });
});

app.delete(
  "/customers/:customerId/external-link/:index",
  async function (req, res) {
    const id = req.params.customerId;
    const index = req.params.index;
    await deleteExternalLinkFromCustomer(id, index);
    res.json({ message: "External link deleted" });
  }
);

app.delete("/customers/:customerId/main-address", async function (req, res) {
  const customerId = req.params.customerId;
  await deleteMainAddressFromCustomer(customerId);
  res.json({ message: `Main address for customer ${customerId} deleted` });
});

app.delete("/customers/:customerId/tax-data", async function (req, res) {
  const customerId = req.params.customerId;
  await deleteTaxDataFromCustomer(customerId);
  res.json({ message: `Tax data for customer ${customerId} deleted` });
});

app.delete(
  "/customers/:customer_id/secondary-address/:address_id",
  async function (req, res) {
    const customerId = req.params.customer_id;
    const addressId = req.params.address_id;
    await deleteSecondaryAddressFromCustomer(customerId, addressId);
    res.json({
      message: `Secondary address ${addressId} for customer ${customerId} deleted`,
    });
  }
);

app.delete("/jobs/:jobId", async function (req, res) {
  const jobId = req.params.jobId;
  await deleteJob(jobId);
  res.json({ message: "Job deleted" });
});

app.listen(3000, function () {
  console.log("App started");
});

module.exports = app;
