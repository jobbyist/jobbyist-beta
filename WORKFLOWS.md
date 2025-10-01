# GitHub Actions Workflows Documentation

This document describes the GitHub Actions workflows configured for the Jobbyist Beta platform.

## Workflows Overview

### 1. Deploy to GitHub Pages (`deploy.yml`)

**Trigger**: Automatic on push to `main` branch, or manual via workflow_dispatch

**Purpose**: Builds and deploys the application to GitHub Pages

**Steps**:
1. Checkout code
2. Setup Node.js 18
3. Install dependencies
4. Build application
5. Create SPA fallback (404.html)
6. Upload to GitHub Pages
7. Deploy to GitHub Pages

**Environment Variables Required**:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`
- `VITE_SUPABASE_PROJECT_ID`
- `VITE_PAYPAL_CLIENT_ID`

### 2. CI/CD Pipeline (`ci.yml`)

**Trigger**: Automatic on push/PR to `main` or `develop` branches

**Purpose**: Runs tests, linting, type checking, and security scans

**Jobs**:
1. **test**: Runs type checking, linting, and tests (Node 18.x and 20.x)
2. **build**: Builds the application
3. **security-scan**: Runs npm audit and Snyk security scan
4. **deploy-staging**: Deploys to staging (on develop branch)
5. **deploy-production**: Deploys to production (on main branch)
6. **notify**: Sends deployment status notification

### 3. Deploy Supabase (`supabase-deploy.yml`)

**Trigger**: 
- Automatic on push to `main` when `supabase/**` files change
- Manual via workflow_dispatch

**Purpose**: Deploys database migrations and edge functions to Supabase

**Jobs**:

#### 3.1 Deploy Database Migrations
- Links to Supabase project
- Pushes all migrations in `supabase/migrations/` directory
- Requires `SUPABASE_ACCESS_TOKEN` secret

#### 3.2 Deploy Edge Functions
- Links to Supabase project
- Deploys all edge functions:
  - `job-cleanup`: Removes old jobs and maintains database
  - `job-scraper`: Imports jobs from partner sites
  - `seed-jobs`: Seeds initial job listings
- Requires `SUPABASE_ACCESS_TOKEN` secret

#### 3.3 Seed Jobs (Optional)
- Only runs on manual trigger
- Calls the seed-jobs edge function
- Seeds 50 job listings (25 SA + 25 Nigerian)

**Required Secrets**:
- `SUPABASE_ACCESS_TOKEN`: Supabase CLI access token
- `VITE_SUPABASE_PROJECT_ID`: Supabase project ID
- `VITE_SUPABASE_URL`: Supabase project URL
- `SUPABASE_SERVICE_ROLE_KEY`: Service role key for function invocation

### 4. Seed Job Listings (`seed-jobs.yml`)

**Trigger**: Manual only via workflow_dispatch

**Purpose**: Seeds the database with 50 job listings (25 South African + 25 Nigerian)

**Usage**:
1. Go to Actions tab in GitHub
2. Select "Seed Job Listings" workflow
3. Click "Run workflow"
4. Enter confirmation text: `seed-jobs`
5. Click "Run workflow" button

**Steps**:
1. Validates confirmation input
2. Links to Supabase project
3. Deploys seed-jobs function (if needed)
4. Invokes seed-jobs function
5. Displays summary of seeded jobs

**Required Secrets**:
- `SUPABASE_ACCESS_TOKEN`: Supabase CLI access token
- `VITE_SUPABASE_PROJECT_ID`: Supabase project ID
- `VITE_SUPABASE_URL`: Supabase project URL
- `SUPABASE_SERVICE_ROLE_KEY`: Service role key for function invocation

## Setting Up Secrets

To configure these workflows, add the following secrets in your GitHub repository:

1. Go to repository Settings → Secrets and variables → Actions
2. Click "New repository secret"
3. Add each of the following secrets:

### Required Secrets

| Secret Name | Description | Where to Find |
|------------|-------------|---------------|
| `VITE_SUPABASE_URL` | Your Supabase project URL | Supabase Dashboard → Settings → API |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Supabase anon/public key | Supabase Dashboard → Settings → API |
| `VITE_SUPABASE_PROJECT_ID` | Supabase project ID | Supabase Dashboard → Settings → General |
| `SUPABASE_ACCESS_TOKEN` | Supabase CLI access token | Generate at supabase.com/dashboard/account/tokens |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key | Supabase Dashboard → Settings → API |
| `VITE_PAYPAL_CLIENT_ID` | PayPal client ID (optional) | PayPal Developer Dashboard |
| `SNYK_TOKEN` | Snyk security token (optional) | snyk.io account settings |

## Supabase Edge Functions

### job-cleanup
Removes job listings older than 30 days and maintains database health.

**Invocation**: 
```bash
curl -X POST \
  "$SUPABASE_URL/functions/v1/job-cleanup" \
  -H "Authorization: Bearer $SERVICE_ROLE_KEY"
```

### job-scraper
Scrapes and imports job listings from partner sites.

**Invocation**: 
```bash
curl -X POST \
  "$SUPABASE_URL/functions/v1/job-scraper" \
  -H "Authorization: Bearer $SERVICE_ROLE_KEY"
```

### seed-jobs
Seeds the database with 50 predefined job listings (25 South African + 25 Nigerian).

**Invocation**: 
```bash
curl -X POST \
  "$SUPABASE_URL/functions/v1/seed-jobs" \
  -H "Authorization: Bearer $SERVICE_ROLE_KEY"
```

## Troubleshooting

### Deployment Fails

1. **Check secrets**: Ensure all required secrets are configured correctly
2. **Check Supabase connection**: Verify project ID and access token
3. **Check build logs**: Review the workflow run logs in Actions tab

### Migrations Fail

1. **Check migration files**: Ensure SQL syntax is correct
2. **Check dependencies**: Verify migrations are in correct order
3. **Manual run**: Try running migrations manually using Supabase CLI

### Seeding Fails

1. **Check function deployment**: Ensure seed-jobs function is deployed
2. **Check database schema**: Verify jobs table exists with correct columns
3. **Check permissions**: Verify service role key has correct permissions

## Manual Deployment

If automatic deployment fails, you can deploy manually:

### Deploy Application
```bash
npm run build
# Upload dist/ folder to hosting service
```

### Deploy Supabase
```bash
# Login to Supabase
supabase login

# Link to project
supabase link --project-ref YOUR_PROJECT_ID

# Push migrations
supabase db push

# Deploy functions
supabase functions deploy job-cleanup
supabase functions deploy job-scraper
supabase functions deploy seed-jobs
```

### Seed Jobs Manually
```bash
# Using curl
curl -X POST \
  "https://YOUR_PROJECT.supabase.co/functions/v1/seed-jobs" \
  -H "Authorization: Bearer YOUR_SERVICE_ROLE_KEY"

# Or using Supabase CLI
supabase functions invoke seed-jobs
```

## Monitoring

- **GitHub Actions**: View workflow runs in the Actions tab
- **Supabase Logs**: View edge function logs in Supabase Dashboard → Edge Functions
- **Application Logs**: Monitor application errors in browser console

## Best Practices

1. **Never commit secrets**: Always use GitHub Secrets for sensitive data
2. **Test locally first**: Test migrations and functions locally before deploying
3. **Use staging**: Test changes in staging environment before production
4. **Monitor deployments**: Check workflow logs after each deployment
5. **Backup data**: Always backup production data before major changes

## Support

For questions or issues with workflows:
1. Check workflow logs in Actions tab
2. Review this documentation
3. Contact the development team
4. Create an issue in the repository
