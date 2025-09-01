
'use client';

import { useState, useEffect, useCallback } from 'react';
import { AdMob, AdOptions, InterstitialAdPluginEvents, PluginListenerHandle, BannerAdOptions, BannerAdSize, BannerAdPosition } from '@capacitor-community/admob';
import { Capacitor } from '@capacitor/core';

const useAdMob = () => {
  const [isInitialized, setIsInitialized] = useState(false);

  const interstitialAdOptions: AdOptions = {
    adId: 'ca-app-pub-3940256099942544/1033173712', // Test Interstitial ID
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
  }, [isInitialized]);

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
    let listener: PluginListenerHandle | undefined;

    const addListener = async () => {
        listener = await AdMob.addListener(InterstitialAdPluginEvents.Dismissed, () => {
            console.log('Interstitial ad dismissed. Preparing next one.');
            prepareInterstitial();
        });
    }
    
    if (isInitialized) {
        addListener();
    }

    return () => {
      const removeListener = async () => {
        if(listener) {
            await listener.remove();
        }
      }
      removeListener();
    };
  }, [isInitialized, prepareInterstitial]);

  return {
    isInitialized,
    prepareInterstitial,
    showInterstitial,
    showBanner,
    hideBanner,
    removeBanner
  };
};

export default useAdMob;
