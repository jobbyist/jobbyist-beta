# Vercel Deployment Setup Guide

This guide provides instructions for deploying the Jobbyist Beta application to Vercel.

## Quick Setup

### Prerequisites
- A Vercel account (sign up at https://vercel.com)
- Access to the GitHub repository

### Step 1: Import Project to Vercel

1. Go to https://vercel.com/dashboard
2. Click "Add New..." → "Project"
3. Import the `jobbyist/jobbyist-beta` repository
4. Vercel will automatically detect the framework (Vite)

### Step 2: Configure Environment Variables

The following environment variables are **required** for the application to work:

#### Supabase Configuration (Required)

```
VITE_SUPABASE_URL=https://xzlyudwzhbqsdlwpfmwk.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh6bHl1ZHd6aGJxc2Rsd3BmbXdrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkzNzQ5MjIsImV4cCI6MjA3NDk1MDkyMn0.3wxOZAi8yMn2iJQYExXCBHcciWgaPc4z1ReIYfknBqc
VITE_SUPABASE_PROJECT_ID=xzlyudwzhbqsdlwpfmwk
```

#### Optional Configuration

For full functionality, you may also want to configure:

```
VITE_PAYPAL_CLIENT_ID=your_paypal_client_id_here
VITE_PAYPAL_MONTHLY_PLAN_ID=your_monthly_plan_id_here
VITE_PAYPAL_YEARLY_PLAN_ID=your_yearly_plan_id_here
VITE_OPENAI_API_KEY=your_openai_api_key_here
VITE_GOOGLE_ANALYTICS_ID=your_google_analytics_id_here
VITE_SENTRY_DSN=your_sentry_dsn_here
VITE_APP_ENV=production
VITE_APP_NAME=Jobbyist
VITE_APP_VERSION=1.0.0
```

### Step 3: Add Environment Variables in Vercel

1. In your Vercel project dashboard, go to **Settings** → **Environment Variables**
2. Add each environment variable:
   - Click "Add New"
   - Enter the variable name (e.g., `VITE_SUPABASE_URL`)
   - Enter the variable value
   - Select the environments where it should be available:
     - ✅ Production
     - ✅ Preview
     - ✅ Development
   - Click "Save"
3. Repeat for all required variables

### Step 4: Deploy

1. Click "Deploy" in Vercel
2. Wait for the build to complete
3. Your application will be available at `https://your-project.vercel.app`

## Build Configuration

The project uses the following build settings (configured in `vercel.json`):

- **Framework**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`
- **Dev Command**: `npm run dev`

## Supabase Connection

The application connects to Supabase using the following configuration:

```javascript
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://xzlyudwzhbqsdlwpfmwk.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh6bHl1ZHd6aGJxc2Rsd3BmbXdrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkzNzQ5MjIsImV4cCI6MjA3NDk1MDkyMn0.3wxOZAi8yMn2iJQYExXCBHcciWgaPc4z1ReIYfknBqc'
);
```

This configuration is already set up in `src/integrations/supabase/client.ts` and will automatically use the environment variables.

## Testing the Database Connection

To test the Supabase connection, you can use the following code in your browser console after deployment:

```javascript
// Import from CDN for quick testing
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const supabase = createClient(
  'https://xzlyudwzhbqsdlwpfmwk.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh6bHl1ZHd6aGJxc2Rsd3BmbXdrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkzNzQ5MjIsImV4cCI6MjA3NDk1MDkyMn0.3wxOZAi8yMn2iJQYExXCBHcciWgaPc4z1ReIYfknBqc'
);

// Test query (example using 'todos' table if it exists)
const { data, error } = await supabase
  .from('todos')
  .select();

console.log('Data:', data);
console.log('Error:', error);
```

## Vercel CLI (Alternative Setup)

You can also deploy using the Vercel CLI:

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy to production
vercel --prod

# Set environment variables via CLI
vercel env add VITE_SUPABASE_URL production
vercel env add VITE_SUPABASE_PUBLISHABLE_KEY production
vercel env add VITE_SUPABASE_PROJECT_ID production
```

## Troubleshooting

### Build Failures

If the build fails:
1. Check that all required environment variables are set
2. Review the build logs in Vercel dashboard
3. Ensure Node.js version is compatible (18+)

### Supabase Connection Issues

If Supabase connection fails:
1. Verify the environment variables are correct
2. Check that the Supabase project is accessible
3. Review browser console for CORS errors
4. Ensure the Supabase URL and anon key are valid

### Performance Issues

For optimal performance:
1. Enable Vercel Edge Network
2. Configure caching headers (already set in vercel.json)
3. Monitor performance in Vercel Analytics

## Custom Domain

To add a custom domain:
1. Go to **Settings** → **Domains** in your Vercel project
2. Add your domain
3. Configure DNS records as instructed by Vercel
4. Wait for SSL certificate provisioning

## Continuous Deployment

Vercel automatically deploys:
- **Production**: When pushing to `main` branch
- **Preview**: For every pull request
- **Development**: For feature branches

## Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)
- [Supabase Documentation](https://supabase.com/docs)

## Security Notes

⚠️ **Important**: The Supabase publishable key is safe to expose in client-side code as it only provides access to public data and authenticated operations. Never expose the Supabase service role key in client-side code.

For sensitive operations, use Supabase Edge Functions or server-side API routes.
