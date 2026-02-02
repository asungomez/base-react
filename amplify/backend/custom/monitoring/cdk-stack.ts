import * as cdk from "aws-cdk-lib";
import * as AmplifyHelpers from "@aws-amplify/cli-extensibility-helper";
import { AmplifyDependentResourcesAttributes } from "../../types/amplify-dependent-resources-ref";
import { Construct } from "constructs";
import * as apigateway from "aws-cdk-lib/aws-apigateway";

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

    // Create the stage with the environment name
    new apigateway.CfnStage(this, "ApiStage", {
      restApiId: apiId,
      deploymentId: deploymentId,
      stageName: cdk.Fn.ref("env"),
    });
  }
}
