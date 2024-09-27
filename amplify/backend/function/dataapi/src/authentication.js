const extractAuthData = (req) => {
  const provider =
    req.apiGateway?.event?.requestContext?.identity
      ?.cognitoAuthenticationProvider;
  if (!provider) {
    return null;
  }
  const userSub = provider.split(":CognitoSignIn:")[1];
  return { userSub };
};

module.exports = {
  extractAuthData,
};
