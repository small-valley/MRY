import * as cdk from 'aws-cdk-lib';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as s3deploy from 'aws-cdk-lib/aws-s3-deployment';
import { Construct } from 'constructs';
import path from 'path';

export class BucketConstruct extends Construct {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id);

    // Create a S3 bucket for hosting the Next.js application
    const bucket = new s3.Bucket(this, 'MryFrontBucket', {
      websiteIndexDocument: 'index.html',
      websiteErrorDocument: 'index.html',
      publicReadAccess: true,
      objectOwnership: s3.ObjectOwnership.BUCKET_OWNER_ENFORCED,
      blockPublicAccess: new s3.BlockPublicAccess({
        blockPublicAcls: false,
        ignorePublicAcls: false,
        blockPublicPolicy: false,
        restrictPublicBuckets: false,
      }),
    });

    // Create a bucket policy to allow public read access
    const bucketPolicy = new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: ['s3:GetObject'],
      resources: [bucket.bucketArn + '/*'],
      principals: [new iam.AnyPrincipal()],
    });
    bucket.addToResourcePolicy(bucketPolicy);

    // Deploy Next.js build output to the S3 bucket
    new s3deploy.BucketDeployment(this, 'DeployNextJsApp', {
      sources: [s3deploy.Source.asset(path.join(__dirname, '../../frontend/out'))],
      destinationBucket: bucket,
    });

    // Create a CloudFront distribution
    const distribution = new cloudfront.CloudFrontWebDistribution(this, 'NextJsAppDistribution', {
      originConfigs: [
        {
          s3OriginSource: {
            s3BucketSource: bucket,
            originAccessIdentity: new cloudfront.OriginAccessIdentity(this, 'OAI', {
              comment: 'Allow CloudFront to access the bucket',
            }),
          },
          behaviors: [
            {
              isDefaultBehavior: true,
              allowedMethods: cloudfront.CloudFrontAllowedMethods.GET_HEAD,
            },
          ],
        },
      ],
      viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
      errorConfigurations: [
        {
          errorCode: 403,
          responseCode: 200,
          responsePagePath: '/index.html',
        },
        {
          errorCode: 404,
          responseCode: 200,
          responsePagePath: '/index.html',
        },
      ],
    });
  }
}
