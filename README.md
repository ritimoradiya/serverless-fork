# Serverless Email Verification - AWS Lambda 📧

**Production-grade serverless email verification system** built with AWS Lambda, integrated with SNS, SES, and DynamoDB. Provides automated, event-driven email verification for user registration with 1-minute token expiration and complete CI/CD automation.

[![AWS Lambda](https://img.shields.io/badge/AWS-Lambda-FF9900)](https://aws.amazon.com/lambda/)
[![Node.js](https://img.shields.io/badge/Node.js-18.x-green)](https://nodejs.org/)
[![Serverless](https://img.shields.io/badge/Architecture-Serverless-blue)](https://aws.amazon.com/serverless/)
[![CI/CD](https://img.shields.io/badge/CI%2FCD-Automated-brightgreen)](./.github/workflows)

---

## 🎯 Overview

This Lambda function handles email verification for new user registrations in a cloud-native web application. It provides a secure, scalable, and cost-effective solution for email verification without managing servers.

### **Key Features:**
- ✅ **Event-Driven Architecture** - Triggered by SNS topic on user registration
- ✅ **Automated Email Delivery** - AWS SES integration for transactional emails
- ✅ **Token Management** - DynamoDB with TTL for secure token storage
- ✅ **Time-Sensitive Security** - 1-minute token expiration
- ✅ **Zero Server Management** - Fully serverless with auto-scaling
- ✅ **CI/CD Automation** - GitHub Actions for automated deployment
- ✅ **Cost Optimization** - Pay-per-invocation pricing model

---

## 📋 Table of Contents

- [Architecture](#architecture)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Configuration](#configuration)
- [Deployment](#deployment)
- [Email Verification Flow](#email-verification-flow)
- [Environment Variables](#environment-variables)
- [Testing](#testing)
- [Monitoring](#monitoring)
- [Troubleshooting](#troubleshooting)

---

## 🏗️ Architecture

### **Email Verification Workflow**
```
User Registration
       ↓
   Web Application
       ↓
   SNS Topic (user-registration)
       ↓
   Lambda Function
       ↓
   ┌───────────────┼───────────────┐
   ↓               ↓               ↓
DynamoDB      Generate        SES Email
(Store Token)  Verification   (Send Email)
   ↓           Link             ↓
   ↓               ↓               ↓
   └───────────────┴───────────────┘
                   ↓
            User Clicks Link
                   ↓
            Web Application
                   ↓
         Verify Token & Email
```

### **AWS Service Integration**
```
┌─────────────────────────────────────────────────────┐
│              SNS Topic (Trigger)                     │
│           user-registration-{env}                   │
└──────────────────┬──────────────────────────────────┘
                   ↓
┌─────────────────────────────────────────────────────┐
│         Lambda Function (Core Logic)                 │
│      emailVerificationLambda-{env}                  │
│                                                      │
│  • Parse SNS event                                  │
│  • Generate verification token (UUID)               │
│  • Store token in DynamoDB (1-min TTL)              │
│  • Build verification link                          │
│  • Send email via SES                               │
└──────────────────┬──────────────────────────────────┘
                   ↓
         ┌─────────┴─────────┐
         ↓                   ↓
┌─────────────────┐ ┌─────────────────┐
│   DynamoDB      │ │   Amazon SES    │
│ EmailVerification│ │  Email Service  │
│                 │ │                 │
│ • email (key)   │ │ • From address  │
│ • token         │ │ • HTML template │
│ • ttl (60s)     │ │ • Delivery      │
└─────────────────┘ └─────────────────┘
```

### **Key Design Patterns**

- **Event-Driven** - Fully reactive, triggered by SNS events
- **Idempotent** - Safe to retry without side effects
- **Ephemeral Storage** - Tokens expire automatically via DynamoDB TTL
- **Stateless** - No persistent state in Lambda function
- **Fail-Fast** - Early validation with detailed error messages

---

## ✨ Features

### **Core Functionality**
- 📧 **Automated Email Sending** - Professional HTML email templates
- 🔐 **Secure Token Generation** - UUID-based verification tokens
- ⏱️ **Time-Limited Tokens** - Automatic expiration after 1 minute
- 📊 **Token Tracking** - DynamoDB storage with TTL for automatic cleanup
- 🔗 **Dynamic Link Generation** - Environment-aware verification URLs
- ✅ **Email Validation** - Ensures valid email format before processing

### **AWS Integration**
- **SNS Trigger** - Automatic invocation on user registration events
- **SES Email** - Reliable transactional email delivery
- **DynamoDB** - Persistent token storage with automatic expiration
- **CloudWatch Logs** - Comprehensive logging for debugging
- **VPC Integration** - Secure communication with private resources
- **IAM Roles** - Least-privilege permissions

### **DevOps & Operations**
- **CI/CD Pipeline** - Automated deployment via GitHub Actions
- **Environment Management** - Separate DEV/DEMO configurations
- **Error Handling** - Graceful error handling with detailed logging
- **Monitoring** - CloudWatch metrics and alarms
- **Cost Optimization** - Pay only for actual invocations

---

## 🛠️ Technology Stack

### **Runtime & Framework**
- **Runtime:** Node.js 18.x
- **Language:** JavaScript (ES6+)
- **AWS SDK:** v3 (modular imports)

### **AWS Services**
- **Lambda** - Serverless compute
- **SNS** - Event notification trigger
- **SES** - Email delivery service
- **DynamoDB** - Token storage with TTL
- **CloudWatch** - Logging and monitoring
- **IAM** - Security and permissions
- **VPC** - Network isolation

### **DevOps Tools**
- **GitHub Actions** - CI/CD automation
- **npm** - Package management
- **AWS CLI** - Deployment and management

### **Dependencies**
- `@aws-sdk/client-ses` - Email sending
- `@aws-sdk/client-dynamodb` - Token storage
- `@aws-sdk/lib-dynamodb` - DynamoDB document client
- `uuid` - Secure token generation

---

## 📦 Project Structure
```
serverless-fork/
├── .github/
│   └── workflows/
│       └── deploy-lambda.yml      # Automated deployment workflow
│
├── src/
│   └── index.js                   # Main Lambda handler
│
├── tests/
│   └── index.test.js              # Unit tests
│
├── .env.example                   # Environment variables template
├── .gitignore                     # Git exclusions
├── package.json                   # Dependencies and scripts
├── package-lock.json              # Dependency lock file
└── README.md                      # This file
```

### **Key Files**

| File | Purpose |
|------|---------|
| `src/index.js` | Lambda function handler and core logic |
| `deploy-lambda.yml` | GitHub Actions CI/CD workflow |
| `package.json` | Dependencies and npm scripts |
| `.env.example` | Environment variables template |
| `tests/index.test.js` | Unit tests for Lambda function |

---

## 📋 Prerequisites

### **Required**
- **Node.js** 18.x or higher
- **npm** for package management
- **AWS CLI** configured with credentials
- **AWS Account** with Lambda, SES, SNS, DynamoDB access

### **AWS Resources Required**
- SNS Topic for user registration events
- SES verified sender email address
- DynamoDB table for token storage
- IAM role with appropriate permissions

---

## ⚡ Quick Start

### **1. Clone Repository**
```bash
git clone <repository-url>
cd serverless-fork
```

### **2. Install Dependencies**
```bash
npm install
```

### **3. Configure Environment**
```bash
cp .env.example .env
# Edit .env with your configuration
```

### **4. Local Testing**
```bash
npm test
```

### **5. Deploy to AWS**
```bash
# Manual deployment (if needed)
npm run deploy

# Or push to main branch for automated deployment
git push origin main
```

---

## ⚙️ Configuration

### **Environment Variables**

Create `.env` file:
```env
# AWS Configuration
AWS_REGION=us-east-1

# Email Configuration
SES_EMAIL_FROM=noreply@yourdomain.com
DOMAIN_NAME=yourdomain.com

# DynamoDB Configuration
DYNAMODB_TABLE=EmailVerification

# Application Configuration
NODE_ENV=development
```

### **Lambda Configuration**
```javascript
{
  "runtime": "nodejs18.x",
  "handler": "index.handler",
  "timeout": 60,
  "memory": 256,
  "environment": {
    "SES_EMAIL_FROM": "noreply@yourdomain.com",
    "DOMAIN_NAME": "dev.yourdomain.com",
    "DYNAMODB_TABLE": "EmailVerification"
  }
}
```

---

## 🚀 Deployment

### **Automated Deployment (CI/CD)**

**Trigger:** Push to `main` branch
```bash
git add .
git commit -m "feat: Update email template"
git push origin main
```

**GitHub Actions automatically:**
1. ✅ Installs dependencies
2. ✅ Runs tests
3. ✅ Packages Lambda function (zip)
4. ✅ Deploys to AWS Lambda
5. ✅ Updates function configuration
6. ✅ Verifies deployment

**Deployment time:** ~2-3 minutes

---

### **Manual Deployment**
```bash
# 1. Install dependencies
npm install --production

# 2. Package function
zip -r function.zip src/ node_modules/

# 3. Deploy to AWS
aws lambda update-function-code \
  --function-name emailVerificationLambda \
  --zip-file fileb://function.zip \
  --region us-east-1

# 4. Verify deployment
aws lambda get-function \
  --function-name emailVerificationLambda \
  --region us-east-1
```

---

## 📧 Email Verification Flow

### **Step 1: User Registration**

User submits registration form in web application:
```json
{
  "first_name": "John",
  "last_name": "Doe",
  "email": "john.doe@example.com"
}
```

### **Step 2: SNS Event Trigger**

Application publishes message to SNS topic:
```json
{
  "email": "john.doe@example.com",
  "first_name": "John",
  "token": "uuid-from-webapp"
}
```

### **Step 3: Lambda Processing**

Lambda function:
1. Receives SNS event
2. Extracts user data
3. Uses token from webapp (does NOT generate new token)
4. Stores token in DynamoDB with 60-second TTL
5. Generates verification link
6. Sends email via SES

### **Step 4: Email Delivery**

User receives email with verification link:
```
https://dev.yourdomain.com/v1/user/verify?email=john.doe@example.com&token=uuid-string
```

### **Step 5: Verification**

User clicks link → Application verifies token → Email confirmed

---

## 🔐 Environment Variables

### **Required Variables**

| Variable | Description | Example |
|----------|-------------|---------|
| `SES_EMAIL_FROM` | Verified sender email address | `noreply@yourdomain.com` |
| `DOMAIN_NAME` | Application domain for verification links | `dev.yourdomain.com` |
| `DYNAMODB_TABLE` | DynamoDB table name for tokens | `EmailVerification` |
| `AWS_REGION` | AWS region for services | `us-east-1` |

### **Optional Variables**

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment (dev/production) | `production` |
| `LOG_LEVEL` | Logging level | `info` |

---

## 🧪 Testing

### **Run Tests**
```bash
# All tests
npm test

# With coverage
npm run test:coverage

# Watch mode
npm run test:watch
```

### **Test Structure**
```javascript
// tests/index.test.js
describe('Email Verification Lambda', () => {
  test('Should process valid SNS event', async () => {
    // Test implementation
  });

  test('Should handle invalid email format', async () => {
    // Test implementation
  });

  test('Should store token in DynamoDB', async () => {
    // Test implementation
  });
});
```

### **Local Testing with Sample Event**
```bash
# Create test event
cat > event.json << EOF
{
  "Records": [{
    "Sns": {
      "Message": "{\"email\":\"test@example.com\",\"first_name\":\"Test\",\"token\":\"test-uuid\"}"
    }
  }]
}
EOF

# Invoke locally (requires AWS SAM CLI)
sam local invoke -e event.json
```

---

## 📊 Monitoring

### **CloudWatch Logs**

**Log Group:** `/aws/lambda/emailVerificationLambda-{env}`

**View Logs:**
```bash
# Tail logs in real-time
aws logs tail /aws/lambda/emailVerificationLambda --follow

# Filter errors
aws logs filter-log-events \
  --log-group-name /aws/lambda/emailVerificationLambda \
  --filter-pattern "ERROR"
```

### **CloudWatch Metrics**

**Key Metrics:**
- **Invocations** - Total function executions
- **Duration** - Execution time (avg, max)
- **Errors** - Failed invocations
- **Throttles** - Rate limit hits
- **Concurrent Executions** - Parallel executions

**View Metrics:**
```bash
aws cloudwatch get-metric-statistics \
  --namespace AWS/Lambda \
  --metric-name Invocations \
  --dimensions Name=FunctionName,Value=emailVerificationLambda \
  --start-time $(date -u -d '1 hour ago' +%Y-%m-%dT%H:%M:%S) \
  --end-time $(date -u +%Y-%m-%dT%H:%M:%S) \
  --period 300 \
  --statistics Sum
```

### **Alarms**

**Recommended CloudWatch Alarms:**
- Error rate > 5%
- Duration > 10 seconds
- Throttles > 0

---

## 🐛 Troubleshooting

### **Common Issues**

**1. Email Not Sending**
```bash
# Check SES sending status
aws ses get-account-sending-enabled

# Verify sender email
aws ses get-identity-verification-attributes \
  --identities noreply@yourdomain.com

# Check Lambda logs
aws logs tail /aws/lambda/emailVerificationLambda --follow
```

**Possible causes:**
- SES sandbox mode (only verified emails)
- Sender email not verified
- IAM permissions missing for SES

---

**2. DynamoDB Access Denied**
```bash
# Check IAM role permissions
aws iam get-role-policy \
  --role-name LambdaExecutionRole \
  --policy-name DynamoDBPolicy

# Test DynamoDB access
aws dynamodb get-item \
  --table-name EmailVerification \
  --key '{"email":{"S":"test@example.com"}}'
```

**Possible causes:**
- Missing IAM permissions
- Table doesn't exist
- Incorrect table name in environment variables

---

**3. Function Timeout**
```bash
# Check function configuration
aws lambda get-function-configuration \
  --function-name emailVerificationLambda

# Update timeout if needed
aws lambda update-function-configuration \
  --function-name emailVerificationLambda \
  --timeout 60
```

**Possible causes:**
- Network latency to SES/DynamoDB
- VPC configuration issues
- Cold start delays

---

**4. SNS Trigger Not Working**
```bash
# Check SNS subscription
aws sns list-subscriptions-by-topic \
  --topic-arn arn:aws:sns:region:account:user-registration

# Test Lambda invocation manually
aws lambda invoke \
  --function-name emailVerificationLambda \
  --payload file://test-event.json \
  response.json
```

**Possible causes:**
- SNS subscription not confirmed
- Lambda permission missing
- Incorrect topic ARN

---

### **Debug Mode**

Enable detailed logging:
```javascript
// Set in Lambda environment variables
LOG_LEVEL=debug
```

View detailed logs:
```bash
aws logs tail /aws/lambda/emailVerificationLambda \
  --follow \
  --format detailed
```

---

## 📈 Performance

### **Execution Metrics**
- **Average Duration:** ~500-800ms
- **Cold Start:** ~1-2 seconds (first invocation)
- **Warm Start:** ~200-500ms
- **Memory Usage:** ~128-256MB

### **Optimization Tips**

1. **Reduce Package Size**
   - Use only required AWS SDK clients
   - Minimize dependencies
   - Remove dev dependencies from deployment

2. **Optimize Cold Starts**
   - Keep function warm with CloudWatch Events
   - Use provisioned concurrency for critical workloads
   - Minimize initialization code

3. **Efficient DynamoDB Usage**
   - Use single-table design
   - Leverage TTL for automatic cleanup
   - Batch operations when possible

---

## 🔒 Security Best Practices

### **IAM Permissions**
- Use least-privilege IAM roles
- Separate roles for dev/prod environments
- Regular permission audits

### **Email Security**
- Verify SES sender email
- Use DKIM/SPF for email authentication
- Monitor bounce/complaint rates

### **Token Security**
- Short-lived tokens (60 seconds)
- UUID v4 for unpredictability
- Automatic cleanup via DynamoDB TTL

### **Network Security**
- Deploy Lambda in VPC for private resource access
- Use security groups for network isolation
- Encrypt data in transit (HTTPS/TLS)

---

**Related Repositories:**
- `webapp-fork` - Node.js/Express REST API
- `tf-aws-infra-fork` - Terraform infrastructure

**AWS Documentation:**
- [AWS Lambda Developer Guide](https://docs.aws.amazon.com/lambda/)
- [Amazon SES Developer Guide](https://docs.aws.amazon.com/ses/)
- [DynamoDB Time-to-Live](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/TTL.html)

---

## 📄 License

MIT License

---

## 🌟 Key Features Summary

✅ **Serverless Architecture** - Zero server management  
✅ **Event-Driven** - Automatic SNS trigger on user registration  
✅ **Secure Tokens** - UUID-based with 1-minute expiration  
✅ **Automated Emails** - Professional HTML templates via SES  
✅ **Persistent Storage** - DynamoDB with automatic TTL cleanup  
✅ **CI/CD Pipeline** - Automated deployment via GitHub Actions  
✅ **Scalable** - Auto-scales to handle demand  
✅ **Monitored** - Comprehensive CloudWatch integration  

**Production-ready serverless email verification system!** 🎉
