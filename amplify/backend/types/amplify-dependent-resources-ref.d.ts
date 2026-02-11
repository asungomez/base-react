export type AmplifyDependentResourcesAttributes = {
  api: {
    AdminQueries: {
      ApiId: "string";
      ApiName: "string";
      DeploymentId: "string";
      RootUrl: "string";
    };
    dataapi: {
      ApiId: "string";
      ApiName: "string";
      DeploymentId: "string";
      RootUrl: "string";
    };
  };
  auth: {
    auth: {
      AppClientID: "string";
      AppClientIDWeb: "string";
      IdentityPoolId: "string";
      IdentityPoolName: "string";
      UserPoolArn: "string";
      UserPoolId: "string";
      UserPoolName: "string";
    };
    userPoolGroups: {
      AdminGroupRole: "string";
    };
  };
  custom: {
    monitoring: {
      AdminApiAccessLogGroupName: "string";
      ApiGatewayLogsRoleArn: "string";
      DataApiAccessLogGroupName: "string";
    };
    sesEmail: {
      Recipient1IdentityArn: "string";
      Recipient2IdentityArn: "string";
      RecipientEmail1Output: "string";
      RecipientEmail2Output: "string";
      SenderEmailOutput: "string";
      SenderIdentityArn: "string";
    };
  };
  function: {
    AdminQueries56514224: {
      Arn: "string";
      LambdaExecutionRole: "string";
      LambdaExecutionRoleArn: "string";
      Name: "string";
      Region: "string";
    };
    authCustomMessage: {
      Arn: "string";
      LambdaExecutionRole: "string";
      LambdaExecutionRoleArn: "string";
      Name: "string";
      Region: "string";
    };
    dataapi: {
      Arn: "string";
      LambdaExecutionRole: "string";
      LambdaExecutionRoleArn: "string";
      Name: "string";
      Region: "string";
    };
    weeklyMail: {
      Arn: "string";
      CloudWatchEventRule: "string";
      LambdaExecutionRole: "string";
      LambdaExecutionRoleArn: "string";
      Name: "string";
      Region: "string";
    };
  };
  storage: {
    carlos: {
      Arn: "string";
      Name: "string";
      PartitionKeyName: "string";
      PartitionKeyType: "string";
      Region: "string";
      SortKeyName: "string";
      SortKeyType: "string";
      StreamArn: "string";
    };
    exercisesstorage: {
      BucketName: "string";
      Region: "string";
    };
  };
};
