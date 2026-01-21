/**
 * Jest Setup File
 * Runs before all tests
 */

// Increase timeout for async operations
jest.setTimeout(10000);

// Mock console methods to reduce noise in tests (optional)
// global.console = {
//   ...console,
//   log: jest.fn(),
//   debug: jest.fn(),
//   info: jest.fn(),
//   warn: jest.fn(),
//   error: jest.fn(),
// };

// Global test utilities
global.testUtils = {
  // Helper to wait for async operations
  wait: (ms) => new Promise(resolve => setTimeout(resolve, ms)),
};

// Clean up after all tests
afterAll(async () => {
  // Close any open connections, clear timers, etc.
  await new Promise(resolve => setTimeout(resolve, 500));
});
