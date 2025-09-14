# Jobbyist (beta)

## Overview

Jobbyist is a React-based job search platform focused on the South African market. The application combines job listings with audio content, featuring a comprehensive job search interface, audio episode streaming capabilities, and administrative tools for content management. Built with modern web technologies, it provides both job seekers and content consumers with an integrated platform for career development and professional insights.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript for type safety and modern development
- **Build Tool**: Vite for fast development and optimized production builds
- **UI Framework**: Radix UI components with shadcn/ui design system for consistent, accessible interfaces
- **Styling**: Tailwind CSS with custom design tokens and theme support
- **Routing**: React Router for client-side navigation and route management
- **State Management**: React Context for authentication state, React Query for server state management

### Authentication & Authorization
- **Provider**: Supabase Auth for user authentication and session management
- **Strategy**: Email/password authentication with persistent sessions
- **Authorization**: Role-based access control with admin privileges for content management
- **Session Handling**: Automatic token refresh and localStorage persistence

### Data Layer
- **Backend Service**: Supabase for backend-as-a-service functionality
- **Database**: PostgreSQL through Supabase with structured tables for jobs, audio episodes, user profiles, and analytics
- **Real-time**: Supabase real-time subscriptions for live data updates
- **File Storage**: Supabase Storage for audio files and thumbnail images

### Job Search System
- **Data Sources**: Web scraping functionality through Supabase Edge Functions
- **Search & Filtering**: Multi-criteria filtering by location, job type, experience level, skills, and remote options
- **Job Management**: Save/unsave functionality with user-specific job collections
- **Data Processing**: Automated job data extraction and standardization

### Audio Content System
- **Media Player**: Custom-built audio player with full playback controls
- **Features**: Play/pause, volume control, playback speed adjustment, progress tracking
- **Analytics**: User engagement tracking with play counts, likes/dislikes, and listening statistics
- **Content Management**: Admin interface for uploading and managing audio episodes

### Form Management
- **Library**: React Hook Form for performant form handling and validation
- **Validation**: Hookform/resolvers for schema-based validation
- **User Experience**: Real-time validation feedback and error handling

## External Dependencies

### Core Services
- **Supabase**: Complete backend infrastructure including authentication, database, real-time subscriptions, and file storage
- **OpenAI API**: AI-powered content processing and job data enhancement (configured in edge functions)

### Payment Integration
- **PayPal**: Payment processing through PayPal React SDK for premium features or donations

### UI & Styling
- **Radix UI**: Comprehensive component library for accessible, unstyled UI primitives
- **Tailwind CSS**: Utility-first CSS framework for consistent styling
- **Lucide React**: Icon library for consistent iconography
- **shadcn/ui**: Pre-built component system built on Radix UI and Tailwind

### Development Tools
- **TypeScript**: Static typing for improved code quality and developer experience
- **ESLint**: Code linting with React-specific rules and TypeScript support
- **Vite**: Modern build tool for fast development and optimized production builds

### Additional Libraries
- **React Query**: Server state management for caching and synchronization
- **date-fns**: Date manipulation and formatting utilities
- **class-variance-authority**: Utility for managing component variants
- **React Hook Form**: Form state management and validation
- **Embla Carousel**: Carousel/slider functionality for content presentation
