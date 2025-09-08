import { useEffect, useState, useCallback } from 'react';
import { AdMob, BannerAdPosition, InterstitialAdPluginEvents, RewardAdPluginEvents } from '@capacitor-community/admob';
import { Capacitor } from '@capacitor/core';

interface UseAdMob {
  isInitialized: boolean;
  prepareInterstitial: () => Promise<void>;
  showInterstitial: () => Promise<void>;
  prepareRewarded: () => Promise<void>;
  showRewarded: () => Promise<{ rewarded: boolean }>; // Updated return type
  showBanner: (position: BannerAdPosition) => Promise<void>;
  hideBanner: () => Promise<void>;
}

const TEST_IDS = {
  INTERSTITIAL: 'ca-app-pub-3940256099942544/1033173712',
  REWARDED: 'ca-app-pub-3940256099942544/5224354917',
  BANNER: 'ca-app-pub-3940256099942544/6300978111',
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

  const prepareInterstitial = useCallback(async (): Promise<void> => {
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
        await prepareFn({ adId: TEST_IDS.INTERSTITIAL });
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

  const showInterstitial = useCallback(async (): Promise<void> => {
    if (!isInitialized || Capacitor.getPlatform() === 'web') return;

    try {
      const showFn =
        (AdMob as any).showInterstitial ??
        (AdMob as any).showInterstitialAd ??
        (AdMob as any).showAd;

      if (showFn) {
        await showFn();
      }
    } catch (e) {
      console.error('showInterstitial failed', e);
    }
  }, [isInitialized]);

  const showRewarded = useCallback(async (): Promise<{ rewarded: boolean }> => {
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
        (err) => {
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

      if (prepareRewardFn) {
        await prepareRewardFn({ adId: TEST_IDS.REWARDED });
      }

      const showRewardFn =
        (AdMob as any).showRewarded ??
        (AdMob as any).showRewardVideoAd ??
        (AdMob as any).showRewardAd;

        if (showRewardFn) {
          await showRewardFn();
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

  const prepareRewarded = useCallback(async (): Promise<void> => {
    if (!isInitialized || Capacitor.getPlatform() === 'web') return;
    try {
      const prepareRewardFn =
        (AdMob as any).prepareRewarded ??
        (AdMob as any).prepareRewardVideoAd ??
        (AdMob as any).prepareRewardAd;

      if (prepareRewardFn) {
        await prepareRewardFn({ adId: TEST_IDS.REWARDED });
      }
    } catch (e) {
      console.error('prepareRewarded failed', e);
    }
  }, [isInitialized]);

  const showBanner = useCallback(async (position: BannerAdPosition): Promise<void> => {
    if (!isInitialized || Capacitor.getPlatform() === 'web') return;

    try {
      await (AdMob as any).showBanner({
        adId: TEST_IDS.BANNER,
        position,
        isTesting: true,
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

  return {
    isInitialized,
    prepareInterstitial,
    showInterstitial,
    prepareRewarded,
    showRewarded,
    showBanner,
    hideBanner,
  };
};

export type { UseAdMob };
export default useAdMob;
