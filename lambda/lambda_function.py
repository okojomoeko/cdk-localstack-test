import json
import boto3
import os
from datetime import datetime

import logging
logger = logging.getLogger()
logger.setLevel(logging.INFO)

LOCALSTACK_IP = os.environ['LOCALSTACK_IP']
BUCKET_NAME = os.environ['BUCKET_NAME']
REGION = os.environ['AWS_REGION']

# localstackのendpointを指定
s3 = boto3.resource(
    service_name='s3',
    endpoint_url = f'http://{LOCALSTACK_IP}:4566',
    region_name=REGION
)

def lambda_handler(event, context):
    datestr = datetime.now().strftime('%Y%m%d-%H%M%S')
    key = f'test_{datestr}.txt'
    file_contents = 'Hello! Lambda File!!'

    s3.Bucket(BUCKET_NAME).put_object(
        Key=key,
        Body=file_contents
    )

    return {
        "statusCode": 200,
        "body": json.dumps({
            "message": 'File created'
        }),
    }
