import { useEffect, useState, useCallback } from 'react';
import { AdMob, BannerAdPosition, InterstitialAdPluginEvents, RewardAdPluginEvents } from '@capacitor-community/admob';
import { Capacitor } from '@capacitor/core';

interface UseAdMob {
  isInitialized: boolean;
  prepareInterstitial: (adId?: string) => Promise<void>;
  showInterstitial: (adId?: string) => Promise<void>;
  prepareRewarded: (adId?: string) => Promise<void>;
  showRewarded: (adId?: string) => Promise<{ rewarded: boolean }>; // Optional adId to support multiple rewarded units
  showBanner: (position: BannerAdPosition) => Promise<void>;
  hideBanner: () => Promise<void>;
  loadNative: (adId?: string) => Promise<any>;
}

const TEST_IDS = {
  INTERSTITIAL: 'ca-app-pub-3940256099942544/1033173712',
  REWARDED: 'ca-app-pub-6516108479140141/1295540142',
  // Updated banner ad unit IDs (top, middle, bottom)
  BANNER_TOP: 'ca-app-pub-6516108479140141/1527474439',
  BANNER_MIDDLE: 'ca-app-pub-6516108479140141/3395638617',
  BANNER_BOTTOM: 'ca-app-pub-6516108479140141/3417964198',
  NATIVE: 'ca-app-pub-6516108479140141/7005198874',
};

const useAdMob = (): UseAdMob => {
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initialize = async () => {
      if (Capacitor.getPlatform() === 'web') return;

      try {
        // Call initialize without passing unknown options to match plugin typings.
        await AdMob.initialize();
        setIsInitialized(true);
      } catch (e) {
        console.error('AdMob initialization failed', e);
      }
    };
    initialize();
  }, []);

  const prepareInterstitial = useCallback(async (adId?: string): Promise<void> => {
    if (!isInitialized || Capacitor.getPlatform() === 'web') return;

    try {
      const listenerHandle = await (AdMob as any).addListener?.(
        InterstitialAdPluginEvents.Loaded,
        () => {
          console.log('Interstitial ad loaded');
        }
      );

      const prepareFn =
        (AdMob as any).prepareInterstitial ??
        (AdMob as any).prepareInterstitialAd ??
        (AdMob as any).prepareAd;

      if (prepareFn) {
        await prepareFn({ adId: adId ?? TEST_IDS.INTERSTITIAL });
      }

      try {
        if (listenerHandle && typeof listenerHandle.remove === 'function') {
          listenerHandle.remove();
        }
      } catch {
        // ignore
      }
    } catch (e) {
      console.error('prepareInterstitial failed', e);
    }
  }, [isInitialized]);

  const showInterstitial = useCallback(async (adId?: string): Promise<void> => {
    if (!isInitialized || Capacitor.getPlatform() === 'web') return;

    try {
      const showFn =
        (AdMob as any).showInterstitial ??
        (AdMob as any).showInterstitialAd ??
        (AdMob as any).showAd;

      if (showFn) {
        try {
          await showFn({ adId: adId ?? TEST_IDS.INTERSTITIAL });
        } catch {
          await showFn();
        }
      }
    } catch (e) {
      console.error('showInterstitial failed', e);
    }
  }, [isInitialized]);

  const showRewarded = useCallback(async (adId?: string): Promise<{ rewarded: boolean }> => {
    if (!isInitialized || Capacitor.getPlatform() === 'web') {
      // For web, simulate a successful ad watch after a short delay
      return new Promise(resolve => setTimeout(() => resolve({ rewarded: true }), 1000));
    }

    return new Promise(async (resolve) => {
      let rewarded = false;
      const rewardedListener = await AdMob.addListener(
        RewardAdPluginEvents.Rewarded,
        () => {
          console.log('Rewarded ad completed and rewarded!');
          rewarded = true;
        }
      );

      const dismissedListener = await AdMob.addListener(
        RewardAdPluginEvents.Dismissed,
        () => {
          console.log('Rewarded ad dismissed.');
          rewardedListener.remove();
          dismissedListener.remove();
          resolve({ rewarded });
        }
      );

      const failedToShowListener = await AdMob.addListener(
        RewardAdPluginEvents.FailedToShow,
        (err: any) => {
          console.error('Rewarded ad failed to show:', err);
          rewardedListener.remove();
          dismissedListener.remove();
          failedToShowListener.remove();
          resolve({ rewarded: false });
        }
      );

      try {
        // Ensure ad is prepared before showing
        const prepareRewardFn =
          (AdMob as any).prepareRewarded ??
          (AdMob as any).prepareRewardVideoAd ??
          (AdMob as any).prepareRewardAd;

        const rewardAdId = adId ?? TEST_IDS.REWARDED;

        if (prepareRewardFn) {
          await prepareRewardFn({ adId: rewardAdId });
        }

        const showRewardFn =
          (AdMob as any).showRewarded ??
          (AdMob as any).showRewardVideoAd ??
          (AdMob as any).showRewardAd;

        if (showRewardFn) {
          try {
            await showRewardFn({ adId: rewardAdId });
          } catch {
            await showRewardFn();
          }
        } else {
          console.error('showRewarded function not found on AdMob plugin.');
          rewardedListener.remove();
          dismissedListener.remove();
          failedToShowListener.remove();
          resolve({ rewarded: false });
        }
      } catch (e) {
        console.error('showRewarded failed', e);
        rewardedListener.remove();
        dismissedListener.remove();
        failedToShowListener.remove();
        resolve({ rewarded: false });
      }
    });
  }, [isInitialized]);

  const prepareRewarded = useCallback(async (adId?: string): Promise<void> => {
    if (!isInitialized || Capacitor.getPlatform() === 'web') return;
    try {
      const prepareRewardFn =
        (AdMob as any).prepareRewarded ??
        (AdMob as any).prepareRewardVideoAd ??
        (AdMob as any).prepareRewardAd;

      const rewardAdId = adId ?? TEST_IDS.REWARDED;

      if (prepareRewardFn) {
        await prepareRewardFn({ adId: rewardAdId });
      }
    } catch (e) {
      console.error('prepareRewarded failed', e);
    }
  }, [isInitialized]);

  const showBanner = useCallback(async (position: BannerAdPosition): Promise<void> => {
    if (!isInitialized || Capacitor.getPlatform() === 'web') return;

    try {
      // Select ad unit ID based on requested position
      let adId = TEST_IDS.BANNER_MIDDLE;
      if (position === BannerAdPosition.TOP_CENTER) {
        adId = TEST_IDS.BANNER_TOP;
      } else if (position === BannerAdPosition.BOTTOM_CENTER) {
        adId = TEST_IDS.BANNER_BOTTOM;
      }

      await (AdMob as any).showBanner({
        adId,
        position,
      });
    } catch (error) {
      console.error('Failed to show banner ad', error);
    }
  }, [isInitialized]);

  const hideBanner = useCallback(async (): Promise<void> => {
    if (!isInitialized || Capacitor.getPlatform() === 'web') return;

    try {
      await (AdMob as any).hideBanner?.();
    } catch (error) {
      console.error('Failed to hide banner ad', error);
    }
  }, [isInitialized]);

  const loadNative = useCallback(async (adId?: string): Promise<any> => {
    if (!isInitialized || Capacitor.getPlatform() === 'web') return null;

    try {
      const loadFn = (AdMob as any).loadNativeAd ?? (AdMob as any).loadNative;
      if (loadFn) {
        const result = await loadFn({ adId: adId ?? TEST_IDS.NATIVE });
        return result;
      }
    } catch (e) {
      console.error('loadNative failed', e);
    }
    return null;
  }, [isInitialized]);

  return {
    isInitialized,
    prepareInterstitial,
    showInterstitial,
    prepareRewarded,
    showRewarded,
    showBanner,
    hideBanner,
    loadNative,
  };
};

export type { UseAdMob };
export default useAdMob;
