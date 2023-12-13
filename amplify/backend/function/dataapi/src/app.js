const express = require("express");
const bodyParser = require("body-parser");
const awsServerlessExpressMiddleware = require("aws-serverless-express/middleware");
const {
  addTaxDataToCustomer,
  createCustomer,
  deleteCustomer,
  deleteTaxDataFromCustomer,
  getCustomer,
  getCustomers,
  updateCustomer,
} = require("./db");
const { validateCustomer, validateTaxData } = require("./validation");

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

app.post("/customers/:id/tax-data", async function (req, res) {
  try {
    const customerId = req.params.id;
    const taxData = req.body;
    validateTaxData(taxData);
    const insertedTaxData = await addTaxDataToCustomer(customerId, taxData);
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

app.delete("/customers/:id", async function (req, res) {
  const id = req.params.id;
  await deleteCustomer(id);
  res.json({ message: "Customer deleted" });
});

app.delete("/customers/:id/tax-data", async function (req, res) {
  const customerId = req.params.id;
  await deleteTaxDataFromCustomer(customerId);
  res.json({ message: `Tax data for customer ${customerId} deleted` });
});

app.listen(3000, function () {
  console.log("App started");
});

module.exports = app;
