
'use client';

import { useState, useEffect, useCallback } from 'react';
import { AdMob, AdOptions, InterstitialAdPluginEvents, BannerAdOptions, BannerAdSize, BannerAdPosition, RewardedAdPluginEvents, RewardAdOptions, RewardAdPluginEvents } from '@capacitor-community/admob';
import { Capacitor, PluginListenerHandle } from '@capacitor/core';

const useAdMob = () => {
  const [isInitialized, setIsInitialized] = useState(false);

  const interstitialAdOptions = {
    adId: 'ca-app-pub-3940256099942544/1033173712', // Test Interstitial ID
    isTesting: true,
  };
  
  const rewardedAdOptions: RewardAdOptions = {
    adId: 'ca-app-pub-3940256099942544/5224354917', // Test Rewarded ID
    isTesting: true,
  };

  const initialize = useCallback(async () => {
    if (Capacitor.getPlatform() === 'web') return;
    try {
      await AdMob.initialize({});
      setIsInitialized(true);
      console.log('AdMob initialized');
    } catch (error) {
      console.error('Error initializing AdMob', error);
    }
  }, []);

  // --- Interstitial Ads ---
  const prepareInterstitial = useCallback(async () => {
    if (!isInitialized) return;
    try {
      console.log('Preparing interstitial ad...');
      await AdMob.prepareInterstitial(interstitialAdOptions);
      console.log('Interstitial ad prepared.');
    } catch (error) {
      console.error('Error preparing interstitial ad', error);
    }
  }, [isInitialized, interstitialAdOptions]);

  const showInterstitial = useCallback(async () => {
    if (!isInitialized) return;
    try {
      console.log('Showing interstitial ad...');
      await AdMob.showInterstitial();
      console.log('Interstitial ad shown.');
    } catch (error) {
      console.error('Error showing interstitial ad', error);
    }
  }, [isInitialized]);
  
  // --- Rewarded Ads ---
  const prepareRewarded = useCallback(async () => {
    if (!isInitialized) return;
    try {
      console.log('Preparing rewarded ad...');
      await AdMob.prepareRewardVideoAd(rewardedAdOptions);
      console.log('Rewarded ad prepared.');
    } catch (error) {
      console.error('Error preparing rewarded ad', error);
    }
  }, [isInitialized, rewardedAdOptions]);

  const showRewarded = useCallback(async () => {
    if (!isInitialized) return;
    try {
      console.log('Showing rewarded ad...');
      await AdMob.showRewardVideoAd();
      console.log('Rewarded ad shown.');
    } catch (error) {
      console.error('Error showing rewarded ad', error);
    }
  }, [isInitialized]);
  
  // --- Banner Ads ---
  const showBanner = useCallback(async (position: 'top' | 'bottom') => {
    if (!isInitialized) return;
    
    const options: BannerAdOptions = {
        adId: 'ca-app-pub-3940256099942544/6300978111', // Test Banner ID
        adSize: BannerAdSize.ADAPTIVE_BANNER,
        position: position === 'top' ? BannerAdPosition.TOP_CENTER : BannerAdPosition.BOTTOM_CENTER,
        isTesting: true,
        margin: 0,
    };
    try {
        console.log(`Showing ${position} banner ad...`);
        await AdMob.showBanner(options);
        console.log('Banner ad shown.');
    } catch (error) {
        console.error('Error showing banner ad', error);
    }
  }, [isInitialized]);

  const hideBanner = useCallback(async () => {
    if (!isInitialized) return;
    try {
        await AdMob.hideBanner();
        console.log('Banner ad hidden.');
    } catch (error) {
        console.error('Error hiding banner ad', error);
    }
  }, [isInitialized]);
  
  const removeBanner = useCallback(async () => {
    if (!isInitialized) return;
    try {
        await AdMob.removeBanner();
        console.log('Banner ad removed.');
    } catch (error) {
        console.error('Error removing banner ad', error);
    }
  }, [isInitialized]);


  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    let listeners: PluginListenerHandle[] = [];

    const addListeners = async () => {
        const interstitialListener = await AdMob.addListener(InterstitialAdPluginEvents.Dismissed, () => {
            console.log('Interstitial ad dismissed. Preparing next one.');
            prepareInterstitial();
        });
        const rewardedListener = await AdMob.addListener(RewardAdPluginEvents.Dismissed, () => {
            console.log('Rewarded ad dismissed. Preparing next one.');
            prepareRewarded();
        });
        listeners.push(interstitialListener, rewardedListener);
    }
    
    if (isInitialized) {
        addListeners();
    }

    return () => {
      const removeListeners = async () => {
        for(const listener of listeners) {
            await listener.remove();
        }
      }
      removeListeners();
    };
  }, [isInitialized, prepareInterstitial, prepareRewarded]);

  return {
    isInitialized,
    prepareInterstitial: useCallback(prepareInterstitial, [prepareInterstitial]),
    showInterstitial: useCallback(showInterstitial, [showInterstitial]),
    prepareRewarded: useCallback(prepareRewarded, [prepareRewarded]),
    showRewarded: useCallback(showRewarded, [showRewarded]),
    showBanner: useCallback(showBanner, [showBanner]),
    hideBanner: useCallback(hideBanner, [hideBanner]),
    removeBanner: useCallback(removeBanner, [removeBanner])
  };
};

export default useAdMob;
