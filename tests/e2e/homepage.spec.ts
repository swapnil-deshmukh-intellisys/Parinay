import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display the homepage', async ({ page }) => {
    // Check if page loads
    await expect(page).toHaveTitle(/Parinay|Matrimony/i);
  });

  test('should have navigation bar', async ({ page }) => {
    const navbar = page.locator('app-navbar, nav, [role="navigation"]').first();
    await expect(navbar).toBeVisible();
  });

  test('should navigate to about page', async ({ page }) => {
    const aboutLink = page.getByRole('link', { name: /about/i });
    if (await aboutLink.isVisible()) {
      await aboutLink.click();
      await expect(page).toHaveURL(/.*about/);
    }
  });

  test('should navigate to login page', async ({ page }) => {
    const loginLink = page.getByRole('link', { name: /login/i });
    if (await loginLink.isVisible()) {
      await loginLink.click();
      await expect(page).toHaveURL(/.*login/);
    }
  });

  test('should display featured profiles', async ({ page }) => {
    // Wait for content to load
    await page.waitForLoadState('networkidle');
    
    // Check for profile-related content
    const profileSection = page.locator('text=/profile|featured|match/i').first();
    await expect(profileSection).toBeVisible({ timeout: 10000 });
  });
});
