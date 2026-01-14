const dayjs = require("dayjs");
const { DynamoDBClient, ScanCommand } = require("@aws-sdk/client-dynamodb");

const client = new DynamoDBClient({ region: "eu-west-1" });

const mapJobFromDB = (item) => {
  const start = +item.start.N;
  const end = +item.end.N;
  return {
    id: item.PK.S.replace("job_", ""),
    name: item.name.S,
    start,
    end,
    date: dayjs(start).format("dddd"),
    startTime: dayjs(start).format("HH:mm"),
    endTime: dayjs(end).format("HH:mm"),
  };
};

const getNextWeekJobs = async (userId) => {
  const startOfNextWeek = +dayjs().startOf("week").add(1, "week").toDate();
  const endOfNextWeek = +dayjs().endOf("week").add(1, "week").toDate();
  const params = {
    ExpressionAttributeNames: {
      "#SK": "SK",
      "#PK": "PK",
      "#AT": "assigned_to",
      "#S": "start",
    },
    ExpressionAttributeValues: {
      ":at": { S: userId },
      ":s": { N: startOfNextWeek.toString() },
      ":e": { N: endOfNextWeek.toString() },
      ":pk": { S: "job_" },
      ":sk": { S: "description" },
    },
    FilterExpression:
      "#AT = :at AND #S BETWEEN :s AND :e AND begins_with(#PK, :pk) AND #SK = :sk",
  };
  let lastEvaluatedKey;
  let jobs = [];
  do {
    const result = await client.send(
      new ScanCommand({ ...params, ExclusiveStartKey: lastEvaluatedKey })
    );
    jobs.push(...(result.Items ?? []));
    lastEvaluatedKey = result.LastEvaluatedKey;
  } while (lastEvaluatedKey);
  return jobs.map(mapJobFromDB) ?? [];
};

module.exports = {
  getNextWeekJobs,
};
