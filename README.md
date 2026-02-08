# stampup-v1

## Installing the Latest APK

Testers usually receive the signed APK directly. Follow these steps to install it on an Android emulator and launch the app.

1. **Start an emulator**
	- Open Android Studio (or use `emulator -avd <name>`) and wait until the emulator is fully booted.

2. **Verify connectivity**
	```bash
	adb devices
	```
	You should see the emulator listed as `emulator-5554` (or similar). If it is missing, close and relaunch the emulator.

3. **Install or update the app**
	```bash
	adb install -r /path/to/app-release.apk
	```
	The `-r` flag lets you re-install over an older build without uninstalling first.

4. **Launch the app**
	- Tap the app icon inside the emulator, or run:
	```bash
	adb shell monkey -p com.example.app 1
	```
	Replace `com.example.app` with the real application ID printed in the install log.

## Android Automation Quickstart

WebdriverIO + Appium is already wired up to boot the bundled `app-release.apk` on an emulator. Update the environment variables below if you need different devices or builds.

| Variable | Purpose | Default |
| --- | --- | --- |
| `ANDROID_DEVICE_NAME` | Emulator/device name passed to Appium | `Android Emulator` |
| `ANDROID_PLATFORM_VERSION` | Android OS version to target | leave unset to auto-match emulator |
| `ANDROID_APP_PATH` | Absolute path to the APK you want to test | first found: `<repo>/app-release.apk` or `<repo>/app/android/app-release.apk` |
| `ANDROID_APP_WAIT_ACTIVITY` | Activity substring to wait for (optional) | `*` |
| `TEST_LOGIN_EMAIL` | Primary test account email used by specs | `test1@stampup.com` (override via env var) |
| `TEST_LOGIN_PASSWORD` | Password for the same test account | `test1` (override via env var) |

### Run the smoke test

```bash
# 1. Ensure an emulator is running and visible via `adb devices`
# 2. Install dependencies once
npm install

# 3. Kick off the WebdriverIO runner
npm run wdio
```

The default spec in `test/specs/launch.smoke.js` only checks that the APK boots. Replace the placeholder assertions with real UI flows once screen identifiers are known.

### Page Objects

Mobile tests reuse the same Page Object Model patterns you know from browser automation. Screen abstractions live under `test/pageobjects`:
- `base.screen.js` centralises waits, typing, and tapping helpers.
- `login.screen.js` exposes `login(email, password)` for the authentication screen.
- `home.screen.js` contains assertions for the loyalty hub entry view.

Add more screen files as new flows are automated, then reference them from spec files under `test/specs`.
    