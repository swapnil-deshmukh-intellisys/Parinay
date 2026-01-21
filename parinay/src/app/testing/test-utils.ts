/**
 * Testing utilities for Angular components and services
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';

/**
 * Common test module configuration
 */
export function configureTestModule(imports: any[] = [], providers: any[] = []) {
  return {
    imports: [
      HttpClientTestingModule,
      RouterTestingModule,
      BrowserAnimationsModule,
      ToastrModule.forRoot({
        positionClass: 'toast-top-right',
        preventDuplicates: true,
        timeOut: 3000
      }),
      ...imports
    ],
    providers: [...providers]
  };
}

/**
 * Create a component with full test setup
 */
export async function createComponent<T>(
  component: any
): Promise<ComponentFixture<T>> {
  const testBed = TestBed.configureTestingModule({
    ...configureTestModule([component])
  });

  await testBed.compileComponents();
  return testBed.createComponent<T>(component);
}

/**
 * Get HTTP testing controller
 */
export function getHttpTestingController(): HttpTestingController {
  return TestBed.inject(HttpTestingController);
}

/**
 * Wait for async operations
 */
export function wait(milliseconds = 0): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, milliseconds));
}

/**
 * Flush all pending HTTP requests
 */
export function flushHttpRequests(): void {
  const httpTestingController = getHttpTestingController();
  httpTestingController.verify();
}

/**
 * Mock localStorage
 */
export class MockLocalStorage {
  private store: { [key: string]: string } = {};

  getItem(key: string): string | null {
    return this.store[key] || null;
  }

  setItem(key: string, value: string): void {
    this.store[key] = value;
  }

  removeItem(key: string): void {
    delete this.store[key];
  }

  clear(): void {
    this.store = {};
  }
}

/**
 * Setup localStorage mock
 */
export function setupLocalStorageMock(): MockLocalStorage {
  const mockLocalStorage = new MockLocalStorage();
  Object.defineProperty(window, 'localStorage', {
    value: mockLocalStorage,
    writable: true
  });
  return mockLocalStorage;
}

/**
 * Create mock HTTP client response
 */
export function createMockResponse<T>(data: T, status = 200, statusText = 'OK') {
  return {
    status,
    statusText,
    body: data
  };
}
