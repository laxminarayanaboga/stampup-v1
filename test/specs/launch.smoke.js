import LoginScreen from '../pageobjects/login.screen.js';
import HomeScreen from '../pageobjects/home.screen.js';

const TEST_LOGIN_EMAIL = process.env.TEST_LOGIN_EMAIL ?? 'test1@stampup.com';
const TEST_LOGIN_PASSWORD = process.env.TEST_LOGIN_PASSWORD ?? 'test1';

describe('Stampup Android smoke suite', () => {
    it('signs in and reaches the loyalty hub', async () => {
        await LoginScreen.login(TEST_LOGIN_EMAIL, TEST_LOGIN_PASSWORD);
        await HomeScreen.waitForLoaded();
        await HomeScreen.assertOnHomeScreen();
    });
});
