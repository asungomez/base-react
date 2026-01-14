const {
  AdminGetUserCommand,
} = require("@aws-sdk/client-cognito-identity-provider");

const client = new CognitoIdentityServiceProvider({ region: "eu-west-1" });
const userPoolId = process.env.AUTH_AUTH_USERPOOLID;

const getUser = async (userId) => {
  const params = {
    UserPoolId: userPoolId,
    Username: userId,
  };
  const response = await client.send(new AdminGetUserCommand(params));
  return (
    response.UserAttributes?.reduce((acc, { Name, Value }) => {
      acc[Name] = Value;
      return acc;
    }, {}) ?? {}
  );
};

module.exports = {
  getUser,
};
