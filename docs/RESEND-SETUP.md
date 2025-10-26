# Resend Email Setup Guide

This guide will help you set up email verification for UW Marketplace using Resend.

## Why Resend?

- **Free tier**: 100 emails/day, 3,000 emails/month
- **Easy setup**: No credit card required
- **Testing domain**: Send emails immediately without buying a domain
- **Great for demos**: Professional-looking emails

---

## Quick Setup (5 Minutes)

### Step 1: Create Resend Account

1. Go to [resend.com/signup](https://resend.com/signup)
2. Sign up with your email
3. Verify your email address

### Step 2: Get API Key

1. In the Resend dashboard, click **"API Keys"** in the left sidebar
2. Click **"Create API Key"**
3. Give it a name (e.g., "UW Marketplace Dev")
4. Copy the API key (starts with `re_`)

### Step 3: Add API Key to Your App

1. Open your `.env.local` file
2. Add the API key:
   ```env
   RESEND_API_KEY=re_your_actual_key_here
   ```
3. Save the file
4. **Restart your dev server** (Ctrl+C, then `npm run dev`)

### Step 4: Verify Your Email (Important!)

Since you're using Resend's **testing domain**, you can only send emails to verified addresses.

1. In Resend dashboard, click **"Domains"**
2. You'll see the default domain called **"Onboarding"** or **"onboarding@resend.dev"**
3. Click on it
4. Scroll down to **"Email Addresses"**
5. Click **"Add Email Address"**
6. Enter your **@uwaterloo.ca** email
7. Click **"Send Verification"**
8. **Check your email** and click the verification link
9. Once verified, you'll see a green checkmark ✅

### Step 5: Test It!

1. Go to your app's signup page
2. Enter your verified **@uwaterloo.ca** email
3. Click "Send Verification Code"
4. **Check your email inbox** - you should receive a verification code!
5. Enter the code and complete signup

---

## Troubleshooting

### "Failed to send verification email"

**Check:**
1. ✅ API key is correct in `.env.local`
2. ✅ Dev server was restarted after adding API key
3. ✅ Your email is verified in Resend dashboard
4. ✅ Check terminal/console for error messages

**Console logs to look for:**
```
[SEND-CODE] Attempting to send verification email to: user@uwaterloo.ca
[SEND-CODE] Email sent successfully!
```

If you see an error instead, it will tell you what went wrong.

### Email Not Arriving

**Possible causes:**
1. **Email not verified**: Make sure you verified your email in Resend dashboard
2. **Spam folder**: Check your spam/junk folder
3. **Wrong email**: Make sure you entered the same email you verified
4. **API limit**: Free tier is 100 emails/day - check your Resend dashboard

### Fallback Mode

If email sending fails, the app will **still work** in development mode:
- The verification code will be logged to your terminal
- Look for the code in your console:
  ```
  📧 VERIFICATION CODE FOR: user@uwaterloo.ca
  🔑 CODE: 123456
  ```
- You can still complete signup using this code

---

## Testing Domain vs. Custom Domain

### Testing Domain (Current Setup)
- **From**: `onboarding@resend.dev`
- **To**: Only verified email addresses
- **Cost**: FREE
- **Best for**: Development, testing, demos
- **Limitation**: Must verify each recipient email

### Custom Domain (Optional)
- **From**: `noreply@yourdomain.com`
- **To**: Anyone
- **Cost**: Domain name (~$1-10/year)
- **Best for**: Production, public deployment
- **Setup**: See "Custom Domain Setup" below

---

## Custom Domain Setup (Optional)

If you want to send emails from your own domain (e.g., `uwmarketplace.com`):

### 1. Buy a Domain

**Cheap options:**
- [Namecheap](https://www.namecheap.com) - `.xyz` for ~$1/year
- [Porkbun](https://porkbun.com) - Good prices
- [Google Domains](https://domains.google.com) - ~$10/year

### 2. Add Domain to Resend

1. In Resend dashboard, go to **"Domains"**
2. Click **"Add Domain"**
3. Enter your domain (e.g., `uwmarketplace.com`)
4. Click **"Add"**

### 3. Configure DNS Records

Resend will show you DNS records to add. Copy these to your domain registrar:

**Example records:**
```
Type: TXT
Name: _resend
Value: resend-verification=abc123...

Type: MX
Name: @
Value: mx.resend.com
Priority: 10

Type: TXT
Name: @
Value: v=spf1 include:resend.com ~all

Type: TXT
Name: resend._domainkey
Value: p=MIGfMA0GCS...
```

### 4. Verify Domain

1. After adding DNS records, click **"Verify"** in Resend
2. Wait a few minutes for DNS propagation
3. Once verified, you'll see a green checkmark ✅

### 5. Update Your App

In `.env.local`, add:
```env
RESEND_FROM_EMAIL=UW Marketplace <noreply@uwmarketplace.com>
```

Restart your dev server, and emails will now come from your domain!

---

## Email Template

The verification email looks like this:

**Subject**: UW Marketplace - Your Verification Code

**Body**:
```
Your Verification Code

Welcome to UW Marketplace! Please use the code below to verify your email address.

[123456]

This code will expire in 10 minutes.

If you didn't request this code, please ignore this email.

Happy selling!
The UW Marketplace Team
```

You can customize this in `/lib/email-templates.ts`

---

## Monitoring Email Sending

### View Sent Emails

1. Go to Resend dashboard
2. Click **"Emails"** in sidebar
3. See all sent emails with:
   - Status (delivered, bounced, etc.)
   - Recipient
   - Timestamp
   - Error messages (if any)

### Check Usage

1. Dashboard → **"Usage"**
2. See how many emails you've sent
3. Free tier: 100/day, 3,000/month

---

## Common Questions

### Q: Do I need a domain?
**A:** No! Use Resend's testing domain for development and demos.

### Q: How many emails can I send?
**A:** Free tier: 100/day, 3,000/month. More than enough for testing.

### Q: Can I send to any email?
**A:** With testing domain: Only verified emails. With custom domain: Anyone.

### Q: What if email fails during a demo?
**A:** The code will be logged to console as a fallback. You can still show the flow.

### Q: Is Resend free forever?
**A:** Yes! Free tier includes 3,000 emails/month permanently.

### Q: Can multiple people test my app?
**A:** Yes! Just verify each tester's email in Resend dashboard first.

---

## Production Checklist

Before deploying to production:

- [ ] Buy a domain name
- [ ] Add domain to Resend and verify DNS
- [ ] Set `RESEND_FROM_EMAIL` in production environment variables
- [ ] Test sending to non-verified email addresses
- [ ] Monitor email delivery in Resend dashboard
- [ ] Set up email error alerts (optional)

---

## Getting Help

### Resend Resources
- **Docs**: [resend.com/docs](https://resend.com/docs)
- **Support**: [resend.com/support](https://resend.com/support)
- **Status**: [status.resend.com](https://status.resend.com)

### App Resources
- Check terminal console logs for `[SEND-CODE]` messages
- Check browser console for any client-side errors
- Review `/app/api/auth/send-code/route.ts` for server-side code

---

## Summary

**For Development/Demo** (Recommended):
1. Sign up for Resend (free)
2. Get API key
3. Add to `.env.local`
4. Verify your email in dashboard
5. Test with your verified email

**For Production** (Optional):
1. Buy domain (~$1-10)
2. Add to Resend
3. Configure DNS
4. Set `RESEND_FROM_EMAIL`
5. Deploy!

---

**You're all set!** 🎉

Start by signing up at [resend.com/signup](https://resend.com/signup) and following Step 1-5 above.
