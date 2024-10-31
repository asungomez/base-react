import {
  AmplifyDDBResourceTemplate,
  AmplifyProjectInfo,
} from "@aws-amplify/cli-extensibility-helper";
import * as ddb from "aws-cdk-lib/aws-dynamodb";

export function override(
  resources: AmplifyDDBResourceTemplate,
  _amplifyProjectInfo: AmplifyProjectInfo
) {
  if (resources.dynamoDBTable) {
    const newTable = { ...resources.dynamoDBTable };
    delete newTable.provisionedThroughput;
    newTable.billingMode = "PAY_PER_REQUEST";
    resources.dynamoDBTable = newTable as unknown as ddb.CfnTable;
  }
}
