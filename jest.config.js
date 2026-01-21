module.exports = {
  // Test environment
  testEnvironment: 'node',
  
  // Root directory
  rootDir: './backend',
  
  // Test file patterns
  testMatch: [
    '**/__tests__/**/*.js',
    '**/?(*.)+(spec|test).js'
  ],
  
  // Coverage configuration
  collectCoverage: false,
  coverageDirectory: '../coverage/backend',
  collectCoverageFrom: [
    '**/*.js',
    '!**/node_modules/**',
    '!**/coverage/**',
    '!**/jest.config.js',
    '!**/server.js'
  ],
  
  // Coverage thresholds (optional - uncomment to enforce)
  // coverageThreshold: {
  //   global: {
  //     branches: 70,
  //     functions: 70,
  //     lines: 70,
  //     statements: 70
  //   }
  // },
  
  // Module paths
  moduleDirectories: ['node_modules'],
  
  // Setup files
  setupFilesAfterEnv: ['<rootDir>/../tests/setup/jest.setup.js'],
  
  // Clear mocks between tests
  clearMocks: true,
  
  // Verbose output
  verbose: true,
  
  // Transform files (if using TypeScript or ES modules)
  transform: {},
  
  // Ignore patterns
  testPathIgnorePatterns: [
    '/node_modules/',
    '/coverage/'
  ],
  
  // Handle module resolution
  moduleFileExtensions: ['js', 'json']
};
