
'use client';

import { useState, useEffect, useCallback } from 'react';
import { AdMob, AdOptions, InterstitialAdPluginEvents } from '@capacitor-community/admob';
import { Capacitor } from '@capacitor/core';

const useAdMob = () => {
  const [isInitialized, setIsInitialized] = useState(false);

  const adOptions: AdOptions = {
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

  const prepareInterstitial = useCallback(async () => {
    if (!isInitialized) return;
    try {
      console.log('Preparing interstitial ad...');
      await AdMob.prepareInterstitial(adOptions);
      console.log('Interstitial ad prepared.');
    } catch (error) {
      console.error('Error preparing interstitial ad', error);
    }
  }, [isInitialized, adOptions]);

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

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    const handleAdDismissed = () => {
        console.log('Interstitial ad dismissed. Preparing next one.');
        prepareInterstitial();
    };

    const listener = AdMob.addListener(InterstitialAdPluginEvents.Dismissed, handleAdDismissed);

    return () => {
        listener.remove();
    };
  }, [prepareInterstitial]);

  return {
    isInitialized,
    prepareInterstitial,
    showInterstitial,
  };
};

export default useAdMob;
