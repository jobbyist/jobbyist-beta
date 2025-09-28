import { beforeAll, afterEach, afterAll } from 'vitest';
import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';

// Mock environment variables
Object.defineProperty(window, 'location', {
  value: {
    origin: 'http://localhost:3000',
    href: 'http://localhost:3000',
  },
  writable: true,
});

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Mock sessionStorage
const sessionStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
Object.defineProperty(window, 'sessionStorage', {
  value: sessionStorageMock,
});

// Mock alert and confirm
Object.defineProperty(window, 'alert', {
  value: vi.fn(),
});

Object.defineProperty(window, 'confirm', {
  value: vi.fn(() => true),
});

// Mock fetch
global.fetch = vi.fn();

beforeAll(() => {
  // Setup global test configuration
});

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

afterAll(() => {
  // Cleanup after all tests
});