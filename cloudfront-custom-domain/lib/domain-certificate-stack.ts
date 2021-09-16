import * as cdk from '@aws-cdk/core';
import { Certificate, CertificateValidation, ICertificate } from '@aws-cdk/aws-certificatemanager';
import { HostedZone } from '@aws-cdk/aws-route53';

export class DomainCertificateStack extends cdk.Stack {
    public readonly certificate: ICertificate;
    public readonly domainName: string;
    public readonly hostedZone: HostedZone;

    constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        this.domainName = 'example-domain.com'

        this.hostedZone = new HostedZone(this, `${id}-hostedzone`, {
            zoneName: this.domainName
        })

        this.certificate = new Certificate(this, `${id}-certificate`, {
            domainName: this.domainName,
            validation: CertificateValidation.fromDns(this.hostedZone)
        });
    }
}