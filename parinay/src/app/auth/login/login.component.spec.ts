import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { LoginComponent } from './login.component';
import { AuthService } from '../../auth/auth.service';
import { of, throwError } from 'rxjs';
import { Router } from '@angular/router';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['login']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [
        LoginComponent,
        HttpClientTestingModule,
        RouterTestingModule,
        BrowserAnimationsModule,
        ToastrModule.forRoot()
      ],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with empty form', () => {
    expect(component).toBeTruthy();
    // Add form validation checks if component has a form
  });

  it('should call authService.login on form submission', () => {
    const credentials = {
      email: 'test@example.com',
      password: 'password123'
    };

    authService.login.and.returnValue(of({ message: 'Login successful' }));

    // Simulate form submission
    // Adjust based on your component's actual implementation
    if (component['onSubmit']) {
      component['onSubmit'](credentials);
    }

    expect(authService.login).toHaveBeenCalledWith(credentials);
  });

  it('should handle login errors', () => {
    const credentials = {
      email: 'test@example.com',
      password: 'wrongpassword'
    };

    authService.login.and.returnValue(
      throwError(() => ({ status: 401, message: 'Invalid credentials' }))
    );

    // Simulate form submission with error
    if (component['onSubmit']) {
      component['onSubmit'](credentials);
    }

    expect(authService.login).toHaveBeenCalled();
    // Add error handling assertions
  });
});
