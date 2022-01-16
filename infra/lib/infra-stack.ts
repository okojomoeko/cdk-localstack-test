import { Duration, Stack, StackProps } from "aws-cdk-lib";
import * as sns from "aws-cdk-lib/aws-sns";
import * as subs from "aws-cdk-lib/aws-sns-subscriptions";
import * as sqs from "aws-cdk-lib/aws-sqs";
import * as s3 from "aws-cdk-lib/aws-s3";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as iam from "aws-cdk-lib/aws-iam";
import * as cdk from "aws-cdk-lib";
import * as apigw from "aws-cdk-lib/aws-apigateway";

import { Construct } from "constructs";
export class InfraStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const queue = new sqs.Queue(this, "InfraQueue", {
      visibilityTimeout: Duration.seconds(300),
    });

    const topic = new sns.Topic(this, "InfraTopic");

    topic.addSubscription(new subs.SqsSubscription(queue));

    // Define S3 bucket resource
    const testBucket = new s3.Bucket(this, "TestBucket");

    const testLambdaRole = new iam.Role(this, "TestLambdaRole", {
      assumedBy: new iam.ServicePrincipal("lambda.amazonaws.com"),
    });
    testLambdaRole.addManagedPolicy(
      iam.ManagedPolicy.fromAwsManagedPolicyName("AWSLambdaBasicExecutionRole")
    );

    // Define Lambda resource
    const testLambda = new lambda.Function(this, "TestLambda", {
      runtime: lambda.Runtime.PYTHON_3_7,
      handler: "lambda_function.lambda_handler",
      code: lambda.Code.fromAsset("../lambda/lambda.zip"),
      environment: {
        LOCALSTACK_IP: `${process.env.LOCALSTACK_IP}`,
        BUCKET_NAME: `${testBucket.bucketName}`,
      },
      role: testLambdaRole,
    });

    testBucket.grantPut(testLambda);

    // Define API Gateway
    // 本当ならLambdaRestApiで簡単にしたいけど、localstack上でendpointを作るので、、
    const testApiGW = new apigw.LambdaRestApi(this, "TestApiGW", {
      handler: testLambda,
    });

    new cdk.CfnOutput(this, "TestLambdaName", {
      value: testLambda.functionName,
    });
    new cdk.CfnOutput(this, "TestS3BucketName", {
      value: testBucket.bucketName,
    });
    new cdk.CfnOutput(this, "TestApiGwEndPoint", {
      value: `http://localhost:4566/restapis/${testApiGW.restApiId}/prod/_user_request_${testApiGW.root.path}`,
    });
  }
}
