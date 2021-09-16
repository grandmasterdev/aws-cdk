import { expect as expectCDK, matchTemplate, MatchStyle, haveResourceLike } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import * as cut from '../lib/certificate-stack';

describe('certificate stack', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    })

    test('stack should have resources', () => {
        const app = new cdk.App();

        const stack = new cut.CertificateStack(app, 'MyStack');

        expectCDK(stack).to(haveResourceLike('AWS::CertificateManager::Certificate'));
        expectCDK(stack).to(haveResourceLike('AWS::Route53::HostedZone'));
    })
})