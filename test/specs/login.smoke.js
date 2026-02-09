import { driver, expect } from '@wdio/globals';
import LoginScreen from '../pageobjects/login.screen.js';
import HomeScreen from '../pageobjects/home.screen.js';

const TEST_LOGIN_EMAIL = process.env.TEST_LOGIN_EMAIL ?? 'test1@stampup.com';
const TEST_LOGIN_PASSWORD = process.env.TEST_LOGIN_PASSWORD ?? 'test1';

const NEGATIVE_LOGIN_SCENARIOS = [
    {
        description: 'both fields are empty',
        email: '',
        password: '',
        expectedMessage: 'Please enter both email and password.'
    },
    {
        description: 'password missing',
        email: 'missing.pass@stampup.com',
        password: '',
        expectedMessage: 'Please enter both email and password.'
    },
    {
        description: 'email missing',
        email: '',
        password: 'missing-email-pass',
        expectedMessage: 'Please enter both email and password.'
    },
    {
        description: 'invalid email format with random password',
        email: 'invalid-email',
        password: 'wrongpass123',
        expectedMessage: 'invalid login credentials'
    },
    {
        description: 'valid account but wrong password',
        email: 'test1@stampup.com',
        password: 'definitely-wrong',
        expectedMessage: 'invalid login credentials'
    },
    {
        description: 'non-existent account credentials',
        email: 'ghost.user@stampup.com',
        password: 'ghostpass',
        expectedMessage: 'invalid login credentials'
    }
];

// TODO: move it to appropriate helper file if it can be reused across multiple test suites
async function resetAppState() {
    if (typeof driver.resetApp === 'function') {
        await driver.resetApp();
        return;
    }

    let packageName;
    if (typeof driver.getCurrentPackage === 'function') {
        try {
            packageName = await driver.getCurrentPackage();
        } catch (error) {
            packageName = undefined;
        }
    }

    if (packageName && typeof driver.terminateApp === 'function' && typeof driver.activateApp === 'function') {
        await driver.terminateApp(packageName);
        await driver.activateApp(packageName);
        return;
    }

    if (typeof driver.closeApp === 'function' && typeof driver.launchApp === 'function') {
        await driver.closeApp();
        await driver.launchApp();
        return;
    }

    throw new Error('Unable to reset the app between tests with the current driver.');
}

describe('Stampup Android login smoke suite', () => {
    beforeEach(async () => {
        await resetAppState();
        await LoginScreen.waitForReady();
    });

    describe('positive login journey', () => {
        it('signs in and reaches the loyalty hub', async () => {
            await LoginScreen.login(TEST_LOGIN_EMAIL, TEST_LOGIN_PASSWORD);
            await HomeScreen.waitForLoaded();
            await HomeScreen.assertOnHomeScreen();
        });
    });

    describe('negative login validations', () => {
        for (const scenario of NEGATIVE_LOGIN_SCENARIOS) {
            it(`rejects login when ${scenario.description}`, async () => {
                await LoginScreen.attemptLogin(scenario.email, scenario.password);
                const message = await LoginScreen.waitForErrorMessage(scenario.expectedMessage);
                expect(message.toLowerCase()).toContain(scenario.expectedMessage.toLowerCase());
            });
        }
    });
});
