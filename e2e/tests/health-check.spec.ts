import { expect, test } from '@playwright/test';
import { config } from './utils/config';

test.describe('Health Check', () => {
  test('application should be accessible', async ({ page }) => {
    // Set a longer timeout for this test
    test.setTimeout(60000);

    console.log(`Testing URL: ${config.URL}`);

    try {
      // Try to navigate to the root URL
      const response = await page.goto(config.URL, {
        waitUntil: 'networkidle',
        timeout: 30000,
      });

      console.log(`Response status: ${response?.status()}`);

      // Check if we get a successful response
      expect(response?.status()).toBeLessThan(400);

      // Wait for the page to load
      await page.waitForLoadState('networkidle');

      // Take a screenshot for debugging
      await page.screenshot({ path: 'test-results/health-check.png', fullPage: true });

      // Log the page content for debugging
      console.log('Page title:', await page.title());
      console.log('Page URL:', page.url());

      // Check if we're redirected to login or if login elements are present
      const isLoginPage =
        page.url().includes('/login') ||
        (await page.locator('input[type="email"], input[placeholder*="mail" i], input[name="email"]').count()) > 0 ||
        (await page.locator('button:has-text("Login"), a:has-text("Login")').count()) > 0;

      if (isLoginPage) {
        console.log('✓ Application is accessible and shows login page');
      } else {
        console.log('✓ Application is accessible');
      }

      // The test passes if we can access the application
      expect(response?.status()).toBeLessThan(400);
    } catch (error) {
      console.error('Health check failed:', error);

      // Try to get more information about the failure
      try {
        await page.screenshot({ path: 'test-results/health-check-error.png', fullPage: true });
      } catch (screenshotError) {
        console.error('Could not take screenshot:', screenshotError);
      }

      throw error;
    }
  });

  test('login page should be accessible', async ({ page }) => {
    test.setTimeout(60000);

    console.log(`Testing login URL: ${config.URL}/login`);

    try {
      const response = await page.goto(`${config.URL}/login`, {
        waitUntil: 'networkidle',
        timeout: 30000,
      });

      console.log(`Login page response status: ${response?.status()}`);
      expect(response?.status()).toBeLessThan(400);

      // Wait for the page to load
      await page.waitForLoadState('networkidle');

      // Take a screenshot
      await page.screenshot({ path: 'test-results/login-page.png', fullPage: true });

      console.log('Login page title:', await page.title());
      console.log('Login page URL:', page.url());

      // Check for login form elements
      const hasEmailField =
        (await page.locator('input[type="email"], input[placeholder*="mail" i], input[name="email"]').count()) > 0;
      const hasPasswordField =
        (await page.locator('input[type="password"], input[placeholder*="password" i], input[name="password"]').count()) > 0;
      const hasLoginButton =
        (await page.locator('button:has-text("Login"), input[type="submit"], button[type="submit"]').count()) > 0;

      console.log('Has email field:', hasEmailField);
      console.log('Has password field:', hasPasswordField);
      console.log('Has login button:', hasLoginButton);

      // At least one of these should be present for a proper login page
      const hasLoginElements = hasEmailField || hasPasswordField || hasLoginButton;
      expect(hasLoginElements).toBe(true);

      console.log('✓ Login page is accessible and contains login elements');
    } catch (error) {
      console.error('Login page check failed:', error);

      try {
        await page.screenshot({ path: 'test-results/login-page-error.png', fullPage: true });
        const content = await page.content();
        console.log('Page content length:', content.length);
        console.log('Page content preview:', content.substring(0, 500));
      } catch (debugError) {
        console.error('Could not get debug information:', debugError);
      }

      throw error;
    }
  });
});
