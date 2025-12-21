/**
 * Minimal TypeScript declarations for the @capacitor-community/admob plugin.
 *
 * This file provides lightweight types so TypeScript can resolve imports in the
 * codebase. It intentionally keeps AdMob as `any` to avoid forcing a specific
 * plugin API shape; extend these declarations if you want stricter typing.
 *
 * Place this file under `src/types` (or any path included by your tsconfig's "include")
 * so the compiler picks it up automatically.
 */

declare module '@capacitor-community/admob' {
  // Plugin instance (keep `any` for maximum compatibility)
  const AdMob: any;
  export { AdMob };

  // Banner positions used in the codebase. Add/remove values if needed.
  export enum BannerAdPosition {
    TOP_LEFT,
    TOP_CENTER,
    TOP_RIGHT,
    MIDDLE_LEFT,
    MIDDLE_CENTER,
    MIDDLE_RIGHT,
    BOTTOM_LEFT,
    BOTTOM_CENTER,
    BOTTOM_RIGHT
  }

  // Interstitial events referenced in the repo
  export enum InterstitialAdPluginEvents {
    Loaded = 'loaded',
    FailedToLoad = 'failedToLoad',
    Showed = 'showed',
    Clicked = 'clicked'
  }

  // Rewarded ad events referenced in the repo
  export enum RewardAdPluginEvents {
    Rewarded = 'rewarded',
    Dismissed = 'dismissed',
    FailedToShow = 'failedToShow'
  }

  export default AdMob;
}
