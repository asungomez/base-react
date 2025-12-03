import * as cdk from "aws-cdk-lib";
import * as AmplifyHelpers from "@aws-amplify/cli-extensibility-helper";
import { Construct } from "constructs";
import * as ses from "aws-cdk-lib/aws-ses";

export class cdkStack extends cdk.Stack {
  constructor(
    scope: Construct,
    id: string,
    props?: cdk.StackProps,
    _amplifyResourceProps?: AmplifyHelpers.AmplifyResourceProps
  ) {
    super(scope, id, props);
    /* Do not remove - Amplify CLI automatically injects the current deployment environment in this input parameter */
    new cdk.CfnParameter(this, "env", {
      type: "String",
      description: "Current Amplify CLI env name",
    });
    /* AWS CDK code goes here - learn more: https://docs.aws.amazon.com/cdk/latest/guide/home.html */

    // Parameters provided via amplify/backend/custom/sesEmail/parameters.json
    const senderEmailParam = new cdk.CfnParameter(this, "SenderEmail", {
      type: "String",
      description: "Sender email address to verify in SES",
    });
    const recipientEmail1Param = new cdk.CfnParameter(this, "RecipientEmail1", {
      type: "String",
      description: "First recipient email address to verify in SES",
    });
    const recipientEmail2Param = new cdk.CfnParameter(this, "RecipientEmail2", {
      type: "String",
      description: "Second recipient email address to verify in SES",
    });

    const senderEmail: string = senderEmailParam.valueAsString;
    const recipientEmail1: string = recipientEmail1Param.valueAsString;
    const recipientEmail2: string = recipientEmail2Param.valueAsString;

    new ses.CfnEmailIdentity(this, "SenderEmailIdentity", {
      emailIdentity: senderEmail,
    });
    new cdk.CfnOutput(this, "SenderEmailOutput", { value: senderEmail });
    const senderArn = cdk.Stack.of(this).formatArn({
      service: "ses",
      resource: "identity",
      resourceName: senderEmail,
    });
    new cdk.CfnOutput(this, "SenderIdentityArn", { value: senderArn });

    new ses.CfnEmailIdentity(this, "RecipientEmailIdentity1", {
      emailIdentity: recipientEmail1,
    });
    new cdk.CfnOutput(this, "RecipientEmail1Output", {
      value: recipientEmail1,
    });
    const recipient1Arn = cdk.Stack.of(this).formatArn({
      service: "ses",
      resource: "identity",
      resourceName: recipientEmail1,
    });
    new cdk.CfnOutput(this, "Recipient1IdentityArn", {
      value: recipient1Arn,
    });

    new ses.CfnEmailIdentity(this, "RecipientEmailIdentity2", {
      emailIdentity: recipientEmail2,
    });
    new cdk.CfnOutput(this, "RecipientEmail2Output", {
      value: recipientEmail2,
    });
    const recipient2Arn = cdk.Stack.of(this).formatArn({
      service: "ses",
      resource: "identity",
      resourceName: recipientEmail2,
    });
    new cdk.CfnOutput(this, "Recipient2IdentityArn", {
      value: recipient2Arn,
    });
  }
}
