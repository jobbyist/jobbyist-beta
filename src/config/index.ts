interface AppConfig {
  app: {
    name: string;
    version: string;
    environment: 'development' | 'staging' | 'production';
    baseUrl: string;
  };
  supabase: {
    url: string;
    anonKey: string;
    projectId: string;
  };
  paypal: {
    clientId: string;
    environment: 'sandbox' | 'production';
  };
  openai: {
    apiKey?: string;
  };
  analytics: {
    googleAnalyticsId?: string;
  };
  features: {
    enableAudioPlayer: boolean;
    enableJobScraping: boolean;
    enablePremiumFeatures: boolean;
    enableAnalytics: boolean;
    maxJobsPerPage: number;
    maxSearchResults: number;
  };
  rateLimit: {
    searchRequests: {
      maxRequests: number;
      windowMs: number;
    };
    jobApplications: {
      maxRequests: number;
      windowMs: number;
    };
  };
}

// Validate required environment variables
const validateEnvVars = () => {
  const required = [
    'VITE_SUPABASE_URL',
    'VITE_SUPABASE_PUBLISHABLE_KEY',
    'VITE_SUPABASE_PROJECT_ID',
  ];

  const missing = required.filter(key => !import.meta.env[key]);
  
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
};

// Initialize configuration
const initializeConfig = (): AppConfig => {
  validateEnvVars();

  const environment = (import.meta.env.VITE_APP_ENV || 'development') as AppConfig['app']['environment'];
  
  return {
    app: {
      name: import.meta.env.VITE_APP_NAME || 'Jobbyist',
      version: import.meta.env.VITE_APP_VERSION || '1.0.0',
      environment,
      baseUrl: environment === 'production' 
        ? 'https://jobbyist.github.io' 
        : window.location.origin,
    },
    supabase: {
      url: import.meta.env.VITE_SUPABASE_URL,
      anonKey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
      projectId: import.meta.env.VITE_SUPABASE_PROJECT_ID,
    },
    paypal: {
      clientId: import.meta.env.VITE_PAYPAL_CLIENT_ID || 'demo-client-id',
      environment: environment === 'production' ? 'production' : 'sandbox',
    },
    openai: {
      apiKey: import.meta.env.VITE_OPENAI_API_KEY,
    },
    analytics: {
      googleAnalyticsId: import.meta.env.VITE_GOOGLE_ANALYTICS_ID,
    },
    features: {
      enableAudioPlayer: true,
      enableJobScraping: environment !== 'development',
      enablePremiumFeatures: environment === 'production',
      enableAnalytics: environment === 'production' && Boolean(import.meta.env.VITE_GOOGLE_ANALYTICS_ID),
      maxJobsPerPage: 20,
      maxSearchResults: 100,
    },
    rateLimit: {
      searchRequests: {
        maxRequests: environment === 'production' ? 100 : 1000,
        windowMs: 60 * 1000, // 1 minute
      },
      jobApplications: {
        maxRequests: environment === 'production' ? 10 : 100,
        windowMs: 60 * 60 * 1000, // 1 hour
      },
    },
  };
};

export const config = initializeConfig();

// Utility functions
export const isDevelopment = () => config.app.environment === 'development';
export const isProduction = () => config.app.environment === 'production';
export const isStaging = () => config.app.environment === 'staging';

export const getApiUrl = (endpoint: string) => {
  return `${config.supabase.url}/rest/v1/${endpoint}`;
};

export const getFunctionUrl = (functionName: string) => {
  return `${config.supabase.url}/functions/v1/${functionName}`;
};

// Feature flags
export const isFeatureEnabled = (feature: keyof typeof config.features) => {
  return config.features[feature];
};

// Debug utilities
export const logConfig = () => {
  if (isDevelopment()) {
    console.log('App Configuration:', {
      ...config,
      supabase: {
        ...config.supabase,
        anonKey: config.supabase.anonKey.substring(0, 20) + '...',
      },
      paypal: {
        ...config.paypal,
        clientId: config.paypal.clientId.substring(0, 10) + '...',
      },
      openai: {
        apiKey: config.openai.apiKey ? config.openai.apiKey.substring(0, 10) + '...' : 'Not set',
      },
    });
  }
};

export default config;