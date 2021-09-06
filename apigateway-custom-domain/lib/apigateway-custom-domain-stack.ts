import * as cdk from '@aws-cdk/core';
import { HostedZone } from '@aws-cdk/aws-route53';
import { Certificate, CertificateValidation, DnsValidatedCertificate } from '@aws-cdk/aws-certificatemanager';
import { DomainName } from '@aws-cdk/aws-apigateway';

export class ApigatewayCustomDomainStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const zoneName: string = "example-domain.com";
    const certificateDomain: string = "*.example-domain.com";
    const domainName: string = "api.example-domain.com";

    const hostedZone = new HostedZone(this, `${id}-hosted-zone`, {
      zoneName
    });

    const certificate = new Certificate(this, `${id}-certificate`, {
      domainName: certificateDomain,
      validation: CertificateValidation.fromDns(hostedZone)
    })

    const apiGatewayDomain = new DomainName(this, `${id}-domain`, {
      domainName,
      certificate
    })

    new cdk.CfnOutput(this, `${id}-apigateway-custom-domain-output`, {
      description: 'The custom domain name of the api gateway',
      value: apiGatewayDomain.domainName,
      exportName: 'apiGatewayDomainName'
    })
  }
}
