import * as cdk from '@aws-cdk/core';
import { Certificate, CertificateValidation, ICertificate } from '@aws-cdk/aws-certificatemanager';
import { ARecord, HostedZone, RecordTarget } from '@aws-cdk/aws-route53';
import { CloudFrontTarget } from '@aws-cdk/aws-route53-targets';
import { Distribution, HttpVersion, SecurityPolicyProtocol, CloudFrontWebDistribution, ViewerProtocolPolicy } from '@aws-cdk/aws-cloudfront';
import { S3Origin } from '@aws-cdk/aws-cloudfront-origins';
import { Bucket } from '@aws-cdk/aws-s3';

export class CloudfrontCustomDomainStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props: CloudfrontCustomDomainStackProps) {
    super(scope, id, props);

    const {domainName, certificate, hostedZone} = props;

    const bucket = new Bucket(this, `${id}-app-bucket`, {
      bucketName: 'example-app' + this.account
    })

    const cloudfront = new Distribution(this, `${id}-distribution`, {
      defaultBehavior: {
        origin: new S3Origin(bucket)
      },
      domainNames: [domainName],
      certificate: certificate,
      httpVersion: HttpVersion.HTTP2,
      minimumProtocolVersion: SecurityPolicyProtocol.TLS_V1_2_2021
    })

    new ARecord(this, `${id}-alias-record`, {
      zone: hostedZone,
      target: RecordTarget.fromAlias(
        new CloudFrontTarget(cloudfront)
      )
    })
  }
}

export interface CloudfrontCustomDomainStackProps extends cdk.StackProps {
  certificate: ICertificate;
  domainName: string;
  hostedZone: HostedZone;
}
