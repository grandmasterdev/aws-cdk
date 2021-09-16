#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { ApigatewayCustomDomainStack } from '../lib/apigateway-custom-domain-stack';
import { CertificateStack } from '../lib/certificate-stack';

const app = new cdk.App();

const { certificate } = new CertificateStack(app, 'CertificateStack');

new ApigatewayCustomDomainStack(app, 'ApigatewayCustomDomainStack', {
  env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION },
  certificate
});
