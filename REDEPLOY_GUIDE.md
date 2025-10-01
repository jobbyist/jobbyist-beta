# PR Redeployment Guide

This guide explains how to redeploy the last 5 pull requests (PRs #20-24) with the current build configuration.

## Overview

The `redeploy-pr.yml` workflow allows you to redeploy individual PRs or all 5 PRs sequentially, using the current build configuration with all the latest environment variables and secrets.

## Why Redeploy?

Redeploying PRs with the current configuration is useful when:
- Build configuration has been updated (e.g., new environment variables, updated dependencies)
- Secrets have been rotated or updated
- You want to ensure all features from these PRs are built with consistent settings
- Testing specific PR changes in isolation with current infrastructure

## Pull Requests Included

The workflow supports redeployment of the following merged PRs:

| PR # | Title | Merge Commit SHA | Features |
|------|-------|------------------|----------|
| #24 | Security fixes and audio player | 6dadd4aa | Security improvements, audio player features |
| #23 | PWA functionality and Jobbyist Pro | 0098c4c4 | PWA support, Pro subscription, job automation |
| #22 | ESLint fixes and SEO | b25c12d9 | Code quality, logo updates, SEO improvements |
| #21 | Footer and company directory | adc80f2d | Footer navigation, company directory page |
| #20 | UI updates and Supabase automation | 34136824 | Preloader, logo integration, job seeding |

## How to Redeploy

### Option 1: Redeploy a Single PR

1. Go to the GitHub repository Actions tab
2. Select "Redeploy Pull Request" workflow
3. Click "Run workflow"
4. Select the PR number from the dropdown (20-24)
5. Leave "Deploy all 5 PRs sequentially" unchecked
6. Click "Run workflow"

The workflow will:
- Checkout the specific merge commit for that PR
- Install dependencies
- Build with current production configuration
- Deploy to GitHub Pages

### Option 2: Redeploy All 5 PRs Sequentially

1. Go to the GitHub repository Actions tab
2. Select "Redeploy Pull Request" workflow
3. Click "Run workflow"
4. Select any PR number (it will be ignored)
5. **Check** "Deploy all 5 PRs sequentially"
6. Click "Run workflow"

The workflow will:
- Trigger redeployment of PR #20
- Wait 60 seconds
- Trigger redeployment of PR #21
- Wait 60 seconds
- Continue for PRs #22, #23, #24

**Note:** Sequential deployment takes approximately 5-10 minutes per PR (25-50 minutes total).

## Build Configuration Used

All redeployments use the current production build configuration:

### Environment Variables
- `VITE_SUPABASE_URL` - Current Supabase project URL
- `VITE_SUPABASE_PUBLISHABLE_KEY` - Current publishable API key
- `VITE_SUPABASE_PROJECT_ID` - Current project ID
- `VITE_PAYPAL_CLIENT_ID` - Current PayPal client ID
- `VITE_APP_ENV=production` - Production environment

### Build Features
- Node.js 20.x
- npm ci (deterministic builds)
- SPA routing (404.html)
- Custom domain (jobbyist.africa)
- No Jekyll processing (.nojekyll)

## Deployment Verification

After each redeployment, verify:

1. **Build Status**: Check the Actions tab for green checkmarks
2. **Site Access**: Visit https://jobbyist.africa
3. **Feature Testing**: Test key features from the redeployed PR
4. **Console Logs**: Check browser console for errors
5. **Network Tab**: Verify API calls succeed

### Testing Checklist by PR

**PR #20:**
- [ ] Preloader displays on first visit
- [ ] Logo appears correctly in header and footer
- [ ] "How It Works" and "Find Out More" buttons work

**PR #21:**
- [ ] Footer links navigate correctly
- [ ] Company Directory page loads at `/companies`
- [ ] Lagos and Abuja appear in location filters

**PR #22:**
- [ ] No console errors related to React hooks
- [ ] Logos are properly sized (larger)
- [ ] SEO meta tags present in page source

**PR #23:**
- [ ] PWA install prompt appears (after 30 days)
- [ ] Service worker registered
- [ ] "View Companies" button works
- [ ] "Try Recruitment Suite" modal opens

**PR #24:**
- [ ] Audio player controls work
- [ ] Security improvements active (DOMPurify)
- [ ] Episodes page loads at `/episodes`
- [ ] PayPal tip button functional

## Troubleshooting

### Deployment Fails

1. Check GitHub Secrets are configured:
   ```
   Settings → Secrets and variables → Actions
   ```

2. Verify required secrets exist:
   - VITE_SUPABASE_URL
   - VITE_SUPABASE_PUBLISHABLE_KEY
   - VITE_SUPABASE_PROJECT_ID
   - VITE_PAYPAL_CLIENT_ID

3. Check workflow logs for specific errors

### Site Not Updating

1. Clear browser cache (Ctrl+Shift+R or Cmd+Shift+R)
2. Check GitHub Pages deployment status in Settings → Pages
3. Wait 1-2 minutes for CDN propagation
4. Verify custom domain DNS configuration

### Build Errors

1. Check if dependencies have breaking changes
2. Review package.json and package-lock.json
3. Try running build locally:
   ```bash
   npm ci
   npm run build
   ```

## Manual Redeployment (Advanced)

If the workflow fails or you need more control:

```bash
# Clone repository
git clone https://github.com/jobbyist/jobbyist-beta.git
cd jobbyist-beta

# Checkout specific PR merge commit
git checkout <commit-sha>

# Install dependencies
npm ci

# Build with environment variables
export VITE_SUPABASE_URL="your-url"
export VITE_SUPABASE_PUBLISHABLE_KEY="your-key"
export VITE_SUPABASE_PROJECT_ID="your-project-id"
export VITE_PAYPAL_CLIENT_ID="your-client-id"
export VITE_APP_ENV="production"
npm run build

# Deploy to GitHub Pages (requires gh CLI)
gh workflow run deploy.yml
```

## Support

For issues with redeployment:
1. Check workflow run logs in Actions tab
2. Review [WORKFLOWS.md](./WORKFLOWS.md) for deployment details
3. See [BUILD_RECONFIGURATION_SUMMARY.md](./BUILD_RECONFIGURATION_SUMMARY.md) for configuration info
4. Contact repository maintainers

## Notes

- Each redeployment creates a new GitHub Pages deployment
- Previous deployments are automatically archived
- Redeployment does NOT modify the main branch
- All PRs must be already merged to main
- The current build configuration is always used (not the configuration from when the PR was merged)
