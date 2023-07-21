const express = require("express");
const bodyParser = require("body-parser");
const awsServerlessExpressMiddleware = require("aws-serverless-express/middleware");
const {
  createCustomer,
  getCustomer,
  getCustomers,
  updateCustomer,
} = require("./db");
const { validateCustomer } = require("./validation");

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

/**********************
 * Example get method *
 **********************/

app.get("/customers", async function (_, res) {
  const customers = await getCustomers();
  res.json({ customers });
});

app.get("/customers/*", async function (req, res) {
  const id = req.params[0];
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

app.put("/customers/*", async function (req, res) {
  try {
    const id = req.params[0];
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

app.delete("/customers/*", function (req, res) {
  // Add your code here
  res.json({ success: "delete call succeed!", url: req.url });
});

app.listen(3000, function () {
  console.log("App started");
});

// Export the app object. When executing the application local this does nothing. However,
// to port it to AWS Lambda we will create a wrapper around that will load the app from
// this file
module.exports = app;
