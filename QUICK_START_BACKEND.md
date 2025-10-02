# Quick Start: Backend Configuration

This is a quick reference for setting up Supabase Edge Functions, Database Migrations, PayPal Payments, and other backend features using GitHub Secrets.

## 🎯 Quick Overview

**What you need to do**: Configure GitHub Secrets so backend features work automatically.

**Time required**: ~15-20 minutes

**Prerequisites**:
- ✅ Supabase account and project
- ✅ PayPal Business account
- ✅ Admin access to this GitHub repository

## 🚀 Quick Setup (5 Steps)

### Step 1: Gather Your Credentials (10 minutes)

Open these pages in separate tabs:

1. **Supabase Dashboard**: [supabase.com/dashboard](https://supabase.com/dashboard)
   - Go to: Your Project → Settings → API
   - Copy these values:
     - Project URL (e.g., `https://xxxxx.supabase.co`)
     - Anon public key (starts with `eyJ...`)
     - Service role key (starts with `eyJ...`)
   - Go to: Settings → General
     - Copy: Reference ID (e.g., `aznouacxayahvisuczie`)

2. **Supabase Access Token**: [supabase.com/dashboard/account/tokens](https://supabase.com/dashboard/account/tokens)
   - Click: Generate new token
   - Name it: "GitHub Actions Deployment"
   - Copy the token (starts with `sbp_`)
   - ⚠️ Save immediately - shown only once!

3. **PayPal Developer Dashboard**: [developer.paypal.com](https://developer.paypal.com)
   - Go to: My Apps & Credentials → Live
   - Copy: Client ID
   - Go to: Products → Billing Plans
   - Copy: Monthly Plan ID and Yearly Plan ID
   - (If you don't have plans yet, create them first)

### Step 2: Add Secrets to GitHub (5 minutes)

1. Go to your repository on GitHub
2. Click: **Settings** (repository settings)
3. Navigate: **Secrets and variables** → **Actions**
4. Click: **New repository secret**

Add each secret with these exact names:

| Secret Name | Value from Step 1 |
|------------|-------------------|
| `VITE_SUPABASE_URL` | Supabase Project URL |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Supabase Anon public key |
| `VITE_SUPABASE_PROJECT_ID` | Supabase Reference ID |
| `SUPABASE_ACCESS_TOKEN` | Supabase Access Token |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase Service role key |
| `VITE_PAYPAL_CLIENT_ID` | PayPal Client ID |
| `VITE_PAYPAL_MONTHLY_PLAN_ID` | PayPal Monthly Plan ID |
| `VITE_PAYPAL_YEARLY_PLAN_ID` | PayPal Yearly Plan ID |

### Step 3: Deploy Supabase Components (2 minutes)

1. Go to: **Actions** tab
2. Select: **Deploy Supabase** workflow
3. Click: **Run workflow** → **Run workflow**
4. Wait ~1-2 minutes
5. ✅ Verify: Green checkmark (success)

This deploys:
- Database migrations
- Edge functions (job-scraper, job-cleanup, seed-jobs)

### Step 4: Seed Job Listings (1 minute)

1. Go to: **Actions** tab
2. Select: **Seed Job Listings** workflow
3. Click: **Run workflow**
4. Type: `seed-jobs` in the confirmation field
5. Click: **Run workflow**
6. Wait ~1 minute
7. ✅ Verify: 100 jobs seeded successfully

### Step 5: Deploy Application (2 minutes)

1. Go to: **Actions** tab
2. Select: **Deploy to GitHub Pages** workflow
3. Click: **Run workflow** → **Run workflow**
4. Wait ~2-3 minutes
5. ✅ Verify: Site deploys successfully

## ✅ Verify Everything Works

### Quick Tests

1. **Visit your site**: [jobbyist.africa](https://jobbyist.africa) (or your domain)
2. **Check jobs**: Navigate to /jobs page → Should see job listings
3. **Test PayPal**: Navigate to /pro page → Click subscribe → PayPal modal should appear
4. **Check workflows**: Actions tab → All workflows should have green checkmarks

### What Should Work Now

- ✅ Job listings display on site
- ✅ Search and filters work
- ✅ PayPal subscription checkout works
- ✅ Daily job seeding runs automatically (2 AM UTC)
- ✅ Daily job cleanup runs automatically (3 AM UTC)
- ✅ Supabase edge functions accessible

## 🔧 Troubleshooting

### "Missing environment variable" error
**Fix**: Go back to Step 2, verify all secret names match exactly (case-sensitive)

### Supabase deploy fails
**Fix**: Verify `SUPABASE_ACCESS_TOKEN` is valid at supabase.com/dashboard/account/tokens

### PayPal doesn't work
**Fix**: 
- Use **Live** credentials (not Sandbox) in production
- Verify plan IDs match your actual subscription plans

### No jobs showing
**Fix**: Run the "Seed Job Listings" workflow again (Step 4)

## 📚 Detailed Documentation

Need more details? See:

- **[SECRETS_SETUP_GUIDE.md](SECRETS_SETUP_GUIDE.md)** - Detailed step-by-step instructions
- **[BACKEND_VERIFICATION_CHECKLIST.md](BACKEND_VERIFICATION_CHECKLIST.md)** - Complete verification checklist
- **[BACKEND_CONFIGURATION_SUMMARY.md](BACKEND_CONFIGURATION_SUMMARY.md)** - Technical summary
- **[REQUIRED_SECRETS.md](REQUIRED_SECRETS.md)** - Complete secrets reference

## 🎯 Optional Enhancements

Want AI chatbot, error tracking, or analytics? Add these optional secrets:

| Secret Name | What It Does | Where to Get |
|------------|--------------|--------------|
| `VITE_OPENAI_API_KEY` | AI-powered chatbot | [platform.openai.com/api-keys](https://platform.openai.com/api-keys) |
| `VITE_SENTRY_DSN` | Error tracking | [sentry.io](https://sentry.io) |
| `VITE_GOOGLE_ANALYTICS_ID` | User analytics | [analytics.google.com](https://analytics.google.com) |

After adding, re-run "Deploy to GitHub Pages" workflow.

## 🔒 Security Notes

- ✅ **Never commit** `.env` file to repository
- ✅ **GitHub Secrets are encrypted** - safe to store sensitive data
- ✅ **Service role key** has admin access - never expose in frontend
- ✅ **Rotate tokens** periodically for enhanced security

## 🆘 Need Help?

1. Check [SECRETS_SETUP_GUIDE.md](SECRETS_SETUP_GUIDE.md) for detailed instructions
2. Use [BACKEND_VERIFICATION_CHECKLIST.md](BACKEND_VERIFICATION_CHECKLIST.md) to diagnose
3. Review workflow logs in Actions tab
4. Check Supabase logs in dashboard
5. Create an issue with error details

---

**Quick Start Version**: 1.0  
**Last Updated**: October 2025  
**Status**: Production-Ready ✅
