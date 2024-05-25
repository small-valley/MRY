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
    // to avoid maximum size (250MB) of a layer, split into to layers
    const lambdaLayerA = new LayerVersion(this, 'HandlerLayerA', {
      code: Code.fromAsset(resolve(__dirname, 'layer/a/node_modules')),
      compatibleRuntimes: [Runtime.NODEJS_20_X],
      description: 'Api Handler Dependencies A',
    });
    const lambdaLayerB = new LayerVersion(this, 'HandlerLayerB', {
      code: Code.fromAsset(resolve(__dirname, 'layer/b/node_modules')),
      compatibleRuntimes: [Runtime.NODEJS_20_X],
      description: 'Api Handler Dependencies B',
    });

    // add handler to respond to all our api requests
    const handlerA = new Function(this, 'HandlerA', {
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
      layers: [lambdaLayerA, lambdaLayerB],
      environment: {
        NODE_PATH: '$NODE_PATH:/opt',
        POSTGRE_DATABASE_HOST: dbInstance.dbInstanceEndpointAddress,
        POSTGRE_DATABASE_PORT: dbInstance.dbInstanceEndpointPort,
        POSTGRE_DATABASE_USER_NAME: process.env.POSTGRE_DATABASE_USER_NAME,
        POSTGRE_DATABASE_PASSWORD: process.env.POSTGRE_DATABASE_PASSWORD,
        POSTGRE_DATABASE_NAME: process.env.POSTGRE_DATABASE_NAME,
        FRONT_AUTH_REDIRECT_URL: process.env.FRONT_AUTH_REDIRECT_URL,
        GOOGLE_OAUTH_CALLBACK_URL: process.env.GOOGLE_OAUTH_CALLBACK_URL,
        GOOGLE_OAUTH_CLIENT_ID: process.env.GOOGLE_OAUTH_CLIENT_ID,
        GOOGLE_OAUTH_CLIENT_SECRET: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
        JWT_EXPIRATION: process.env.JWT_EXPIRATION,
        JWT_SECRET: process.env.JWT_SECRET,
      },
      timeout: cdk.Duration.seconds(10),
      memorySize: 128,
    });

    const handlerB = new Function(this, 'HandlerB', {
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
      layers: [lambdaLayerA, lambdaLayerB],
      environment: {
        NODE_PATH: '$NODE_PATH:/opt',
        POSTGRE_DATABASE_HOST: dbInstance.dbInstanceEndpointAddress,
        POSTGRE_DATABASE_PORT: dbInstance.dbInstanceEndpointPort,
        POSTGRE_DATABASE_USER_NAME: process.env.POSTGRE_DATABASE_USER_NAME,
        POSTGRE_DATABASE_PASSWORD: process.env.POSTGRE_DATABASE_PASSWORD,
        POSTGRE_DATABASE_NAME: process.env.POSTGRE_DATABASE_NAME,
        FRONT_AUTH_REDIRECT_URL: process.env.FRONT_AUTH_REDIRECT_URL,
        GOOGLE_OAUTH_CALLBACK_URL: process.env.GOOGLE_OAUTH_CALLBACK_URL,
        GOOGLE_OAUTH_CLIENT_ID: process.env.GOOGLE_OAUTH_CLIENT_ID,
        GOOGLE_OAUTH_CLIENT_SECRET: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
        JWT_EXPIRATION: process.env.JWT_EXPIRATION,
        JWT_SECRET: process.env.JWT_SECRET,
      },
      timeout: cdk.Duration.seconds(10),
      memorySize: 128,
    });

    const handlerC = new Function(this, 'HandlerC', {
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
      layers: [lambdaLayerA, lambdaLayerB],
      environment: {
        NODE_PATH: '$NODE_PATH:/opt',
        POSTGRE_DATABASE_HOST: dbInstance.dbInstanceEndpointAddress,
        POSTGRE_DATABASE_PORT: dbInstance.dbInstanceEndpointPort,
        POSTGRE_DATABASE_USER_NAME: process.env.POSTGRE_DATABASE_USER_NAME,
        POSTGRE_DATABASE_PASSWORD: process.env.POSTGRE_DATABASE_PASSWORD,
        POSTGRE_DATABASE_NAME: process.env.POSTGRE_DATABASE_NAME,
        FRONT_AUTH_REDIRECT_URL: process.env.FRONT_AUTH_REDIRECT_URL,
        GOOGLE_OAUTH_CALLBACK_URL: process.env.GOOGLE_OAUTH_CALLBACK_URL,
        GOOGLE_OAUTH_CLIENT_ID: process.env.GOOGLE_OAUTH_CLIENT_ID,
        GOOGLE_OAUTH_CLIENT_SECRET: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
        JWT_EXPIRATION: process.env.JWT_EXPIRATION,
        JWT_SECRET: process.env.JWT_SECRET,
      },
      timeout: cdk.Duration.seconds(10),
      memorySize: 128,
    });

    const handlerD = new Function(this, 'HandlerD', {
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
      layers: [lambdaLayerA, lambdaLayerB],
      environment: {
        NODE_PATH: '$NODE_PATH:/opt',
        POSTGRE_DATABASE_HOST: dbInstance.dbInstanceEndpointAddress,
        POSTGRE_DATABASE_PORT: dbInstance.dbInstanceEndpointPort,
        POSTGRE_DATABASE_USER_NAME: process.env.POSTGRE_DATABASE_USER_NAME,
        POSTGRE_DATABASE_PASSWORD: process.env.POSTGRE_DATABASE_PASSWORD,
        POSTGRE_DATABASE_NAME: process.env.POSTGRE_DATABASE_NAME,
        FRONT_AUTH_REDIRECT_URL: process.env.FRONT_AUTH_REDIRECT_URL,
        GOOGLE_OAUTH_CALLBACK_URL: process.env.GOOGLE_OAUTH_CALLBACK_URL,
        GOOGLE_OAUTH_CLIENT_ID: process.env.GOOGLE_OAUTH_CLIENT_ID,
        GOOGLE_OAUTH_CLIENT_SECRET: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
        JWT_EXPIRATION: process.env.JWT_EXPIRATION,
        JWT_SECRET: process.env.JWT_SECRET,
      },
      timeout: cdk.Duration.seconds(10),
      memorySize: 128,
    });

    const handlerE = new Function(this, 'HandlerE', {
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
      layers: [lambdaLayerA, lambdaLayerB],
      environment: {
        NODE_PATH: '$NODE_PATH:/opt',
        POSTGRE_DATABASE_HOST: dbInstance.dbInstanceEndpointAddress,
        POSTGRE_DATABASE_PORT: dbInstance.dbInstanceEndpointPort,
        POSTGRE_DATABASE_USER_NAME: process.env.POSTGRE_DATABASE_USER_NAME,
        POSTGRE_DATABASE_PASSWORD: process.env.POSTGRE_DATABASE_PASSWORD,
        POSTGRE_DATABASE_NAME: process.env.POSTGRE_DATABASE_NAME,
        FRONT_AUTH_REDIRECT_URL: process.env.FRONT_AUTH_REDIRECT_URL,
        GOOGLE_OAUTH_CALLBACK_URL: process.env.GOOGLE_OAUTH_CALLBACK_URL,
        GOOGLE_OAUTH_CLIENT_ID: process.env.GOOGLE_OAUTH_CLIENT_ID,
        GOOGLE_OAUTH_CLIENT_SECRET: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
        JWT_EXPIRATION: process.env.JWT_EXPIRATION,
        JWT_SECRET: process.env.JWT_SECRET,
      },
      timeout: cdk.Duration.seconds(10),
      memorySize: 128,
    });

    // Update RDS security group to allow inbound traffic from Lambda
    dbInstance.connections.allowFrom(handlerA, ec2.Port.tcp(5432), 'Allow inbound from Lambda');
    dbInstance.connections.allowFrom(handlerB, ec2.Port.tcp(5432), 'Allow inbound from Lambda');
    dbInstance.connections.allowFrom(handlerC, ec2.Port.tcp(5432), 'Allow inbound from Lambda');
    dbInstance.connections.allowFrom(handlerD, ec2.Port.tcp(5432), 'Allow inbound from Lambda');
    dbInstance.connections.allowFrom(handlerE, ec2.Port.tcp(5432), 'Allow inbound from Lambda');

    // add api resource to handle all http traffic and pass it to our handler
    const apiA = new RestApi(this, 'ApiA', {
      defaultCorsPreflightOptions: {
        allowOrigins: ['https://mry-ciccc.me', 'http://localhost:3000'],
        allowMethods: ['GET', 'POST', 'PUT', 'DELETE'],
      },
    });

    // Attach Lambda integration to API Gateway methods
    // HACK: Considering about autogenerating this part by using the OpenAPI document or SpecRestApi
    const cohortsResource = apiA.root.addResource('cohorts');
    cohortsResource.addMethod('GET', new LambdaIntegration(handlerA));
    cohortsResource.addMethod('POST', new LambdaIntegration(handlerA));

    const cohortByIdResource = cohortsResource.addResource('{cohortId}');
    cohortByIdResource.addMethod('GET', new LambdaIntegration(handlerA));
    const cohortRecentResource = cohortsResource.addResource('recent').addResource('{programId}');
    cohortRecentResource.addMethod('GET', new LambdaIntegration(handlerA));

    const usersResource = apiA.root.addResource('users');
    usersResource.addMethod('GET', new LambdaIntegration(handlerA));
    usersResource.addResource('managers').addMethod('GET', new LambdaIntegration(handlerA));
    usersResource.addResource('login').addResource('user').addMethod('GET', new LambdaIntegration(handlerA));
    const usersUserIdResource = usersResource.addResource('{userId}');
    usersUserIdResource.addMethod('GET', new LambdaIntegration(handlerA));
    usersUserIdResource.addResource('avatar').addMethod('POST', new LambdaIntegration(handlerA));

    const availabilityResource = apiA.root.addResource('availability');
    availabilityResource.addResource('{scheduleId}').addMethod('GET', new LambdaIntegration(handlerA));

    const apiB = new RestApi(this, 'ApiB', {
      defaultCorsPreflightOptions: {
        allowOrigins: ['https://mry-ciccc.me', 'http://localhost:3000'],
        allowMethods: ['GET', 'POST', 'PUT', 'DELETE'],
      },
    });

    const todoResource = apiB.root.addResource('todos');
    todoResource.addMethod('POST', new LambdaIntegration(handlerB));
    todoResource.addMethod('PUT', new LambdaIntegration(handlerB));

    const schedulesResource = apiB.root.addResource('schedules');
    schedulesResource.addResource('ongoing-and-upcoming').addMethod('GET', new LambdaIntegration(handlerB));
    schedulesResource.addMethod('POST', new LambdaIntegration(handlerB));
    schedulesResource.addResource('instructor').addResource('room').addMethod('PUT', new LambdaIntegration(handlerB));
    schedulesResource.addResource('course').addMethod('PUT', new LambdaIntegration(handlerB));
    schedulesResource.addResource('{scheduleId}').addMethod('DELETE', new LambdaIntegration(handlerB));

    const notificationsResource = apiB.root.addResource('notifications');
    notificationsResource.addMethod('GET', new LambdaIntegration(handlerB));
    notificationsResource.addMethod('POST', new LambdaIntegration(handlerB));
    notificationsResource.addResource('sender').addMethod('GET', new LambdaIntegration(handlerB));
    notificationsResource.addResource('{notificationId}').addMethod('PUT', new LambdaIntegration(handlerB));

    const apiC = new RestApi(this, 'ApiC', {
      defaultCorsPreflightOptions: {
        allowOrigins: ['https://mry-ciccc.me', 'http://localhost:3000'],
        allowMethods: ['GET', 'POST', 'PUT', 'DELETE'],
      },
    });

    const userDayoffsResource = apiC.root.addResource('userDayoffs');
    //userDayoffsResource.addResource('{userId}').addMethod('GET', new LambdaIntegration(handler));
    userDayoffsResource.addMethod('POST', new LambdaIntegration(handlerC));
    const userDayoffsWithIdResource = userDayoffsResource.addResource('{userDayoffId}');
    userDayoffsWithIdResource.addMethod('PUT', new LambdaIntegration(handlerC));
    userDayoffsWithIdResource.addMethod('DELETE', new LambdaIntegration(handlerC));

    const userCapabilityCoursesResource = apiC.root.addResource('userCapabilityCourses');
    userCapabilityCoursesResource.addMethod('POST', new LambdaIntegration(handlerC));
    const userCapabilityCoursesWithIdResource = userCapabilityCoursesResource.addResource('{userCapabilityCourseId}');
    userCapabilityCoursesWithIdResource.addMethod('PUT', new LambdaIntegration(handlerC));
    userCapabilityCoursesWithIdResource.addMethod('DELETE', new LambdaIntegration(handlerC));

    const userCapabilityDaysResource = apiC.root.addResource('userCapabilityDays');
    userCapabilityDaysResource.addMethod('POST', new LambdaIntegration(handlerC));
    const userCapabilityDaysWithIdResource = userCapabilityDaysResource.addResource('{userCapabilityDayId}');
    userCapabilityDaysWithIdResource.addMethod('PUT', new LambdaIntegration(handlerC));
    userCapabilityDaysWithIdResource.addMethod('DELETE', new LambdaIntegration(handlerC));

    const userCapabilityTimesResource = apiC.root.addResource('userCapabilityTimes');
    userCapabilityTimesResource.addMethod('POST', new LambdaIntegration(handlerC));
    const userCapabilityTimesWithIdResource = userCapabilityTimesResource.addResource('{userCapabilityTimeId}');
    userCapabilityTimesWithIdResource.addMethod('PUT', new LambdaIntegration(handlerC));
    userCapabilityTimesWithIdResource.addMethod('DELETE', new LambdaIntegration(handlerC));

    const apiD = new RestApi(this, 'ApiD', {
      defaultCorsPreflightOptions: {
        allowOrigins: ['https://mry-ciccc.me', 'http://localhost:3000'],
        allowMethods: ['GET', 'POST', 'PUT', 'DELETE'],
      },
    });

    const daysResource = apiD.root.addResource('days');
    daysResource.addMethod('GET', new LambdaIntegration(handlerD));

    const periodsResource = apiD.root.addResource('periods');
    periodsResource.addMethod('GET', new LambdaIntegration(handlerD));

    const schoolBreaksResource = apiD.root.addResource('school-breaks');
    schoolBreaksResource.addMethod('GET', new LambdaIntegration(handlerD));
    schoolBreaksResource.addMethod('POST', new LambdaIntegration(handlerD));
    schoolBreaksResource.addResource('{schoolBreakId}').addMethod('DELETE', new LambdaIntegration(handlerD));

    const dashboardResource = apiD.root.addResource('dashboard');
    dashboardResource.addMethod('GET', new LambdaIntegration(handlerD));

    const authResource = apiD.root.addResource('auth');
    authResource.addResource('signin').addMethod('POST', new LambdaIntegration(handlerD));
    authResource.addResource('signup').addMethod('POST', new LambdaIntegration(handlerD));
    authResource.addResource('logout').addMethod('POST', new LambdaIntegration(handlerD));
    const googleAuthResource = authResource.addResource('google');
    googleAuthResource.addMethod('GET', new LambdaIntegration(handlerD));
    googleAuthResource.addResource('callback').addMethod('GET', new LambdaIntegration(handlerD));

    const apiE = new RestApi(this, 'ApiE', {
      defaultCorsPreflightOptions: {
        allowOrigins: ['https://mry-ciccc.me', 'http://localhost:3000'],
        allowMethods: ['GET', 'POST', 'PUT', 'DELETE'],
      },
    });

    const programsResource = apiE.root.addResource('programs');
    programsResource.addMethod('GET', new LambdaIntegration(handlerE));
    programsResource.addMethod('POST', new LambdaIntegration(handlerE));
    programsResource.addMethod('PUT', new LambdaIntegration(handlerE));
    programsResource.addResource('{id}').addMethod('DELETE', new LambdaIntegration(handlerE));
    const programsCourseResource = programsResource.addResource('courses');
    programsCourseResource.addMethod('POST', new LambdaIntegration(handlerE));
    programsCourseResource.addMethod('PUT', new LambdaIntegration(handlerE));
    programsCourseResource.addResource('{courseId}').addMethod('DELETE', new LambdaIntegration(handlerE));
  }
}
