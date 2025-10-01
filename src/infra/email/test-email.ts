/**
 * Email Service Test
 * 
 * This is a simple test file to verify your email configuration.
 * Run this file directly with: ts-node src/infra/email/test-email.ts
 * 
 * Make sure you have configured your .env file with SMTP settings before running.
 */

import { EmailService } from './email.service';

async function testEmail() {
  console.log('🧪 Testing Email Service...\n');

  const emailService = new EmailService();
  const testEmail = process.env.TEST_EMAIL || process.env.SMTP_USER;

  if (!testEmail) {
    console.error('❌ Error: No test email address found.');
    console.log('   Set TEST_EMAIL or SMTP_USER in your .env file');
    process.exit(1);
  }

  try {
    console.log(`📧 Sending test email to: ${testEmail}`);
    
    // Test 1: Simple email
    console.log('\n1️⃣ Testing simple email...');
    await emailService.sendEmail({
      to: testEmail,
      subject: 'Test Email - Avalia Irriga',
      text: 'This is a test email from Avalia Irriga backend.',
      html: '<h1>Test Email</h1><p>This is a test email from Avalia Irriga backend.</p>',
    });
    console.log('✅ Simple email sent successfully!');

    // Test 2: Verification email
    console.log('\n2️⃣ Testing verification email...');
    const verificationUrl = 'http://localhost:3000/verify?token=test-token-123';
    await emailService.sendVerificationEmail(testEmail, verificationUrl, 'test-token-123');
    console.log('✅ Verification email sent successfully!');

    // Test 3: Password reset email
    console.log('\n3️⃣ Testing password reset email...');
    const resetUrl = 'http://localhost:3000/reset-password?token=reset-token-456';
    await emailService.sendResetPasswordEmail(testEmail, resetUrl, 'reset-token-456');
    console.log('✅ Password reset email sent successfully!');

    console.log('\n✨ All tests passed! Check your inbox.');
    console.log('\n📝 Note: Check your spam folder if you don\'t see the emails.');

  } catch (error) {
    console.error('\n❌ Email test failed:');
    console.error(error);
    console.log('\n💡 Common issues:');
    console.log('   - Gmail: Use App Password (not regular password)');
    console.log('   - Check SMTP_HOST and SMTP_PORT are correct');
    console.log('   - Verify SMTP_USER and SMTP_PASS are set in .env');
    console.log('   - Check your firewall/network settings');
    process.exit(1);
  }
}

// Run the test
testEmail();
