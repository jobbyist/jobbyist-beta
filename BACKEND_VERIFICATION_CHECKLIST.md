# Backend Configuration Verification Checklist

Use this checklist to verify that all backend features are properly configured with GitHub Secrets.

## ✅ Pre-Deployment Verification

### Step 1: Verify GitHub Secrets Are Configured

Go to your repository **Settings** → **Secrets and variables** → **Actions** and verify the following secrets exist:

#### Required Secrets (Must Have)
- [ ] `VITE_SUPABASE_URL`
- [ ] `VITE_SUPABASE_PUBLISHABLE_KEY`
- [ ] `VITE_SUPABASE_PROJECT_ID`
- [ ] `SUPABASE_ACCESS_TOKEN`
- [ ] `SUPABASE_SERVICE_ROLE_KEY`
- [ ] `VITE_PAYPAL_CLIENT_ID`
- [ ] `VITE_PAYPAL_MONTHLY_PLAN_ID`
- [ ] `VITE_PAYPAL_YEARLY_PLAN_ID`

#### Optional Secrets (Enhanced Features)
- [ ] `VITE_OPENAI_API_KEY` (for AI chatbot)
- [ ] `VITE_SENTRY_DSN` (for error tracking)
- [ ] `VITE_GOOGLE_ANALYTICS_ID` (for analytics)
- [ ] `SNYK_TOKEN` (for security scanning)

### Step 2: Verify Workflows

#### Deploy to GitHub Pages
- [ ] Navigate to **Actions** → **Deploy to GitHub Pages**
- [ ] Click **Run workflow** → **Run workflow**
- [ ] Wait for completion (should take ~2-3 minutes)
- [ ] Verify: ✅ No "missing environment variable" errors
- [ ] Verify: ✅ Build completes successfully
- [ ] Verify: ✅ Site deploys to GitHub Pages

#### Deploy Supabase
- [ ] Navigate to **Actions** → **Deploy Supabase**
- [ ] Click **Run workflow** → **Run workflow**
- [ ] Wait for completion (should take ~1-2 minutes)
- [ ] Verify: ✅ Database migrations deploy successfully
- [ ] Verify: ✅ Edge functions deploy successfully (job-cleanup, job-scraper, seed-jobs)

#### Seed Job Listings
- [ ] Navigate to **Actions** → **Seed Job Listings**
- [ ] Click **Run workflow**
- [ ] Type `seed-jobs` in the confirmation field
- [ ] Click **Run workflow**
- [ ] Wait for completion (should take ~1 minute)
- [ ] Verify: ✅ Function invoked successfully
- [ ] Verify: ✅ 100 jobs seeded (50 South African + 50 Nigerian)

### Step 3: Verify Supabase Configuration

#### Check Database
- [ ] Go to Supabase Dashboard → Your Project → Table Editor
- [ ] Verify: ✅ `jobs` table exists
- [ ] Verify: ✅ Table has rows (after seeding)
- [ ] Verify: ✅ All required columns are present

#### Check Edge Functions
- [ ] Go to Supabase Dashboard → Your Project → Edge Functions
- [ ] Verify: ✅ `job-cleanup` function is deployed
- [ ] Verify: ✅ `job-scraper` function is deployed
- [ ] Verify: ✅ `seed-jobs` function is deployed
- [ ] Click on each function to view logs
- [ ] Verify: ✅ No environment variable errors in logs

### Step 4: Test Live Application

#### Test Basic Functionality
- [ ] Visit your deployed site (jobbyist.africa)
- [ ] Verify: ✅ Site loads without errors
- [ ] Navigate to Jobs page
- [ ] Verify: ✅ Job listings are displayed (if seeded)
- [ ] Test search and filters
- [ ] Verify: ✅ Search works correctly

#### Test PayPal Integration
- [ ] Navigate to Jobbyist Pro page (/pro)
- [ ] Click "Upgrade to Pro" or subscription button
- [ ] Verify: ✅ PayPal checkout modal appears
- [ ] Verify: ✅ Monthly plan option is available
- [ ] Verify: ✅ Yearly plan option is available
- [ ] DO NOT complete payment (unless testing)
- [ ] Close modal

#### Test Optional Features (if configured)

**AI Chatbot** (if VITE_OPENAI_API_KEY is set):
- [ ] Look for AI chatbot button (usually bottom right)
- [ ] Click to open chatbot
- [ ] Verify: ✅ Chatbot interface appears
- [ ] Type a test message
- [ ] Verify: ✅ AI responds (may take a few seconds)

**Error Tracking** (if VITE_SENTRY_DSN is set):
- [ ] Go to Sentry dashboard
- [ ] Verify: ✅ Project is receiving events
- [ ] Verify: ✅ No critical errors

**Analytics** (if VITE_GOOGLE_ANALYTICS_ID is set):
- [ ] Go to Google Analytics dashboard
- [ ] Verify: ✅ Realtime users showing
- [ ] Navigate around the site
- [ ] Verify: ✅ Pageviews are tracked

### Step 5: Verify Automated Schedules

#### Daily Job Seeding
- [ ] Check workflow: `.github/workflows/seed-jobs.yml`
- [ ] Verify: ✅ Schedule cron is set: `0 2 * * *` (daily at 2 AM UTC)
- [ ] After 24 hours, check Actions tab for automatic runs
- [ ] Verify: ✅ Workflow runs automatically on schedule

#### Daily Job Cleanup
- [ ] Check workflow: `.github/workflows/cleanup-jobs.yml`
- [ ] Verify: ✅ Schedule cron is set: `0 3 * * *` (daily at 3 AM UTC)
- [ ] After 24 hours, check Actions tab for automatic runs
- [ ] Verify: ✅ Workflow runs automatically on schedule

## 🔧 Troubleshooting

### Workflow Fails: "Missing environment variable"

**Problem**: A required secret is not configured  
**Solution**:
1. Go to Settings → Secrets and variables → Actions
2. Check the secret name matches exactly (case-sensitive)
3. Add missing secret with correct value
4. Re-run workflow

### Workflow Fails: "Supabase CLI link failed"

**Problem**: `SUPABASE_ACCESS_TOKEN` or `VITE_SUPABASE_PROJECT_ID` is incorrect  
**Solution**:
1. Verify access token at supabase.com/dashboard/account/tokens
2. Verify project ID in Supabase Dashboard → Settings → General
3. Update secrets if needed
4. Re-run workflow

### Edge Function Fails: "Missing environment variables"

**Problem**: Edge function can't access required environment variables  
**Solution**:
1. Go to Supabase Dashboard → Your Project → Edge Functions
2. Click on the failing function
3. Check "Secrets" or "Environment Variables" section
4. Verify `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are set
5. These are usually auto-configured by Supabase
6. If missing, add them manually in Supabase dashboard

### PayPal Integration Not Working

**Problem**: PayPal modal doesn't appear or shows errors  
**Solution**:
1. Verify all three PayPal secrets are set in GitHub
2. Check browser console for errors
3. Ensure using **Live** credentials (not Sandbox) in production
4. Verify plan IDs match your actual subscription plans in PayPal
5. Test plan IDs by visiting them directly in PayPal dashboard

### Jobs Not Appearing After Seeding

**Problem**: Seed workflow succeeds but no jobs visible  
**Solution**:
1. Go to Supabase Dashboard → Table Editor → jobs table
2. Verify rows exist in the table
3. Check if jobs have `is_active = true`
4. Verify frontend is querying the correct table
5. Check browser console for API errors
6. Verify Row Level Security (RLS) policies allow public reads

### Build Fails Locally

**Problem**: `npm run build` fails with environment variable errors  
**Solution**:
1. Copy `.env.example` to `.env`
2. Fill in all required `VITE_*` variables with your values
3. Never commit `.env` file (it's in .gitignore)
4. Run `npm run build` again

## 📊 Monitoring Checklist

### Daily Checks (First Week)
- [ ] Check GitHub Actions tab for failed workflows
- [ ] Review Supabase Edge Function logs
- [ ] Monitor PayPal dashboard for subscription events
- [ ] Check error tracking (Sentry) for critical errors
- [ ] Review analytics (Google Analytics) for traffic

### Weekly Checks (Ongoing)
- [ ] Verify scheduled workflows are running
- [ ] Check database size and performance
- [ ] Review API usage in Supabase
- [ ] Monitor PayPal transaction fees
- [ ] Check OpenAI API usage (if enabled)

### Monthly Checks
- [ ] Review and rotate access tokens if needed
- [ ] Check for package updates
- [ ] Review security scan results
- [ ] Audit GitHub Secret access logs
- [ ] Backup critical data

## 🎉 Success Criteria

Your backend is fully configured when:
- ✅ All required GitHub Secrets are set
- ✅ All workflows run successfully
- ✅ Edge functions deploy without errors
- ✅ Database migrations apply successfully
- ✅ Jobs can be seeded via workflow
- ✅ PayPal integration works on live site
- ✅ Scheduled workflows run automatically
- ✅ No environment variable errors in logs
- ✅ Application functions correctly on live site

## 📚 Additional Resources

If you need help with any step:
- **[SECRETS_SETUP_GUIDE.md](SECRETS_SETUP_GUIDE.md)** - Detailed setup instructions
- **[REQUIRED_SECRETS.md](REQUIRED_SECRETS.md)** - Complete secrets reference
- **[GITHUB_SECRETS.md](GITHUB_SECRETS.md)** - Template and security guidelines
- **[WORKFLOWS.md](WORKFLOWS.md)** - Workflow documentation
- **[PRODUCTION_GUIDE.md](PRODUCTION_GUIDE.md)** - Production best practices

## 🆘 Getting Help

If you're stuck:
1. Check the troubleshooting sections above
2. Review workflow logs in the Actions tab
3. Check Supabase logs in the dashboard
4. Review browser console for client-side errors
5. Create an issue in the repository with:
   - Description of the problem
   - Workflow or feature affected
   - Error messages from logs
   - Steps you've already tried

---

**Last Updated**: October 2025  
**Version**: 1.0
