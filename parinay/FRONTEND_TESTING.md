# Frontend Testing Framework - Quick Reference

## Overview

The Angular frontend uses **Jasmine** and **Karma** for unit and integration testing, following Angular testing best practices.

## Test Configuration Files

- `karma.conf.js` - Karma test runner configuration
- `angular.json` - Angular CLI test configuration
- `tsconfig.spec.json` - TypeScript configuration for tests
- `src/test-setup.ts` - Global test environment setup

## Quick Start

### Install Dependencies

```bash
cd parinay
npm install
```

### Run Tests

```bash
# Watch mode (default)
npm test

# Single run (headless)
npm run test:headless

# With coverage
npm run test:coverage

# CI mode
npm run test:ci
```

## Test Scripts

| Command | Description |
|---------|-------------|
| `npm test` | Run tests in watch mode |
| `npm run test:watch` | Run tests in watch mode (explicit) |
| `npm run test:ci` | Run tests once for CI/CD |
| `npm run test:coverage` | Generate coverage reports |
| `npm run test:headless` | Run tests headless (no browser UI) |

## Project Structure

```
parinay/
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   └── *.component.spec.ts
│   │   ├── services/
│   │   │   └── *.service.spec.ts
│   │   ├── pages/
│   │   │   └── *.component.spec.ts
│   │   └── testing/
│   │       ├── test-utils.ts      # Testing utilities
│   │       └── README.md          # Detailed guide
│   └── test-setup.ts              # Global setup
├── karma.conf.js                  # Karma configuration
└── coverage/                      # Coverage reports (generated)
```

## Test Examples

### Service Test

```typescript
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MyService } from './my.service';

describe('MyService', () => {
  let service: MyService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(MyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
```

### Component Test

```typescript
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MyComponent } from './my.component';

describe('MyComponent', () => {
  let component: MyComponent;
  let fixture: ComponentFixture<MyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(MyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
```

## Coverage Reports

Coverage reports are generated in `coverage/` directory after running:

```bash
npm run test:coverage
```

Open `coverage/index.html` in a browser to view detailed coverage.

### Coverage Goals

- **Statements**: 60%+
- **Branches**: 60%+
- **Functions**: 60%+
- **Lines**: 60%+

## Testing Utilities

Located in `src/app/testing/test-utils.ts`:

- `configureTestModule()` - Common test module setup
- `createComponent()` - Create component with full setup
- `getHttpTestingController()` - Get HTTP testing controller
- `MockLocalStorage` - Mock localStorage for tests

## Best Practices

1. ✅ **Isolate Tests**: Each test should be independent
2. ✅ **Use TestBed**: Configure testing module properly
3. ✅ **Mock Dependencies**: Use HttpClientTestingModule for HTTP
4. ✅ **Test Behavior**: Focus on what components do, not how
5. ✅ **Clean Up**: Use `afterEach` for cleanup if needed
6. ✅ **Descriptive Names**: Use clear test descriptions

## Common Testing Scenarios

### Testing HTTP Services

```typescript
import { HttpTestingController } from '@angular/common/http/testing';

let httpMock: HttpTestingController;

beforeEach(() => {
  httpMock = TestBed.inject(HttpTestingController);
});

afterEach(() => {
  httpMock.verify(); // Verify no pending requests
});

it('should fetch data', () => {
  service.getData().subscribe(data => {
    expect(data).toBeDefined();
  });

  const req = httpMock.expectOne('/api/data');
  req.flush({ id: 1, name: 'Test' });
});
```

### Testing Forms

```typescript
import { ReactiveFormsModule } from '@angular/forms';

beforeEach(async () => {
  await TestBed.configureTestingModule({
    imports: [MyComponent, ReactiveFormsModule]
  }).compileComponents();
});
```

### Testing Router

```typescript
import { RouterTestingModule } from '@angular/router/testing';

beforeEach(async () => {
  await TestBed.configureTestingModule({
    imports: [MyComponent, RouterTestingModule]
  }).compileComponents();
});
```

### Testing Async Operations

```typescript
it('should handle async', async () => {
  await component.loadData();
  expect(component.data).toBeDefined();
});
```

## Debugging Tests

1. **Browser Debug**: Tests run in browser - use DevTools
2. **Console Logs**: `console.log()` works in tests
3. **Debugger**: Use `debugger` statement to pause
4. **Karma Debug**: Click "Debug" button in Karma UI

## Resources

- **Detailed Guide**: See `src/app/testing/README.md`
- **Angular Testing**: https://angular.dev/guide/testing
- **Jasmine Docs**: https://jasmine.github.io/
- **Karma Docs**: https://karma-runner.github.io/

## Troubleshooting

### Tests Not Running
- Check if `karma.conf.js` exists
- Verify `angular.json` test configuration
- Ensure dependencies are installed

### Coverage Not Generating
- Run `npm run test:coverage`
- Check `angular.json` codeCoverage settings
- Verify `karma-coverage` is installed

### Import Errors
- Check `tsconfig.spec.json` includes test files
- Verify path aliases in `tsconfig.json`
- Ensure proper module imports

### Browser Not Launching
- Install Chrome/Chromium
- Check `karma-chrome-launcher` is installed
- Try headless mode: `npm run test:headless`
