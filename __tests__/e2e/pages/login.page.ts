import { Locator, Page } from '@playwright/test';

export class LoginPage {
  page: Page;
  usernameInputField: Locator;
  passwordInputField: Locator;
  submitButton: Locator;
  logOutButton: Locator;
  errorMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.usernameInputField = page.locator('input[name="email"]');
    this.passwordInputField = page.locator('input[name="password"]');
    this.submitButton = page.locator('button[type="submit"]');
    this.logOutButton = page.getByText('Log out');
    this.errorMessage = page.locator('div[id="error"]');
  }

  async isUsernameInputFieldVisible() {
    return await this.usernameInputField.isVisible();
  }

  async isPasswordInputFieldVisible() {
    return await this.passwordInputField.isVisible();
  }

  async isSubmitButtonVisible() {
    return await this.submitButton.isVisible();
  }

  async fillUsername(username: string) {
    await this.usernameInputField.fill(username);
  }

  async fillPassword(password: string) {
    await this.passwordInputField.fill(password);
  }

  async logIn(username: string, password: string) {
    await this.fillUsername(username);
    await this.fillPassword(password);
  }

  async clickSubmitLoginButton() {
    await this.submitButton.click();
  }

  async isLogOutButtonVisible() {
    return await this.logOutButton.isVisible();
  }

  async isErrorMessageVisible() {
    return await this.errorMessage.isVisible();
  }

  async errorMessageText() {
    return await this.errorMessage.textContent();
  }
}
