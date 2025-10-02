# Secrets Setup Guide for Jobbyist Beta

This guide walks you through setting up all required GitHub Secrets for the Jobbyist platform to function with Supabase Edge Functions, database migrations, PayPal payments, and other backend features.

## 🔒 Security First

**⚠️ CRITICAL**: Never commit secrets to the repository. All sensitive credentials MUST be stored ONLY in GitHub Secrets.

## Prerequisites

Before you begin, ensure you have:
1. A Supabase project created at [supabase.com](https://supabase.com)
2. A PayPal Business account with Developer access at [developer.paypal.com](https://developer.paypal.com)
3. Admin access to this GitHub repository

## Quick Start Checklist

### Core Required Secrets (Must Configure)

- [ ] `VITE_SUPABASE_URL`
- [ ] `VITE_SUPABASE_PUBLISHABLE_KEY`
- [ ] `VITE_SUPABASE_PROJECT_ID`
- [ ] `SUPABASE_ACCESS_TOKEN`
- [ ] `SUPABASE_SERVICE_ROLE_KEY`
- [ ] `VITE_PAYPAL_CLIENT_ID`
- [ ] `VITE_PAYPAL_MONTHLY_PLAN_ID`
- [ ] `VITE_PAYPAL_YEARLY_PLAN_ID`

### Optional Enhancement Secrets

- [ ] `VITE_OPENAI_API_KEY` (AI Chatbot)
- [ ] `VITE_SENTRY_DSN` (Error Tracking)
- [ ] `VITE_GOOGLE_ANALYTICS_ID` (Analytics)
- [ ] `SNYK_TOKEN` (Security Scanning)

## Step-by-Step Setup

### Part 1: Configure Supabase Secrets

#### 1.1 Get Your Supabase Project URL

1. Go to [supabase.com/dashboard](https://supabase.com/dashboard)
2. Select your project
3. Navigate to **Settings** → **API**
4. Copy the **Project URL** (format: `https://xxxxx.supabase.co`)

**Add to GitHub Secrets as**: `VITE_SUPABASE_URL`

#### 1.2 Get Your Supabase Publishable Key

1. Still in **Settings** → **API**
2. Find the **anon public** key under "Project API keys"
3. Copy the key (starts with `eyJ...`)

**Add to GitHub Secrets as**: `VITE_SUPABASE_PUBLISHABLE_KEY`

#### 1.3 Get Your Supabase Project ID

1. Navigate to **Settings** → **General**
2. Copy the **Reference ID** (alphanumeric, e.g., `abcdefghijklmnop`)

**Add to GitHub Secrets as**: `VITE_SUPABASE_PROJECT_ID`

#### 1.4 Get Your Supabase Service Role Key

1. Back to **Settings** → **API**
2. Find the **service_role** key under "Project API keys"
3. Copy the key (starts with `eyJ...`)

⚠️ **WARNING**: This key has full admin access. Never expose it in client-side code.

**Add to GitHub Secrets as**: `SUPABASE_SERVICE_ROLE_KEY`

#### 1.5 Generate Supabase Access Token

1. Go to [supabase.com/dashboard/account/tokens](https://supabase.com/dashboard/account/tokens)
2. Click **Generate new token**
3. Give it a name (e.g., "GitHub Actions Deployment")
4. Copy the token (starts with `sbp_`)
5. ⚠️ Save it immediately - it won't be shown again!

**Add to GitHub Secrets as**: `SUPABASE_ACCESS_TOKEN`

### Part 2: Configure PayPal Secrets

#### 2.1 Create PayPal App (if not done)

1. Go to [developer.paypal.com](https://developer.paypal.com)
2. Navigate to **My Apps & Credentials**
3. Switch to **Live** environment (not Sandbox)
4. Click **Create App**
5. Enter app name (e.g., "Jobbyist Pro Subscriptions")
6. Click **Create App**

#### 2.2 Get PayPal Client ID

1. In your app's dashboard
2. Copy the **Client ID** (long alphanumeric string)

**Add to GitHub Secrets as**: `VITE_PAYPAL_CLIENT_ID`

#### 2.3 Create Subscription Plans

You need to create two billing plans in PayPal:

**Monthly Plan ($4.99/month)**:
1. Go to **Products** → **Billing Plans and Subscriptions**
2. Click **Create Plan**
3. Set up:
   - Name: "Jobbyist Pro Monthly"
   - Billing cycle: $4.99 every 1 month
4. Save and copy the **Plan ID**

**Add to GitHub Secrets as**: `VITE_PAYPAL_MONTHLY_PLAN_ID`

**Yearly Plan ($49.99/year)**:
1. Create another plan
2. Set up:
   - Name: "Jobbyist Pro Yearly"
   - Billing cycle: $49.99 every 1 year
3. Save and copy the **Plan ID**

**Add to GitHub Secrets as**: `VITE_PAYPAL_YEARLY_PLAN_ID`

### Part 3: Optional Enhancements

#### 3.1 OpenAI API Key (AI Chatbot)

1. Go to [platform.openai.com/api-keys](https://platform.openai.com/api-keys)
2. Sign in or create account
3. Click **Create new secret key**
4. Name it (e.g., "Jobbyist Chatbot")
5. Copy the key (starts with `sk-`)

**Add to GitHub Secrets as**: `VITE_OPENAI_API_KEY`

**Note**: Without this, the AI chatbot will show "not configured" but won't break the app.

#### 3.2 Sentry DSN (Error Tracking)

1. Go to [sentry.io](https://sentry.io)
2. Create project or select existing one
3. Navigate to **Settings** → **Projects** → Your Project → **Client Keys (DSN)**
4. Copy the DSN URL

**Add to GitHub Secrets as**: `VITE_SENTRY_DSN`

#### 3.3 Google Analytics ID

1. Go to [analytics.google.com](https://analytics.google.com)
2. Navigate to **Admin** → **Data Streams**
3. Select or create a web stream
4. Copy the **Measurement ID** (format: `G-XXXXXXXXXX`)

**Add to GitHub Secrets as**: `VITE_GOOGLE_ANALYTICS_ID`

#### 3.4 Snyk Token (Security Scanning)

1. Go to [snyk.io](https://snyk.io)
2. Navigate to **Account Settings** → **API Token**
3. Click **Generate** or copy existing token

**Add to GitHub Secrets as**: `SNYK_TOKEN`

### Part 4: Add Secrets to GitHub

Now that you have all the values, add them to GitHub:

1. Go to your repository on GitHub
2. Click **Settings** (repository settings, not user settings)
3. In the left sidebar, navigate to **Secrets and variables** → **Actions**
4. Click **New repository secret**
5. For each secret:
   - Enter the **Name** (exactly as specified, case-sensitive)
   - Paste the **Value**
   - Click **Add secret**
6. Repeat for all required secrets

### Part 5: Verify Setup

#### Check Secrets are Added

In your repository:
1. Go to **Settings** → **Secrets and variables** → **Actions**
2. Verify all required secrets are listed (you can't see values, only names)

#### Test Deployment

1. Go to **Actions** tab
2. Select **Deploy to GitHub Pages** workflow
3. Click **Run workflow** → **Run workflow**
4. Monitor the build - it should complete without "missing environment variable" errors

#### Test Supabase Deployment

1. Go to **Actions** tab
2. Select **Deploy Supabase** workflow
3. Click **Run workflow** → **Run workflow**
4. Check that migrations and functions deploy successfully

#### Test Job Seeding

1. Go to **Actions** tab
2. Select **Seed Job Listings** workflow
3. Click **Run workflow**
4. Type `seed-jobs` in the confirmation field
5. Click **Run workflow**
6. Verify 100 jobs are seeded to your Supabase database

## Troubleshooting

### "Missing environment variable" during build

**Problem**: A required secret is not configured
**Solution**: Double-check the secret name matches exactly (case-sensitive) and the value is correct

### Supabase functions fail to deploy

**Problem**: `SUPABASE_ACCESS_TOKEN` is invalid or expired
**Solution**: Generate a new token at supabase.com/dashboard/account/tokens

### PayPal payments don't work

**Problem**: Using sandbox credentials in production or plan IDs are incorrect
**Solution**: 
- Ensure you're using **Live** credentials (not Sandbox)
- Verify plan IDs match your actual billing plans
- Test in PayPal sandbox first, then switch to live

### Edge functions can't access database

**Problem**: `SUPABASE_SERVICE_ROLE_KEY` is incorrect
**Solution**: 
- Copy the service_role key from Supabase Dashboard → Settings → API
- Ensure you copied the full JWT token

### Database connection fails

**Problem**: Application can't connect to database
**Solution**: 
- Verify `VITE_SUPABASE_URL` is the HTTP URL (not the connection string)
- Check that `VITE_SUPABASE_PUBLISHABLE_KEY` is the anon key (not service role)

## Security Reminders

✅ **DO**:
- Store all secrets in GitHub Secrets only
- Rotate tokens regularly
- Use least-privilege access
- Monitor usage in respective dashboards

❌ **DON'T**:
- Commit secrets to the repository
- Share secrets via email or chat
- Use production secrets in development
- Expose service role keys in client code

## What Gets Configured

Once secrets are set up, the following features will work:

### ✅ Supabase Edge Functions
- **job-scraper**: Imports jobs from partner sites
- **job-cleanup**: Removes old job listings (runs daily)
- **seed-jobs**: Seeds database with sample jobs

### ✅ Database Migrations
- Automatic deployment of schema changes
- Row Level Security policies
- Database functions and triggers

### ✅ PayPal Payments
- Pro subscription monthly billing ($4.99/month)
- Pro subscription yearly billing ($49.99/year)
- Automatic subscription management

### ✅ Optional Features
- AI-powered career chatbot (with OpenAI)
- Error tracking and monitoring (with Sentry)
- User analytics (with Google Analytics)
- Security vulnerability scanning (with Snyk)

## Next Steps

After completing this setup:

1. ✅ Verify all workflows run successfully
2. ✅ Test Pro subscription signup on your live site
3. ✅ Monitor Supabase logs for edge function execution
4. ✅ Check PayPal dashboard for subscription events
5. ✅ Set up monitoring alerts for errors (if using Sentry)

## Additional Resources

- **Supabase Documentation**: [supabase.com/docs](https://supabase.com/docs)
- **PayPal Developer Guide**: [developer.paypal.com/docs](https://developer.paypal.com/docs)
- **GitHub Actions Secrets**: [docs.github.com/actions/security-guides/encrypted-secrets](https://docs.github.com/actions/security-guides/encrypted-secrets)
- **Repository Documentation**:
  - `REQUIRED_SECRETS.md` - Comprehensive secrets reference
  - `GITHUB_SECRETS.md` - Secrets template and guidelines
  - `WORKFLOWS.md` - Workflow documentation
  - `PRODUCTION_GUIDE.md` - Production deployment guide

## Support

If you encounter issues:
1. Check the troubleshooting section above
2. Review workflow logs in the Actions tab
3. Check Supabase logs in the dashboard
4. Verify all secrets are correctly configured
5. Create an issue in the repository with error details

---

**Last Updated**: October 2025  
**Version**: 1.0  
**Maintained by**: Jobbyist Development Team
