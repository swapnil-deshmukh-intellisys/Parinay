import { TestBed } from '@angular/core/testing';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';

describe('AuthGuard', () => {
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;
  let route: ActivatedRouteSnapshot;
  let state: RouterStateSnapshot;

  beforeEach(() => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['isAuthenticated']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    route = {} as ActivatedRouteSnapshot;
    state = { url: '/protected' } as RouterStateSnapshot;

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    });

    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('should allow access when user is authenticated', () => {
    authService.isAuthenticated.and.returnValue(true);

    const result = TestBed.runInInjectionContext(() => AuthGuard(route, state));

    expect(result).toBe(true);
    expect(router.navigate).not.toHaveBeenCalled();
  });

  it('should deny access when user is not authenticated', () => {
    authService.isAuthenticated.and.returnValue(false);

    const result = TestBed.runInInjectionContext(() => AuthGuard(route, state));

    expect(result).toBe(false);
    expect(router.navigate).toHaveBeenCalledWith(
      ['/login'],
      jasmine.objectContaining({
        queryParams: jasmine.objectContaining({ returnUrl: '/protected' })
      })
    );
  });

  it('should include returnUrl in query params when redirecting', () => {
    authService.isAuthenticated.and.returnValue(false);
    const newState = { url: '/dashboard/profile' } as RouterStateSnapshot;

    TestBed.runInInjectionContext(() => AuthGuard(route, newState));

    expect(router.navigate).toHaveBeenCalledWith(
      ['/login'],
      jasmine.objectContaining({
        queryParams: { returnUrl: '/dashboard/profile' }
      })
    );
  });

  it('should handle different protected routes', () => {
    authService.isAuthenticated.and.returnValue(false);
    const routes = ['/dashboard', '/profile', '/settings'];

    routes.forEach(routePath => {
      router.navigate.calls.reset();
      const routeState = { url: routePath } as RouterStateSnapshot;

      TestBed.runInInjectionContext(() => AuthGuard(route, routeState));

      expect(router.navigate).toHaveBeenCalledWith(
        ['/login'],
        jasmine.objectContaining({
          queryParams: { returnUrl: routePath }
        })
      );
    });
  });

  it('should return true immediately for authenticated users', () => {
    authService.isAuthenticated.and.returnValue(true);

    const result = TestBed.runInInjectionContext(() => AuthGuard(route, state));

    expect(result).toBe(true);
    expect(authService.isAuthenticated).toHaveBeenCalled();
  });

  it('should check authentication status', () => {
    authService.isAuthenticated.and.returnValue(true);

    TestBed.runInInjectionContext(() => AuthGuard(route, state));

    expect(authService.isAuthenticated).toHaveBeenCalled();
  });
});
