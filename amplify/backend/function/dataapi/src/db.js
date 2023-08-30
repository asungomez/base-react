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
  const customersWithSameEmail = await queryCustomerByEmail(customer.email);
  if (customersWithSameEmail.length > 0) {
    throw new Error("This email already exists");
  }
  const id = uuid.v1();
  const params = {
    TableName: "customers-dev",
    Item: {
      name: {
        S: customer.name,
      },
      name_lowercase: {
        S: customer.name?.toLowerCase(),
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

const deleteCustomer = async (id) => {
  const params = {
    TableName: "customers-dev",
    Key: {
      id: { S: id },
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
    TableName: "customers-dev",
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
    TableName: "customers-dev",
    Key: {
      id: { S: id },
    },
  };
  const result = await ddb.getItem(params).promise();
  if (!result.Item) return null;
  return mapCustomerFromDB(result.Item);
};

const getCustomers = async (nextTokenParam, searchInput) => {
  const PAGE_SIZE = 5;
  let params = {
    TableName: "customers-dev",
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
      ":email": { S: email },
    },
    KeyConditionExpression: "email = :email",
    TableName: "customers-dev",
    IndexName: "search_by_email",
  };
  const result = await ddb.query(params).promise();
  return result.Items.map(mapCustomerFromDB);
};

const parseToken = (token) => {
  if (!token) return;
  return JSON.parse(decodeToken(token));
};

const updateCustomer = async (id, customer) => {
  const customersWithSameEmail = await queryCustomerByEmail(customer.email);
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
        S: customer.email,
      },
      ":type": {
        S: customer.type,
      },
    },
    Key: {
      id: {
        S: id,
      },
    },
    TableName: "customers-dev",
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
  createCustomer,
  deleteCustomer,
  getCustomer,
  getCustomers,
  updateCustomer,
};
