import * as cdk from '@aws-cdk/core';
import { Certificate, CertificateValidation } from '@aws-cdk/aws-certificatemanager';
import { HostedZone } from '@aws-cdk/aws-route53';

export class CertificateStack extends cdk.Stack {
    public readonly certificate: Certificate;

    constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        const zoneName: string = "example-domain.com";
        const certificateDomain: string = "*.example-domain.com";

        const hostedZone = new HostedZone(this, `${id}-hosted-zone`, {
            zoneName
        });

        this.certificate = new Certificate(this, `${id}-certificate`, {
            domainName: certificateDomain,
            validation: CertificateValidation.fromDns(hostedZone)
        })
    }
}