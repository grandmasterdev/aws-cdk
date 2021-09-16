import { expect as expectCDK, matchTemplate, MatchStyle, haveResourceLike } from '@aws-cdk/assert';
import { ICertificate } from '@aws-cdk/aws-certificatemanager';
import { HostedZone } from '@aws-cdk/aws-route53';
import * as cdk from '@aws-cdk/core';
import * as CloudfrontCustomDomain from '../lib/cloudfront-custom-domain-stack';

test('stack should have resources', () => {
    const app = new cdk.App();
    // WHEN
    const stack = new CloudfrontCustomDomain.CloudfrontCustomDomainStack(app, 'MyTestStack', {
      env: {
        region: 'us-east-1',
        account: '0123456789'
      },
      domainName: 'example-domain.com',
      certificate: {certificateArn: 'arn:aws:certificate:us-east-1:mock:mock'} as ICertificate,
      hostedZone: {zoneName: 'mock-name',hostedZoneId: 'mock-zone-id'} as HostedZone
    });
    // THEN
    expectCDK(stack).to(haveResourceLike("AWS::S3::Bucket"))
    expectCDK(stack).to(haveResourceLike("AWS::CloudFront::Distribution"))
    expectCDK(stack).to(haveResourceLike("AWS::Route53::RecordSet"))
});
