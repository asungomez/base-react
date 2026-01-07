// This file is used to override the REST API resources configuration
import {
  AmplifyApiRestResourceStackTemplate,
  AmplifyProjectInfo,
} from "@aws-amplify/cli-extensibility-helper";

export function override(
  resources: AmplifyApiRestResourceStackTemplate,
  _amplifyProjectInfo: AmplifyProjectInfo
) {
  const deployment = resources.deploymentResource;
  delete deployment.stageName;
  resources.deploymentResource = deployment;
  resources.addCfnOutput(
    {
      key: "ApiDeploymentId",
      value: resources.deploymentResource.ref,
      description: "Deployment ID for API Gateway",
    },
    "ApiDeploymentId"
  );
}
