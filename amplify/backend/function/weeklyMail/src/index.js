/* Amplify Params - DO NOT EDIT
	AUTH_AUTH_USERPOOLID
	ENV
	REGION
	STORAGE_CARLOS_ARN
	STORAGE_CARLOS_NAME
	STORAGE_CARLOS_STREAMARN
Amplify Params - DO NOT EDIT */

const { emailUserTimetable } = require("./mailer");
const { getUser } = require("./users");
const { getNextWeekJobs } = require("./jobs");

const USER_ID = "0a36f4f5-6598-4cf0-9a07-1563c7b182ba";

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
exports.handler = async () => {
  const user = await getUser(USER_ID);
  const name = user.name ?? user.email.split("@")[0];
  user.name = name;
  const jobs = await getNextWeekJobs(USER_ID);
  if (jobs.length > 0) {
    await emailUserTimetable(user, jobs);
  }
  return {
    statusCode: 200,
    body: jobs,
  };
};
