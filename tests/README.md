# Testing Framework Documentation

This directory contains the testing setup for the Parinay platform, covering frontend (Angular), backend (Express), and end-to-end (E2E) tests.

## Test Structure

```
Parinay-main/
├── tests/
│   ├── e2e/              # Playwright E2E tests
│   │   ├── auth.spec.ts
│   │   └── homepage.spec.ts
│   └── setup/            # Test setup files
│       └── jest.setup.js
├── backend/
│   └── __tests__/        # Backend unit/integration tests
│       ├── auth.test.js
│       └── models/
│           └── user.test.js
└── parinay/
    └── src/
        └── app/
            └── **/*.spec.ts  # Angular component tests
```

## Running Tests

### All Tests
```bash
# From project root
npm test
```

### Backend Tests Only
```bash
npm run test:backend

# Or from backend directory
cd backend && npm test
```

### Frontend Tests Only
```bash
npm run test:frontend

# Or from parinay directory
cd parinay && npm test
```

### E2E Tests
```bash
# Run all E2E tests
npm run test:e2e

# Run with UI mode
npm run test:e2e:ui

# Run in headed mode (see browser)
npm run test:e2e:headed
```

### Coverage Reports
```bash
# All coverage reports
npm run test:coverage

# Backend coverage only
npm run test:backend:coverage

# Frontend coverage only
npm run test:frontend:coverage
```

## Test Types

### 1. Backend Tests (Jest + Supertest)
- **Location**: `backend/__tests__/`
- **Framework**: Jest with Supertest for API testing
- **Database**: Uses MongoDB Memory Server for isolated tests
- **Coverage**: Available via Jest coverage reports

**Example Test**:
```javascript
test('should register a new user', async () => {
  const response = await request(app)
    .post('/api/auth/register')
    .send(userData)
    .expect(201);
});
```

### 2. Frontend Tests (Jasmine + Karma)
- **Location**: `parinay/src/app/**/*.spec.ts`
- **Framework**: Jasmine with Karma test runner
- **Coverage**: Available via Angular CLI coverage

**Example Test**:
```typescript
it('should create the app', () => {
  expect(component).toBeTruthy();
});
```

### 3. E2E Tests (Playwright)
- **Location**: `tests/e2e/`
- **Framework**: Playwright
- **Browsers**: Chromium, Firefox, WebKit
- **Features**: Screenshots, videos, traces on failure

**Example Test**:
```typescript
test('should display login form', async ({ page }) => {
  await page.goto('/login');
  await expect(page.locator('input[type="email"]')).toBeVisible();
});
```

## Configuration Files

- **`jest.config.js`**: Jest configuration for backend tests
- **`playwright.config.ts`**: Playwright E2E test configuration
- **`tests/setup/jest.setup.js`**: Global Jest setup

## Writing Tests

### Backend Test Example
```javascript
// backend/__tests__/routes/myRoute.test.js
const request = require('supertest');
const app = require('../../server');

describe('My Route', () => {
  test('should handle GET request', async () => {
    const response = await request(app)
      .get('/api/myroute')
      .expect(200);
    
    expect(response.body).toBeDefined();
  });
});
```

### E2E Test Example
```typescript
// tests/e2e/my-feature.spec.ts
import { test, expect } from '@playwright/test';

test.describe('My Feature', () => {
  test('should work correctly', async ({ page }) => {
    await page.goto('/my-feature');
    await expect(page.locator('h1')).toContainText('My Feature');
  });
});
```

## Best Practices

1. **Isolated Tests**: Each test should be independent and not rely on others
2. **Clean State**: Use `beforeEach`/`afterEach` to reset test state
3. **Mock External Services**: Use mocks for API calls, databases, etc.
4. **Meaningful Names**: Use descriptive test names
5. **Assertions**: Use specific assertions (not just truthy checks)
6. **Async Handling**: Properly await async operations

## CI/CD Integration

The test framework is CI-ready:
- Backend tests run with Jest
- Frontend tests run headless with Karma
- E2E tests run in CI mode (retries enabled)
- Coverage reports generated automatically

## Troubleshooting

### Backend Tests
- **MongoDB Connection Issues**: Ensure MongoDB Memory Server is properly installed
- **Port Conflicts**: Change port in test setup if 5000 is in use

### E2E Tests
- **Browser Installation**: Run `npx playwright install` if browsers are missing
- **Server Not Starting**: Ensure frontend can start on port 4200
- **Timeout Issues**: Increase timeout in `playwright.config.ts`

### Frontend Tests
- **Karma Not Starting**: Check if Chrome/Chromium is installed
- **Module Resolution**: Verify `tsconfig.spec.json` configuration

## Coverage Goals

- Backend: Aim for 70%+ coverage
- Frontend: Aim for 60%+ coverage for components
- E2E: Cover critical user flows

## Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Playwright Documentation](https://playwright.dev/docs/intro)
- [Angular Testing Guide](https://angular.dev/guide/testing)
- [Supertest Documentation](https://github.com/visionmedia/supertest)
