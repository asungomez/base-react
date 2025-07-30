import { DynamoDBClient, ScanCommand } from "@aws-sdk/client-dynamodb";

const TABLE_NAME = "exercises-dev";

const client = new DynamoDBClient({ region: "eu-west-1" });

async function listCustomers() {
  try {
    const data = await client.send(
      new ScanCommand({
        TableName: TABLE_NAME,
        ExpressionAttributeNames: {
          "#PK": "PK",
          "#SK": "SK",
        },
        ExpressionAttributeValues: {
          ":pk": { S: "customer_" },
          ":sk": { S: "profile" },
        },
        FilterExpression: "begins_with(#PK, :pk) AND #SK = :sk",
      })
    );
    return data.Items;
  } catch (error) {
    console.error("Error listing customers:", error);
    throw error;
  }
}

(async () => {
  try {
    const customers = await listCustomers();
    console.log(customers);
  } catch (error) {
    console.error("Failed to list customers:", error);
  }
})();
