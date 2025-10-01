# GitHub Secrets Configuration

This document outlines the GitHub repository secrets that need to be configured to enable Supabase deployments and integrations.

## Required Secrets

The following secrets need to be added to the repository settings (Settings > Secrets and variables > Actions):

### Supabase Configuration

1. **SUPABASE_ACCESS_TOKEN**
   - Value: `sbp_0f0e6550e306b2099aaab8f24049540e5435d1ad`
   - Description: Supabase access token for deployment via GitHub Actions

2. **SUPABASE_SERVICE_ROLE_KEY**
   - Value: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF6bm91YWN4YXlhaHZpc3VjemllIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjIyNjkzMiwiZXhwIjoyMDcxODAyOTMyfQ.xs0wPyhQzYI_9yhMoUtgVl3ElNQzEhaJjm88Kr2h9tU`
   - Description: Supabase service role key for server-side operations

3. **SUPABASE_DB_PASSWORD**
   - Value: `quxbe5-xuqjah-giDbiw`
   - Description: Supabase database password

4. **VITE_SUPABASE_URL**
   - Value: `postgresql://postgres:quxbe5-xuqjah-giDbiw@db.aznouacxayahvisuczie.supabase.co:5432/postgres`
   - Description: Supabase database connection URL

5. **VITE_SUPABASE_PUBLISHABLE_KEY**
   - Value: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF6bm91YWN4YXlhaHZpc3VjemllIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYyMjY5MzIsImV4cCI6MjA3MTgwMjkzMn0.7_1XlPD9kABdjqvejXEtsUrHDbngSpmLaA0RVVTs7oc`
   - Description: Supabase publishable (anon) key for client-side operations

6. **VITE_SUPABASE_PROJECT_ID**
   - Value: `aznouacxayahvisuczie`
   - Description: Supabase project ID

### Payment Integration

7. **VITE_PAYPAL_CLIENT_ID**
   - Value: `Ac32ZDa7N2pDibLvx4kTWcNr2Txpx0mrieU1hbyAt9dStW9SDITO_rbxqupzGRNEglcgQQjN8iqUtraY`
   - Description: PayPal client ID for payment processing

## How to Add Secrets

1. Navigate to your GitHub repository
2. Go to **Settings** > **Secrets and variables** > **Actions**
3. Click **New repository secret**
4. Enter the secret name (e.g., `SUPABASE_ACCESS_TOKEN`)
5. Enter the secret value
6. Click **Add secret**
7. Repeat for all secrets listed above

## Security Notes

- Never commit these secrets to the repository
- These secrets are sensitive and should be kept confidential
- If any secret is compromised, regenerate it immediately in the Supabase/PayPal dashboard
- The values shown here should be added as GitHub secrets, not hardcoded in the application

## Environment Variables

Some of these secrets (those prefixed with `VITE_`) will be available in the application at build time. They are safe to expose to the client as they are public keys or connection strings meant for client-side use.

## Related Files

- `/src/db.js` - Database connection configuration
- `/src/integrations/supabase/client.ts` - Supabase client configuration
- GitHub Actions workflows in `/.github/workflows/` - CI/CD pipelines that use these secrets
