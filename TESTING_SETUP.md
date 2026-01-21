# Testing Framework Setup Guide

This guide explains how to set up and use the testing framework for the Parinay project.

## Quick Start

### 1. Install Dependencies

From the project root:

```bash
npm install
cd backend && npm install && cd ..
cd parinay && npm install && cd ..
```

Or use the convenience script:

```bash
npm run install:all
```

### 2. Install Playwright Browsers (for E2E tests)

```bash
npx playwright install
```

### 3. Run Tests

```bash
# Run all tests
npm test

# Run specific test suites
npm run test:backend
npm run test:frontend
npm run test:e2e
```

## What's Included

### ✅ Backend Testing (Jest + Supertest)
- Unit tests for models
- Integration tests for API routes
- In-memory MongoDB for isolated testing
- Coverage reporting

**Location**: `backend/__tests__/`

### ✅ Frontend Testing (Jasmine + Karma)
- Component unit tests
- Service tests
- Already configured with Angular CLI

**Location**: `parinay/src/app/**/*.spec.ts`

### ✅ E2E Testing (Playwright)
- End-to-end browser tests
- Multi-browser support (Chrome, Firefox, Safari)
- Mobile viewport testing
- Screenshots and videos on failure

**Location**: `tests/e2e/`

## Test Configuration

### Jest Configuration (`jest.config.js`)
- Test environment: Node.js
- Coverage directory: `coverage/backend`
- Setup file: `tests/setup/jest.setup.js`

### Playwright Configuration (`playwright.config.ts`)
- Base URL: `http://localhost:4200`
- Auto-starts Angular dev server
- Supports Chromium, Firefox, WebKit
- Mobile device testing included

## Writing New Tests

### Backend Test Example

Create a file in `backend/__tests__/`:

```javascript
const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

process.env.NODE_ENV = 'test';
const app = require('../server');

describe('My Feature', () => {
  let mongoServer;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri());
  });

  afterAll(async () => {
    await mongoose.connection.close();
    await mongoServer.stop();
  });

  test('should do something', async () => {
    const response = await request(app)
      .get('/api/myroute')
      .expect(200);
    
    expect(response.body).toBeDefined();
  });
});
```

### E2E Test Example

Create a file in `tests/e2e/`:

```typescript
import { test, expect } from '@playwright/test';

test.describe('My Feature', () => {
  test('should work in browser', async ({ page }) => {
    await page.goto('/my-feature');
    await expect(page.locator('h1')).toBeVisible();
  });
});
```

## Test Scripts Reference

| Command | Description |
|---------|-------------|
| `npm test` | Run all tests (backend + frontend) |
| `npm run test:backend` | Run backend tests only |
| `npm run test:frontend` | Run frontend tests (headless) |
| `npm run test:e2e` | Run E2E tests |
| `npm run test:e2e:ui` | Run E2E tests with Playwright UI |
| `npm run test:coverage` | Generate coverage reports |
| `npm run test:all` | Run all tests including E2E |

## Coverage Reports

After running coverage tests, reports are generated in:

- **Backend**: `coverage/backend/`
- **Frontend**: `parinay/coverage/`
- **E2E**: HTML report in `playwright-report/`

View HTML coverage:
```bash
# Backend
open coverage/backend/index.html

# Frontend
open parinay/coverage/index.html

# E2E
open playwright-report/index.html
```

## Troubleshooting

### Backend Tests Fail
- **Issue**: MongoDB connection errors
- **Solution**: Ensure `mongodb-memory-server` is installed:
  ```bash
  cd backend && npm install mongodb-memory-server --save-dev
  ```

### Frontend Tests Fail
- **Issue**: Chrome/Chromium not found
- **Solution**: Install Chromium:
  ```bash
  npm install -g puppeteer
  ```

### E2E Tests Fail
- **Issue**: Angular dev server not starting
- **Solution**: 
  1. Ensure Angular app runs on port 4200
  2. Check if port is already in use
  3. Try: `cd parinay && npm start` manually

### Port Conflicts
- **Issue**: Port 4200 or 5000 already in use
- **Solution**: 
  - Kill process using the port
  - Or change port in `playwright.config.ts` (for frontend)
  - Or change PORT in backend `.env`

## CI/CD Integration

The test framework is ready for CI/CD pipelines:

```yaml
# Example GitHub Actions workflow
- name: Run Tests
  run: |
    npm install
    npm run install:all
    npx playwright install --with-deps
    npm run test:all
```

## Next Steps

1. ✅ Install dependencies
2. ✅ Run initial tests to verify setup
3. ✅ Write tests for new features
4. ✅ Set up CI/CD pipeline
5. ✅ Monitor coverage metrics

For detailed documentation, see `tests/README.md`.
