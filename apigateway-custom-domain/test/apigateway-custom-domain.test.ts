import { expect as expectCDK, matchTemplate, MatchStyle, haveResourceLike } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import * as ApigatewayCustomDomain from '../lib/apigateway-custom-domain-stack';

test('stack should have resources', () => {
    const app = new cdk.App();
    // WHEN
    const stack = new ApigatewayCustomDomain.ApigatewayCustomDomainStack(app, 'MyTestStack');
    // THEN
    expectCDK(stack).to(haveResourceLike("AWS::Route53::HostedZone"))
    expectCDK(stack).to(haveResourceLike("AWS::ApiGateway::DomainName"))
    expectCDK(stack).to(haveResourceLike("AWS::CertificateManager::Certificate"))
});
