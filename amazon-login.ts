import { chromium } from 'playwright';
import * as dotenv from 'dotenv';
import * as fs from 'fs';

dotenv.config();

const email = process.env.AMAZON_EMAIL || '';
const password = process.env.AMAZON_PASSWORD || '';
const url = process.env.AMAZON_URL || '';

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    
    await page.goto(url);
    await page.click("(//span[text()='Sign in'])[1]");
    await page.fill('//input[@id="ap_email"]', email);
    await page.click('//input[@id="continue"]');
    await page.fill('//input[@id="ap_password"]', password);
    await page.click('//input[@id="signInSubmit"]');
    await page.waitForNavigation();
    const testResultsFolder = 'test-results';
    if (!fs.existsSync(testResultsFolder)) {
      fs.mkdirSync(testResultsFolder);
    }
    // Capture a screenshot and save it in the test-results folder
    const screenshotPath = `${testResultsFolder}/amazon-login.png`;
    await page.screenshot({ path: screenshotPath });
    console.log('Login successful!');
    console.log(`Screenshot saved: ${screenshotPath}`);
  } catch (error) {
    console.error('Login failed:', error);
  } finally {
    await browser.close();
  }
})();
