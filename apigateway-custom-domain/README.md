# Custom API gateway domain

When you create an API in AWS, you will be given a random API URL that is generate by AWS upon successful deployment. The URL will often changes on every deployment. 

In order to maintain a proper host URL for your API, you will need to map it with a custom domain (eg. api.example-domain.com).

## Stack

The following demonstrate on how to create the stack needed for a `custom API gateway domain`:

### CDK

Generally when building the configuration your will need the `aws-certificatemanager`, `aws-route53` and `aws-apigateway`. 

```typescript
import * as cdk from '@aws-cdk/core';
import { HostedZone } from '@aws-cdk/aws-route53';
import { Certificate, CertificateValidation } from '@aws-cdk/aws-certificatemanager';
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
      exportName: 'apiGatewayCustomDomainName'
    })
  }
}
```

If the certificate needs to be in a different region or you need a cross-region certificate support, you can change the above configuration to the following:

```typescript
const crossRegionCertificate = new DnsValidatedCertificate(this, `${id}-certificate`, {
      domainName: certificateDomain,
      hostedZone: HostedZone.fromLookup(this, `${id}-hostedzone-lookup`, {domainName: zoneName}),
      region: 'us-east-1'
    })

const apiGatewayDomain = new DomainName(this, `${id}-domain`, {
	domainName,
	certificate: crossRegionCertificate
})
```