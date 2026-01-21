import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NavbarComponent } from './navbar.component';
import { AuthService } from '../../auth/auth.service';
import { Router } from '@angular/router';
import { of, Subject } from 'rxjs';
import { AppUser } from '../../auth/auth.service';

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;
  let authStateSubject: Subject<AppUser | null>;

  beforeEach(async () => {
    authStateSubject = new Subject<AppUser | null>();
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['logout'], {
      authState$: authStateSubject.asObservable()
    });
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [
        NavbarComponent,
        RouterTestingModule,
        BrowserAnimationsModule
      ],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with menu and dropdown closed', () => {
    expect(component.menuOpen).toBe(false);
    expect(component.dropdownOpen).toBe(false);
  });

  it('should initialize with logged out state', () => {
    fixture.detectChanges();
    expect(component.isLoggedIn).toBe(false);
    expect(component.userDisplayName).toBe('');
    expect(component.userInitials).toBe('');
  });

  it('should have navigation links defined', () => {
    expect(component.navLinks).toBeDefined();
    expect(component.navLinks.length).toBeGreaterThan(0);
    expect(component.navLinks.some(link => link.path === '/')).toBe(true);
  });

  it('should toggle menu', () => {
    expect(component.menuOpen).toBe(false);
    component.toggleMenu();
    expect(component.menuOpen).toBe(true);
    component.toggleMenu();
    expect(component.menuOpen).toBe(false);
  });

  it('should close dropdown when menu opens', () => {
    component.dropdownOpen = true;
    component.toggleMenu();
    expect(component.dropdownOpen).toBe(false);
  });

  it('should toggle dropdown', () => {
    expect(component.dropdownOpen).toBe(false);
    component.toggleDropdown();
    expect(component.dropdownOpen).toBe(true);
    component.toggleDropdown();
    expect(component.dropdownOpen).toBe(false);
  });

  it('should update login state when user logs in', () => {
    const mockUser: AppUser = {
      uid: '123',
      displayName: 'John Doe',
      email: 'john@example.com',
      photoURL: null
    };

    fixture.detectChanges();
    authStateSubject.next(mockUser);
    fixture.detectChanges();

    expect(component.isLoggedIn).toBe(true);
    expect(component.userDisplayName).toBe('John Doe');
  });

  it('should update login state when user logs out', () => {
    const mockUser: AppUser = {
      uid: '123',
      displayName: 'John Doe',
      email: 'john@example.com',
      photoURL: null
    };

    fixture.detectChanges();
    authStateSubject.next(mockUser);
    fixture.detectChanges();
    expect(component.isLoggedIn).toBe(true);

    authStateSubject.next(null);
    fixture.detectChanges();
    expect(component.isLoggedIn).toBe(false);
    expect(component.userDisplayName).toBe('');
  });

  it('should generate user initials correctly', () => {
    const mockUser: AppUser = {
      uid: '123',
      displayName: 'John Doe',
      email: 'john@example.com',
      photoURL: null
    };

    fixture.detectChanges();
    authStateSubject.next(mockUser);
    fixture.detectChanges();

    expect(component.userInitials).toBe('JD');
  });

  it('should generate initials for single name', () => {
    const mockUser: AppUser = {
      uid: '123',
      displayName: 'John',
      email: 'john@example.com',
      photoURL: null
    };

    fixture.detectChanges();
    authStateSubject.next(mockUser);
    fixture.detectChanges();

    expect(component.userInitials).toBe('J');
  });

  it('should handle user with null displayName', () => {
    const mockUser: AppUser = {
      uid: '123',
      displayName: null,
      email: 'john@example.com',
      photoURL: null
    };

    fixture.detectChanges();
    authStateSubject.next(mockUser);
    fixture.detectChanges();

    expect(component.userDisplayName).toBe('User');
  });

  it('should call logout on authService', () => {
    authService.logout.and.returnValue(of(undefined));
    component.logout();
    expect(authService.logout).toHaveBeenCalled();
  });

  it('should close menu and dropdown on logout', () => {
    component.menuOpen = true;
    component.dropdownOpen = true;
    authService.logout.and.returnValue(of(undefined));

    component.logout();

    expect(component.menuOpen).toBe(false);
    expect(component.dropdownOpen).toBe(false);
  });

  it('should unsubscribe on destroy', () => {
    fixture.detectChanges();
    spyOn(component['authSub'], 'unsubscribe');
    component.ngOnDestroy();
    expect(component['authSub'].unsubscribe).toHaveBeenCalled();
  });

  it('should not throw error if authSub is undefined on destroy', () => {
    component['authSub'] = undefined as any;
    expect(() => component.ngOnDestroy()).not.toThrow();
  });

  it('should display navigation links in template', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement;
    const navLinks = compiled.querySelectorAll('a[routerLink]');
    expect(navLinks.length).toBeGreaterThan(0);
  });
});
