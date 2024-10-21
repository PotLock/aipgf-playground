import { expect, test } from '@playwright/test';

import { LoginPage } from '../pages/login.page';

test.beforeEach(async ({ page }) => {
  await page.goto('/login');
});

// test.describe('Check elements visibility', () => {
//   test('Verify "Username" input field visibility', async ({ page }) => {
//     const loginPage = new LoginPage(page);
//     const isUsernameInputFieldVisible = await loginPage.isUsernameInputFieldVisible();

//     expect(isUsernameInputFieldVisible).toBe(true);
//   });

//   test('Verify "Password" input field visibility', async ({ page }) => {
//     const loginPage = new LoginPage(page);
//     const isPasswordInputFieldVisible = await loginPage.isPasswordInputFieldVisible();

//     expect(isPasswordInputFieldVisible).toBe(true);
//   });

//   test('Verify "Submit" button visibility', async ({ page }) => {
//     const loginPage = new LoginPage(page);
//     const isSumbitButtonVisible = await loginPage.isSubmitButtonVisible();

//     expect(isSumbitButtonVisible).toBe(true);
//   });
// });

test.describe('Test "Log in" functionality', () => {
  const validCredentials = ['tindl88@gmail.com', 'Tintran123@'];
  const invalidUsername = 'incorrectUser';
  const invalidPassword = 'incorrectPassword';
  const successfullyLoggedInURL = '/';
  const expectedInvalidUsernameErrorMessageText = 'Your username is invalid!';
  const expectedInvalidPasswordErrorMessageText = 'Your password is invalid!';

  test('Test log in functionality with valid credentials', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.logIn(validCredentials[0], validCredentials[1]);
    await loginPage.clickSubmitLoginButton();

    await expect(page).toHaveURL(successfullyLoggedInURL);

    // const isLogOutButtonVisible = await loginPage.isLogOutButtonVisible();

    // expect(isLogOutButtonVisible).toBe(true);
  });

  // test('Test log in functionality with invalid username', async ({ page }) => {
  //   const loginPage = new LoginPage(page);

  //   await loginPage.logIn(invalidUsername, validCredentials[1]);
  //   await loginPage.clickSubmitLoginButton();

  //   const isErrorMessageVisible = await loginPage.isErrorMessageVisible();

  //   expect(isErrorMessageVisible).toBe(true);

  //   const actualInvalidUsernameErrorMessageText = await loginPage.errorMessageText();

  //   expect(actualInvalidUsernameErrorMessageText).toBe(expectedInvalidUsernameErrorMessageText);
  // });

  // test('Test log in functionality with invalid password', async ({ page }) => {
  //   const loginPage = new LoginPage(page);

  //   await loginPage.logIn(validCredentials[0], invalidPassword);
  //   await loginPage.clickSubmitLoginButton();

  //   const isErrorMessageVisible = await loginPage.isErrorMessageVisible();

  //   expect(isErrorMessageVisible).toBe(true);

  //   const actualInvalidPasswordErrorMessageText = await loginPage.errorMessageText();

  //   expect(actualInvalidPasswordErrorMessageText).toBe(expectedInvalidPasswordErrorMessageText);
  // });

  // test('Test log in functionality by sumbitting empty log in form', async ({ page }) => {
  //   const loginPage = new LoginPage(page);

  //   await loginPage.clickSubmitLoginButton();

  //   const isErrorMessageVisible = await loginPage.isErrorMessageVisible();

  //   expect(isErrorMessageVisible).toBe(true);

  //   const actualInvalidUsernameErrorMessageText = await loginPage.errorMessageText();

  //   expect(actualInvalidUsernameErrorMessageText).toBe(expectedInvalidUsernameErrorMessageText);
  // });
});
