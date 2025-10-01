# Quick Reference: Redeploying PRs #20-24

## One-Time Setup (If Not Already Done)

Ensure these GitHub Secrets are configured in `Settings → Secrets and variables → Actions`:
- ✅ VITE_SUPABASE_URL
- ✅ VITE_SUPABASE_PUBLISHABLE_KEY  
- ✅ VITE_SUPABASE_PROJECT_ID
- ✅ VITE_PAYPAL_CLIENT_ID

## Redeploy All 5 PRs (Recommended)

1. Navigate to: **Actions → Redeploy Pull Request**
2. Click: **Run workflow**
3. Select any PR number (will be ignored)
4. ✅ **Check** "Deploy all 5 PRs sequentially"
5. Click: **Run workflow**

⏱️ **Time:** ~25-50 minutes (5-10 min per PR)

## Redeploy Single PR

1. Navigate to: **Actions → Redeploy Pull Request**
2. Click: **Run workflow**
3. Select **PR number** (20, 21, 22, 23, or 24)
4. Leave "Deploy all 5 PRs sequentially" unchecked
5. Click: **Run workflow**

⏱️ **Time:** ~5-10 minutes

## PR Summary

| PR | Description | Commit SHA |
|----|-------------|------------|
| 24 | Security fixes & audio player | 6dadd4aa |
| 23 | PWA & Jobbyist Pro | 0098c4c4 |
| 22 | ESLint fixes & SEO | b25c12d9 |
| 21 | Footer & company directory | adc80f2d |
| 20 | UI updates & Supabase automation | 34136824 |

## What Gets Deployed

Each redeployment:
- ✅ Checks out the PR's original merge commit
- ✅ Builds with **current** production configuration
- ✅ Uses **latest** environment variables/secrets
- ✅ Deploys to https://jobbyist.africa

## Verification

After deployment completes:
1. Visit: https://jobbyist.africa
2. Clear cache: `Ctrl+Shift+R` (or `Cmd+Shift+R` on Mac)
3. Check console for errors (F12)
4. Test key features from the deployed PR

## Troubleshooting

**Workflow not appearing?**
- Ensure you're on the main branch in the repository
- Refresh the Actions page

**Deployment fails?**
- Check Actions tab for error logs
- Verify secrets are configured correctly
- See full [REDEPLOY_GUIDE.md](./REDEPLOY_GUIDE.md)

**Site not updating?**
- Wait 1-2 minutes for CDN propagation
- Clear browser cache completely
- Try incognito/private browsing mode

## Need Help?

- 📖 Full guide: [REDEPLOY_GUIDE.md](./REDEPLOY_GUIDE.md)
- ⚙️ Build config: [BUILD_RECONFIGURATION_SUMMARY.md](./BUILD_RECONFIGURATION_SUMMARY.md)
- 🔄 Workflows: [WORKFLOWS.md](./WORKFLOWS.md)
