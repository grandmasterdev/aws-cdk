import * as cdk from "@aws-cdk/core";
import { HostedZone } from "@aws-cdk/aws-route53";
import {
  Effect,
  PolicyDocument,
  PolicyStatement,
  Role,
  ServicePrincipal,
} from "@aws-cdk/aws-iam";
import { Code, Function, Runtime } from "@aws-cdk/aws-lambda";
import { Duration } from "@aws-cdk/core";

export class EmailSesStack extends cdk.Stack {
  private readonly domainName: string = 'example.com';
  private readonly DKIM: boolean = true;
  private readonly normalizedZoneName: string;

  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Route53 resource
    const hostedZone = HostedZone.fromLookup(this, `${id}-email-hostedzone`, {
      domainName: this.domainName,
      privateZone: false,
    });

    this.normalizedZoneName = hostedZone.zoneName;

    // Roles
    const lambdaRole = new Role(this, `${id}-lambda-role`, {
      roleName: "email-setup-function",
      assumedBy: new ServicePrincipal("lambda.amazonaws.com"),
      inlinePolicies: {
        sesAccessPolicy: new PolicyDocument({
          statements: [
            new PolicyStatement({
              effect: Effect.ALLOW,
              actions: [
                "ses:GetIdentityVerificationAttributes",
                "ses:GetIdentityDkimAttributes",
                "ses:SetIdentityDkimEnabled",
                "ses:VerifyDomainIdentity",
                "ses:VerifyDomainDkim",
                "ses:ListIdentities",
                "ses:DeleteIdentity",
              ],
              resources: ["*"],
            }),

            new PolicyStatement({
              effect: Effect.ALLOW,
              actions: ["route53:GetChange"],
              resources: ["*"],
            }),

            new PolicyStatement({
              effect: Effect.ALLOW,
              actions: [
                "route53:changeResourceRecordSets",
                "route53:ListResourceRecordSets",
              ],
              resources: [`arn:${cdk.Stack.of(this).partition}:route53:::hostedzone/${hostedZone.hostedZoneId}`]
            }),
          ],
        }),
      },
    });

    // Lambda resource
    const emailSetupFunction = new Function(this, `${id}-emailsetup-function`, {
      functionName: "emailSetup",
      runtime: Runtime.NODEJS_14_X,
      memorySize: 128,
      timeout: Duration.minutes(15),
      handler: "index.handler",
      code: Code.fromAsset("dist"),
      role: lambdaRole,
    });


    // Custom resource
    const sesIdentity = new cdk.CustomResource(this, "IdentityRequestorResource", {
      serviceToken: emailSetupFunction.functionArn,
      properties: {
        DomainName: this.domainName,
        HostedZoneId: hostedZone.hostedZoneId,
        Region: this.region,
        DKIM: this.DKIM,
      },
    });
  }

  protected validate(): string[] {
    const errors: string[] = [];
    // Ensure the zone name is a parent zone of the certificate domain name
    if (!cdk.Token.isUnresolved(this.normalizedZoneName) &&
              this.domainName !== this.normalizedZoneName &&
              !this.domainName.endsWith("." + this.normalizedZoneName)) {
      errors.push(`DNS zone ${this.normalizedZoneName} is not authoritative for SES identity domain name ${this.domainName}`);
    }

    return errors;
  }
}
