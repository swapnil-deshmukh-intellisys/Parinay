# Angular Testing Guide

This guide covers testing practices for the Parinay Angular application.

## Testing Stack

- **Jasmine**: Test framework
- **Karma**: Test runner
- **Angular Testing Utilities**: `TestBed`, `ComponentFixture`
- **HttpClientTestingModule**: For testing HTTP services
- **RouterTestingModule**: For testing routing
- **@testing-library/angular**: Enhanced component testing (optional)

## Test Structure

```
src/
├── app/
│   ├── components/
│   │   └── *.component.spec.ts
│   ├── services/
│   │   └── *.service.spec.ts
│   └── testing/
│       ├── test-utils.ts      # Testing utilities
│       └── README.md          # This file
└── test-setup.ts              # Global test setup
```

## Running Tests

```bash
# Run tests in watch mode (default)
npm test

# Run tests once
npm run test:headless

# Run tests with coverage
npm run test:coverage

# Run tests in CI mode
npm run test:ci
```

## Writing Tests

### Component Tests

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

### Service Tests with HTTP

```typescript
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { MyService } from './my.service';

describe('MyService', () => {
  let service: MyService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [MyService]
    });
    service = TestBed.inject(MyService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should fetch data', () => {
    const mockData = { id: 1, name: 'Test' };

    service.getData().subscribe(data => {
      expect(data).toEqual(mockData);
    });

    const req = httpMock.expectOne('/api/data');
    expect(req.request.method).toBe('GET');
    req.flush(mockData);
  });
});
```

### Testing with Router

```typescript
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';

describe('Component with Router', () => {
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        MyComponent,
        RouterTestingModule.withRoutes([])
      ]
    }).compileComponents();

    router = TestBed.inject(Router);
  });
});
```

### Testing with Forms

```typescript
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

beforeEach(async () => {
  await TestBed.configureTestingModule({
    imports: [
      MyComponent,
      ReactiveFormsModule,
      FormsModule
    ]
  }).compileComponents();
});
```

## Using Test Utilities

The `test-utils.ts` file provides helper functions:

```typescript
import { configureTestModule, createComponent, getHttpTestingController } from '../testing/test-utils';

// Configure test module with common imports
beforeEach(async () => {
  await TestBed.configureTestingModule(
    configureTestModule([MyComponent])
  ).compileComponents();
});

// Create component with full setup
const fixture = await createComponent(MyComponent);

// Get HTTP testing controller
const httpMock = getHttpTestingController();
```

## Best Practices

### 1. Test Isolation
- Each test should be independent
- Use `beforeEach` to set up fresh state
- Clean up in `afterEach` if needed

### 2. Test Structure
- Follow AAA pattern: Arrange, Act, Assert
- Use descriptive test names
- Group related tests with `describe` blocks

### 3. Mocking
- Mock HTTP calls with `HttpTestingController`
- Mock router with `RouterTestingModule`
- Use `jasmine.createSpyObj` for service mocks

### 4. Async Testing
```typescript
it('should handle async operations', async () => {
  const promise = component.loadData();
  fixture.detectChanges();
  await promise;
  expect(component.data).toBeDefined();
});
```

### 5. Component Testing
- Test component logic, not implementation details
- Use `fixture.detectChanges()` to trigger change detection
- Query elements with `fixture.nativeElement` or `fixture.debugElement`

### 6. Service Testing
- Always verify HTTP requests with `httpMock.verify()`
- Test both success and error scenarios
- Use `HttpTestingController.expectOne()` for single requests

## Coverage Goals

- **Statements**: 60%+
- **Branches**: 60%+
- **Functions**: 60%+
- **Lines**: 60%+

View coverage reports:
```bash
npm run test:coverage
# Open coverage/index.html in browser
```

## Common Patterns

### Testing HTTP Errors
```typescript
service.getData().subscribe({
  next: () => fail('should have failed'),
  error: (error) => {
    expect(error.status).toBe(404);
  }
});

const req = httpMock.expectOne('/api/data');
req.flush(null, { status: 404, statusText: 'Not Found' });
```

### Testing Component Outputs
```typescript
spyOn(component.someEvent, 'emit');
component.doSomething();
expect(component.someEvent.emit).toHaveBeenCalledWith(expectedValue);
```

### Testing Component Inputs
```typescript
component.inputProperty = 'test value';
fixture.detectChanges();
expect(fixture.nativeElement.textContent).toContain('test value');
```

## Debugging Tests

1. Use `console.log` in tests
2. Use `debugger` statement (pauses execution)
3. Check Karma debug page in browser
4. Use `fixture.debugElement` to inspect component tree

## Resources

- [Angular Testing Guide](https://angular.dev/guide/testing)
- [Jasmine Documentation](https://jasmine.github.io/)
- [Karma Documentation](https://karma-runner.github.io/)
- [Testing Library Angular](https://testing-library.com/angular)
