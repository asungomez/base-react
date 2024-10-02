const { CognitoIdentityServiceProvider } = require("aws-sdk");

const cognitoIdentityServiceProvider = new CognitoIdentityServiceProvider();
const userPoolId = "eu-west-1_r97wuTAVq";

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

const extractAuthData = async (req) => {
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

module.exports = {
  extractAuthData,
};
