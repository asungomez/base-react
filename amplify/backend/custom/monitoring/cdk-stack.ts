import * as cdk from "aws-cdk-lib";
import * as AmplifyHelpers from "@aws-amplify/cli-extensibility-helper";
import { AmplifyDependentResourcesAttributes } from "../../types/amplify-dependent-resources-ref";
import { Construct } from "constructs";
import * as apigateway from "aws-cdk-lib/aws-apigateway";
import * as logs from "aws-cdk-lib/aws-logs";
import * as iam from "aws-cdk-lib/aws-iam";

export class cdkStack extends cdk.Stack {
  constructor(
    scope: Construct,
    id: string,
    props?: cdk.StackProps,
    amplifyResourceProps?: AmplifyHelpers.AmplifyResourceProps
  ) {
    super(scope, id, props);
    new cdk.CfnParameter(this, "env", {
      type: "String",
      description: "Current Amplify CLI env name",
    });

    const amplifyProjectInfo = AmplifyHelpers.getProjectInfo();

    // Add dependency on both REST APIs
    const dependencies: AmplifyDependentResourcesAttributes =
      AmplifyHelpers.addResourceDependency(
        this,
        amplifyResourceProps!.category,
        amplifyResourceProps!.resourceName,
        [
          { category: "api", resourceName: "dataapi" },
          { category: "api", resourceName: "AdminQueries" },
        ]
      );

    // Get the API IDs and Deployment IDs from the dependencies
    const dataApiId = cdk.Fn.ref(dependencies.api.dataapi.ApiId);
    const dataApiDeploymentId = cdk.Fn.ref(
      dependencies.api.dataapi.DeploymentId
    );

    const adminApiId = cdk.Fn.ref(dependencies.api.AdminQueries.ApiId);
    const adminApiDeploymentId = cdk.Fn.ref(
      dependencies.api.AdminQueries.DeploymentId
    );

    // ===========================================
    // CloudWatch Log Groups for API Gateway access logs
    // ===========================================
    const dataApiAccessLogGroup = new logs.LogGroup(this, "DataApiAccessLogs", {
      logGroupName: `/aws/apigateway/${
        amplifyProjectInfo.projectName
      }-dataapi-${cdk.Fn.ref("env")}`,
      retention: logs.RetentionDays.ONE_WEEK,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    const adminApiAccessLogGroup = new logs.LogGroup(
      this,
      "AdminApiAccessLogs",
      {
        logGroupName: `/aws/apigateway/${
          amplifyProjectInfo.projectName
        }-adminqueries-${cdk.Fn.ref("env")}`,
        retention: logs.RetentionDays.ONE_WEEK,
        removalPolicy: cdk.RemovalPolicy.DESTROY,
      }
    );

    // ===========================================
    // IAM Role for API Gateway CloudWatch logging
    // ===========================================
    const apiGatewayLogsRole = new iam.Role(this, "ApiGatewayLogsRole", {
      assumedBy: new iam.ServicePrincipal("apigateway.amazonaws.com"),
      managedPolicies: [
        iam.ManagedPolicy.fromAwsManagedPolicyName(
          "service-role/AmazonAPIGatewayPushToCloudWatchLogs"
        ),
      ],
    });

    // ===========================================
    // API Gateway Account configuration (region singleton)
    // Links the IAM role to API Gateway at the account level.
    // Note: Only one AWS::ApiGateway::Account can exist per region.
    // First deployment per region creates it; if another stack owns it,
    // manually configure via API Gateway console → Settings.
    // ===========================================
    const apiGatewayAccount = new apigateway.CfnAccount(
      this,
      "ApiGatewayAccount",
      {
        cloudWatchRoleArn: apiGatewayLogsRole.roleArn,
      }
    );

    // Access log format (shared by both APIs)
    const accessLogFormat = JSON.stringify({
      requestId: "$context.requestId",
      extendedRequestId: "$context.extendedRequestId",
      ip: "$context.identity.sourceIp",
      caller: "$context.identity.caller",
      user: "$context.identity.user",
      requestTime: "$context.requestTime",
      httpMethod: "$context.httpMethod",
      resourcePath: "$context.resourcePath",
      path: "$context.path",
      status: "$context.status",
      protocol: "$context.protocol",
      responseLength: "$context.responseLength",
      responseLatency: "$context.responseLatency",
      integrationLatency: "$context.integrationLatency",
      integrationStatus: "$context.integrationStatus",
      errorMessage: "$context.error.message",
      errorType: "$context.error.responseType",
    });

    // Method settings (shared by both APIs)
    const methodSettings = [
      {
        httpMethod: "*",
        resourcePath: "/*",
        metricsEnabled: true,
        dataTraceEnabled: true,
        loggingLevel: "INFO",
      },
    ];

    // ===========================================
    // DataAPI Stage with full monitoring
    // ===========================================
    const dataApiStage = new apigateway.CfnStage(this, "DataApiStage", {
      restApiId: dataApiId,
      deploymentId: dataApiDeploymentId,
      stageName: cdk.Fn.ref("env"),
      accessLogSetting: {
        destinationArn: dataApiAccessLogGroup.logGroupArn,
        format: accessLogFormat,
      },
      tracingEnabled: true,
      methodSettings: methodSettings,
    });
    dataApiStage.addDependency(apiGatewayAccount);

    // ===========================================
    // AdminQueries API Stage with full monitoring
    // ===========================================
    const adminApiStage = new apigateway.CfnStage(this, "AdminApiStage", {
      restApiId: adminApiId,
      deploymentId: adminApiDeploymentId,
      stageName: cdk.Fn.ref("env"),
      accessLogSetting: {
        destinationArn: adminApiAccessLogGroup.logGroupArn,
        format: accessLogFormat,
      },
      tracingEnabled: true,
      methodSettings: methodSettings,
    });
    adminApiStage.addDependency(apiGatewayAccount);

    // ===========================================
    // Outputs
    // ===========================================
    new cdk.CfnOutput(this, "DataApiAccessLogGroupName", {
      value: dataApiAccessLogGroup.logGroupName,
      description: "CloudWatch Log Group for DataAPI access logs",
    });

    new cdk.CfnOutput(this, "AdminApiAccessLogGroupName", {
      value: adminApiAccessLogGroup.logGroupName,
      description: "CloudWatch Log Group for AdminQueries API access logs",
    });

    new cdk.CfnOutput(this, "ApiGatewayLogsRoleArn", {
      value: apiGatewayLogsRole.roleArn,
      description: "IAM Role ARN for API Gateway CloudWatch logging",
    });
  }
}
