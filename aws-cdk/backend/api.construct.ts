import * as cdk from 'aws-cdk-lib';
import { LambdaIntegration, RestApi } from 'aws-cdk-lib/aws-apigateway';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { Code, Function, LayerVersion, Runtime } from 'aws-cdk-lib/aws-lambda';
import { Construct } from 'constructs';
import { resolve } from 'path';
import { db } from './db.instance';
import { vpc } from './vpc.instance';

export class ApiConstruct extends Construct {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id);

    // Get a default VPC
    const vpcInstance = vpc(this);

    // Create an RDS instance
    const dbInstance = db(this, vpcInstance);

    // pack all external deps in layer
    const lambdaLayer = new LayerVersion(this, 'HandlerLayer', {
      code: Code.fromAsset(resolve(__dirname, 'layer/node_modules')),
      compatibleRuntimes: [Runtime.NODEJS_20_X],
      description: 'Api Handler Dependencies',
    });

    // add handler to respond to all our api requests
    const handler = new Function(this, 'Handler', {
      code: Code.fromAsset(resolve(__dirname, '../../backend/dist'), {
        exclude: ['node_modules'],
      }),
      vpc: vpcInstance,
      vpcSubnets: {
        subnetType: ec2.SubnetType.PUBLIC,
      },
      allowPublicSubnet: true,
      handler: 'lambda.handler',
      runtime: Runtime.NODEJS_20_X,
      layers: [lambdaLayer],
      environment: {
        NODE_PATH: '$NODE_PATH:/opt',
        POSTGRE_DATABASE_HOST: dbInstance.dbInstanceEndpointAddress,
        POSTGRE_DATABASE_PORT: dbInstance.dbInstanceEndpointPort,
        POSTGRE_DATABASE_USER_NAME: process.env.POSTGRE_DATABASE_USER_NAME,
        POSTGRE_DATABASE_PASSWORD: process.env.POSTGRE_DATABASE_PASSWORD,
        POSTGRE_DATABASE_NAME: process.env.POSTGRE_DATABASE_NAME,
      },
      timeout: cdk.Duration.seconds(10),
      memorySize: 128,
    });

    // Update RDS security group to allow inbound traffic from Lambda
    dbInstance.connections.allowFrom(handler, ec2.Port.tcp(5432), 'Allow inbound from Lambda');

    // add api resource to handle all http traffic and pass it to our handler
    const api = new RestApi(this, 'Api', {});

    // Attach Lambda integration to API Gateway methods
    // HACK: Considering about autogenerating this part by using the OpenAPI document or SpecRestApi
    const cohortsResource = api.root.addResource('cohorts');
    cohortsResource.addMethod('GET', new LambdaIntegration(handler));

    const cohortByIdResource = cohortsResource.addResource('{cohortId}');
    cohortByIdResource.addMethod('GET', new LambdaIntegration(handler));

    const usersResource = api.root.addResource('users');
    usersResource.addMethod('GET', new LambdaIntegration(handler));
    usersResource.addResource('{userId}').addMethod('GET', new LambdaIntegration(handler));

    const availabilityResource = api.root.addResource('availability');
    availabilityResource.addResource('{scheduleId}').addMethod('GET', new LambdaIntegration(handler));

    const programsResource = api.root.addResource('programs');
    programsResource.addMethod('GET', new LambdaIntegration(handler));
    programsResource.addMethod('POST', new LambdaIntegration(handler));
    programsResource.addMethod('PUT', new LambdaIntegration(handler));
    programsResource.addResource('{id}').addMethod('DELETE', new LambdaIntegration(handler));

    const programsCourseResource = programsResource.addResource('courses');
    programsCourseResource.addMethod('POST', new LambdaIntegration(handler));
    programsCourseResource.addMethod('PUT', new LambdaIntegration(handler));
    programsCourseResource.addResource('{courseId}').addMethod('DELETE', new LambdaIntegration(handler));

    const todoResource = api.root.addResource('todos');
    todoResource.addMethod('POST', new LambdaIntegration(handler));
    todoResource.addMethod('PUT', new LambdaIntegration(handler));

    const schedulesResource = api.root.addResource('schedules');
    schedulesResource.addMethod('POST', new LambdaIntegration(handler));
    schedulesResource.addResource('instructor').addResource('room').addMethod('PUT', new LambdaIntegration(handler));
    schedulesResource.addResource('course').addMethod('PUT', new LambdaIntegration(handler));
    schedulesResource.addResource('{scheduleId}').addMethod('DELETE', new LambdaIntegration(handler));
  }
}
