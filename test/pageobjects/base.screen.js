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
    
    buildCaseInsensitiveTextSelector(text) {
        const safeText = (text ?? '').replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        return $(
            `android=new UiSelector().textMatches("(?i).*${safeText}.*")`
        );
    }

    async waitForTextInSource(text, options = {}) {
        const { timeout = this.defaultTimeout, interval = 350 } = options;
        const needle = (text ?? '').trim().toLowerCase();

        if (!needle) {
            throw new Error('waitForTextInSource requires non-empty text.');
        }

        let lastSource = '';

        await driver.waitUntil(async () => {
            lastSource = await driver.getPageSource();
            return lastSource.toLowerCase().includes(needle);
        }, { timeout, interval });

        return lastSource;
    }

    buildCaseInsensitiveXPathSelector(text, tag = '*') {
        const target = (text ?? '').trim().toLowerCase();

        if (!target) {
            throw new Error('buildCaseInsensitiveXPathSelector requires non-empty text.');
        }

        const safeTarget = target.replace(/"/g, '\\"');
        const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const lower = upper.toLowerCase();
        return $(`//${tag}[contains(translate(@text,"${upper}","${lower}"),"${safeTarget}")]`);
    }
}
