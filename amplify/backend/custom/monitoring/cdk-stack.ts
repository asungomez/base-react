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

    /* Do not remove - Amplify CLI automatically injects the current deployment environment in this input parameter */
    new cdk.CfnParameter(this, "env", {
      type: "String",
      description: "Current Amplify CLI env name",
    });

    const amplifyProjectInfo = AmplifyHelpers.getProjectInfo();

    // Add dependency on the dataapi REST API
    const dependencies: AmplifyDependentResourcesAttributes =
      AmplifyHelpers.addResourceDependency(
        this,
        amplifyResourceProps!.category,
        amplifyResourceProps!.resourceName,
        [{ category: "api", resourceName: "dataapi" }]
      );

    // Get the API ID and Deployment ID from the dependencies
    const apiId = cdk.Fn.ref(dependencies.api.dataapi.ApiId);
    const deploymentId = cdk.Fn.ref(dependencies.api.dataapi.DeploymentId);

    // ===========================================
    // CloudWatch Log Group for API Gateway access logs
    // ===========================================
    const accessLogGroup = new logs.LogGroup(this, "ApiAccessLogs", {
      logGroupName: `/aws/apigateway/${
        amplifyProjectInfo.projectName
      }-dataapi-${cdk.Fn.ref("env")}`,
      retention: logs.RetentionDays.ONE_MONTH,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

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

    // ===========================================
    // API Gateway Stage with full monitoring
    // ===========================================
    const stage = new apigateway.CfnStage(this, "ApiStage", {
      restApiId: apiId,
      deploymentId: deploymentId,
      stageName: cdk.Fn.ref("env"),

      // Access logging - logs each request with correlation data
      accessLogSetting: {
        destinationArn: accessLogGroup.logGroupArn,
        format: JSON.stringify({
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
        }),
      },

      // Enable X-Ray tracing for distributed tracing
      tracingEnabled: true,

      // Method settings for detailed CloudWatch metrics
      methodSettings: [
        {
          httpMethod: "*",
          resourcePath: "/*",
          metricsEnabled: true,
          dataTraceEnabled: true,
          loggingLevel: "INFO",
        },
      ],
    });

    // Ensure the account config is set before creating the stage
    stage.addDependency(apiGatewayAccount);

    // ===========================================
    // Outputs
    // ===========================================
    new cdk.CfnOutput(this, "AccessLogGroupName", {
      value: accessLogGroup.logGroupName,
      description: "CloudWatch Log Group for API Gateway access logs",
    });

    new cdk.CfnOutput(this, "ApiGatewayLogsRoleArn", {
      value: apiGatewayLogsRole.roleArn,
      description: "IAM Role ARN for API Gateway CloudWatch logging",
    });
  }
}
