/**
 * Lambda function to send email verification links
 * Triggered by SNS when new user registers
 */

const { SESClient, SendEmailCommand } = require('@aws-sdk/client-ses');
const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, PutCommand, QueryCommand } = require('@aws-sdk/lib-dynamodb');
const { v4: uuidv4 } = require('uuid');

// Initialize AWS clients
const sesClient = new SESClient({ region: process.env.AWS_REGION || 'us-east-1' });
const dynamoClient = new DynamoDBClient({ region: process.env.AWS_REGION || 'us-east-1' });
const docClient = DynamoDBDocumentClient.from(dynamoClient);

// Environment variables
const DOMAIN = process.env.DOMAIN || 'dev.ritimoradiya.me';
const FROM_EMAIL = process.env.SES_FROM_EMAIL || 'noreply@ritimoradiya.me';
const DYNAMODB_TABLE = process.env.DYNAMODB_TABLE || 'EmailVerificationTracking';

/**
 * Lambda handler function
 */
exports.handler = async (event) => {
  console.log('Event received:', JSON.stringify(event, null, 2));

  try {
    // Parse SNS message
    const snsMessage = JSON.parse(event.Records[0].Sns.Message);
    const { email, firstName, lastName } = snsMessage;

    console.log(`Processing verification email for: ${email}`);

    // Check if email was already sent (prevent duplicates)
    const isDuplicate = await checkDuplicateEmail(email);
    if (isDuplicate) {
      console.log(`Duplicate email detected for ${email}, skipping send`);
      return {
        statusCode: 200,
        body: JSON.stringify({ message: 'Email already sent' })
      };
    }

    // Generate verification token
    const token = uuidv4();
    const verificationLink = `https://${DOMAIN}/v1/user/verify?email=${encodeURIComponent(email)}&token=${token}`;

    // Send email via SES
    await sendVerificationEmail(email, firstName, verificationLink);

    // Track email in DynamoDB
    await trackEmailSent(email, token);

    console.log(`Verification email sent successfully to ${email}`);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Email sent successfully' })
    };

  } catch (error) {
    console.error('Error processing email:', error);
    throw error;
  }
};

/**
 * Check if email was already sent to prevent duplicates
 */
async function checkDuplicateEmail(email) {
  const params = {
    TableName: DYNAMODB_TABLE,
    KeyConditionExpression: 'email = :email',
    ExpressionAttributeValues: {
      ':email': email
    }
  };

  try {
    const result = await docClient.send(new QueryCommand(params));
    return result.Items && result.Items.length > 0;
  } catch (error) {
    console.error('Error checking duplicate:', error);
    return false; // If error, allow sending (fail open)
  }
}

/**
 * Send verification email via SES
 */
async function sendVerificationEmail(email, firstName, verificationLink) {
  const params = {
    Source: FROM_EMAIL,
    Destination: {
      ToAddresses: [email]
    },
    Message: {
      Subject: {
        Data: 'Verify Your Email Address',
        Charset: 'UTF-8'
      },
      Body: {
        Text: {
          Data: `Hello ${firstName},

Thank you for creating an account. Please verify your email address by clicking the link below:

${verificationLink}

This link will expire in 1 minute.

If you did not create an account, please ignore this email.

Best regards,
CSYE6225 Team`,
          Charset: 'UTF-8'
        },
        Html: {
          Data: `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .button { 
      display: inline-block; 
      padding: 12px 24px; 
      background-color: #007bff; 
      color: white; 
      text-decoration: none; 
      border-radius: 4px; 
      margin: 20px 0;
    }
    .footer { margin-top: 30px; font-size: 12px; color: #666; }
  </style>
</head>
<body>
  <div class="container">
    <h2>Verify Your Email Address</h2>
    <p>Hello ${firstName},</p>
    <p>Thank you for creating an account. Please verify your email address by clicking the button below:</p>
    <a href="${verificationLink}" class="button">Verify Email</a>
    <p>Or copy and paste this link into your browser:</p>
    <p style="word-break: break-all; color: #007bff;">${verificationLink}</p>
    <p><strong>This link will expire in 1 minute.</strong></p>
    <p>If you did not create an account, please ignore this email.</p>
    <div class="footer">
      <p>Best regards,<br>CSYE6225 Team</p>
    </div>
  </div>
</body>
</html>`,
          Charset: 'UTF-8'
        }
      }
    }
  };

  const command = new SendEmailCommand(params);
  await sesClient.send(command);
}

/**
 * Track email sent in DynamoDB to prevent duplicates
 */
async function trackEmailSent(email, token) {
  const params = {
    TableName: DYNAMODB_TABLE,
    Item: {
      email: email,
      token: token,
      sentAt: new Date().toISOString(),
      ttl: Math.floor(Date.now() / 1000) + (60 * 60 * 24) // 24 hours TTL
    }
  };

  await docClient.send(new PutCommand(params));
}