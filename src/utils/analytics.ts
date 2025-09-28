import { config, isFeatureEnabled } from '@/config';

// Analytics event types
export interface AnalyticsEvent {
  action: string;
  category: string;
  label?: string;
  value?: number;
  custom_parameters?: Record<string, unknown>;
}

// User interaction events
export const trackPageView = (pagePath: string, pageTitle?: string) => {
  if (!isFeatureEnabled('enableAnalytics')) return;

  if (typeof gtag !== 'undefined') {
    gtag('config', config.analytics.googleAnalyticsId!, {
      page_path: pagePath,
      page_title: pageTitle,
    });
  }

  // Also track in our custom analytics
  trackCustomEvent({
    action: 'page_view',
    category: 'navigation',
    label: pagePath,
  });
};

export const trackJobSearch = (searchQuery: string, resultsCount: number) => {
  trackCustomEvent({
    action: 'job_search',
    category: 'search',
    label: searchQuery,
    value: resultsCount,
    custom_parameters: {
      search_query: searchQuery,
      results_count: resultsCount,
    },
  });
};

export const trackJobView = (jobId: string, jobTitle: string, company: string) => {
  trackCustomEvent({
    action: 'job_view',
    category: 'jobs',
    label: jobTitle,
    custom_parameters: {
      job_id: jobId,
      job_title: jobTitle,
      company: company,
    },
  });
};

export const trackJobSave = (jobId: string, jobTitle: string) => {
  trackCustomEvent({
    action: 'job_save',
    category: 'jobs',
    label: jobTitle,
    custom_parameters: {
      job_id: jobId,
      job_title: jobTitle,
    },
  });
};

export const trackJobApplication = (jobId: string, jobTitle: string, company: string) => {
  trackCustomEvent({
    action: 'job_application',
    category: 'conversions',
    label: jobTitle,
    value: 1,
    custom_parameters: {
      job_id: jobId,
      job_title: jobTitle,
      company: company,
    },
  });
};

export const trackAudioPlay = (episodeId: string, episodeTitle: string) => {
  trackCustomEvent({
    action: 'audio_play',
    category: 'audio',
    label: episodeTitle,
    custom_parameters: {
      episode_id: episodeId,
      episode_title: episodeTitle,
    },
  });
};

export const trackUserSignup = (method: string) => {
  trackCustomEvent({
    action: 'signup',
    category: 'auth',
    label: method,
    value: 1,
    custom_parameters: {
      signup_method: method,
    },
  });
};

export const trackUserLogin = (method: string) => {
  trackCustomEvent({
    action: 'login',
    category: 'auth',
    label: method,
    custom_parameters: {
      login_method: method,
    },
  });
};

export const trackError = (errorType: string, errorMessage: string, context?: string) => {
  trackCustomEvent({
    action: 'error',
    category: 'errors',
    label: errorType,
    custom_parameters: {
      error_type: errorType,
      error_message: errorMessage,
      context: context,
    },
  });
};

export const trackPerformance = (metric: string, value: number, context?: string) => {
  trackCustomEvent({
    action: 'performance',
    category: 'performance',
    label: metric,
    value: value,
    custom_parameters: {
      metric: metric,
      value: value,
      context: context,
    },
  });
};

export const trackCustomEvent = (event: AnalyticsEvent) => {
  if (!isFeatureEnabled('enableAnalytics')) return;

  // Google Analytics 4
  if (typeof gtag !== 'undefined') {
    gtag('event', event.action, {
      event_category: event.category,
      event_label: event.label,
      value: event.value,
      ...event.custom_parameters,
    });
  }

  // Store in local analytics for internal tracking
  storeLocalAnalytics(event);

  // Send to Supabase for internal analytics
  sendToSupabaseAnalytics(event);
};

// Local analytics storage
const storeLocalAnalytics = (event: AnalyticsEvent) => {
  try {
    const stored = localStorage.getItem('jobbyist_analytics') || '[]';
    const analytics = JSON.parse(stored);
    
    analytics.push({
      ...event,
      timestamp: new Date().toISOString(),
      session_id: getSessionId(),
      user_agent: navigator.userAgent,
      url: window.location.href,
    });

    // Keep only the last 100 events
    if (analytics.length > 100) {
      analytics.splice(0, analytics.length - 100);
    }

    localStorage.setItem('jobbyist_analytics', JSON.stringify(analytics));
  } catch (error) {
    console.error('Failed to store analytics locally:', error);
  }
};

// Send analytics to Supabase
const sendToSupabaseAnalytics = async (event: AnalyticsEvent) => {
  try {
    // This would send to a Supabase function or table for internal analytics
    // Implementation depends on your Supabase setup
    const analyticsData = {
      ...event,
      timestamp: new Date().toISOString(),
      session_id: getSessionId(),
      user_agent: navigator.userAgent,
      url: window.location.href,
    };

    // Example: Send to Supabase function
    // await supabase.functions.invoke('analytics', { body: analyticsData });
  } catch (error) {
    console.error('Failed to send analytics to Supabase:', error);
  }
};

// Session management
let sessionId: string | null = null;

const getSessionId = (): string => {
  if (!sessionId) {
    sessionId = sessionStorage.getItem('jobbyist_session_id');
    if (!sessionId) {
      sessionId = crypto.randomUUID();
      sessionStorage.setItem('jobbyist_session_id', sessionId);
    }
  }
  return sessionId;
};

// Performance monitoring
export const measurePerformance = (name: string, fn: () => void | Promise<void>) => {
  const start = performance.now();
  
  const measure = () => {
    const duration = performance.now() - start;
    trackPerformance(name, Math.round(duration), 'function_execution');
  };

  try {
    const result = fn();
    if (result instanceof Promise) {
      return result.finally(measure);
    } else {
      measure();
      return result;
    }
  } catch (error) {
    measure();
    throw error;
  }
};

// Initialize analytics
export const initAnalytics = () => {
  if (!isFeatureEnabled('enableAnalytics') || !config.analytics.googleAnalyticsId) {
    return;
  }

  // Initialize Google Analytics
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${config.analytics.googleAnalyticsId}`;
  document.head.appendChild(script);

  script.onload = () => {
    window.dataLayer = window.dataLayer || [];
    window.gtag = function(...args: unknown[]) {
      window.dataLayer.push(args);
    };

    gtag('js', new Date());
    gtag('config', config.analytics.googleAnalyticsId!, {
      page_title: document.title,
      page_location: window.location.href,
    });
  };

  // Track initial page view
  trackPageView(window.location.pathname, document.title);

  // Set up performance observer
  if ('PerformanceObserver' in window) {
    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        if (entry.entryType === 'navigation') {
          const navEntry = entry as PerformanceNavigationTiming;
          trackPerformance('page_load_time', Math.round(navEntry.loadEventEnd - navEntry.loadEventStart), 'navigation');
        }
      });
    });
    
    observer.observe({ entryTypes: ['navigation'] });
  }
};

// Export for global access
declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (...args: unknown[]) => void;
  }
}

export default {
  init: initAnalytics,
  trackPageView,
  trackJobSearch,
  trackJobView,
  trackJobSave,
  trackJobApplication,
  trackAudioPlay,
  trackUserSignup,
  trackUserLogin,
  trackError,
  trackPerformance,
  trackCustomEvent,
  measurePerformance,
};