import { expect as expectCDK, matchTemplate, MatchStyle, haveResourceLike, countResourcesLike, exactlyMatchTemplate } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import * as ApigatewayLambda from '../lib/apigateway-lambda-stack';

test('stack should have resources', () => {
    const app = new cdk.App();
    // WHEN
    const stack = new ApigatewayLambda.ApigatewayLambdaStack(app, 'MyTestStack');
    // THEN
    expectCDK(stack).to(haveResourceLike("AWS::IAM::Role"));
    expectCDK(stack).to(haveResourceLike("AWS::ApiGateway::RestApi"));
    expectCDK(stack).to(haveResourceLike("AWS::ApiGateway::Resource"));
    expectCDK(stack).to(countResourcesLike("AWS::ApiGateway::Resource", 3, {}));
    expectCDK(stack).to(haveResourceLike("AWS::ApiGateway::Method"));
    expectCDK(stack).to(countResourcesLike("AWS::ApiGateway::Method", 5, {}));
    expectCDK(stack).to(haveResourceLike("AWS::Lambda::Function"));
    expectCDK(stack).to(haveResourceLike("AWS::Lambda::Permission"))
});
