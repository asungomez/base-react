const AWS = require("aws-sdk");
const uuid = require("node-uuid");

// set DynamoDb client
AWS.config.update({ region: "eu-west-1" });
const ddb = new AWS.DynamoDB({ apiVersion: "2012-08-10" });

const mapCustomerFromDB = (customer) => ({
  id: customer.id.S,
  name: customer.name.S,
  email: customer.email.S,
  type: customer.type.S,
});

const createCustomer = async (customer) => {
  const id = uuid.v1();
  const params = {
    TableName: "customers-dev",
    Item: {
      name: {
        S: customer.name,
      },
      email: {
        S: customer.email,
      },
      type: {
        S: customer.type,
      },
      id: {
        S: id,
      },
    },
  };
  await ddb.putItem(params).promise();
  return {
    ...customer,
    id,
  };
};

const getCustomer = async (id) => {
  const params = {
    TableName: "customers-dev",
    Key: {
      id: { S: id },
    },
  };
  const result = await ddb.getItem(params).promise();
  return mapCustomerFromDB(result.Item);
};

const getCustomers = async () => {
  const params = {
    TableName: "customers-dev",
  };
  const result = await ddb.scan(params).promise();
  return result.Items.map(mapCustomerFromDB);
};

module.exports = { createCustomer, getCustomer, getCustomers };
