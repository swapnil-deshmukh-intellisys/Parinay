import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { ContactComponent } from './contact.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { getHttpTestingController, flushHttpRequests } from '../../testing/test-utils';

describe('ContactComponent', () => {
  let component: ContactComponent;
  let fixture: ComponentFixture<ContactComponent>;
  let httpMock: HttpTestingController;
  let toastrService: ToastrService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ContactComponent,
        ReactiveFormsModule,
        HttpClientTestingModule,
        BrowserAnimationsModule,
        ToastrModule.forRoot()
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ContactComponent);
    component = fixture.componentInstance;
    httpMock = getHttpTestingController();
    toastrService = TestBed.inject(ToastrService);
    fixture.detectChanges();
  });

  afterEach(() => {
    flushHttpRequests();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize contact form with empty fields', () => {
    expect(component.contactForm).toBeDefined();
    expect(component.contactForm.get('fullName')?.value).toBe('');
    expect(component.contactForm.get('email')?.value).toBe('');
    expect(component.contactForm.get('subject')?.value).toBe('');
    expect(component.contactForm.get('message')?.value).toBe('');
  });

  it('should have required validators on all form fields', () => {
    const fullNameControl = component.contactForm.get('fullName');
    const emailControl = component.contactForm.get('email');
    const subjectControl = component.contactForm.get('subject');
    const messageControl = component.contactForm.get('message');

    fullNameControl?.setValue('');
    emailControl?.setValue('');
    subjectControl?.setValue('');
    messageControl?.setValue('');

    expect(fullNameControl?.hasError('required')).toBe(true);
    expect(emailControl?.hasError('required')).toBe(true);
    expect(subjectControl?.hasError('required')).toBe(true);
    expect(messageControl?.hasError('required')).toBe(true);
  });

  it('should validate email format', () => {
    const emailControl = component.contactForm.get('email');
    
    emailControl?.setValue('invalid-email');
    expect(emailControl?.hasError('email')).toBe(true);
    
    emailControl?.setValue('valid@example.com');
    expect(emailControl?.hasError('email')).toBe(false);
  });

  it('should mark form as valid when all fields are filled correctly', () => {
    component.contactForm.patchValue({
      fullName: 'John Doe',
      email: 'john@example.com',
      subject: 'Test Subject',
      message: 'Test message content'
    });

    expect(component.contactForm.valid).toBe(true);
  });

  it('should not submit form when invalid', () => {
    spyOn(toastrService, 'error');
    
    component.contactForm.patchValue({
      fullName: '',
      email: '',
      subject: '',
      message: ''
    });

    component.onSubmit();

    expect(toastrService.error).toHaveBeenCalledWith('Please fill all fields correctly');
  });

  it('should submit form successfully with valid data', () => {
    spyOn(toastrService, 'success');
    spyOn(component.contactForm, 'reset');

    component.contactForm.patchValue({
      fullName: 'John Doe',
      email: 'john@example.com',
      subject: 'Test Subject',
      message: 'Test message content'
    });

    component.onSubmit();

    const req = httpMock.expectOne((request) => 
      request.url.includes('/api/contact') && request.method === 'POST'
    );
    expect(req.request.body).toEqual(component.contactForm.value);
    req.flush({ message: 'Message sent successfully' });

    expect(toastrService.success).toHaveBeenCalledWith('Message sent successfully!');
    expect(component.contactForm.reset).toHaveBeenCalled();
  });

  it('should handle form submission error', () => {
    spyOn(toastrService, 'error');

    component.contactForm.patchValue({
      fullName: 'John Doe',
      email: 'john@example.com',
      subject: 'Test Subject',
      message: 'Test message content'
    });

    component.onSubmit();

    const req = httpMock.expectOne((request) => 
      request.url.includes('/api/contact') && request.method === 'POST'
    );
    req.flush(null, { status: 500, statusText: 'Server Error' });

    expect(toastrService.error).toHaveBeenCalledWith('Failed to send message. Try again.');
  });

  it('should display form fields in template', () => {
    const compiled = fixture.nativeElement;
    const form = compiled.querySelector('form');
    
    expect(form).toBeTruthy();
    expect(compiled.querySelector('input[formControlName="fullName"]')).toBeTruthy();
    expect(compiled.querySelector('input[formControlName="email"]')).toBeTruthy();
    expect(compiled.querySelector('input[formControlName="subject"]')).toBeTruthy();
    expect(compiled.querySelector('textarea[formControlName="message"]')).toBeTruthy();
  });
});
