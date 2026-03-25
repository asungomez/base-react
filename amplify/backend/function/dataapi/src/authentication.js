const { CognitoIdentityServiceProvider } = require("aws-sdk");

const cognitoIdentityServiceProvider = new CognitoIdentityServiceProvider();
const userPoolId = "eu-west-1_r97wuTAVq";

const MOCK_USER_SUB = "0a36f4f5-6598-4cf0-9a07-1563c7b182ba";

const extractAuthData = async (req) => {
  if (process.env.MOCK_USER === "true") {
    const groups = process.env.MOCK_USER_ADMIN === "true" ? ["Admin"] : [];
    return { userSub: MOCK_USER_SUB, groups };
  }

  const provider =
    req.apiGateway?.event?.requestContext?.identity
      ?.cognitoAuthenticationProvider;
  if (!provider) {
    return null;
  }
  const userSub = provider.split(":CognitoSignIn:")[1];
  const groups = await getGroups(userSub);
  return { userSub, groups };
};

const getGroups = async (userSub) => {
  const params = {
    UserPoolId: userPoolId,
    Username: userSub,
  };

  try {
    const { Groups } = await cognitoIdentityServiceProvider
      .adminListGroupsForUser(params)
      .promise();
    return Groups.map((group) => group.GroupName);
  } catch (err) {
    console.log(err);
    throw err;
  }
};

const getJobUsers = async (jobs) => {
  if (!jobs?.length) {
    return [];
  }
  const uniqueUsersSet = new Set();
  for (const job of jobs) {
    uniqueUsersSet.add(job.assignedTo);
  }
  const uniqueUsersArray = Array.from(uniqueUsersSet);
  const users = await Promise.all(
    uniqueUsersArray.map((userSub) => getUserInfo(userSub))
  );
  return jobs.map((job) => ({
    ...job,
    assignedTo: users.find((user) => user.sub === job.assignedTo),
  }));
};

const USER_ATTRIBUTES = ["sub", "name", "email", "custom:color"];
const getUserInfo = async (userSub) => {
  const params = {
    UserPoolId: userPoolId,
    Username: userSub,
  };
  const response = await cognitoIdentityServiceProvider
    .adminGetUser(params)
    .promise();
  return response.UserAttributes.reduce((acc, { Name, Value }) => {
    if (USER_ATTRIBUTES.includes(Name)) {
      const attrName = Name.startsWith("custom:") ? Name.split(":")[1] : Name;
      acc[attrName] = Value;
    }
    return acc;
  }, {});
};

module.exports = {
  extractAuthData,
  getUserInfo,
  getJobUsers,
};
