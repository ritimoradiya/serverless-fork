# Serverless Email Verification

Lambda function for sending email verification links when new users register.

## Prerequisites

- Node.js 18.x or higher
- npm 9.x or higher
- AWS CLI configured with credentials
- Access to AWS Lambda, SNS, SES, and DynamoDB

## Local Development

### Install Dependencies
```bash
npm install
```

### Run Tests
```bash
npm test
```

### Environment Variables

The Lambda function requires these environment variables (configured via Terraform):

- `DOMAIN` - Application domain (e.g., dev.ritimoradiya.me)
- `SES_FROM_EMAIL` - Sender email address
- `DYNAMODB_TABLE` - DynamoDB table name for tracking
- `SNS_TOPIC_ARN` - SNS topic ARN
- `AWS_REGION` - AWS region (default: us-east-1)

## Build and Deploy

### Package Lambda Function

From the `tf-aws-infra-fork` directory:
```bash
chmod +x package-lambda.sh
./package-lambda.sh
```

This creates `lambda/email-verification.zip`.

### Deploy with Terraform
```bash
cd tf-aws-infra-fork
terraform apply -var-file="devv.tfvars"
```

### Deployment
```bash
aws lambda update-function-code \
  --function-name emailVerificationLambda-devv \
  --zip-file fileb://email-verification.zip \
  --region us-east-1 \
  --profile devv
```

## Function Details

- **Handler:** `index.handler`
- **Runtime:** Node.js 18.x
- **Timeout:** 60 seconds
- **Memory:** 256 MB

## Features

- Sends verification emails via Amazon SES
- Prevents duplicate emails using DynamoDB
- 1-minute token expiration
- Automatic cleanup with TTL (24 hours)