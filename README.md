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

The application is automatically deployed to GitHub Pages on every push to `main`:

```sh
npm run build
# Builds to dist/ folder
# Automatically deployed via GitHub Actions
```

### Custom Domain

To connect a custom domain:
1. Navigate to repository Settings > Pages
2. Add your custom domain
3. Configure DNS records as instructed

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
