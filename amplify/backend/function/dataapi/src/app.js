const express = require("express");
const bodyParser = require("body-parser");
const awsServerlessExpressMiddleware = require("aws-serverless-express/middleware");
const {
  addExternalLinkToCustomer,
  createCustomer,
  createCustomerMainAddress,
  createCustomerSecondaryAddress,
  deleteCustomer,
  deleteExternalLinkFromCustomer,
  deleteMainAddressFromCustomer,
  deleteTaxDataFromCustomer,
  deleteSecondaryAddressFromCustomer,
  editExternalLinkFromCustomer,
  getCustomer,
  getCustomerSecondaryAddresses,
  getCustomers,
  setCustomerTaxData,
  updateCustomer,
  getCustomerMainAddress,
} = require("./db");
const {
  validateCustomer,
  validateTaxData,
  validateCustomerAddress,
} = require("./validation");

// declare a new express app
const app = express();
app.use(bodyParser.json());
app.use(awsServerlessExpressMiddleware.eventContext());

// Enable CORS for all methods
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");
  next();
});

app.get("/customers", async function (req, res) {
  const nextTokenParam = req.query?.nextToken;
  const searchInput = req.query?.search;
  const { items, nextToken } = await getCustomers(nextTokenParam, searchInput);
  res.json({ customers: items, nextToken });
});

app.get("/customers/:id", async function (req, res) {
  const id = req.params.id;
  const customer = await getCustomer(id);
  if (!customer) {
    res.status(404).json({ error: "Customer not found" });
    return;
  }
  res.json({ customer });
});

app.get("/customers/:id/main-address", async function (req, res) {
  try {
    const id = req.params.id;
    const mainAddress = await getCustomerMainAddress(id);
    res.json({ mainAddress });
  } catch (e) {
    if (e.message === "Customer not found") {
      res.status(404).json({ error: e.message });
      return;
    }
    throw e;
  }
});

app.get("/customers/:id/secondary-addresses", async function (req, res) {
  try {
    const id = req.params.id;
    const nextTokenParam = req.query?.nextToken;
    const { items: secondaryAddresses, nextToken } =
      await getCustomerSecondaryAddresses(id, nextTokenParam);
    res.json({ secondaryAddresses, nextToken });
  } catch (e) {
    if (e.message === "Customer not found") {
      res.status(404).json({ error: e.message });
      return;
    }
    throw e;
  }
});

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

app.post("/customers/:id/external-link", async function (req, res) {
  try {
    const customerId = req.params.id;
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

app.post("/customers/:id/main-address", async function (req, res) {
  try {
    const customerId = req.params.id;
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

app.post("/customers/:id/tax-data", async function (req, res) {
  try {
    const customerId = req.params.id;
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

app.post("/customers/:id/secondary-address", async function (req, res) {
  try {
    const customerId = req.params.id;
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

app.put("/customers/:id/tax-data", async function (req, res) {
  try {
    const customerId = req.params.id;
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

app.put("/customers/:id", async function (req, res) {
  try {
    const id = req.params.id;
    const customer = req.body;
    validateCustomer(customer);
    const updatedCustomer = await updateCustomer(id, customer);
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

app.put("/customers/:id/external-link/:index", async function (req, res) {
  const id = req.params.id;
  const index = req.params.index;
  const url = req.body.url;
  const newUrl = await editExternalLinkFromCustomer(id, index, url);
  res.json({ url: newUrl });
});

app.delete("/customers/:id", async function (req, res) {
  const id = req.params.id;
  await deleteCustomer(id);
  res.json({ message: "Customer deleted" });
});

app.delete("/customers/:id/external-link/:index", async function (req, res) {
  const id = req.params.id;
  const index = req.params.index;
  await deleteExternalLinkFromCustomer(id, index);
  res.json({ message: "External link deleted" });
});

app.delete("/customers/:id/tax-data", async function (req, res) {
  const customerId = req.params.id;
  await deleteTaxDataFromCustomer(customerId);
  res.json({ message: `Tax data for customer ${customerId} deleted` });
});

app.delete("/customers/:id/main-address", async function (req, res) {
  const customerId = req.params.id;
  await deleteMainAddressFromCustomer(customerId);
  res.json({ message: `Main address for customer ${customerId} deleted` });
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

app.listen(3000, function () {
  console.log("App started");
});

module.exports = app;
