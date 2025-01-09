const AWS = require("aws-sdk");
const uuid = require("node-uuid");
const {
  mapAddressFromDB,
  mapCustomerFromDB,
  mapMainAddressFromDB,
  mapSecondaryAddressFromDB,
  mapJobFromDB,
} = require("./mapper");

const TABLE_NAME = "exercises-dev";
const PAGE_SIZE = 5;

// set DynamoDb client
AWS.config.update({ region: "eu-west-1" });
const ddb = new AWS.DynamoDB({ apiVersion: "2012-08-10" });

const addExternalLinkToCustomer = async (customerId, url) => {
  if (!(await getCustomer(customerId))) {
    throw new Error("Customer not found");
  }
  const params = {
    ExpressionAttributeNames: {
      "#EL": "externalLinks",
    },
    ExpressionAttributeValues: {
      ":url": { L: [{ S: url }] },
      ":empty_list": { L: [] },
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
    UpdateExpression:
      "SET #EL = list_append(if_not_exists(#EL, :empty_list), :url)",
  };
  await ddb.updateItem(params).promise();
  return url;
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

const createCustomerMainAddress = async (customerId, address) => {
  if (!(await getCustomer(customerId))) {
    throw new Error("Customer not found");
  }
  const params = {
    TableName: TABLE_NAME,
    Item: {
      PK: { S: `customer_${customerId}` },
      SK: { S: "address_main" },
      street: { S: address.street },
      city: { S: address.city },
      number: { S: address.number },
      postcode: { S: address.postcode },
    },
  };
  await ddb.putItem(params).promise();
  return address;
};

const createCustomerSecondaryAddress = async (customerId, address) => {
  if (!(await getCustomer(customerId))) {
    throw new Error("Customer not found");
  }
  const addressId = uuid.v1();
  const params = {
    TableName: TABLE_NAME,
    Item: {
      PK: { S: `customer_${customerId}` },
      SK: { S: `address_secondary_${addressId}` },
      street: { S: address.street },
      city: { S: address.city },
      number: { S: address.number },
      postcode: { S: address.postcode },
    },
  };
  await ddb.putItem(params).promise();
  return { ...address, id: addressId };
};

const createJob = async (job) => {
  const id = uuid.v1();
  const params = {
    TableName: TABLE_NAME,
    Item: {
      PK: { S: `job_${id}` },
      SK: { S: "description" },
      name: { S: job.name },
      start: { N: job.start.toString() },
      end: { N: job.end.toString() },
      assigned_to: { S: job.assignedTo },
    },
  };
  await ddb.putItem(params).promise();
  for (let i = 0; i < job.addresses.length; i++) {
    const address = job.addresses[i];
    const params = {
      TableName: TABLE_NAME,
      Item: {
        PK: { S: `job_${id}` },
        SK: { S: `address_assignation_${i}` },
        address_id: { S: address.addressId },
        customer_id: { S: address.customerId },
      },
    };
    await ddb.putItem(params).promise();
  }
  return {
    id,
    name: job.name,
    startTime: job.startTime,
    endTime: job.endTime,
    date: job.date,
  };
};

const decodeToken = (token) => {
  if (!token) return;
  return JSON.parse(Buffer.from(token, "base64").toString("utf8"));
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

const deleteExternalLinkFromCustomer = async (customerId, index) => {
  if (!(await getCustomer(customerId))) {
    throw new Error("Customer not found");
  }
  const params = {
    ExpressionAttributeNames: {
      "#EL": "externalLinks",
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
    UpdateExpression: `REMOVE #EL[${index}]`,
  };
  await ddb.updateItem(params).promise();
};

const deleteJob = async (jobId) => {
  const searchParams = {
    TableName: TABLE_NAME,
    ExpressionAttributeNames: {
      "#PK": "PK",
    },
    ExpressionAttributeValues: {
      ":pk": { S: `job_${jobId}` },
    },
    FilterExpression: "#PK = :pk",
  };
  const rowsToDelete = await getAllRows(searchParams);
  for (const row of rowsToDelete) {
    const deleteParams = {
      TableName: TABLE_NAME,
      Key: {
        PK: row.PK,
        SK: row.SK,
      },
    };
    await ddb.deleteItem(deleteParams).promise();
  }
};

const deleteMainAddressFromCustomer = async (customerId) => {
  const params = {
    TableName: TABLE_NAME,
    Key: {
      PK: { S: `customer_${customerId}` },
      SK: { S: "address_main" },
    },
  };
  await ddb.deleteItem(params).promise();
  const searchAssignationParams = {
    TableName: TABLE_NAME,
    ExpressionAttributeNames: {
      "#CID": "customer_id",
      "#AID": "address_id",
      "#SK": "SK",
    },
    ExpressionAttributeValues: {
      ":customer_id": { S: customerId },
      ":sk": { S: "address_assignation" },
      ":address_id": { S: "main" },
    },
    FilterExpression:
      "begins_with(#SK, :sk) AND #CID = :customer_id AND #AID = :address_id",
  };
  const assignations = await getAllRows(searchAssignationParams);
  for (const assignation of assignations) {
    const deleteParams = {
      TableName: TABLE_NAME,
      Key: {
        PK: assignation.PK,
        SK: assignation.SK,
      },
    };
    await ddb.deleteItem(deleteParams).promise();
  }
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

const deleteSecondaryAddressFromCustomer = async (customerId, addressId) => {
  const params = {
    TableName: TABLE_NAME,
    Key: {
      PK: { S: `customer_${customerId}` },
      SK: { S: `address_secondary_${addressId}` },
    },
  };
  await ddb.deleteItem(params).promise();
  const searchAssignationParams = {
    TableName: TABLE_NAME,
    ExpressionAttributeNames: {
      "#CID": "customer_id",
      "#AID": "address_id",
      "#SK": "SK",
    },
    ExpressionAttributeValues: {
      ":customer_id": { S: customerId },
      ":address_id": { S: addressId },
      ":sk": { S: "address_assignation" },
    },
    FilterExpression:
      "begins_with(#SK, :sk) AND #CID = :customer_id AND #AID = :address_id",
  };
  const assignations = await getAllRows(searchAssignationParams);
  for (const assignation of assignations) {
    const deleteParams = {
      TableName: TABLE_NAME,
      Key: {
        PK: assignation.PK,
        SK: assignation.SK,
      },
    };
    await ddb.deleteItem(deleteParams).promise();
  }
};

const editCustomer = async (id, customer) => {
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

const editCustomerMainAddress = async (customerId, updatedAddress) => {
  const params = {
    ExpressionAttributeNames: {
      "#S": "street",
      "#C": "city",
      "#N": "number",
      "#P": "postcode",
    },
    ExpressionAttributeValues: {
      ":street": {
        S: updatedAddress.street,
      },
      ":city": {
        S: updatedAddress.city,
      },
      ":number": {
        S: updatedAddress.number,
      },
      ":postcode": {
        S: updatedAddress.postcode,
      },
    },
    Key: {
      PK: {
        S: `customer_${customerId}`,
      },
      SK: {
        S: "address_main",
      },
    },
    TableName: TABLE_NAME,
    UpdateExpression:
      "SET #S = :street, #C = :city, #N = :number, #P = :postcode",
  };
  await ddb.updateItem(params).promise();
  return updatedAddress;
};

const editExternalLinkFromCustomer = async (customerId, index, url) => {
  if (!(await getCustomer(customerId))) {
    throw new Error("Customer not found");
  }
  const params = {
    ExpressionAttributeNames: {
      "#EL": "externalLinks",
    },
    ExpressionAttributeValues: {
      ":url": { S: url },
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
    UpdateExpression: `SET #EL[${index}] = :url`,
  };
  await ddb.updateItem(params).promise();
  return url;
};

const editJob = async (jobId, job) => {
  const params = {
    ExpressionAttributeNames: {
      "#N": "name",
      "#S": "start",
      "#E": "end",
    },
    ExpressionAttributeValues: {
      ":name": {
        S: job.name,
      },
      ":start": {
        N: job.start.toString(),
      },
      ":end": {
        N: job.end.toString(),
      },
    },
    Key: {
      PK: {
        S: `job_${jobId}`,
      },
      SK: {
        S: "description",
      },
    },
    TableName: TABLE_NAME,
    UpdateExpression: "SET #N = :name, #S = :start, #E = :end",
  };
  await ddb.updateItem(params).promise();

  const searchAssignationsParams = {
    TableName: TABLE_NAME,
    ExpressionAttributeNames: {
      "#PK": "PK",
      "#SK": "SK",
    },
    ExpressionAttributeValues: {
      ":pk": { S: `job_${jobId}` },
      ":sk": { S: "address_assignation" },
    },
    FilterExpression: "#PK = :pk AND begins_with(#SK, :sk)",
  };
  const existingAssignations = await getAllRows(searchAssignationsParams);

  for (const assignation of existingAssignations) {
    const deleteParams = {
      TableName: TABLE_NAME,
      Key: {
        PK: assignation.PK,
        SK: assignation.SK,
      },
    };
    await ddb.deleteItem(deleteParams).promise();
  }

  const newAssignations = job.addresses.map((address, index) => ({
    PK: { S: `job_${jobId}` },
    SK: { S: `address_assignation_${index}` },
    address_id: { S: address.addressId },
    customer_id: { S: address.customerId },
  }));

  for (const assignation of newAssignations) {
    const params = {
      TableName: TABLE_NAME,
      Item: assignation,
    };
    await ddb.putItem(params).promise();
  }

  return {
    id: jobId,
    name: job.name,
    startTime: job.startTime,
    endTime: job.endTime,
    date: job.date,
  };
};

const editSecondaryAddressFromCustomer = async (
  customerId,
  addressId,
  updatedAddress
) => {
  const params = {
    ExpressionAttributeNames: {
      "#S": "street",
      "#C": "city",
      "#N": "number",
      "#P": "postcode",
    },
    ExpressionAttributeValues: {
      ":street": {
        S: updatedAddress.street,
      },
      ":city": {
        S: updatedAddress.city,
      },
      ":number": {
        S: updatedAddress.number,
      },
      ":postcode": {
        S: updatedAddress.postcode,
      },
    },
    Key: {
      PK: {
        S: `customer_${customerId}`,
      },
      SK: {
        S: `address_secondary_${addressId}`,
      },
    },
    TableName: TABLE_NAME,
    UpdateExpression:
      "SET #S = :street, #C = :city, #N = :number, #P = :postcode",
  };
  await ddb.updateItem(params).promise();
  return { id: addressId, ...updatedAddress };
};

const encodeToken = (token) => {
  if (!token) return;
  return Buffer.from(JSON.stringify(token)).toString("base64");
};

const findNextValue = async (startKey, filter) => {
  const params = {
    TableName: TABLE_NAME,
    Limit: 1,
    ExclusiveStartKey: startKey,
    FilterExpression: filter.filterExpression,
    ExpressionAttributeNames: filter.expressionAttributeNames,
    ExpressionAttributeValues: filter.expressionAttributeValues,
  };
  const result = await ddb.scan(params).promise();
  if (result.Items.length === 0) return;
  return result.Items[0];
};

const generateToken = async (scanOutput, filter) => {
  if (!scanOutput.LastEvaluatedKey) return;
  const nextValue = await findNextValue(scanOutput.LastEvaluatedKey, filter);
  if (!nextValue) return;
  return encodeToken(JSON.stringify(scanOutput.LastEvaluatedKey));
};

const getAddressJobIDs = async (addressId, customerId) => {
  let params = {
    TableName: TABLE_NAME,
    ExpressionAttributeNames: {
      "#PK": "PK",
      "#SK": "SK",
      "#AID": "address_id",
      "#CID": "customer_id",
    },
    ExpressionAttributeValues: {
      ":pk": { S: "job_" },
      ":sk": { S: "address_assignation" },
      ":addressId": { S: addressId },
      ":customerId": { S: customerId },
    },
    FilterExpression:
      "begins_with(#PK, :pk) AND begins_with(#SK, :sk) AND #AID = :addressId AND #CID = :customerId",
  };
  const result = await getAllRows(params);
  return result.map((row) => row.PK.S.replace("job_", ""));
};

const getAddresses = async (
  nextTokenParam,
  searchInput,
  excludedAddresses,
  includedAddresses
) => {
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

  let searchParams = {
    ExpressionAttributeNames: {
      "#PK": "PK",
      "#SK": "SK",
    },
    ExpressionAttributeValues: {
      ":pk": { S: "customer_" },
      ":sk": { S: "address_" },
    },
    FilterExpression: "begins_with(#PK, :pk) AND begins_with(#SK, :sk)",
  };

  if (searchInput) {
    searchParams = {
      ExpressionAttributeNames: {
        ...searchParams.ExpressionAttributeNames,
        "#S": "street",
      },
      ExpressionAttributeValues: {
        ...searchParams.ExpressionAttributeValues,
        ":street": { S: searchInput },
      },
      FilterExpression:
        searchParams.FilterExpression + " AND contains(#S, :street)",
    };
  }

  if (includedAddresses?.length) {
    const filterExpressions = [];
    for (let i = 0; i < includedAddresses.length; i++) {
      const includedAddress = includedAddresses[i];
      searchParams = {
        ...searchParams,
        ExpressionAttributeValues: {
          ...searchParams.ExpressionAttributeValues,
          [`:includedAddressId${i}`]: { S: includedAddress.addressId },
          [`:includedCustomerId${i}`]: {
            S: includedAddress.customerId,
          },
        },
      };
      filterExpressions.push(
        `(contains(#SK, :includedAddressId${i}) AND contains(#PK, :includedCustomerId${i}))`
      );
    }
    searchParams = {
      ...searchParams,
      FilterExpression: `${searchParams.FilterExpression} AND ${
        filterExpressions.length > 1 ? "(" : ""
      }${filterExpressions.join(" OR ")}${
        filterExpressions.length > 1 ? ")" : ""
      }`,
    };
  } else if (excludedAddresses) {
    for (let i = 0; i < excludedAddresses.length; i++) {
      const excludedAddress = excludedAddresses[i];
      searchParams = {
        ...searchParams,
        ExpressionAttributeValues: {
          ...searchParams.ExpressionAttributeValues,
          [`:excludedAddressId${i}`]: { S: excludedAddress.addressId },
          [`:excludedCustomerId${i}`]: {
            S: excludedAddress.customerId,
          },
        },
        FilterExpression: `${searchParams.FilterExpression} AND (NOT contains(#SK, :excludedAddressId${i}) OR NOT contains(#PK, :excludedCustomerId${i}))`,
      };
    }
  }

  params = {
    ...params,
    ...searchParams,
  };

  let result = await ddb.scan(params).promise();
  const items = result.Items.map(mapAddressFromDB);
  while (result.LastEvaluatedKey && items.length < PAGE_SIZE) {
    const exclusiveStartKey = result.LastEvaluatedKey;
    params = {
      ...params,
      ExclusiveStartKey: exclusiveStartKey,
      Limit: PAGE_SIZE - items.length,
    };
    result = await ddb.scan(params).promise();
    items.push(...result.Items.map(mapAddressFromDB));
  }

  const nextToken = await generateToken(result, {
    filterExpression: params.FilterExpression,
    expressionAttributeNames: params.ExpressionAttributeNames,
    expressionAttributeValues: params.ExpressionAttributeValues,
  });
  return { items, nextToken };
};

const getAllRows = async (params) => {
  let result = await ddb.scan(params).promise();
  const items = result.Items;
  while (result.LastEvaluatedKey) {
    const exclusiveStartKey = result.LastEvaluatedKey;
    params = {
      ...params,
      ExclusiveStartKey: exclusiveStartKey,
    };
    result = await ddb.scan(params).promise();
    items.push(...result.Items);
  }
  return items;
};

const getCustomerAddresses = async (customerId, nextTokenParam) => {
  const items = [];
  let pageSize = 5;
  if (!nextTokenParam) {
    const mainAddress = await getCustomerMainAddress(customerId);
    if (mainAddress) {
      items.push({ ...mainAddress, id: "main" });
      pageSize = 4;
    }
  }
  const { items: secondaryAddresses, nextToken } =
    await getCustomerSecondaryAddresses(customerId, nextTokenParam, pageSize);
  items.push(...secondaryAddresses);
  return { items, nextToken };
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

const getCustomerMainAddress = async (customerId) => {
  const params = {
    TableName: TABLE_NAME,
    Key: {
      PK: { S: `customer_${customerId}` },
      SK: { S: "address_main" },
    },
  };
  const result = await ddb.getItem(params).promise();
  if (!result.Item) return null;
  return mapMainAddressFromDB(result.Item);
};

const getCustomerSecondaryAddress = async (customerId, addressId) => {
  const params = {
    TableName: TABLE_NAME,
    Key: {
      PK: { S: `customer_${customerId}` },
      SK: { S: `address_secondary_${addressId}` },
    },
  };
  const result = await ddb.getItem(params).promise();
  if (!result.Item) return null;
  return mapSecondaryAddressFromDB(result.Item);
};

const getCustomerSecondaryAddresses = async (
  customerId,
  nextTokenParam,
  pageSize = 5
) => {
  let params = {
    TableName: TABLE_NAME,
    ExpressionAttributeNames: {
      "#PK": "PK",
      "#SK": "SK",
    },
    ExpressionAttributeValues: {
      ":pk": { S: `customer_${customerId}` },
      ":sk": { S: "address_secondary_" },
    },
    KeyConditionExpression: "#PK = :pk AND begins_with(#SK, :sk)",
    Limit: pageSize,
  };
  if (nextTokenParam) {
    const nextToken = parseToken(nextTokenParam);
    params = {
      ...params,
      ExclusiveStartKey: nextToken,
    };
  }
  const result = await ddb.query(params).promise();
  const nextToken = await generateToken(result, {
    filterExpression: params.KeyConditionExpression,
    expressionAttributeNames: params.ExpressionAttributeNames,
    expressionAttributeValues: params.ExpressionAttributeValues,
  });
  const items = result.Items.map(mapSecondaryAddressFromDB);
  return { items, nextToken };
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

  let searchParams = {
    ExpressionAttributeNames: {
      "#PK": "PK",
      "#SK": "SK",
    },
    ExpressionAttributeValues: {
      ":pk": { S: "customer_" },
      ":sk": { S: "profile" },
    },
    FilterExpression: "begins_with(#PK, :pk) AND #SK = :sk",
  };

  if (searchInput) {
    searchParams = {
      ExpressionAttributeNames: {
        ...searchParams.ExpressionAttributeNames,
        "#NL": "name_lowercase",
      },
      ExpressionAttributeValues: {
        ...searchParams.ExpressionAttributeValues,
        ":name": { S: searchInput.toLowerCase() },
      },
      FilterExpression:
        searchParams.FilterExpression + " AND contains(#NL, :name)",
    };
  }

  params = {
    ...params,
    ...searchParams,
  };

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

  const nextToken = await generateToken(result, {
    filterExpression: params.FilterExpression,
    expressionAttributeNames: params.ExpressionAttributeNames,
    expressionAttributeValues: params.ExpressionAttributeValues,
  });
  return { items, nextToken };
};

const getJob = async (jobId) => {
  const params = {
    TableName: TABLE_NAME,
    Key: {
      PK: { S: `job_${jobId}` },
      SK: { S: "description" },
    },
  };
  const result = await ddb.getItem(params).promise();
  if (!result.Item) return null;
  return mapJobFromDB(result.Item);
};

const getJobs = async (filters, order, nextTokenParam, paginate) => {
  let params = {
    TableName: TABLE_NAME,
    IndexName: "job_start_time",
    ScanIndexForward: order !== "desc",
    ExpressionAttributeNames: {
      "#PK": "PK",
      "#SK": "SK",
    },
    ExpressionAttributeValues: {
      ":sk": { S: "description" },
    },
  };

  if (paginate) {
    params.Limit = PAGE_SIZE;
  }

  if (nextTokenParam && paginate) {
    const nextToken = parseToken(nextTokenParam);
    params.ExclusiveStartKey = nextToken;
  }

  const keyConditionExpressions = ["#SK = :sk"];
  const filterExpressions = [];

  if (filters.addressId && filters.customerId) {
    const ids = await getAddressJobIDs(filters.addressId, filters.customerId);
    if (ids.length === 0) {
      return [];
    }
    for (let i = 0; i < ids.length; i++) {
      const id = ids[i];
      params.ExpressionAttributeValues[`:jobId${i}`] = { S: `job_${id}` };
    }
    filterExpressions.push(
      `#PK IN (${ids.map((_id, index) => `:jobId${index}`).join(", ")})`
    );
  } else {
    params.ExpressionAttributeValues[":pk"] = { S: "job_" };
    filterExpressions.push("begins_with(#PK, :pk)");
  }

  if (filters.assignedTo) {
    params.ExpressionAttributeNames["#AT"] = "assigned_to";
    params.ExpressionAttributeValues[":assignedTo"] = { S: filters.assignedTo };
    filterExpressions.push("#AT = :assignedTo");
  }

  if (filters.from && filters.to) {
    params.ExpressionAttributeNames["#S"] = "start";
    params.ExpressionAttributeValues[":from"] = { N: filters.from.toString() };
    params.ExpressionAttributeValues[":to"] = { N: filters.to.toString() };
    keyConditionExpressions.push("#S BETWEEN :from AND :to");
  } else if (filters.from) {
    params.ExpressionAttributeNames["#S"] = "start";
    params.ExpressionAttributeValues[":from"] = { N: filters.from.toString() };
    keyConditionExpressions.push("#S >= :from");
  } else if (filters.to) {
    params.ExpressionAttributeNames["#S"] = "start";
    params.ExpressionAttributeValues[":to"] = { N: filters.to.toString() };
    keyConditionExpressions.push("#S <= :to");
  }

  if (keyConditionExpressions.length === 1) {
    params.KeyConditionExpression = keyConditionExpressions[0];
  } else {
    params.KeyConditionExpression = keyConditionExpressions
      .map((expression) => `(${expression})`)
      .join(" AND ");
  }

  if (filterExpressions.length === 1) {
    params.FilterExpression = filterExpressions[0];
  } else if (filterExpressions.length > 1) {
    params.FilterExpression = filterExpressions
      .map((expression) => `(${expression})`)
      .join(" AND ");
  }

  let result = await ddb.query(params).promise();
  const items = result.Items?.map(mapJobFromDB) ?? [];
  let nextToken;

  if (paginate) {
    // Fill a whole page
    while (result.LastEvaluatedKey && items.length < PAGE_SIZE) {
      params = {
        ...params,
        ExclusiveStartKey: result.LastEvaluatedKey,
        Limit: PAGE_SIZE - items.length,
      };
      result = await ddb.query(params).promise();
      items.push(...result.Items.map(mapJobFromDB));
    }
    const nextResult = await ddb
      .query({
        ...params,
        ExclusiveStartKey: result.LastEvaluatedKey,
        Limit: 1,
      })
      .promise();

    if (nextResult.Items.length > 0) {
      nextToken = encodeToken(JSON.stringify(result.LastEvaluatedKey));
    }
  } else {
    // Retrieve all results
    while (result.LastEvaluatedKey && result.Items.length > 0) {
      params = {
        ...params,
        ExclusiveStartKey: result.LastEvaluatedKey,
      };
      result = await ddb.query(params).promise();
      items.push(...result.Items.map(mapJobFromDB));
    }
  }

  return { items, nextToken };
};

const getJobAddresses = async (jobId, nextTokenParam) => {
  const PAGE_SIZE = 5;
  let params = {
    TableName: TABLE_NAME,
    Limit: PAGE_SIZE,
    ExpressionAttributeNames: {
      "#PK": "PK",
      "#SK": "SK",
    },
    ExpressionAttributeValues: {
      ":pk": { S: `job_${jobId}` },
      ":sk": { S: "address_assignation" },
    },
    FilterExpression: "#PK = :pk AND begins_with(#SK, :sk)",
  };

  if (nextTokenParam) {
    const nextToken = parseToken(nextTokenParam);
    params = {
      ...params,
      ExclusiveStartKey: nextToken,
    };
  }

  let result = await ddb.scan(params).promise();
  const items = result.Items;

  while (result.LastEvaluatedKey && items.length < PAGE_SIZE) {
    const exclusiveStartKey = result.LastEvaluatedKey;
    params = {
      ...params,
      ExclusiveStartKey: exclusiveStartKey,
      Limit: PAGE_SIZE - items.length,
    };
    result = await ddb.scan(params).promise();
    items.push(...result.Items);
  }

  const addresses = [];
  for (const item of items) {
    const addressId = item.address_id.S;
    const customerId = item.customer_id.S;

    if (addressId === "main") {
      const mainAddress = await getCustomerMainAddress(customerId);
      addresses.push({ ...mainAddress, id: "main" });
    } else {
      const secondaryAddress = await getCustomerSecondaryAddress(
        customerId,
        addressId
      );
      addresses.push(secondaryAddress);
    }
  }

  const nextToken = await generateToken(result, {
    filterExpression: params.FilterExpression,
    expressionAttributeNames: params.ExpressionAttributeNames,
    expressionAttributeValues: params.ExpressionAttributeValues,
  });
  return { addresses, nextToken };
};

const parseToken = (token) => {
  if (!token) return;
  return JSON.parse(decodeToken(token));
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

const setCustomerTaxData = async (customerId, taxData) => {
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

module.exports = {
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
  getCustomerSecondaryAddresses,
  getCustomers,
  getJob,
  getJobAddresses,
  getJobs,
  setCustomerTaxData,
};
