import * as cdk from '@aws-cdk/core';
import { LambdaIntegration, RestApi } from '@aws-cdk/aws-apigateway';
import { Code, Function, Runtime, Tracing } from '@aws-cdk/aws-lambda';
import * as path from 'path';

export class ApigatewayLambdaStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const lambdaFunction = new Function(this, `${id}-function`, {
      runtime: Runtime.NODEJS,
      memorySize: 128,
      functionName: 'example',
      handler: 'index.handler',
      code: Code.fromAsset(path.resolve(__dirname,'..','dist')),
      tracing: Tracing.ACTIVE
    })

    const restApi = new RestApi(this, `${id}-restapi`, {
      restApiName: 'example-api'
    })

    /** Creates the root api resource for versioning /{version} */
    const apiVersion = restApi.root.addResource('{version}');

    /** Creates api resource with path /{version}/example */
    const exampleResource = apiVersion.addResource('example');

    /** Add methods to the resource where each methods has lambda integration */
    exampleResource.addMethod('GET', new LambdaIntegration(lambdaFunction));
    exampleResource.addMethod('POST', new LambdaIntegration(lambdaFunction));
    exampleResource.addMethod('DELETE', new LambdaIntegration(lambdaFunction));
    exampleResource.addMethod('PUT', new LambdaIntegration(lambdaFunction));

    /** Creates resource for example /{version}/example/more-example */
    const moreExampleResource = exampleResource.addResource('more-example');

    moreExampleResource.addMethod('GET', new LambdaIntegration(lambdaFunction));
  }
}
