# Email Configuration Guide

This guide explains how to configure email sending for authentication features in the Avalia Irriga backend.

## Overview

The application uses **Nodemailer** to send emails for:
- Email verification (when users sign up)
- Password reset requests
- Organization invitations (if needed)

## Setup Instructions

### 1. Install Dependencies

The required packages are already installed:
```bash
npm install nodemailer @types/nodemailer
```

### 2. Configure Environment Variables

Add the following variables to your `.env` file:

```env
# SMTP Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM_NAME=Avalia Irriga
```

### 3. Email Provider Setup

#### Option A: Gmail (Recommended for Development)

1. Go to your Google Account settings
2. Enable 2-Factor Authentication (2FA)
3. Generate an App Password:
   - Visit: https://myaccount.google.com/apppasswords
   - Select "Mail" and your device
   - Copy the generated 16-character password
4. Use this App Password as `SMTP_PASS` in your `.env` file

**Example Configuration:**
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=abcd efgh ijkl mnop  # 16-character App Password
SMTP_FROM_NAME=Avalia Irriga
```

#### Option B: SendGrid

1. Sign up at https://sendgrid.com/
2. Create an API key
3. Configure:
```env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=apikey
SMTP_PASS=your_sendgrid_api_key
SMTP_FROM_NAME=Avalia Irriga
```

#### Option C: Mailgun

1. Sign up at https://www.mailgun.com/
2. Get your SMTP credentials from the dashboard
3. Configure:
```env
SMTP_HOST=smtp.mailgun.org
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your_mailgun_smtp_username
SMTP_PASS=your_mailgun_smtp_password
SMTP_FROM_NAME=Avalia Irriga
```

#### Option D: AWS SES

1. Set up AWS SES and verify your domain/email
2. Create SMTP credentials in the SES console
3. Configure:
```env
SMTP_HOST=email-smtp.us-east-1.amazonaws.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your_aws_access_key_id
SMTP_PASS=your_aws_secret_access_key
SMTP_FROM_NAME=Avalia Irriga
```

## Email Service Features

### Email Verification

When a user signs up, they automatically receive a verification email with:
- Styled HTML template
- Clickable verification button
- Verification link (in case the button doesn't work)
- 1-hour expiration notice

**Configuration in `auth.ts`:**
```typescript
emailVerification: {
  sendOnSignUp: true,
  autoSignInAfterVerification: true,
  sendVerificationEmail: async ({ user, url, token }, request) => {
    await emailService.sendVerificationEmail(user.email, url, token);
  },
}
```

### Password Reset

Users can request a password reset and receive an email with:
- Styled HTML template
- Reset password button
- Reset link
- 1-hour expiration notice

**Configuration in `auth.ts`:**
```typescript
emailAndPassword: {
  enabled: true,
  sendResetPassword: async ({ user, url, token }, request) => {
    await emailService.sendResetPasswordEmail(user.email, url, token);
  },
}
```

## Testing

### 1. Test Email Configuration

Create a simple test endpoint or use the existing authentication flow:

```typescript
// Test endpoint (optional)
@Get('test-email')
async testEmail() {
  const emailService = new EmailService();
  await emailService.sendEmail({
    to: 'test@example.com',
    subject: 'Test Email',
    text: 'This is a test email',
  });
  return { message: 'Email sent successfully' };
}
```

### 2. Test Sign Up Flow

1. Start your server: `npm run start:dev`
2. Sign up with a new email address
3. Check your inbox for the verification email
4. Click the verification link

### 3. Test Password Reset

1. Use the password reset endpoint
2. Check your inbox for the reset email
3. Click the reset link

## Troubleshooting

### Common Issues

1. **"Invalid login" or Authentication error**
   - For Gmail: Make sure you're using an App Password, not your regular password
   - Ensure 2FA is enabled on your Gmail account

2. **Connection timeout**
   - Check your firewall settings
   - Verify the SMTP host and port are correct
   - Try port 465 with `SMTP_SECURE=true` if port 587 fails

3. **Emails going to spam**
   - For production, use a verified domain
   - Set up SPF, DKIM, and DMARC records
   - Use a reputable email service (SendGrid, AWS SES, etc.)

4. **Rate limiting**
   - Gmail has daily sending limits (500 emails/day for free accounts)
   - Consider using a dedicated email service for production

## Production Recommendations

1. **Use a dedicated email service** (SendGrid, AWS SES, Mailgun)
2. **Set up a custom domain** for your emails
3. **Configure SPF, DKIM, and DMARC** records
4. **Monitor email delivery rates** and bounce rates
5. **Implement email queuing** for high-volume sending
6. **Set up email templates** in your email service provider
7. **Add unsubscribe links** for marketing emails (if applicable)

## Security Best Practices

1. **Never commit** `.env` file to version control
2. **Use App Passwords** for Gmail (not regular passwords)
3. **Rotate credentials** regularly
4. **Use environment variables** for all sensitive data
5. **Enable TLS/SSL** for SMTP connections
6. **Monitor for suspicious activity** in your email service

## File Structure

```
src/
├── infra/
│   └── email/
│       └── email.service.ts      # Email service with Nodemailer
└── lib/
    └── auth.ts                     # Better Auth configuration with email hooks
```

## Additional Resources

- [Nodemailer Documentation](https://nodemailer.com/)
- [Better Auth Email Docs](https://www.better-auth.com/docs/concepts/email)
- [Gmail App Passwords](https://support.google.com/accounts/answer/185833)
- [SendGrid Documentation](https://docs.sendgrid.com/)
- [AWS SES Documentation](https://docs.aws.amazon.com/ses/)

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review the Better Auth documentation
3. Check Nodemailer documentation
4. Open an issue in the repository
