# Jobbyist Beta - Africa's Premier Job Discovery Platform

[![Deploy to GitHub Pages](https://github.com/jobbyist/jobbyist-beta/actions/workflows/deploy.yml/badge.svg)](https://github.com/jobbyist/jobbyist-beta/actions/workflows/deploy.yml)
[![CI/CD Pipeline](https://github.com/jobbyist/jobbyist-beta/actions/workflows/ci.yml/badge.svg)](https://github.com/jobbyist/jobbyist-beta/actions/workflows/ci.yml)

## About

Jobbyist is a comprehensive job discovery and career management platform designed specifically for the African job market. The platform connects job seekers with verified companies across South Africa, Nigeria, and other African countries.

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
- **Deployment**: GitHub Pages
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

Create a `.env` file in the root directory:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_publishable_key
VITE_SUPABASE_PROJECT_ID=your_project_id
VITE_PAYPAL_CLIENT_ID=your_paypal_client_id
```

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

### Custom Domain

The application is configured with the custom domain **jobbyist.africa**:
1. CNAME file is automatically included in the build
2. DNS records should point to GitHub Pages
3. HTTPS is automatically configured by GitHub Pages

### PR Redeployment

A redeployment workflow is available to redeploy the last 5 pull requests (#20-24) with the current build configuration:

```sh
# Via GitHub Actions UI:
Actions → Redeploy Pull Request → Run workflow
```

**Options:**
- Deploy individual PRs (select PR number 20-24)
- Deploy all 5 PRs sequentially (check the batch option)

**Documentation:**
- 📖 [Quick Reference](./QUICK_REDEPLOY.md) - Fast instructions
- 📚 [Complete Guide](./REDEPLOY_GUIDE.md) - Detailed documentation
- 🔧 [Implementation Details](./PR_REDEPLOY_IMPLEMENTATION.md) - Technical overview

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
