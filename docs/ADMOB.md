# AdMob Integration Guide (EmojiSliderz)

This document explains how to make the app AdMob-ready, create ad units, and test ads. It complements the runtime wrapper at `src/hooks/use-admob.ts` which ships with safe defaults and Google test ad unit IDs.

Summary of actions performed in the repo
- Implemented a defensive TypeScript wrapper: `src/hooks/use-admob.ts`
  - Uses Google test ad units by default
  - Detects common Capacitor/Cordova AdMob plugin shapes at runtime
  - No-op in the regular web browser so the app won't crash during development

Important: Do not use real AdMob unit IDs during development — use the Google-provided test IDs below until you verify functionality.

Test Ad Unit IDs (already included in `use-admob.ts`)
- App ID (test): ca-app-pub-3940256099942544~3347511713
- Banner (test): ca-app-pub-3940256099942544/6300978111
- Interstitial (test): ca-app-pub-3940256099942544/1033173712
- Rewarded (test): ca-app-pub-3940256099942544/5224354917
- Native (test): ca-app-pub-3940256099942544/2247696110

1) Choose a Capacitor AdMob plugin (recommended)
- Community plugin (widely-used): @capacitor-community/admob
  - npm install @capacitor-community/admob
  - npx cap sync android
- Other options exist; if you pick a different plugin, adapt the usage accordingly.
- The repo's `use-admob.ts` attempts to work with multiple plugin method shapes but for advanced features prefer the plugin's official API.

2) Android-specific setup (already partially present)
- `AndroidManifest.xml` must contain:
  <meta-data android:name="com.google.android.gms.ads.APPLICATION_ID" android:value="@string/admob_app_id" />
  - This project already has that entry.
- `android/app/src/main/res/values/strings.xml` must define `admob_app_id`.
  - This project includes the test ID in `strings.xml`:
    `<string name="admob_app_id">ca-app-pub-3940256099942544~3347511713</string>`
  - Replace with your real AdMob App ID when publishing.
- Google Mobile Ads SDK dependency:
  - If you use a Capacitor plugin, the plugin will typically add the required native dependencies after `npx cap sync`.
  - If you manually add the SDK to `build.gradle`, ensure you include the Google Mobile Ads dependency:
    ```
    implementation 'com.google.android.gms:play-services-ads:22.5.0' // or current version
    ```
  - Most plugin installs remove the need for manual Gradle edits.

3) iOS-specific setup (if you target iOS)
- Add your App ID to `Info.plist` (if plugin documentation requires it).
- The community plugin's docs describe proper iOS setup and required flags (App Tracking Transparency).

4) Initialize AdMob at app startup
- Only run AdMob initialization on device (Capacitor runtime), not during Next.js SSR or development page loads in a desktop browser.
- Example (React client-side):
  ```tsx
  import { useEffect } from 'react';
  import useAdMob from '@/hooks/use-admob';

  export default function AdmobInit() {
    const admob = useAdMob();

    useEffect(() => {
      const init = async () => {
        // initialize will be a no-op in the browser (safe)
        await admob.initialize({ appId: admob.TEST_AD_UNITS.APP_ID });
      };
      init();
    }, []);

    return null;
  }
  ```
- Place this component in a client-only area (for Next.js put inside a component that only runs in the browser, or call from a page effect).

5) Example usage (banner, interstitial, rewarded)
- Banner
  - `await admob.showBanner({ adId: admob.TEST_AD_UNITS.BANNER, adSize: 'SMART_BANNER', position: 'BOTTOM_CENTER' })`
  - `await admob.hideBanner()`
- Interstitial
  - `await admob.prepareInterstitial(adUnitId)` to pre-load
  - `await admob.showInterstitial()` to show when ready
- Rewarded
  - `await admob.prepareRewarded(adUnitId)` to pre-load
  - `await admob.showRewarded()` to present and reward user after completion
- Native
  - Native ads require platform-specific views and custom rendering.
  - `use-admob.ts` exposes `loadNative()` that will attempt to load a native ad payload if the plugin exposes that method; you still need to render the ad components natively or map fields to a custom view.

6) Web fallback
- In the web browser (development), AdMob is not available. Provide a fallback UI:
  - Use a placeholder banner (HTML/CSS) or a promotional banner for your app.
  - The `use-admob.ts` wrapper will be a no-op in the browser to avoid runtime errors.

7) Create real ad units in the AdMob console
- Sign in to AdMob, create your app and the ad units required (Banner, Interstitial, Rewarded, Native).
- Replace the test IDs in production builds only **after** testing.

8) Example troubleshooting
- Ads not showing:
  - Verify `npx cap sync android` completed successfully.
  - Confirm `admob_app_id` is present in strings.xml and manifest meta-data exists.
  - Use the plugin's debug/logging options; check `adb logcat` for errors.
- Ads show only on device: AdMob SDK won't show ads in emulators without Google Play services or without proper configuration.

9) Security & policy
- Follow Google Play / AdMob policies.
- Don't click your own ads during testing with your real account (use test IDs or test devices).

10) Example demo component (see `src/components/ad-demo.tsx`)
- A simple UI to initialize and trigger banner/interstitial/rewarded actions is included in the repo. It uses `use-admob.ts` and falls back gracefully in the browser.

11) Next steps (developer)
- Install and sync a Capacitor AdMob plugin:
  - `npm install @capacitor-community/admob`
  - `npx cap sync android`
- Test on an Android device with `npx cap open android` then run via Android Studio or `npx cap run android -l` workflows.
- Once validated, create production ad units in AdMob and swap the IDs.

Reference: `src/hooks/use-admob.ts` contains the runtime wrapper and the `TEST_AD_UNITS` constants used in this doc.
