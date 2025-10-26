# Deployment Guide

This guide walks you through deploying UW Marketplace to production.

## 📋 Pre-Deployment Checklist

Before deploying, ensure you have:

- [ ] GitHub repository with your code
- [ ] Supabase project created and configured
- [ ] All environment variables ready
- [ ] API keys for Anthropic and Resend
- [ ] Database schema applied
- [ ] Tested locally with `npm run build`

## 🚀 Deploying to Vercel (Recommended)

Vercel is the easiest and recommended platform for deploying Next.js applications.

### Step 1: Push to GitHub

```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

### Step 2: Import to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click "Add New Project"
3. Import your `uw-marketplace` repository
4. Vercel will auto-detect Next.js configuration

### Step 3: Configure Environment Variables

In the Vercel project settings, add all environment variables:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
ANTHROPIC_API_KEY=sk-ant-api03-...
RESEND_API_KEY=re_...
JWT_SECRET=your_super_secret_key_32_chars_minimum
```

⚠️ **Important**: Make sure to paste the exact values from your `.env.local` file.

### Step 4: Deploy

1. Click "Deploy"
2. Wait for the build to complete (2-3 minutes)
3. Visit your live site at `your-project.vercel.app`

### Step 5: Custom Domain (Optional)

1. Go to Project Settings → Domains
2. Add your custom domain
3. Follow DNS configuration instructions
4. Wait for SSL certificate provisioning

## 🗄️ Supabase Setup

### Create New Project

1. Go to [app.supabase.com](https://app.supabase.com)
2. Click "New Project"
3. Choose organization and region (closest to users)
4. Set a strong database password
5. Wait for project initialization (~2 minutes)

### Run Database Schema

1. Go to SQL Editor in Supabase dashboard
2. Click "New Query"
3. Copy contents of `lib/supabase/schema.sql`
4. Paste and click "Run"
5. Verify all tables are created:
   - users
   - listings
   - messages
   - verification_codes
   - price_history

### Get API Keys

1. Go to Project Settings → API
2. Copy:
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon` `public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` `secret` key → `SUPABASE_SERVICE_ROLE_KEY`

⚠️ **Security Warning**: Never commit the service role key. It has full database access!

### Configure Row Level Security (Optional)

RLS policies are included in the schema. To enable:

```sql
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
```

Note: Service role key bypasses RLS, which is used for API routes.

## 🔑 API Keys Setup

### Anthropic Claude AI

1. Visit [console.anthropic.com](https://console.anthropic.com)
2. Sign up or log in
3. Go to API Keys section
4. Click "Create Key"
5. Name it (e.g., "UW Marketplace Production")
6. Copy the key (starts with `sk-ant-api03-`)
7. Add to environment variables

**Pricing**:
- $3 per million input tokens
- $15 per million output tokens
- Free tier: $5 credit

**Rate Limits**:
- Tier 1: 50 requests/minute
- Monitor usage in dashboard

### Resend Email Service

1. Visit [resend.com](https://resend.com)
2. Sign up for free account
3. Go to API Keys
4. Create new key
5. Copy the key (starts with `re_`)
6. Add to environment variables

**For Production Email**:
1. Go to Domains
2. Add your domain
3. Add DNS records (MX, TXT, CNAME)
4. Wait for verification (~10 minutes)
5. Update `RESEND_FROM_EMAIL` environment variable

**Free Tier**:
- 100 emails/day
- 3,000 emails/month
- Good for testing and small deployments

## ✅ Post-Deployment Testing

After deployment, test these critical flows:

### 1. Authentication Flow
- [ ] Sign up with UWaterloo email
- [ ] Receive verification code (check inbox/console)
- [ ] Complete signup with password
- [ ] Log out
- [ ] Log in with credentials
- [ ] Stay logged in after refresh

### 2. Listing Creation
- [ ] Navigate to "Create Listing"
- [ ] Upload image (under 5MB)
- [ ] Click "AI Generate" for description
- [ ] Description appears correctly
- [ ] Select category
- [ ] AI suggests price (optional)
- [ ] Submit listing
- [ ] Redirect to listing detail page

### 3. Chat Functionality
- [ ] View a listing
- [ ] Click "Contact Seller"
- [ ] Send message
- [ ] Message appears in conversation
- [ ] Log in as other user
- [ ] See received message
- [ ] Reply to message
- [ ] Real-time update works

### 4. Browse & Search
- [ ] Browse page loads all listings
- [ ] Category filter works
- [ ] Search functionality works
- [ ] Listings display correctly
- [ ] Click listing goes to detail page

### 5. Profile & User Features
- [ ] Access user profile
- [ ] View "My Listings"
- [ ] Edit profile information
- [ ] Log out successfully

## 🔍 Monitoring & Debugging

### Vercel Logs

View real-time logs in Vercel dashboard:
1. Go to your project
2. Click "Logs" tab
3. Filter by function or search

### Supabase Logs

Monitor database activity:
1. Go to Supabase dashboard
2. Click "Logs" → "Postgres Logs"
3. Check for errors

### Error Tracking

Common production errors and fixes:

**"Network Error" / API Failures**
- Check environment variables are set
- Verify API keys are correct
- Check Supabase project is not paused

**AI Features Not Working**
- Verify Anthropic API key
- Check usage limits/quota
- Review API logs in Anthropic console

**Email Not Sending**
- Check Resend API key
- Verify domain is verified (for custom domain)
- Review Resend dashboard logs

**Authentication Issues**
- Verify JWT_SECRET is set (32+ chars)
- Check cookie settings (httpOnly, sameSite)
- Clear cookies and try again

## 🔄 Updating Deployment

### Method 1: Automatic (Recommended)

Vercel auto-deploys when you push to GitHub:

```bash
git add .
git commit -m "Update features"
git push origin main
```

Vercel will automatically:
1. Detect changes
2. Build new version
3. Deploy to production
4. Keep previous version as rollback

### Method 2: Manual

Using Vercel CLI:

```bash
npm i -g vercel
vercel --prod
```

## 🔐 Security Best Practices

### Environment Variables
- ✅ Never commit `.env.local` to git
- ✅ Use different keys for dev/production
- ✅ Rotate keys periodically (every 90 days)
- ✅ Limit service role key usage

### Database
- ✅ Enable Row Level Security in production
- ✅ Regular backups (Supabase does daily backups)
- ✅ Monitor for unusual activity

### API Keys
- ✅ Set up usage alerts in Anthropic dashboard
- ✅ Use separate keys for staging/production
- ✅ Monitor rate limits

## 📊 Performance Optimization

### Caching
Vercel automatically caches:
- Static pages
- Images
- API responses (with headers)

### Database
- Indexes are included in schema
- Connection pooling handled by Supabase
- Monitor slow queries in Supabase dashboard

### CDN
- Images served via Unsplash CDN (for demo data)
- For production, use Supabase Storage or Cloudinary

## 🆘 Rollback Procedure

If deployment has issues:

### Vercel
1. Go to Deployments
2. Find last working deployment
3. Click ••• → "Promote to Production"
4. Instant rollback (no downtime)

### Database
1. Supabase keeps daily backups
2. Go to Database → Backups
3. Restore to previous state

## 📞 Support

If you encounter issues:

1. Check Vercel/Supabase status pages
2. Review error logs
3. Consult documentation:
   - [Vercel Docs](https://vercel.com/docs)
   - [Supabase Docs](https://supabase.com/docs)
   - [Next.js Docs](https://nextjs.org/docs)
4. Open GitHub issue with:
   - Error message
   - Steps to reproduce
   - Environment (dev/production)

## ✨ Success!

Your UW Marketplace should now be live and accessible to users!

Next steps:
- Share with UWaterloo community
- Monitor usage and performance
- Gather user feedback
- Iterate and improve

---

**Happy Deploying! 🚀**
