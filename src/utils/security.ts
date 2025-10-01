import { createRateLimiter } from './validation';
import DOMPurify from 'dompurify';

// Rate limiters for different operations
export const searchRateLimit = createRateLimiter(100, 60 * 1000); // 100 requests per minute
export const authRateLimit = createRateLimiter(5, 15 * 60 * 1000); // 5 attempts per 15 minutes
export const applicationRateLimit = createRateLimiter(10, 60 * 60 * 1000); // 10 applications per hour

// Input sanitization functions using DOMPurify to prevent DOM-based XSS
export const sanitizeHTML = (html: string): string => {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: [], // Strip all HTML tags by default
    ALLOWED_ATTR: [],
    KEEP_CONTENT: true
  });
};

export const sanitizeInput = (input: string): string => {
  // Use DOMPurify to sanitize against DOM-based XSS attacks
  const sanitized = sanitizeHTML(input);
  return sanitized
    .trim()
    .substring(0, 1000); // Limit length
};

export const sanitizeEmail = (email: string): string => {
  // Use DOMPurify first to prevent XSS
  const sanitized = sanitizeHTML(email);
  return sanitized
    .toLowerCase()
    .trim()
    .replace(/[^a-zA-Z0-9@._-]/g, '') // Only allow valid email characters
    .substring(0, 254); // RFC 5321 limit
};

export const sanitizeSearchQuery = (query: string): string => {
  // Use DOMPurify to prevent DOM-based XSS in search queries
  const sanitized = sanitizeHTML(query);
  return sanitized
    .trim()
    .replace(/\s+/g, ' ') // Normalize whitespace
    .substring(0, 100); // Reasonable search length limit
};

// Content Security Policy configuration
export const getCSPHeader = (): string => {
  const isDevelopment = import.meta.env.MODE === 'development';
  
  const baseCSP = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.paypal.com https://js.paypal.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: https: blob:",
    "media-src 'self' https:",
    "connect-src 'self' https://*.supabase.co https://api.openai.com https://www.paypal.com https://js.paypal.com https://www.google-analytics.com",
    "frame-src https://www.paypal.com https://js.paypal.com",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self' https://www.paypal.com",
    "frame-ancestors 'none'",
    "upgrade-insecure-requests"
  ];

  if (isDevelopment) {
    // More permissive CSP for development
    baseCSP[1] = "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.paypal.com https://js.paypal.com";
    baseCSP.push("connect-src 'self' ws: wss: https://*.supabase.co https://api.openai.com https://www.paypal.com https://js.paypal.com https://www.google-analytics.com");
  }

  return baseCSP.join('; ');
};

// Security headers configuration
export const getSecurityHeaders = () => {
  return {
    'Content-Security-Policy': getCSPHeader(),
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload'
  };
};

// Validate user input for potential security threats
export const validateInputSecurity = (input: string): { isValid: boolean; reason?: string } => {
  // Check for common injection patterns
  const sqlInjectionPattern = /(union|select|insert|update|delete|drop|create|alter|exec|script)/i;
  const xssPattern = /<script|javascript:|data:text\/html|vbscript:|onload|onerror|onclick/i;
  const pathTraversalPattern = /\.\.[/\\]/;

  if (sqlInjectionPattern.test(input)) {
    return { isValid: false, reason: 'Potential SQL injection detected' };
  }

  if (xssPattern.test(input)) {
    return { isValid: false, reason: 'Potential XSS attempt detected' };
  }

  if (pathTraversalPattern.test(input)) {
    return { isValid: false, reason: 'Path traversal attempt detected' };
  }

  if (input.length > 10000) {
    return { isValid: false, reason: 'Input too long' };
  }

  return { isValid: true };
};

// Generate secure random tokens
export const generateSecureToken = (length: number = 32): string => {
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
};

// Password strength validation
export const validatePasswordStrength = (password: string): {
  isStrong: boolean;
  score: number;
  feedback: string[];
} => {
  const feedback: string[] = [];
  let score = 0;

  // Length check
  if (password.length >= 12) {
    score += 2;
  } else if (password.length >= 8) {
    score += 1;
  } else {
    feedback.push('Password should be at least 8 characters long');
  }

  // Character variety checks
  if (/[a-z]/.test(password)) score += 1;
  else feedback.push('Include lowercase letters');

  if (/[A-Z]/.test(password)) score += 1;
  else feedback.push('Include uppercase letters');

  if (/[0-9]/.test(password)) score += 1;
  else feedback.push('Include numbers');

  if (/[^A-Za-z0-9]/.test(password)) score += 1;
  else feedback.push('Include special characters');

  // Common password patterns (weak)
  const commonPatterns = [
    /123456/,
    /password/i,
    /qwerty/i,
    /admin/i,
    /^(.)\1+$/, // All same character
  ];

  if (commonPatterns.some(pattern => pattern.test(password))) {
    score -= 2;
    feedback.push('Avoid common passwords and patterns');
  }

  const isStrong = score >= 5 && feedback.length === 0;
  
  return { isStrong, score: Math.max(0, score), feedback };
};

// Session security utilities
export const generateSessionId = (): string => {
  return generateSecureToken(64);
};

export const isValidSession = (sessionId: string): boolean => {
  // Basic session ID validation
  return /^[a-f0-9]{128}$/.test(sessionId);
};

// API request signing (for critical operations)
export const signRequest = async (data: string, secret: string): Promise<string> => {
  const encoder = new TextEncoder();
  const keyData = encoder.encode(secret);
  const messageData = encoder.encode(data);

  const key = await crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );

  const signature = await crypto.subtle.sign('HMAC', key, messageData);
  return Array.from(new Uint8Array(signature))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
};

export const verifySignature = async (
  data: string,
  signature: string,
  secret: string
): Promise<boolean> => {
  try {
    const expectedSignature = await signRequest(data, secret);
    return signature === expectedSignature;
  } catch {
    return false;
  }
};

// Data encryption utilities (for sensitive local storage)
export const encryptData = async (data: string, password: string): Promise<string> => {
  const encoder = new TextEncoder();
  const salt = crypto.getRandomValues(new Uint8Array(16));
  
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(password),
    'PBKDF2',
    false,
    ['deriveBits', 'deriveKey']
  );

  const derivedKey = await crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: salt,
      iterations: 100000,
      hash: 'SHA-256'
    },
    key,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt']
  );

  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encodedData = encoder.encode(data);

  const encrypted = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv: iv },
    derivedKey,
    encodedData
  );

  const result = new Uint8Array(salt.length + iv.length + encrypted.byteLength);
  result.set(salt, 0);
  result.set(iv, salt.length);
  result.set(new Uint8Array(encrypted), salt.length + iv.length);

  return btoa(String.fromCharCode(...result));
};

export const decryptData = async (encryptedData: string, password: string): Promise<string> => {
  try {
    const data = new Uint8Array(
      atob(encryptedData)
        .split('')
        .map(char => char.charCodeAt(0))
    );

    const salt = data.slice(0, 16);
    const iv = data.slice(16, 28);
    const encrypted = data.slice(28);

    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      'raw',
      encoder.encode(password),
      'PBKDF2',
      false,
      ['deriveBits', 'deriveKey']
    );

    const derivedKey = await crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt: salt,
        iterations: 100000,
        hash: 'SHA-256'
      },
      key,
      { name: 'AES-GCM', length: 256 },
      false,
      ['decrypt']
    );

    const decrypted = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv: iv },
      derivedKey,
      encrypted
    );

    return new TextDecoder().decode(decrypted);
  } catch {
    throw new Error('Failed to decrypt data');
  }
};

// Security audit logging
export const logSecurityEvent = (event: {
  type: 'auth_failure' | 'rate_limit' | 'input_validation' | 'security_violation';
  message: string;
  userId?: string;
  ip?: string;
  userAgent?: string;
  timestamp?: string;
}) => {
  const logEntry = {
    ...event,
    timestamp: event.timestamp || new Date().toISOString(),
    ip: event.ip || 'unknown',
    userAgent: event.userAgent || navigator.userAgent,
  };

  // In production, this should be sent to a secure logging service
  console.warn('Security Event:', logEntry);

  // Store in local storage for debugging (development only)
  if (import.meta.env.MODE === 'development') {
    const logs = JSON.parse(localStorage.getItem('security_logs') || '[]');
    logs.push(logEntry);
    // Keep only last 100 entries
    if (logs.length > 100) logs.splice(0, logs.length - 100);
    localStorage.setItem('security_logs', JSON.stringify(logs));
  }
};

export default {
  sanitizeHTML,
  sanitizeInput,
  sanitizeEmail,
  sanitizeSearchQuery,
  getCSPHeader,
  getSecurityHeaders,
  validateInputSecurity,
  generateSecureToken,
  validatePasswordStrength,
  generateSessionId,
  isValidSession,
  signRequest,
  verifySignature,
  encryptData,
  decryptData,
  logSecurityEvent,
  searchRateLimit,
  authRateLimit,
  applicationRateLimit,
};