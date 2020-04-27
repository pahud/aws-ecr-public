import * as cdk from '@aws-cdk/core';
import * as lambda from '@aws-cdk/aws-lambda';
import * as apigateway from '@aws-cdk/aws-apigateway';
import * as path from 'path';
import * as iam from '@aws-cdk/aws-iam';

export class CdkStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const handler = new lambda.Function(this, 'LambdaFn', {
      code: lambda.AssetCode.fromAsset(path.join(__dirname, '../../lambda.d')),
      runtime: lambda.Runtime.NODEJS_12_X,
      handler: 'lambda.handler',
      environment: {
        registry_id: this.node.tryGetContext('registry_id')
      }
    })

    handler.role!.addToPolicy(new iam.PolicyStatement({
      actions: [
        'ecr:GetDownloadUrlForLayer',
        'ecr:BatchGetImage',
        "ecr:GetAuthorizationToken",
        "ecr:BatchCheckLayerAvailability"
      ],
      resources: [ '*' ]
    }))

    const api = new apigateway.LambdaRestApi(this, 'RestApi', {
      handler,
      endpointConfiguration: {
        types: [ apigateway.EndpointType.REGIONAL ]
      },
    })

    const cfnStage = api.deploymentStage.node.findChild ('Resource') as apigateway.CfnStage
    cfnStage.addPropertyOverride('StageName', 'v2')

    new cdk.CfnOutput(this, 'DomainName', {
      value: `${api.restApiId}.execute-api.${cdk.Stack.of(this).region}.${cdk.Stack.of(this).urlSuffix}`
    })
  }
}
