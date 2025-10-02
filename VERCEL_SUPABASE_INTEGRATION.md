# Vercel + Supabase Integration Guide

## Overview

This document explains how Vercel deployment integrates with Supabase Edge Functions and database migrations for the Jobbyist Beta application.

## Architecture

The application uses a **split deployment architecture**:

- **Vercel**: Hosts the frontend React application (static files + SPA)
- **Supabase**: Hosts the database, Edge Functions (serverless Deno functions), and storage
- **GitHub Actions**: Automates deployment of Supabase resources (migrations + functions)

```
┌─────────────────────────────────────────────────────────────┐
│                     GitHub Repository                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Frontend   │  │    Edge      │  │   Database   │      │
│  │   (React)    │  │  Functions   │  │  Migrations  │      │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘      │
└─────────┼──────────────────┼──────────────────┼─────────────┘
          │                  │                  │
          │                  │                  │
    ┌─────▼─────┐      ┌─────▼──────────────────▼─────┐
    │   Vercel  │      │     Supabase Platform        │
    │           │      │  ┌────────┐  ┌────────────┐  │
    │  Hosts    │◄─────┼──┤  Edge  │  │  Database  │  │
    │  Frontend │ API  │  │Functions│  │ PostgreSQL │  │
    │           │      │  └────────┘  └────────────┘  │
    └───────────┘      └──────────────────────────────┘
```

## Supabase Edge Functions

### What Are Edge Functions?

Edge Functions are Deno-based serverless functions that run on Supabase infrastructure. They provide:
- Server-side business logic
- Database operations with elevated permissions
- API integrations and data processing
- Scheduled tasks (via GitHub Actions cron)

### Available Edge Functions

1. **job-scraper** (`/functions/v1/job-scraper`)
   - Scrapes and imports job listings from partner sites
   - Requires: `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`
   - Optional: `OPENAI_API_KEY` for AI enhancements

2. **job-cleanup** (`/functions/v1/job-cleanup`)
   - Removes old job listings (older than 90 days)
   - Scheduled: Daily at 3 AM UTC via GitHub Actions
   - Requires: `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`

3. **seed-jobs** (`/functions/v1/seed-jobs`)
   - Seeds database with sample job listings
   - Creates 50 South African + 50 Nigerian jobs
   - Requires: `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`

### How Edge Functions Work with Vercel

The frontend application deployed on Vercel calls these Edge Functions via HTTP:

```typescript
// Example: Calling an Edge Function from the frontend
const response = await fetch(
  `${VITE_SUPABASE_URL}/functions/v1/job-scraper`,
  {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${supabaseAnonKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ /* payload */ })
  }
);
```

The Edge Functions authenticate requests using:
- **Anonymous key** (for public functions)
- **User JWT token** (for authenticated functions)
- **Service role key** (for scheduled/admin functions - only used server-side)

### Deploying Edge Functions

Edge Functions are **NOT deployed by Vercel**. They're deployed to Supabase via:

1. **Automatic Deployment** (GitHub Actions)
   - Triggered on push to `main` with changes to `supabase/**`
   - Workflow: `.github/workflows/supabase-deploy.yml`
   - Deploys all three functions automatically

2. **Manual Deployment** (Supabase CLI)
   ```bash
   # Install Supabase CLI
   npm install -g supabase
   
   # Login with access token
   supabase login
   
   # Link to project
   supabase link --project-ref xzlyudwzhbqsdlwpfmwk
   
   # Deploy specific function
   supabase functions deploy job-scraper
   
   # Deploy all functions
   supabase functions deploy job-cleanup
   supabase functions deploy job-scraper
   supabase functions deploy seed-jobs
   ```

### Required Secrets for Edge Functions

These secrets must be configured in **GitHub Secrets** (for GitHub Actions):

- `SUPABASE_ACCESS_TOKEN` - For deploying functions via CLI
- `VITE_SUPABASE_PROJECT_ID` - Project identifier
- `VITE_SUPABASE_URL` - Project URL
- `SUPABASE_SERVICE_ROLE_KEY` - For admin operations (scheduled tasks)

In **Vercel Environment Variables** (for frontend):

- `VITE_SUPABASE_URL` - To know where to send API requests
- `VITE_SUPABASE_PUBLISHABLE_KEY` - For authentication
- `VITE_SUPABASE_PROJECT_ID` - Project identifier

⚠️ **NEVER** add `SUPABASE_SERVICE_ROLE_KEY` to Vercel or expose it in frontend code!

## Database Migrations

### What Are Database Migrations?

Database migrations are SQL scripts that:
- Create/modify database schema (tables, columns, indexes)
- Set up Row Level Security (RLS) policies
- Configure storage buckets
- Seed initial data

### Migration Files

Located in `supabase/migrations/`:
- `20250120000000_add_pro_subscription_fields.sql`
- `20250128000000_add_transcript_to_audio_episodes.sql`
- `20250128000001_seed_initial_episodes.sql`
- And more...

### How Migrations Work with Vercel

Migrations are **NOT run by Vercel**. They're applied to the Supabase database via:

1. **Automatic Deployment** (GitHub Actions)
   - Triggered on push to `main` with changes to `supabase/**`
   - Workflow: `.github/workflows/supabase-deploy.yml`
   - Runs: `supabase db push --linked`

2. **Manual Deployment** (Supabase CLI)
   ```bash
   # Link to project
   supabase link --project-ref xzlyudwzhbqsdlwpfmwk
   
   # Push migrations
   supabase db push
   ```

### Migration Best Practices

1. **Never modify existing migrations** - Create new ones instead
2. **Test locally first** - Use `supabase start` to test migrations locally
3. **Review before deploying** - Check the SQL carefully
4. **Backup production data** - Always have backups before major migrations

## Vercel Configuration

### vercel.json

The `vercel.json` file configures:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "env": {
    "VITE_SUPABASE_URL": "https://xzlyudwzhbqsdlwpfmwk.supabase.co",
    "VITE_SUPABASE_PUBLISHABLE_KEY": "[anon-key]",
    "VITE_SUPABASE_PROJECT_ID": "xzlyudwzhbqsdlwpfmwk"
  },
  "github": {
    "enabled": true,
    "silent": true
  }
}
```

The `github.enabled` setting allows Vercel to integrate with GitHub for automatic deployments.

### Environment Variables in Vercel

Configure these in **Vercel Dashboard → Project Settings → Environment Variables**:

**Required:**
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`
- `VITE_SUPABASE_PROJECT_ID`

**Optional (for full functionality):**
- `VITE_PAYPAL_CLIENT_ID`
- `VITE_PAYPAL_MONTHLY_PLAN_ID`
- `VITE_PAYPAL_YEARLY_PLAN_ID`
- `VITE_OPENAI_API_KEY`
- `VITE_GOOGLE_ANALYTICS_ID`
- `VITE_SENTRY_DSN`
- `VITE_APP_ENV=production`

## Complete Deployment Workflow

### 1. Development Phase

```bash
# Make changes to frontend or Supabase
git checkout -b feature/new-feature

# Test locally
npm run dev
supabase start  # For local Supabase testing

# Commit changes
git add .
git commit -m "Add new feature"
git push origin feature/new-feature
```

### 2. Pull Request Phase

When you create a PR:
- **Vercel** automatically creates a preview deployment
- **GitHub Actions** can be manually triggered to deploy Supabase changes to a staging environment

### 3. Production Deployment

When you merge to `main`:

**Automatic (via GitHub Actions):**
1. Vercel deploys frontend to production
2. If `supabase/**` files changed:
   - GitHub Actions deploy database migrations
   - GitHub Actions deploy Edge Functions
   - Optionally seeds data (manual trigger only)

**Manual (if needed):**
```bash
# Deploy frontend
vercel --prod

# Deploy Supabase
supabase link --project-ref xzlyudwzhbqsdlwpfmwk
supabase db push
supabase functions deploy job-cleanup
supabase functions deploy job-scraper
supabase functions deploy seed-jobs
```

## Testing the Integration

### 1. Test Frontend Connection to Supabase

Open browser console on your Vercel deployment:

```javascript
// Should log the Supabase URL
console.log(import.meta.env.VITE_SUPABASE_URL);

// Test a simple query
const { data, error } = await window.supabase
  .from('job_listings')
  .select('*')
  .limit(5);

console.log('Jobs:', data);
console.log('Error:', error);
```

### 2. Test Edge Function Calls

```javascript
const response = await fetch(
  'https://xzlyudwzhbqsdlwpfmwk.supabase.co/functions/v1/job-scraper',
  {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer [your-anon-key]',
      'Content-Type': 'application/json',
    }
  }
);

console.log('Status:', response.status);
console.log('Result:', await response.json());
```

### 3. Verify Database Schema

```sql
-- Run in Supabase SQL Editor
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public';

-- Check if job_listings table exists
SELECT * FROM job_listings LIMIT 5;
```

## Troubleshooting

### Issue: "Missing environment variables" error in Vercel build

**Solution:**
1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Ensure all `VITE_SUPABASE_*` variables are set
3. Redeploy: Vercel Dashboard → Deployments → Three dots → Redeploy

### Issue: Edge Functions return 404

**Solution:**
1. Verify functions are deployed: Check Supabase Dashboard → Edge Functions
2. Check GitHub Actions logs: `.github/workflows/supabase-deploy.yml` run
3. Manually deploy: `supabase functions deploy [function-name]`

### Issue: Database tables missing

**Solution:**
1. Check migrations were applied: Supabase Dashboard → Database → Migrations
2. Review GitHub Actions logs for migration errors
3. Manually apply migrations: `supabase db push`

### Issue: CORS errors when calling Edge Functions

**Solution:**
Edge Functions should already have CORS headers. If you see CORS errors:
1. Check the Edge Function includes CORS headers in responses
2. Verify the function handles OPTIONS requests
3. Check browser network tab for actual error details

## Security Best Practices

1. ✅ **DO** use environment variables for configuration
2. ✅ **DO** use the anon key for frontend authentication
3. ✅ **DO** implement Row Level Security (RLS) on all tables
4. ✅ **DO** validate all inputs in Edge Functions
5. ❌ **DON'T** expose service role key in frontend code
6. ❌ **DON'T** commit secrets to git
7. ❌ **DON'T** disable RLS policies without careful consideration

## Related Documentation

- [VERCEL_SETUP.md](VERCEL_SETUP.md) - Basic Vercel deployment guide
- [BACKEND_CONFIGURATION_SUMMARY.md](BACKEND_CONFIGURATION_SUMMARY.md) - Supabase configuration details
- [GITHUB_SECRETS.md](GITHUB_SECRETS.md) - GitHub Secrets setup
- [Supabase Edge Functions Docs](https://supabase.com/docs/guides/functions)
- [Vercel Documentation](https://vercel.com/docs)

## Support

For issues or questions:
- Create an issue in the GitHub repository
- Check Vercel deployment logs
- Check Supabase Dashboard logs
- Email: support@jobbyist.africa
