# GitHub Pages Deployment Configuration

## Overview

This document describes the GitHub Pages deployment configuration for the Jobbyist Beta platform, deployed as a Single Page Application (SPA) with the custom domain **jobbyist.africa**.

## Configuration Summary

### 1. Build Configuration

**Vite Configuration** (`vite.config.ts`):
- Base path: `/` (for custom domain)
- Output directory: `dist/`
- Build optimizations: esbuild minification, no sourcemaps

### 2. GitHub Pages Setup

**Custom Domain**: jobbyist.africa

**Files Required**:
- `public/CNAME` - Contains the custom domain name
- `public/.nojekyll` - Prevents GitHub Pages Jekyll processing
- `dist/404.html` - Client-side routing fallback (created during build)

### 3. GitHub Actions Workflow

**Workflow**: `.github/workflows/deploy.yml`

**Trigger**:
- Automatic on push to `main` branch
- Manual via workflow_dispatch

**Key Steps**:
1. Checkout code
2. Setup Node.js 20 with npm caching
3. Install dependencies with `npm ci`
4. Build application with production environment variables
5. Setup SPA routing:
   - Create `404.html` for client-side routing
   - Verify `CNAME` file exists
   - Verify `.nojekyll` file exists
6. Deploy to GitHub Pages

**Environment Variables**:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`
- `VITE_SUPABASE_PROJECT_ID`
- `VITE_PAYPAL_CLIENT_ID`
- `VITE_APP_ENV` (set to 'production')

## SPA vs Static Website

This deployment is configured as a **Single Page Application (SPA)**, not a static website:

### SPA Features:
- ✅ Client-side routing with React Router
- ✅ 404.html fallback for all routes
- ✅ Dynamic content loading
- ✅ State management with React
- ✅ API calls to Supabase backend

### What Makes it a SPA:
1. **404.html Fallback**: All unknown routes serve `404.html` (which is a copy of `index.html`), allowing React Router to handle routing
2. **Client-Side Navigation**: Navigation is handled by JavaScript, not server redirects
3. **Single HTML Entry Point**: All routes load through `index.html`
4. **No Jekyll Processing**: The `.nojekyll` file ensures GitHub Pages doesn't process the files as a Jekyll site

## Custom Domain Setup

### DNS Configuration

Point your domain's DNS records to GitHub Pages:

**For apex domain (jobbyist.africa)**:
```
Type: A
Host: @
Value: 185.199.108.153
       185.199.109.153
       185.199.110.153
       185.199.111.153
```

**For www subdomain (optional)**:
```
Type: CNAME
Host: www
Value: jobbyist.github.io
```

### HTTPS Configuration

GitHub Pages automatically provisions and renews Let's Encrypt certificates for custom domains. This process typically takes a few minutes after DNS propagation.

## Testing the Deployment

### Local Testing

```bash
# Build the application
npm run build

# Preview the build
npm run preview
```

### Verify Deployment Files

```bash
# Check that critical files exist
ls -la dist/CNAME
ls -la dist/.nojekyll
ls -la dist/404.html
ls -la dist/index.html

# Verify CNAME content
cat dist/CNAME  # Should output: jobbyist.africa
```

### Production Testing

Once deployed, test the following:

1. **Root URL**: https://jobbyist.africa/
2. **Direct Route Access**: https://jobbyist.africa/jobs (should work, not 404)
3. **Deep Links**: https://jobbyist.africa/jobs/some-job-id
4. **HTTPS**: Verify SSL certificate is valid
5. **SPA Navigation**: Click through the site, use browser back/forward

## Deployment Flow

```
┌─────────────────────────────────────────────────────────┐
│                   Push to main branch                    │
└────────────────────────┬────────────────────────────────┘
                         │
                         ▼
         ┌───────────────────────────────┐
         │  GitHub Actions Workflow       │
         │  (.github/workflows/deploy.yml)│
         └───────────────┬───────────────┘
                         │
          ┌──────────────┼──────────────┐
          ▼              ▼              ▼
      Checkout       Install        Build
       Code          Dependencies    App
                         │
                         ▼
                 ┌───────────────┐
                 │  Setup SPA    │
                 │  - 404.html   │
                 │  - CNAME      │
                 │  - .nojekyll  │
                 └───────┬───────┘
                         │
                         ▼
                 ┌───────────────┐
                 │  Deploy to    │
                 │ GitHub Pages  │
                 └───────┬───────┘
                         │
                         ▼
                 ┌───────────────┐
                 │  Live at:     │
                 │jobbyist.africa│
                 └───────────────┘
```

## Key Files

### Added/Modified Files

1. **`public/.nojekyll`** (NEW)
   - Empty file to prevent Jekyll processing
   - Automatically copied to `dist/` during build

2. **`.github/workflows/deploy.yml`** (MODIFIED)
   - Updated workflow name to "Deploy to GitHub Pages"
   - Enhanced SPA routing setup step
   - Added verification for CNAME and .nojekyll files

3. **`README.md`** (MODIFIED)
   - Updated deployment section with SPA details
   - Clarified custom domain configuration

4. **`WORKFLOWS.md`** (MODIFIED)
   - Enhanced deploy workflow documentation
   - Added key features section

### Existing Files (Already Configured)

- `public/CNAME` - Contains "jobbyist.africa"
- `vite.config.ts` - Correct base path for custom domain
- `index.html` - SPA entry point with proper meta tags

## Troubleshooting

### Issue: Routes return 404 error

**Solution**: Ensure `404.html` is created in the workflow and is a copy of `index.html`

### Issue: Custom domain not working

**Solution**: 
1. Verify DNS records are correctly configured
2. Check that CNAME file exists in repository
3. Wait for DNS propagation (can take up to 24 hours)

### Issue: Styles not loading

**Solution**: Ensure `.nojekyll` file exists to prevent Jekyll from processing files

### Issue: Deployment fails

**Solution**: 
1. Check that all required secrets are configured in GitHub
2. Verify workflow has proper permissions
3. Check GitHub Actions logs for specific errors

## Security Considerations

1. **Environment Variables**: All sensitive data is stored as GitHub Secrets
2. **HTTPS**: Automatically enforced by GitHub Pages
3. **Build Process**: Uses `npm ci` for deterministic builds
4. **Permissions**: Workflow has minimal required permissions

## Performance Optimizations

1. **npm caching**: Speeds up dependency installation
2. **esbuild minification**: Fast build process
3. **No sourcemaps**: Reduces build size
4. **SWC plugin**: Fast React compilation

## Maintenance

### Updating Dependencies

```bash
npm update
npm audit fix
```

### Rebuilding

Deployment happens automatically on push to `main`. For manual deployment:

```bash
# Trigger workflow manually from GitHub Actions tab
# or push to main branch
git push origin main
```

### Monitoring

- Check GitHub Actions tab for deployment status
- Monitor application at https://jobbyist.africa/
- Review build logs for any warnings or errors

## Summary

The Jobbyist Beta platform is configured for optimal SPA deployment to GitHub Pages:

✅ **Deployed as**: Single Page Application (SPA)  
✅ **Custom Domain**: jobbyist.africa  
✅ **Client-Side Routing**: Full support with 404.html fallback  
✅ **Build Process**: Automated via GitHub Actions  
✅ **HTTPS**: Automatically configured  
✅ **No Jekyll Processing**: Ensured via .nojekyll file  

All changes are minimal and focused on ensuring proper SPA deployment with the custom domain.
