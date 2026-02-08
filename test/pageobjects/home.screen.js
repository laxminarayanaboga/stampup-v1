import { expect } from '@wdio/globals';
import BaseScreen from './base.screen.js';

class HomeScreen extends BaseScreen {
    constructor() {
        super('Home');
    }

    get loyaltyTitle() {
        return $('android=new UiSelector().textContains("Stamp a loyalty card")');
    }

    get stampButton() {
        return $('android=new UiSelector().textContains("Stamp")');
    }

    async waitForLoaded() {
        await this.waitForDisplayed(this.loyaltyTitle, { timeout: 30000 });
    }

    async assertOnHomeScreen() {
        const title = await this.waitForDisplayed(this.loyaltyTitle);
        expect(await title.getText()).toContain('Stamp a loyalty card');

        const button = await this.stampButton;
        await button.waitForExist({ timeout: this.defaultTimeout });
    }
}

export default new HomeScreen();
