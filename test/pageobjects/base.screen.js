import { driver } from '@wdio/globals';

export default class BaseScreen {
    constructor(screenName) {
        this.screenName = screenName;
        this.defaultTimeout = 20000;
    }

    async waitForDisplayed(elementPromise, options = {}) {
        const element = await elementPromise;
        await element.waitForDisplayed({ timeout: this.defaultTimeout, ...options });
        return element;
    }

    async waitAndType(elementPromise, value, options = {}) {
        const element = await this.waitForDisplayed(elementPromise, options);
        try {
            await element.clearValue();
        } catch (error) {
            // Some Android inputs do not support clearValue; fall back to select-all delete.
            await element.click();
            await driver.execute('mobile: performEditorAction', { action: 'selectAll' }).catch(() => {});
        }
        await element.setValue(value);
    }

    async waitAndTap(elementPromise, options = {}) {
        const element = await this.waitForDisplayed(elementPromise, options);
        await element.click();
    }

    async pause(ms = 1000) {
        await driver.pause(ms);
    }

    buildTextSelector(text) {
        return $(`android=new UiSelector().textContains("${text}")`);
    }
}
