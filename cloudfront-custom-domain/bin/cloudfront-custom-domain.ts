#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { DomainCertificateStack } from '../lib/domain-certificate-stack';
import { CloudfrontCustomDomainStack } from '../lib/cloudfront-custom-domain-stack';

const app = new cdk.App();

const certificateStack = new DomainCertificateStack(app, 'CloudfrontCustomDomainStack', {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: 'us-east-1'
  }
});

new CloudfrontCustomDomainStack(app, 'CloudfrontCustomDomainStack', {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: 'us-east-1'
  },
  domainName: certificateStack.domainName,
  hostedZone: certificateStack.hostedZone,
  certificate: certificateStack.certificate
});
