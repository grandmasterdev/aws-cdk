import { expect as expectCDK, matchTemplate, MatchStyle, haveResourceLike } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import * as cut from '../lib/apigateway-custom-domain-stack';

describe('apigateway custom domain', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    })

    test('stack should have resources', () => {
        const app = new cdk.App();

        const stack = new cut.ApigatewayCustomDomainStack(app, 'MyTestStack', {
            certificate: { certificateArn: 'arn:cert:us-east-1:1234567890:jest-mock' } as any
        });

        expectCDK(stack).to(haveResourceLike("AWS::ApiGateway::DomainName"));
    });

    test('should throw error if missing required props in the ApigatewayCustomDomainStack constructor', () => {
        const app = new cdk.App();

        expect(() => {
            new cut.ApigatewayCustomDomainStack(app, 'MyTestStack')
        }).toThrowError('Missing required props from ApiGatewayCustomDomainProps');
    })
})
