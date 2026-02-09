import BaseScreen from './base.screen.js';

class LoginScreen extends BaseScreen {
    constructor() {
        super('Login');
    }

    get emailField() {
        return $('android=new UiSelector().className("android.widget.EditText").instance(0)');
    }

    get passwordField() {
        return $('android=new UiSelector().className("android.widget.EditText").instance(1)');
    }

    get signInButton() {
        return $('android=new UiSelector().textMatches("(?i)sign\\s*in")');
    }

    get toastMessage() {
        return $('//android.widget.Toast[1]');
    }

    get snackbarMessage() {
        return $('android=new UiSelector().resourceIdMatches(".*snackbar_text")');
    }

    async waitForReady() {
        await this.waitForDisplayed(this.emailField);
        await this.waitForDisplayed(this.passwordField);
    }

    async attemptLogin(email = '', password = '') {
        await this.waitForReady();
        await this.waitAndType(this.emailField, email ?? '');
        await this.waitAndType(this.passwordField, password ?? '');
        await this.waitAndTap(this.signInButton);
    }

    async login(email, password) {
        if (!email || !password) {
            throw new Error('TEST_LOGIN_EMAIL and TEST_LOGIN_PASSWORD must be set to run the login flow.');
        }

        await this.attemptLogin(email, password);
    }

    async waitForErrorMessage(expectedMessage) {
        const normalizedExpectation = (expectedMessage ?? '').trim().toLowerCase();
        if (!normalizedExpectation) {
            throw new Error('waitForErrorMessage expects a non-empty string.');
        }

        const dialogTextView = this.buildCaseInsensitiveXPathSelector(expectedMessage, 'android.widget.TextView');
        const messageElement = await this.waitForDisplayed(dialogTextView, { timeout: 8000 });
        return (await messageElement.getText()).trim();
    }
}

export default new LoginScreen();
