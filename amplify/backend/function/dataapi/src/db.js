const AWS = require("aws-sdk");
const { get } = require("http");
const uuid = require("node-uuid");

const TABLE_NAME = "exercises-dev";

// set DynamoDb client
AWS.config.update({ region: "eu-west-1" });
const ddb = new AWS.DynamoDB({ apiVersion: "2012-08-10" });

const mapCustomerFromDB = (customer) => ({
  id: customer.PK.S.replace("customer_", ""),
  name: customer.name.S,
  email: customer.email.S,
  type: customer.type.S,
  taxData: customer.taxData ? mapTaxDataFromDB(customer.taxData.M) : undefined,
});

const mapTaxDataFromDB = (taxData) => ({
  taxId: taxData.taxId.S,
  companyName: taxData.companyName.S,
  companyAddress: taxData.companyAddress.S,
});

const addTaxDataToCustomer = async (customerId, taxData) => {
  if (!(await getCustomer(customerId))) {
    throw new Error("Customer not found");
  }
  const params = {
    ExpressionAttributeNames: {
      "#TD": "taxData",
    },
    ExpressionAttributeValues: {
      ":taxData": {
        M: {
          taxId: {
            S: taxData.taxId,
          },
          companyName: {
            S: taxData.companyName,
          },
          companyAddress: {
            S: taxData.companyAddress,
          },
        },
      },
    },
    Key: {
      PK: {
        S: `customer_${customerId}`,
      },
      SK: {
        S: "profile",
      },
    },
    TableName: TABLE_NAME,
    UpdateExpression: "SET #TD = :taxData",
  };
  await ddb.updateItem(params).promise();
  return taxData;
};

const deleteTaxDataFromCustomer = async (customerId) => {
  const params = {
    ExpressionAttributeNames: {
      "#TD": "taxData",
    },
    Key: {
      PK: {
        S: `customer_${customerId}`,
      },
      SK: {
        S: "profile",
      },
    },
    TableName: TABLE_NAME,
    UpdateExpression: "REMOVE #TD",
  };
  await ddb.updateItem(params).promise();
};

const createCustomer = async (customer) => {
  const customersWithSameEmail = await queryCustomerByEmail(customer.email);
  if (customersWithSameEmail.length > 0) {
    throw new Error("This email already exists");
  }
  const id = uuid.v1();
  const params = {
    TableName: TABLE_NAME,
    Item: {
      name: {
        S: customer.name,
      },
      name_lowercase: {
        S: customer.name?.toLowerCase(),
      },
      email: {
        S: customer.email.toLowerCase(),
      },
      type: {
        S: customer.type,
      },
      PK: {
        S: `customer_${id}`,
      },
      SK: {
        S: "profile",
      },
    },
  };
  await ddb.putItem(params).promise();
  return {
    ...customer,
    id,
  };
};

const deleteCustomer = async (id) => {
  const params = {
    TableName: TABLE_NAME,
    Key: {
      PK: { S: `customer_${id}` },
      SK: { S: "profile" },
    },
  };
  await ddb.deleteItem(params).promise();
};

const decodeToken = (token) => {
  if (!token) return;
  return JSON.parse(Buffer.from(token, "base64").toString("utf8"));
};

const encodeToken = (token) => {
  if (!token) return;
  return Buffer.from(JSON.stringify(token)).toString("base64");
};

// Find next customer after the last evaluated key
const findNextCustomer = async (startKey) => {
  const params = {
    TableName: TABLE_NAME,
    Limit: 1,
    ExclusiveStartKey: startKey,
  };
  const result = await ddb.scan(params).promise();
  if (result.Items.length === 0) return;
  return result.Items[0];
};

const generateToken = async (scanOutput) => {
  if (!scanOutput.LastEvaluatedKey) return;
  const nextCustomer = await findNextCustomer(scanOutput.LastEvaluatedKey);
  if (!nextCustomer) return;
  return encodeToken(JSON.stringify(scanOutput.LastEvaluatedKey));
};

const getCustomer = async (id) => {
  const params = {
    TableName: TABLE_NAME,
    Key: {
      PK: { S: `customer_${id}` },
      SK: { S: "profile" },
    },
  };
  const result = await ddb.getItem(params).promise();
  if (!result.Item) return null;
  return mapCustomerFromDB(result.Item);
};

const getCustomers = async (nextTokenParam, searchInput) => {
  const PAGE_SIZE = 5;
  let params = {
    TableName: TABLE_NAME,
    Limit: PAGE_SIZE,
  };

  if (nextTokenParam) {
    const nextToken = parseToken(nextTokenParam);
    params = {
      ...params,
      ExclusiveStartKey: nextToken,
    };
  }

  if (searchInput) {
    const searchParams = {
      ExpressionAttributeNames: {
        "#NL": "name_lowercase",
      },
      ExpressionAttributeValues: {
        ":name": { S: searchInput.toLowerCase() },
      },
      FilterExpression: "contains(#NL, :name)",
    };
    params = {
      ...params,
      ...searchParams,
    };
  }

  let result = await ddb.scan(params).promise();
  const items = result.Items.map(mapCustomerFromDB);
  while (result.LastEvaluatedKey && items.length < PAGE_SIZE) {
    const exclusiveStartKey = result.LastEvaluatedKey;
    params = {
      ...params,
      ExclusiveStartKey: exclusiveStartKey,
      Limit: PAGE_SIZE - items.length,
    };
    result = await ddb.scan(params).promise();
    items.push(...result.Items.map(mapCustomerFromDB));
  }

  const nextToken = await generateToken(result);
  return { items, nextToken };
};

const queryCustomerByEmail = async (email) => {
  const params = {
    ExpressionAttributeValues: {
      ":email": { S: email.toLowerCase() },
    },
    KeyConditionExpression: "email = :email",
    TableName: TABLE_NAME,
    IndexName: "customer_email",
  };
  const result = await ddb.query(params).promise();
  return result.Items.map(mapCustomerFromDB);
};

const parseToken = (token) => {
  if (!token) return;
  return JSON.parse(decodeToken(token));
};

const updateCustomer = async (id, customer) => {
  const customersWithSameEmail = (
    await queryCustomerByEmail(customer.email)
  ).filter((customer) => customer.id !== id);
  if (customersWithSameEmail.length > 0) {
    throw new Error("This email already exists");
  }
  const params = {
    ExpressionAttributeNames: {
      "#N": "name",
      "#NL": "name_lowercase",
      "#E": "email",
      "#T": "type",
    },
    ExpressionAttributeValues: {
      ":name": {
        S: customer.name,
      },
      ":name_lowercase": {
        S: customer.name?.toLowerCase(),
      },
      ":email": {
        S: customer.email.toLowerCase(),
      },
      ":type": {
        S: customer.type,
      },
    },
    Key: {
      PK: {
        S: `customer_${id}`,
      },
      SK: {
        S: "profile",
      },
    },
    TableName: TABLE_NAME,
    UpdateExpression:
      "SET #N = :name, #E = :email, #T = :type, #NL = :name_lowercase",
  };
  await ddb.updateItem(params).promise();
  return {
    id,
    ...customer,
  };
};

module.exports = {
  addTaxDataToCustomer,
  createCustomer,
  deleteCustomer,
  deleteTaxDataFromCustomer,
  getCustomer,
  getCustomers,
  updateCustomer,
};
