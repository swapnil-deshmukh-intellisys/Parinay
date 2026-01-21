import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
  });

  test('should display login form', async ({ page }) => {
    const emailInput = page.locator('input[type="email"], input[name="email"]');
    const passwordInput = page.locator('input[type="password"], input[name="password"]');
    
    await expect(emailInput).toBeVisible({ timeout: 5000 });
    await expect(passwordInput).toBeVisible({ timeout: 5000 });
  });

  test('should show error for empty login form', async ({ page }) => {
    const submitButton = page.getByRole('button', { name: /login|sign in/i });
    if (await submitButton.isVisible()) {
      await submitButton.click();
      
      // Wait for validation messages
      await page.waitForTimeout(500);
      
      // Check for error messages (adjust selectors based on your form)
      const errors = page.locator('text=/required|invalid|error/i');
      const count = await errors.count();
      expect(count).toBeGreaterThan(0);
    }
  });

  test('should navigate to register page', async ({ page }) => {
    const registerLink = page.getByRole('link', { name: /register|sign up|create account/i });
    if (await registerLink.isVisible()) {
      await registerLink.click();
      await expect(page).toHaveURL(/.*register/);
    }
  });

  test('should display register form', async ({ page }) => {
    await page.goto('/register');
    
    const form = page.locator('form').first();
    await expect(form).toBeVisible({ timeout: 5000 });
  });
});
