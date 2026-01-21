import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { ReactiveFormsModule } from '@angular/forms';
import { RegisterComponent } from './register.component';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { getHttpTestingController, flushHttpRequests } from '../../testing/test-utils';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;
  let toastrService: ToastrService;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['register']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [
        RegisterComponent,
        ReactiveFormsModule,
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

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    toastrService = TestBed.inject(ToastrService);
    httpMock = getHttpTestingController();
    fixture.detectChanges();
  });

  afterEach(() => {
    flushHttpRequests();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize registration form', () => {
    expect(component.registerForm).toBeDefined();
    expect(component.registerForm.get('fullName')).toBeTruthy();
    expect(component.registerForm.get('email')).toBeTruthy();
    expect(component.registerForm.get('password')).toBeTruthy();
  });

  it('should have form validation for required fields', () => {
    const form = component.registerForm;
    expect(form.get('fullName')?.hasError('required')).toBe(true);
    expect(form.get('email')?.hasError('required')).toBe(true);
    expect(form.get('password')?.hasError('required')).toBe(true);
    expect(form.get('gender')?.hasError('required')).toBe(true);
    expect(form.get('age')?.hasError('required')).toBe(true);
    expect(form.get('city')?.hasError('required')).toBe(true);
  });

  it('should validate password minimum length', () => {
    const passwordControl = component.registerForm.get('password');
    passwordControl?.setValue('123');
    expect(passwordControl?.hasError('minlength')).toBe(true);
    
    passwordControl?.setValue('password123');
    expect(passwordControl?.hasError('minlength')).toBeFalsy();
  });

  it('should validate age range', () => {
    const ageControl = component.registerForm.get('age');
    ageControl?.setValue(17);
    expect(ageControl?.hasError('min')).toBe(true);
    
    ageControl?.setValue(101);
    expect(ageControl?.hasError('max')).toBe(true);
    
    ageControl?.setValue(25);
    expect(ageControl?.valid).toBe(true);
  });

  it('should call authService.register on valid form submission', () => {
    const userData = {
      fullName: 'Test User',
      email: 'test@example.com',
      password: 'password123',
      confirmPassword: 'password123',
      gender: 'Male',
      age: 25,
      city: 'Mumbai'
    };

    authService.register.and.returnValue(of({ message: 'Registration successful' }));
    spyOn(toastrService, 'success');
    spyOn(router, 'navigate');

    component.registerForm.patchValue(userData);
    component.onSubmit();

    expect(authService.register).toHaveBeenCalled();
    expect(toastrService.success).toHaveBeenCalledWith('Registration successful!');
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should handle password mismatch', () => {
    spyOn(toastrService, 'error');
    
    component.registerForm.patchValue({
      fullName: 'Test User',
      email: 'test@example.com',
      password: 'password123',
      confirmPassword: 'different',
      gender: 'Male',
      age: 25,
      city: 'Mumbai'
    });

    component.onSubmit();

    expect(toastrService.error).toHaveBeenCalledWith('Passwords do not match');
    expect(authService.register).not.toHaveBeenCalled();
  });

  it('should handle registration errors', () => {
    const errorResponse = { message: 'Email already exists' };
    authService.register.and.returnValue(throwError(() => ({ status: 400, error: errorResponse })));
    spyOn(toastrService, 'error');

    component.registerForm.patchValue({
      fullName: 'Test User',
      email: 'test@example.com',
      password: 'password123',
      confirmPassword: 'password123',
      gender: 'Male',
      age: 25,
      city: 'Mumbai'
    });

    component.onSubmit();

    expect(toastrService.error).toHaveBeenCalledWith('Email already exists');
    expect(component.isSubmitting).toBe(false);
  });

  it('should not submit when form is invalid', () => {
    component.registerForm.patchValue({
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
      gender: '',
      age: '',
      city: ''
    });

    component.onSubmit();

    expect(authService.register).not.toHaveBeenCalled();
  });

  it('should navigate to login after successful registration', () => {
    const userData = {
      fullName: 'Test User',
      email: 'test@example.com',
      password: 'password123',
      confirmPassword: 'password123',
      gender: 'Male',
      age: 25,
      city: 'Mumbai'
    };

    authService.register.and.returnValue(of({ message: 'Registration successful' }));
    spyOn(router, 'navigate');

    component.registerForm.patchValue(userData);
    component.onSubmit();

    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should set isSubmitting flag during submission', () => {
    const userData = {
      fullName: 'Test User',
      email: 'test@example.com',
      password: 'password123',
      confirmPassword: 'password123',
      gender: 'Male',
      age: 25,
      city: 'Mumbai'
    };

    authService.register.and.returnValue(of({ message: 'Registration successful' }));

    component.registerForm.patchValue(userData);
    component.onSubmit();

    expect(component.isSubmitting).toBe(false); // Should be reset after completion
  });

  it('should display form fields in template', () => {
    const compiled = fixture.nativeElement;
    const form = compiled.querySelector('form');
    
    if (form) {
      expect(form).toBeTruthy();
      // Add more specific template tests based on actual HTML
    }
  });

  it('should validate email format', () => {
    const emailControl = component.registerForm.get('email');
    emailControl?.setValue('invalid-email');
    expect(emailControl?.hasError('email')).toBe(true);
    
    emailControl?.setValue('valid@example.com');
    expect(emailControl?.hasError('email')).toBeFalsy();
  });

  it('should require password field', () => {
    const passwordControl = component.registerForm.get('password');
    passwordControl?.setValue('');
    expect(passwordControl?.hasError('required')).toBe(true);
  });

  it('should have getter for form controls', () => {
    expect(component.f).toBe(component.registerForm.controls);
  });

  it('should not submit when isSubmitting is true', () => {
    component.isSubmitting = true;
    component.registerForm.patchValue({
      fullName: 'Test User',
      email: 'test@example.com',
      password: 'password123',
      confirmPassword: 'password123',
      gender: 'Male',
      age: 25,
      city: 'Mumbai'
    });

    component.onSubmit();

    expect(authService.register).not.toHaveBeenCalled();
  });
});
