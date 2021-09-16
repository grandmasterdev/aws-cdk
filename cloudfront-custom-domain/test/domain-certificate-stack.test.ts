import { expect as expectCDK, matchTemplate, MatchStyle, haveResourceLike } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import * as cut from '../lib/domain-certificate-stack';

test('stack should have resources', () => {
    const app = new cdk.App();
    // WHEN
    const stack = new cut.DomainCertificateStack(app, 'MyTestStack', {
        env: {
            region: 'us-east-1',
            account: '0123456789'
        }
    });
    // THEN
    expectCDK(stack).to(haveResourceLike("AWS::Route53::HostedZone"))
    expectCDK(stack).to(haveResourceLike("AWS::CertificateManager::Certificate"))
});



