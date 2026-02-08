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

    async waitForReady() {
        await this.waitForDisplayed(this.emailField);
        await this.waitForDisplayed(this.passwordField);
    }

    async login(email, password) {
        if (!email || !password) {
            throw new Error('TEST_LOGIN_EMAIL and TEST_LOGIN_PASSWORD must be set to run the login flow.');
        }

        await this.waitForReady();
        await this.waitAndType(this.emailField, email);
        await this.waitAndType(this.passwordField, password);
        await this.waitAndTap(this.signInButton);
    }
}

export default new LoginScreen();
