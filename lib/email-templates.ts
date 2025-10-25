/**
 * Email Templates
 *
 * This file contains HTML email templates for various email communications.
 */

/**
 * Verification code email template
 * @param code - 6-digit verification code
 * @returns HTML email template
 */
export function sendVerificationCodeEmail(code: string): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Verification Code</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      background-color: #f4f4f4;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: 40px auto;
      background: white;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }
    .header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 40px 20px;
      text-align: center;
      color: white;
    }
    .header h1 {
      margin: 0;
      font-size: 28px;
      font-weight: 600;
    }
    .content {
      padding: 40px 30px;
    }
    .code-container {
      background: #f8f9fa;
      border: 2px dashed #667eea;
      border-radius: 8px;
      padding: 30px;
      text-align: center;
      margin: 30px 0;
    }
    .code {
      font-size: 48px;
      font-weight: bold;
      letter-spacing: 8px;
      color: #667eea;
      font-family: 'Courier New', monospace;
    }
    .message {
      font-size: 16px;
      line-height: 1.8;
      color: #555;
      margin: 20px 0;
    }
    .warning {
      background: #fff3cd;
      border-left: 4px solid #ffc107;
      padding: 15px;
      margin: 20px 0;
      font-size: 14px;
      color: #856404;
    }
    .footer {
      background: #f8f9fa;
      padding: 20px 30px;
      text-align: center;
      font-size: 14px;
      color: #666;
      border-top: 1px solid #e9ecef;
    }
    .footer a {
      color: #667eea;
      text-decoration: none;
    }
    .button {
      display: inline-block;
      padding: 12px 30px;
      background: #667eea;
      color: white;
      text-decoration: none;
      border-radius: 6px;
      margin: 20px 0;
      font-weight: 600;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🎓 UW Marketplace</h1>
    </div>

    <div class="content">
      <h2 style="color: #333; margin-top: 0;">Verify Your Email</h2>

      <p class="message">
        Thank you for joining UW Marketplace! To complete your registration,
        please use the verification code below:
      </p>

      <div class="code-container">
        <div class="code">${code}</div>
        <p style="margin: 10px 0 0 0; color: #666; font-size: 14px;">
          Enter this code to verify your account
        </p>
      </div>

      <p class="message">
        This code will expire in <strong>10 minutes</strong> for security reasons.
      </p>

      <div class="warning">
        <strong>⚠️ Security Notice:</strong> Never share this code with anyone.
        UW Marketplace will never ask for your verification code via email or phone.
      </div>

      <p class="message">
        If you didn't request this code, you can safely ignore this email.
        Someone may have accidentally entered your email address.
      </p>
    </div>

    <div class="footer">
      <p>
        <strong>UW Marketplace</strong><br>
        University of Waterloo Student Marketplace<br>
        <a href="mailto:support@uwmarketplace.com">support@uwmarketplace.com</a>
      </p>
      <p style="margin-top: 20px; font-size: 12px; color: #999;">
        This is an automated message. Please do not reply to this email.
      </p>
    </div>
  </div>
</body>
</html>
  `.trim()
}

/**
 * Welcome email template (sent after successful verification)
 * @param userName - User's name
 * @returns HTML email template
 */
export function sendWelcomeEmail(userName: string): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to UW Marketplace</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      background-color: #f4f4f4;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: 40px auto;
      background: white;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }
    .header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 40px 20px;
      text-align: center;
      color: white;
    }
    .content {
      padding: 40px 30px;
    }
    .footer {
      background: #f8f9fa;
      padding: 20px 30px;
      text-align: center;
      font-size: 14px;
      color: #666;
      border-top: 1px solid #e9ecef;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🎉 Welcome to UW Marketplace!</h1>
    </div>

    <div class="content">
      <h2>Hi ${userName || 'there'}!</h2>

      <p>
        Your account has been successfully verified. You're now part of the
        UW Marketplace community!
      </p>

      <p>
        Here's what you can do:
      </p>

      <ul>
        <li>📱 Browse and search for items</li>
        <li>💰 List items for sale</li>
        <li>💬 Message other students</li>
        <li>🎯 Get AI-powered price recommendations</li>
      </ul>

      <p>
        Happy trading!
      </p>
    </div>

    <div class="footer">
      <p>
        <strong>UW Marketplace</strong><br>
        University of Waterloo Student Marketplace
      </p>
    </div>
  </div>
</body>
</html>
  `.trim()
}

/**
 * Password reset email template (if implementing password auth later)
 * @param resetLink - Password reset link
 * @returns HTML email template
 */
export function sendPasswordResetEmail(resetLink: string): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reset Your Password</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      background-color: #f4f4f4;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: 40px auto;
      background: white;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }
    .header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 40px 20px;
      text-align: center;
      color: white;
    }
    .content {
      padding: 40px 30px;
    }
    .button {
      display: inline-block;
      padding: 12px 30px;
      background: #667eea;
      color: white;
      text-decoration: none;
      border-radius: 6px;
      margin: 20px 0;
      font-weight: 600;
    }
    .footer {
      background: #f8f9fa;
      padding: 20px 30px;
      text-align: center;
      font-size: 14px;
      color: #666;
      border-top: 1px solid #e9ecef;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🔒 Reset Your Password</h1>
    </div>

    <div class="content">
      <p>
        We received a request to reset your password. Click the button below
        to create a new password:
      </p>

      <div style="text-align: center;">
        <a href="${resetLink}" class="button">Reset Password</a>
      </div>

      <p>
        This link will expire in 1 hour for security reasons.
      </p>

      <p>
        If you didn't request a password reset, you can safely ignore this email.
      </p>
    </div>

    <div class="footer">
      <p>
        <strong>UW Marketplace</strong><br>
        University of Waterloo Student Marketplace
      </p>
    </div>
  </div>
</body>
</html>
  `.trim()
}
