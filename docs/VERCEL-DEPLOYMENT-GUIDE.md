# Vercel Deployment Guide - UW Marketplace

This guide will walk you through deploying your UW Marketplace app to Vercel in under 10 minutes.

## ✅ Pre-Deployment Checklist

Before deploying, make sure you have:

- [x] GitHub repository with your code pushed
- [x] Supabase database set up with schema
- [x] Anthropic API key
- [x] Resend API key (optional, for email)
- [x] JWT secret generated

---

## 🚀 Step-by-Step Deployment

### Step 1: Sign Up for Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click **"Sign Up"**
3. Choose **"Continue with GitHub"**
4. Authorize Vercel to access your GitHub account

---

### Step 2: Import Your Project

1. On Vercel dashboard, click **"Add New..."** → **"Project"**
2. Find your repository: **`uw-marketplace`**
3. Click **"Import"**

---

### Step 3: Configure Project Settings

Vercel will detect that it's a Next.js project automatically.

**Framework Preset:** Next.js (auto-detected ✅)
**Root Directory:** ./ (leave as is)
**Build Command:** `next build` (auto-filled)
**Output Directory:** `.next` (auto-filled)

Click **"Configure Project"** to move to environment variables.

---

### Step 4: Add Environment Variables

**IMPORTANT:** Add a `SEED_SECRET` environment variable for database seeding:

```
SEED_SECRET=your-random-secret-here-make-it-long-and-secure
```

Then add all other required environment variables:

This is the most important step! Add all your environment variables:

#### Required Variables

Click **"Environment Variables"** and add these one by one:

```
Variable Name: NEXT_PUBLIC_SUPABASE_URL
Value: https://your-project-id.supabase.co
```

```
Variable Name: NEXT_PUBLIC_SUPABASE_ANON_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

```
Variable Name: SUPABASE_SERVICE_ROLE_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

```
Variable Name: ANTHROPIC_API_KEY
Value: sk-ant-api03-...
```

```
Variable Name: RESEND_API_KEY
Value: re_...
```

```
Variable Name: JWT_SECRET
Value: your_super_secret_jwt_key_min_32_characters_long
```

**Tip:** Copy these from your `.env.local` file!

#### How to Add Each Variable

1. Type the variable name (e.g., `NEXT_PUBLIC_SUPABASE_URL`)
2. Paste the value
3. Select **"Production"**, **"Preview"**, and **"Development"** (all three)
4. Click **"Add"**
5. Repeat for all variables

---

### Step 5: Deploy!

1. After adding all environment variables, click **"Deploy"**
2. Vercel will:
   - Clone your repository
   - Install dependencies
   - Build your project
   - Deploy to production

**Build time:** ~2-4 minutes

You'll see a progress screen with logs. Watch for any errors.

---

### Step 6: Visit Your Site

Once deployment completes:

1. You'll see **"Congratulations!"** with confetti 🎉
2. Click **"Visit"** or the provided URL
3. Your site is live at: `https://uw-marketplace-xxx.vercel.app`

---

## 🔧 Post-Deployment Configuration

### Custom Domain (Optional)

1. In Vercel dashboard, go to your project
2. Click **"Settings"** → **"Domains"**
3. Add your custom domain (e.g., `uwmarketplace.com`)
4. Follow DNS instructions to point domain to Vercel

### Environment Variables Updates

If you need to update environment variables later:

1. Vercel Dashboard → Your Project
2. **"Settings"** → **"Environment Variables"**
3. Edit or add variables
4. **Redeploy** (Settings → Deployments → Latest → "Redeploy")

---

## 🌱 Seeding the Database (Optional but Recommended)

To populate your deployed app with sample data for demo purposes:

### Option 1: API Endpoint (Easiest)

1. After deployment, visit this URL in your browser:
   ```
   https://your-app.vercel.app/api/seed?secret=YOUR_SEED_SECRET
   ```
   (Replace `YOUR_SEED_SECRET` with the value you set in environment variables)

2. You should see a success response with:
   - Number of users created
   - Number of listings created
   - Sample login credentials

3. **Sample Login:**
   - Email: `alice.chen@uwaterloo.ca`
   - Password: `password123`

### Option 2: Local Script (Advanced)

Run the seed script locally against production database:

```bash
npm run seed
```

**⚠️ Warning:** Only seed once to avoid duplicate data!

---

## 🧪 Testing Your Deployment

### Test Checklist

After deployment (and optional seeding), test these features:

- [ ] **Homepage loads** (visit your URL)
- [ ] **Sign up works** (try creating an account)
- [ ] **Email verification** (check if code is sent - may need Resend setup)
- [ ] **Login works** (use your test account)
- [ ] **Browse listings** (navigate to /browse)
- [ ] **Create listing** (upload image, AI description)
- [ ] **AI features work** (description generation, price suggestion)
- [ ] **View listing details** (click on a listing)
- [ ] **Chat works** (try messaging)
- [ ] **Profile page** (check your profile)

---

## 🐛 Troubleshooting

### Build Fails

**Issue:** Build fails with TypeScript errors

**Solution:**
- TypeScript errors won't prevent deployment but are warnings
- Check build logs in Vercel dashboard
- Most type errors are non-critical

---

### Environment Variables Not Working

**Issue:** App doesn't work, shows errors about missing env variables

**Solution:**
1. Go to Settings → Environment Variables
2. Make sure all variables are added
3. Check that variables are enabled for "Production"
4. Redeploy after adding variables

---

### Database Connection Fails

**Issue:** "Failed to fetch listings" or database errors

**Solution:**
1. Check `NEXT_PUBLIC_SUPABASE_URL` is correct
2. Check `NEXT_PUBLIC_SUPABASE_ANON_KEY` is correct
3. Verify `SUPABASE_SERVICE_ROLE_KEY` is correct
4. Make sure Supabase database has your schema

---

### AI Features Don't Work

**Issue:** "Failed to generate description" or AI errors

**Solution:**
1. Check `ANTHROPIC_API_KEY` is correct and valid
2. Make sure you have API credits in Anthropic account
3. Check API key hasn't expired

---

### Email Verification Doesn't Work

**Issue:** Verification emails not sending

**Solution:**
1. Check `RESEND_API_KEY` is correct
2. Verify your email in Resend dashboard
3. For testing domain, make sure recipient emails are verified
4. Check server logs in Vercel for email errors

---

## 📊 Monitoring Your App

### View Logs

1. Vercel Dashboard → Your Project
2. Click **"Logs"** tab
3. See real-time logs from your app
4. Filter by function or time range

### View Analytics

1. Vercel Dashboard → Your Project
2. Click **"Analytics"** tab
3. See visitor stats, page views, performance

### View Deployments

1. Vercel Dashboard → Your Project
2. Click **"Deployments"** tab
3. See all deployments, rollback if needed

---

## 🔄 Continuous Deployment

Good news! **Vercel automatically redeploys** when you push to GitHub.

### How It Works

1. You push code to GitHub (`git push origin main`)
2. Vercel detects the push
3. Automatically builds and deploys
4. Your site updates in ~2-4 minutes

### Disable Auto-Deploy (if needed)

1. Settings → Git
2. Turn off "Auto Deploy"

---

## 💰 Pricing

### Free Tier (Hobby)

- ✅ Perfect for this project!
- Unlimited deployments
- 100 GB bandwidth/month
- Serverless function executions
- Analytics
- **Cost: $0/month**

### Pro Tier (if you need more)

- More bandwidth
- Team features
- Better analytics
- **Cost: $20/month** (not needed for school project)

---

## 🎓 Demo Day Tips

### Before Your Demo

1. **Test your deployed URL** 30 minutes before
2. **Seed database** with demo data (`npm run seed` locally)
3. **Clear browser cache** before presenting
4. **Have backup screenshots** in case of issues
5. **Test all features** once more

### During Demo

1. **Use incognito window** for fresh session
2. **Have your deployed URL bookmarked**
3. **Show the live site**, not localhost
4. **Mention it's deployed on Vercel** (bonus points!)

### Backup Plan

If Vercel is down or slow:
- Use `npm run dev` locally
- Show screenshots
- Reference backup JSON data in `/public/demo-data/`

---

## 🚨 Common Issues

### Issue: "Function Execution Timeout"

**Cause:** AI endpoints taking too long
**Solution:**
- Increase timeout in `vercel.json` (already set to 30s)
- Or use backup demo data

### Issue: "Rate Limit Exceeded"

**Cause:** Too many Anthropic API calls
**Solution:**
- Check your API usage
- Use backup demo data for testing

### Issue: Site is Slow

**Cause:** Cold start of serverless functions
**Solution:**
- First request after inactivity might be slow
- Subsequent requests will be fast
- This is normal for free tier

---

## 📞 Getting Help

### Vercel Resources

- **Docs:** [vercel.com/docs](https://vercel.com/docs)
- **Support:** [vercel.com/support](https://vercel.com/support)
- **Status:** [vercel-status.com](https://vercel-status.com)

### Your Project Docs

- **Main README:** `/README.md`
- **Deployment Guide:** `/docs/DEPLOYMENT.md`
- **Demo Script:** `/docs/DEMO-SCRIPT.md`
- **Testing Guide:** `/docs/TESTING.md`

---

## ✅ Deployment Complete!

Congratulations! Your UW Marketplace is now live on Vercel! 🎉

**Your site:** `https://uw-marketplace-xxx.vercel.app`

### Next Steps

1. ✅ Test all features
2. ✅ Share URL with friends
3. ✅ Prepare demo presentation
4. ✅ Add custom domain (optional)

---

## Quick Reference

### Deploy Command (Alternative to UI)

If you prefer CLI:

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Deploy to production
vercel --prod
```

### Environment Variables Quick Copy

For your reference (update with your actual values):

```env
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
SUPABASE_SERVICE_ROLE_KEY=your_key
ANTHROPIC_API_KEY=your_key
RESEND_API_KEY=your_key
JWT_SECRET=your_secret
```

---

**Happy deploying! 🚀**

If you encounter any issues, check the troubleshooting section above or refer to the Vercel documentation.
