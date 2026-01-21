import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ToastrModule } from 'ngx-toastr';
import { AuthService } from '../auth/auth.service';
import { getHttpTestingController, flushHttpRequests } from '../testing/test-utils';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        ToastrModule.forRoot()
      ],
      providers: [AuthService]
    });
    service = TestBed.inject(AuthService);
    httpMock = getHttpTestingController();
  });

  afterEach(() => {
    flushHttpRequests();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('register', () => {
    it('should register a new user successfully', () => {
      const userData = {
        fullName: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        gender: 'Male',
        age: 28,
        city: 'Mumbai'
      };

      const mockResponse = { message: 'User registered successfully' };

      service.register(userData).subscribe(response => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne((request) => 
        request.url.includes('/api/auth/register') && request.method === 'POST'
      );
      expect(req.request.body).toEqual(userData);
      req.flush(mockResponse);
    });

    it('should handle registration errors', () => {
      const userData = {
        fullName: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        gender: 'Male',
        age: 28,
        city: 'Mumbai'
      };

      const mockError = { message: 'Email already exists' };

      service.register(userData).subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error.status).toBe(400);
        }
      });

      const req = httpMock.expectOne((request) => 
        request.url.includes('/api/auth/register') && request.method === 'POST'
      );
      req.flush(mockError, { status: 400, statusText: 'Bad Request' });
    });
  });

  describe('login', () => {
    it('should login successfully with valid credentials', () => {
      const credentials = {
        email: 'test@example.com',
        password: 'password123'
      };

      const mockResponse = {
        message: 'Login successful',
        user: {
          _id: '123',
          email: 'test@example.com',
          fullName: 'Test User'
        }
      };

      service.login(credentials).subscribe(response => {
        expect(response).toEqual(mockResponse);
        expect(response.user.email).toBe(credentials.email);
      });

      const req = httpMock.expectOne((request) => 
        request.url.includes('/api/auth/login') && request.method === 'POST'
      );
      expect(req.request.body).toEqual(credentials);
      req.flush(mockResponse);
    });

    it('should handle login errors', () => {
      const credentials = {
        email: 'test@example.com',
        password: 'wrongpassword'
      };

      service.login(credentials).subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error.status).toBe(401);
        }
      });

      const req = httpMock.expectOne((request) => 
        request.url.includes('/api/auth/login') && request.method === 'POST'
      );
      req.flush({ message: 'Invalid credentials' }, { status: 401, statusText: 'Unauthorized' });
    });
  });
});
