# Create API gateway with lambda integration

The following will guide you on how configure your infrastructure to use AWS API gateway with lambda integration. 

## Stack

 ### CDK

Import all the dependencies...

```typescript
import * as cdk from '@aws-cdk/core';
import { LambdaIntegration, RestApi } from '@aws-cdk/aws-apigateway';
import { Code, Function, Runtime, Tracing } from '@aws-cdk/aws-lambda';
import * as path from 'path';
```



Create the lambda construct..

```typescript
const lambdaFunction = new Function(this, `${id}-function`, {
      runtime: Runtime.NODEJS,
      memorySize: 128,
      functionName: 'example',
      handler: 'index.handler',
      code: Code.fromAsset(path.resolve(__dirname,'..','dist')),
      tracing: Tracing.ACTIVE
    })
```

For this stack, we will be using the lambda `service design pattern`. Hence, the single lambda function.



Next, is to create the API...

```typescript
const restApi = new RestApi(this, `${id}-restapi`, {
      restApiName: 'example-api'
})
```



Once you have the API object, you can now add resources to your API. 

```typescript
/** Creates the root api resource for versioning /{version} */
const apiVersion = restApi.root.addResource('{version}');

/** Creates api resource with path /{version}/example */
const exampleResource = apiVersion.addResource('example');
```

Resources are generally your REST API paths. Example:

`GET https://www.my-domain.com/<resource 1>/<resource 2>`

will be...

`GET https://www.my-domain.com/v1/example`



When we have the resource created, we can now add `method` to it and the integration where in this case will be a `lambda`

```typescript
 /** Add methods to the resource where each methods has lambda integration */
exampleResource.addMethod('GET', new LambdaIntegration(lambdaFunction));
```



You should now have a working REST API stack now.

## Useful commands

 * `npm run build`   compile typescript to js
 * `npm run test`    perform the jest unit tests
 * `cdk deploy`      deploy this stack to your default AWS account/region
 * `cdk diff`        compare deployed stack with current state
 * `cdk synth`       emits the synthesized CloudFormation template
