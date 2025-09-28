import { toast } from '@/components/ui/use-toast';

export interface AppError extends Error {
  code?: string;
  statusCode?: number;
  context?: Record<string, unknown>;
}

export class CustomError extends Error implements AppError {
  code?: string;
  statusCode?: number;
  context?: Record<string, unknown>;

  constructor(
    message: string,
    code?: string,
    statusCode?: number,
    context?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'CustomError';
    this.code = code;
    this.statusCode = statusCode;
    this.context = context;
  }
}

export const handleError = (error: Error | AppError, context?: string) => {
  console.error(`Error${context ? ` in ${context}` : ''}:`, error);

  // Log to external error tracking service if available
  if (import.meta.env.VITE_SENTRY_DSN) {
    // Sentry would be integrated here
  }

  const appError = error as AppError;
  let userMessage = 'An unexpected error occurred';

  // Provide user-friendly error messages based on error type
  switch (appError.code) {
    case 'AUTH_ERROR':
      userMessage = 'Authentication failed. Please try logging in again.';
      break;
    case 'NETWORK_ERROR':
      userMessage = 'Network error. Please check your connection and try again.';
      break;
    case 'VALIDATION_ERROR':
      userMessage = 'Please check your input and try again.';
      break;
    case 'PERMISSION_ERROR':
      userMessage = 'You do not have permission to perform this action.';
      break;
    case 'RATE_LIMIT_ERROR':
      userMessage = 'Too many requests. Please wait a moment and try again.';
      break;
    default:
      if (appError.statusCode === 404) {
        userMessage = 'The requested resource was not found.';
      } else if (appError.statusCode === 500) {
        userMessage = 'Server error. Please try again later.';
      } else if (appError.message && appError.message.length < 100) {
        userMessage = appError.message;
      }
  }

  toast({
    title: 'Error',
    description: userMessage,
    variant: 'destructive',
  });

  return { error: appError, userMessage };
};

export const withErrorHandling = <T extends (...args: unknown[]) => Promise<unknown>>(
  fn: T,
  context?: string
): T => {
  return ((...args: Parameters<T>) => {
    return fn(...args).catch((error: Error) => {
      handleError(error, context);
      throw error;
    });
  }) as T;
};

export const createSupabaseError = (error: unknown): AppError => {
  const errorObj = error as { message?: string; status?: number };
  const customError = new CustomError(
    errorObj.message || 'Database operation failed',
    'SUPABASE_ERROR',
    errorObj.status || 500,
    { originalError: error }
  );
  return customError;
};

export const createNetworkError = (error: unknown): AppError => {
  const errorObj = error as { status?: number };
  const customError = new CustomError(
    'Network request failed',
    'NETWORK_ERROR',
    errorObj.status || 0,
    { originalError: error }
  );
  return customError;
};

export const createValidationError = (message: string, field?: string): AppError => {
  const customError = new CustomError(
    message,
    'VALIDATION_ERROR',
    400,
    { field }
  );
  return customError;
};

export const createAuthError = (message: string): AppError => {
  const customError = new CustomError(
    message,
    'AUTH_ERROR',
    401
  );
  return customError;
};