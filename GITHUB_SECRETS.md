# GitHub Secrets Configuration Template

⚠️ **SECURITY WARNING**: This file is a template for configuring GitHub Secrets. DO NOT add actual secret values to this file. All sensitive credentials must ONLY be stored in GitHub Secrets.

This document outlines the GitHub repository secrets that need to be configured to enable Supabase deployments and integrations.

## Required Secrets

The following secrets need to be added to the repository settings (Settings > Secrets and variables > Actions):

### Supabase Configuration

1. **SUPABASE_ACCESS_TOKEN**
   - **Where to find**: Generate at [supabase.com/dashboard/account/tokens](https://supabase.com/dashboard/account/tokens)
   - **Description**: Supabase CLI access token for automated deployments via GitHub Actions
   - **Format**: Starts with `sbp_`
   - **Used in**: `supabase-deploy.yml`, `seed-jobs.yml` workflows

2. **SUPABASE_SERVICE_ROLE_KEY**
   - **Where to find**: Supabase Dashboard → Your Project → Settings → API → Service Role Key
   - **Description**: Supabase service role key for server-side operations (admin access)
   - **Format**: JWT token starting with `eyJ...`
   - **Used in**: Edge functions, seed-jobs workflow
   - ⚠️ **WARNING**: This key has full admin access. Never expose it in client-side code.

3. **VITE_SUPABASE_URL**
   - **Where to find**: Supabase Dashboard → Your Project → Settings → API → Project URL
   - **Description**: Your Supabase project URL
   - **Format**: `https://your-project-id.supabase.co`
   - **Used in**: Frontend build, workflows

4. **VITE_SUPABASE_PUBLISHABLE_KEY**
   - **Where to find**: Supabase Dashboard → Your Project → Settings → API → Anon/Public Key
   - **Description**: Supabase anon/public key for client-side operations
   - **Format**: JWT token starting with `eyJ...`
   - **Used in**: Frontend build
   - ℹ️ **Note**: Safe to expose in client-side code (public key)

5. **VITE_SUPABASE_PROJECT_ID**
   - **Where to find**: Supabase Dashboard → Your Project → Settings → General → Reference ID
   - **Description**: Supabase project identifier
   - **Format**: Lowercase alphanumeric string (e.g., `abcdefghijklmnop`)
   - **Used in**: CLI operations, function deployment

### Payment Integration

6. **VITE_PAYPAL_CLIENT_ID**
   - **Where to find**: [PayPal Developer Dashboard](https://developer.paypal.com) → My Apps & Credentials → Your App → Client ID
   - **Description**: PayPal client ID for payment processing
   - **Format**: Long alphanumeric string
   - **Used in**: Pro subscription payment integration
   
7. **VITE_PAYPAL_MONTHLY_PLAN_ID**
   - **Where to find**: PayPal Developer Dashboard → Billing Plans → Your Monthly Plan → Plan ID
   - **Description**: PayPal subscription plan ID for monthly billing
   - **Used in**: Pro subscription (monthly option)

8. **VITE_PAYPAL_YEARLY_PLAN_ID**
   - **Where to find**: PayPal Developer Dashboard → Billing Plans → Your Yearly Plan → Plan ID
   - **Description**: PayPal subscription plan ID for yearly billing
   - **Used in**: Pro subscription (yearly option)

### Optional Secrets (Enhanced Features)

9. **VITE_OPENAI_API_KEY** (Optional)
   - **Where to find**: [platform.openai.com/api-keys](https://platform.openai.com/api-keys)
   - **Description**: OpenAI API key for AI-powered career assistant chatbot (Pro feature)
   - **Used in**: AI chatbot feature
   - ℹ️ **Note**: Feature gracefully degrades if not configured

10. **VITE_SENTRY_DSN** (Optional)
    - **Where to find**: Sentry.io → Project Settings → Client Keys (DSN)
    - **Description**: Sentry Data Source Name for error tracking
    - **Used in**: Error monitoring and tracking

11. **VITE_GOOGLE_ANALYTICS_ID** (Optional)
    - **Where to find**: Google Analytics → Admin → Data Streams
    - **Description**: Google Analytics tracking ID (GA4)
    - **Used in**: User analytics

12. **SNYK_TOKEN** (Optional)
    - **Where to find**: [snyk.io](https://snyk.io) → Account Settings → API Token
    - **Description**: Snyk API token for security vulnerability scanning
    - **Used in**: CI/CD security scanning

## How to Add Secrets

1. Navigate to your GitHub repository
2. Go to **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Enter the secret name exactly as shown above (e.g., `SUPABASE_ACCESS_TOKEN`)
5. Paste the secret value from the source indicated in "Where to find"
6. Click **Add secret**
7. Repeat for all required secrets (1-8) and any optional secrets you want to enable

## Verification Checklist

Before running workflows, ensure you have configured:

### Core Required Secrets (Application won't work without these)
- [ ] `VITE_SUPABASE_URL`
- [ ] `VITE_SUPABASE_PUBLISHABLE_KEY`
- [ ] `VITE_SUPABASE_PROJECT_ID`
- [ ] `SUPABASE_ACCESS_TOKEN`
- [ ] `SUPABASE_SERVICE_ROLE_KEY`
- [ ] `VITE_PAYPAL_CLIENT_ID`
- [ ] `VITE_PAYPAL_MONTHLY_PLAN_ID`
- [ ] `VITE_PAYPAL_YEARLY_PLAN_ID`

### Optional Secrets (Enhanced features)
- [ ] `VITE_OPENAI_API_KEY`
- [ ] `VITE_SENTRY_DSN`
- [ ] `VITE_GOOGLE_ANALYTICS_ID`
- [ ] `SNYK_TOKEN`

## Security Best Practices

⚠️ **CRITICAL SECURITY GUIDELINES**:

1. **Never commit secrets to the repository** - Always use GitHub Secrets, never hardcode values
2. **Rotate secrets regularly** - Change keys periodically for enhanced security
3. **Use least privilege** - Only grant necessary permissions to each key
4. **Monitor usage** - Track API usage in respective dashboards (Supabase, PayPal, OpenAI)
5. **Regenerate compromised secrets immediately** - If a secret is exposed, regenerate it right away
6. **Service role keys are admin access** - The `SUPABASE_SERVICE_ROLE_KEY` bypasses RLS policies
7. **Don't share secrets** - Never share secret values via email, chat, or unsecured channels
8. **Review access logs** - Regularly check who has access to GitHub Secrets in your repository

## Environment Variables in Code

Some secrets (prefixed with `VITE_`) are embedded in the build at compile time and become part of the client-side bundle. These are safe to expose as they are:
- Public API keys (Supabase anon key, PayPal client ID)
- Public URLs (Supabase project URL)
- Non-sensitive configuration (Project IDs)

However, the following should NEVER be exposed client-side:
- ❌ `SUPABASE_SERVICE_ROLE_KEY` - Full admin access
- ❌ `SUPABASE_ACCESS_TOKEN` - CLI deployment access

## Workflow Usage

### Deploy Workflow (`deploy.yml`)
Uses: All `VITE_*` prefixed secrets for building the application

### Supabase Deploy Workflow (`supabase-deploy.yml`)
Uses: `SUPABASE_ACCESS_TOKEN`, `VITE_SUPABASE_PROJECT_ID`

### Seed Jobs Workflow (`seed-jobs.yml`)
Uses: `SUPABASE_ACCESS_TOKEN`, `VITE_SUPABASE_PROJECT_ID`, `VITE_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`

### CI/CD Pipeline (`ci.yml`)
Uses: `SNYK_TOKEN` (optional)

## Troubleshooting

### "Missing environment variable" error during build
**Solution**: Add the required secret to GitHub Secrets as described above

### Supabase functions fail to deploy
**Solution**: Verify `SUPABASE_ACCESS_TOKEN` is valid at supabase.com/dashboard/account/tokens

### PayPal integration not working
**Solution**: 
1. Verify all three PayPal secrets are configured
2. Ensure you're using production credentials (not sandbox)
3. Confirm plan IDs match your actual PayPal subscription plans

### Edge functions can't access database
**Solution**: Verify `SUPABASE_SERVICE_ROLE_KEY` is correctly configured in GitHub Secrets

## Related Files

- `/src/integrations/supabase/client.ts` - Supabase client configuration
- `/.github/workflows/` - GitHub Actions workflows that use these secrets
- `/supabase/functions/` - Edge functions that use runtime environment variables
- `REQUIRED_SECRETS.md` - Comprehensive secrets documentation
- `.env.example` - Local development environment template

## Further Documentation

For detailed information about secrets and their usage, see:
- `REQUIRED_SECRETS.md` - Complete secrets reference guide
- `WORKFLOWS.md` - Workflow documentation
- `PRODUCTION_GUIDE.md` - Production deployment guide
