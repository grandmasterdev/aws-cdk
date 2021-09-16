import * as cdk from '@aws-cdk/core';
import { DomainName } from '@aws-cdk/aws-apigateway';
import { Certificate } from '@aws-cdk/aws-certificatemanager';

export class ApigatewayCustomDomainStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: ApiGatewayCustomDomainProps) {
    super(scope, id, props);

    if (!props?.certificate) {
      throw new Error(`Missing required props from ApiGatewayCustomDomainProps`)
    }

    const { certificate } = props;

    const domainName: string = "api.example-domain.com";

    const apiGatewayDomain = new DomainName(this, `${id}-domain`, {
      domainName,
      certificate
    })

    new cdk.CfnOutput(this, `${id}-apigateway-custom-domain-output`, {
      description: 'The custom domain name of the api gateway',
      value: apiGatewayDomain.domainName,
      exportName: 'apiGatewayDomainName'
    })
  }
}

export interface ApiGatewayCustomDomainProps extends cdk.StackProps {
  certificate: Certificate;
}
