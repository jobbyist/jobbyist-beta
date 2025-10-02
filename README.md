# Jobbyist Beta - Africa's Premier Job Discovery Platform

[![Deploy to GitHub Pages](https://github.com/jobbyist/jobbyist-beta/actions/workflows/deploy.yml/badge.svg)](https://github.com/jobbyist/jobbyist-beta/actions/workflows/deploy.yml)
[![CI/CD Pipeline](https://github.com/jobbyist/jobbyist-beta/actions/workflows/ci.yml/badge.svg)](https://github.com/jobbyist/jobbyist-beta/actions/workflows/ci.yml)

## About

Jobbyist is a comprehensive job discovery and career management platform designed specifically for the African job market. The platform connects job seekers with verified companies across South Africa, Nigeria, and other African countries.

### 📚 Documentation

For comprehensive setup and deployment information, see:
- **[SECRETS_SETUP_GUIDE.md](SECRETS_SETUP_GUIDE.md)** - 🔐 **START HERE**: Step-by-step guide for configuring GitHub Secrets
- **[VERCEL_SETUP.md](VERCEL_SETUP.md)** - 🚀 Vercel deployment guide with Supabase configuration
- **[REQUIRED_SECRETS.md](REQUIRED_SECRETS.md)** - Complete reference for all required and optional secrets
- **[GITHUB_SECRETS.md](GITHUB_SECRETS.md)** - Template and security guidelines for secrets configuration
- **[COMPLETE_CONFIGURATION_SUMMARY.md](COMPLETE_CONFIGURATION_SUMMARY.md)** - Complete overview of build and deployment
- **[WORKFLOWS.md](WORKFLOWS.md)** - Detailed workflow documentation
- **[DEPLOYMENT_CONFIGURATION.md](DEPLOYMENT_CONFIGURATION.md)** - Deployment details and troubleshooting
- **[PRODUCTION_GUIDE.md](PRODUCTION_GUIDE.md)** - Production deployment and optimization guide

### Key Features

- 🔍 **Smart Job Search** - Discover curated job opportunities from verified companies
- 📝 **Free Resume Builder** - Create ATS-friendly resumes with AI-powered suggestions
- 🎯 **Resume Audit** - Get professional feedback on your resume
- 🎙️ **The Job Post Podcast** - Career advice and success stories
- 💼 **Jobbyist Pro** - Premium features for serious job seekers
- 🌍 **Africa-Focused** - Tailored for African and international job markets

## Recent Updates

### UI/UX Improvements
- ✅ Replaced briefcase icons with custom Jobbyist logo throughout the site
- ✅ Added animated preloader with loading bar animation
- ✅ Updated CTA buttons: "Find Out More" (Pro) and "How It Works" (Builder)
- ✅ Refined Builder page features to match profiles.jobbyist.africa

### Supabase Integration
- ✅ Automated edge function deployment via GitHub Actions
- ✅ Automated database migration deployment
- ✅ Job seeding workflow (25 South African + 25 Nigerian listings)

## Technologies

This project is built with:

- **Frontend**: Vite, TypeScript, React, shadcn-ui, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Edge Functions)
- **Authentication**: Supabase Auth
- **Storage**: Supabase Storage
- **Deployment**: GitHub Pages, Vercel
- **CI/CD**: GitHub Actions

## Getting Started

### Prerequisites

- Node.js 18+ & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)
- Supabase account (for backend features)

### Local Development

```sh
# Clone the repository
git clone <YOUR_GIT_URL>

# Navigate to the project directory
cd jobbyist-beta

# Install dependencies
npm install

# Start the development server
npm run dev
```

### Environment Variables

For local development, create a `.env` file based on `.env.example`:

```sh
cp .env.example .env
# Then edit .env with your actual credentials
```

Required variables for development:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_publishable_key
VITE_SUPABASE_PROJECT_ID=your_project_id
VITE_PAYPAL_CLIENT_ID=your_paypal_client_id
VITE_PAYPAL_MONTHLY_PLAN_ID=your_monthly_plan_id
VITE_PAYPAL_YEARLY_PLAN_ID=your_yearly_plan_id
```

⚠️ **Important**: Never commit the `.env` file. It's already in `.gitignore`.

For production deployment, all secrets must be configured in **GitHub Secrets**. See [SECRETS_SETUP_GUIDE.md](SECRETS_SETUP_GUIDE.md) for detailed instructions.

## Backend Configuration

### 🚀 Quick Start

**New to backend setup?** Start here: **[QUICK_START_BACKEND.md](QUICK_START_BACKEND.md)** - 5-step guide (~15 minutes)

### 🔐 Setting Up Secrets

The platform requires proper configuration of GitHub Secrets for:
- ✅ Supabase Edge Functions (job-scraper, job-cleanup, seed-jobs)
- ✅ Database Migrations (automatic deployment)
- ✅ PayPal Payment Integration (Pro subscriptions)
- ✅ Optional: AI Chatbot, Error Tracking, Analytics

**Detailed Setup Guides**:
1. **[QUICK_START_BACKEND.md](QUICK_START_BACKEND.md)** - ⚡ Quick 5-step setup (START HERE)
2. **[SECRETS_SETUP_GUIDE.md](SECRETS_SETUP_GUIDE.md)** - Detailed step-by-step instructions
3. **[BACKEND_VERIFICATION_CHECKLIST.md](BACKEND_VERIFICATION_CHECKLIST.md)** - Verify everything works
4. **[REQUIRED_SECRETS.md](REQUIRED_SECRETS.md)** - Complete secrets reference

### ✅ Verification

After configuring secrets, use the [BACKEND_VERIFICATION_CHECKLIST.md](BACKEND_VERIFICATION_CHECKLIST.md) to verify:
- All workflows run successfully
- Edge functions deploy correctly
- PayPal integration works
- Scheduled jobs run automatically

## GitHub Actions Workflows

### Automatic Deployments

- **Deploy to GitHub Pages**: Automatically deploys on push to `main` branch
  - Uses Node.js 20 with npm caching for faster builds
  - Includes all required environment variables for production builds
  - Separate from CI/CD to ensure clean deployments
- **CI/CD Pipeline**: Runs tests, linting, and type checking on PRs
  - Validates code quality before merging
  - Runs security scans with npm audit and Snyk

### Supabase Deployment

- **Deploy Supabase**: Deploys migrations and edge functions
  ```bash
  # Triggered automatically when supabase/ folder changes
  # or run manually from Actions tab
  ```

### Job Seeding

- **Seed Job Listings**: Seeds 50 jobs (25 South African + 25 Nigerian)
  ```bash
  # Run manually from Actions tab
  # Input confirmation: "seed-jobs"
  ```

## Supabase Edge Functions

The platform includes three edge functions:

1. **job-scraper**: Scrapes and imports job listings from partner sites
2. **job-cleanup**: Removes old job listings and maintains database health
3. **seed-jobs**: Seeds initial job listings for testing and demo purposes

## Deployment

### GitHub Pages

The application is deployed as a Single Page Application (SPA) to GitHub Pages on every push to `main`:

```sh
npm run build
# Builds to dist/ folder with:
# - SPA routing support (404.html fallback)
# - Custom domain configuration (CNAME)
# - Jekyll processing disabled (.nojekyll)
# Automatically deployed via GitHub Actions
```

**Deployment Features:**
- ✅ Single Page Application (not a static website)
- ✅ Custom domain: **jobbyist.africa**
- ✅ Client-side routing support
- ✅ Automatic deployments on push to main

### Vercel (Alternative Deployment)

The application can also be deployed to Vercel with full Supabase integration:

```sh
# Using Vercel CLI
vercel --prod

# Or import from GitHub at https://vercel.com
```

**Vercel Configuration:**
- ✅ Automatic builds from GitHub
- ✅ Environment variables configured in `vercel.json`
- ✅ Supabase connection pre-configured
- ✅ Edge Network for optimal performance
- ✅ Preview deployments for all PRs

For detailed Vercel setup instructions, see **[VERCEL_SETUP.md](VERCEL_SETUP.md)**.

### Custom Domain

The application is configured with the custom domain **jobbyist.africa**:
1. CNAME file is automatically included in the build
2. DNS records should point to GitHub Pages
3. HTTPS is automatically configured by GitHub Pages

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is proprietary software owned by Jobbyist.

## Support

For support, email support@jobbyist.africa or visit our [Help Center](https://jobbyist.africa/help).

---

Made with ❤️ for African job seekers
