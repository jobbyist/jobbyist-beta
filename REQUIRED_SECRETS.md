# Required GitHub Repository Secrets

This document lists all the GitHub repository secrets required for the Jobbyist Beta platform to function properly with GitHub Actions workflows and deployed features.

## How to Add Secrets

1. Navigate to your GitHub repository
2. Go to **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Enter the secret name and value
5. Click **Add secret**

## Required Secrets (Must Be Configured)

These secrets are **required** for the application to build and deploy successfully:

### Supabase Configuration

| Secret Name | Description | Required For |
|------------|-------------|--------------|
| `VITE_SUPABASE_URL` | Supabase project URL (e.g., https://xxxxx.supabase.co) | Database connection, authentication |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Supabase anon/public key (starts with eyJ...) | Client-side database access |
| `VITE_SUPABASE_PROJECT_ID` | Supabase project identifier | CLI operations, function deployment |
| `SUPABASE_ACCESS_TOKEN` | Supabase CLI access token | Automated deployments, migrations |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (admin access) | Server-side operations, edge functions |

**Where to find**: Supabase Dashboard → Settings → API / General

### PayPal Configuration

| Secret Name | Description | Required For |
|------------|-------------|--------------|
| `VITE_PAYPAL_CLIENT_ID` | PayPal client ID | Payment processing, Pro subscriptions |
| `VITE_PAYPAL_MONTHLY_PLAN_ID` | PayPal monthly subscription plan ID | Pro subscription monthly billing |
| `VITE_PAYPAL_YEARLY_PLAN_ID` | PayPal yearly subscription plan ID | Pro subscription yearly billing |

**Where to find**: PayPal Developer Dashboard → My Apps & Credentials → Billing Plans

## Optional Secrets (Enhanced Features)

These secrets are **optional** but enable additional features when configured:

### AI Chatbot (Pro Feature)

| Secret Name | Description | Feature Enabled |
|------------|-------------|-----------------|
| `VITE_OPENAI_API_KEY` | OpenAI API key | AI-powered career assistant chatbot for Pro users |

**Where to find**: [platform.openai.com/api-keys](https://platform.openai.com/api-keys)

**Note**: Without this key, the AI chatbot will show a "not configured" message but won't break the application.

### Error Tracking & Monitoring

| Secret Name | Description | Feature Enabled |
|------------|-------------|-----------------|
| `VITE_SENTRY_DSN` | Sentry Data Source Name | Real-time error tracking and performance monitoring |

**Where to find**: Sentry.io → Project Settings → Client Keys (DSN)

### Analytics

| Secret Name | Description | Feature Enabled |
|------------|-------------|-----------------|
| `VITE_GOOGLE_ANALYTICS_ID` | Google Analytics tracking ID (GA4) | User analytics and behavior tracking |

**Where to find**: Google Analytics → Admin → Data Streams

### Security Scanning

| Secret Name | Description | Feature Enabled |
|------------|-------------|-----------------|
| `SNYK_TOKEN` | Snyk API token | Automated security vulnerability scanning in CI/CD |

**Where to find**: [snyk.io](https://snyk.io) → Account Settings → API Token

## Environment Variables in Workflows

### Deploy Workflow (deploy.yml)

Uses the following secrets during build:
- ✅ All Supabase secrets
- ✅ All PayPal secrets
- ⚠️ Optional: `VITE_OPENAI_API_KEY`
- ⚠️ Optional: `VITE_SENTRY_DSN`
- ⚠️ Optional: `VITE_GOOGLE_ANALYTICS_ID`

### Supabase Deploy Workflow (supabase-deploy.yml)

Uses the following secrets:
- ✅ `SUPABASE_ACCESS_TOKEN`
- ✅ `VITE_SUPABASE_PROJECT_ID`

### Seed Jobs Workflow (seed-jobs.yml)

Uses the following secrets:
- ✅ `SUPABASE_ACCESS_TOKEN`
- ✅ `VITE_SUPABASE_PROJECT_ID`
- ✅ `VITE_SUPABASE_URL`
- ✅ `SUPABASE_SERVICE_ROLE_KEY`

### CI/CD Pipeline (ci.yml)

Uses the following secrets:
- ⚠️ Optional: `SNYK_TOKEN` (for security scanning)

## Verification Checklist

Before deploying, ensure you have configured:

### Minimum Required (Core Functionality)
- [ ] `VITE_SUPABASE_URL`
- [ ] `VITE_SUPABASE_PUBLISHABLE_KEY`
- [ ] `VITE_SUPABASE_PROJECT_ID`
- [ ] `SUPABASE_ACCESS_TOKEN`
- [ ] `SUPABASE_SERVICE_ROLE_KEY`
- [ ] `VITE_PAYPAL_CLIENT_ID`
- [ ] `VITE_PAYPAL_MONTHLY_PLAN_ID`
- [ ] `VITE_PAYPAL_YEARLY_PLAN_ID`

### Optional (Enhanced Features)
- [ ] `VITE_OPENAI_API_KEY` (AI chatbot)
- [ ] `VITE_SENTRY_DSN` (error tracking)
- [ ] `VITE_GOOGLE_ANALYTICS_ID` (analytics)
- [ ] `SNYK_TOKEN` (security scanning)

## Security Best Practices

1. **Never commit secrets to the repository** - Always use GitHub Secrets
2. **Rotate secrets regularly** - Update keys periodically for security
3. **Use least privilege** - Only grant necessary permissions
4. **Monitor usage** - Track API usage in respective dashboards
5. **Regenerate compromised secrets immediately** - If a secret is exposed, regenerate it

## Troubleshooting

### Build Fails with "Undefined environment variable"

**Problem**: Required secret is missing

**Solution**: Add the missing secret to GitHub repository secrets

### PayPal Integration Not Working

**Problem**: PayPal secrets not configured or incorrect

**Solution**: 
1. Verify `VITE_PAYPAL_CLIENT_ID`, `VITE_PAYPAL_MONTHLY_PLAN_ID`, and `VITE_PAYPAL_YEARLY_PLAN_ID` are set
2. Ensure plan IDs match your PayPal subscription plans
3. Check that PayPal app is in production mode (not sandbox)

### AI Chatbot Shows "Not Configured"

**Problem**: `VITE_OPENAI_API_KEY` is not set

**Solution**: This is expected if you haven't added the OpenAI API key. The feature is optional. Add the secret to enable the AI chatbot.

### Supabase Functions Fail to Deploy

**Problem**: `SUPABASE_ACCESS_TOKEN` or `VITE_SUPABASE_PROJECT_ID` is incorrect

**Solution**:
1. Verify the access token is valid at supabase.com/dashboard/account/tokens
2. Ensure project ID matches your Supabase project

## Support

For additional help:
- Supabase: [supabase.com/docs](https://supabase.com/docs)
- PayPal: [developer.paypal.com](https://developer.paypal.com)
- OpenAI: [platform.openai.com/docs](https://platform.openai.com/docs)
- Sentry: [docs.sentry.io](https://docs.sentry.io)
- GitHub Actions: [docs.github.com/actions](https://docs.github.com/actions)
