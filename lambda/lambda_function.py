import boto3
import os

LOCALSTACK_IP = os.environ['LOCALSTACK_IP']

# localstackのendpointを指定

s3 = boto3.resource(
    aws_access_key_id='dummy',
    aws_secret_access_key='dummy',
    region_name='ap-northeast-1',
    service_name='s3',
    endpoint_url = f'http://{LOCALSTACK_IP}:4566'
)

def lambda_handler(event, context):
    bucket = 'test-bucket'
    key = 'test.txt'

    res = s3.Bucket(bucket).Object(key).get()
    body = res['Body'].read()
    return {
        "statusCode": 200,
        "body": body,
    }
