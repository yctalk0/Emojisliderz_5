'use client';

import React, { useEffect, useState } from 'react';
import useAdMob from '../hooks/use-admob';

export default function AdDemo() {
  const admob = useAdMob();
  const [initialized, setInitialized] = useState<boolean>(false);
  const [available, setAvailable] = useState<boolean>(false);
  const [interstitialLoaded, setInterstitialLoaded] = useState<boolean>(false);
  const [rewardedLoaded, setRewardedLoaded] = useState<boolean>(false);
  const [nativeAd, setNativeAd] = useState<any | null>(null);
  const [log, setLog] = useState<string[]>([]);

  const appendLog = (msg: string) =>
    setLog((l) => [new Date().toLocaleTimeString() + ' — ' + msg, ...l].slice(0, 50));
  const errMsg = (err: any) => (err && (err as any).message) ? String((err as any).message) : String(err);

  useEffect(() => {
    // useAdMob initializes internally; expose its state here
    setAvailable(admob.isInitialized);
    setInitialized(admob.isInitialized);
    appendLog(`Ad plugin initialized: ${admob.isInitialized}`);
    // Keep admob.isInitialized as a dependency so component updates when the hook finishes initializing
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [admob.isInitialized]);

  const handleShowBanner = async () => {
    appendLog('showBanner() - not supported by current AdMob hook');
  };

  const handleHideBanner = async () => {
    appendLog('hideBanner() - not supported by current AdMob hook');
  };

  const handlePrepareInterstitial = async () => {
    appendLog('prepareInterstitial()');
    try {
      await admob.prepareInterstitial();
      setInterstitialLoaded(true);
      appendLog('Interstitial prepared (plugin may still load asynchronously)');
    } catch (e) {
      appendLog('prepareInterstitial error: ' + errMsg(e));
    }
  };

  const handleShowInterstitial = async () => {
    appendLog('showInterstitial()');
    try {
      await admob.showInterstitial();
      appendLog('showInterstitial requested');
      // after showing, interstitial typically needs to be prepared again
      setInterstitialLoaded(false);
    } catch (e) {
      appendLog('showInterstitial error: ' + errMsg(e));
    }
  };

  const handlePrepareRewarded = async () => {
    appendLog('prepareRewarded()');
    try {
      await admob.prepareRewarded();
      setRewardedLoaded(true);
      appendLog('Rewarded prepared (plugin may still load asynchronously)');
    } catch (e) {
      appendLog('prepareRewarded error: ' + errMsg(e));
    }
  };

  const handleShowRewarded = async () => {
    appendLog('showRewarded()');
    try {
      await admob.showRewarded();
      appendLog('showRewarded requested');
      setRewardedLoaded(false);
    } catch (e) {
      appendLog('showRewarded error: ' + errMsg(e));
    }
  };

  const handleLoadNative = async () => {
    appendLog('loadNative() - not supported by current AdMob hook');
    setNativeAd(null);
  };

  return (
    <div style={{ padding: 12, border: '1px solid #eee', borderRadius: 8, maxWidth: 720, margin: '12px auto', fontFamily: 'system-ui, Arial' }}>
      <h3 style={{ margin: '0 0 8px 0' }}>AdMob Demo</h3>
      <p style={{ margin: '0 0 12px 0', color: '#555' }}>
        Plugin available: <strong>{String(available)}</strong> • Initialized: <strong>{String(initialized)}</strong>
      </p>

      <div style={{ display: 'grid', gap: 8, gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', marginBottom: 12 }}>
        <button onClick={handlePrepareInterstitial} style={{ padding: 8 }}>Prepare Interstitial</button>
        <button onClick={handleShowInterstitial} style={{ padding: 8 }} disabled={!interstitialLoaded}>Show Interstitial</button>
        <button onClick={handlePrepareRewarded} style={{ padding: 8 }}>Prepare Rewarded</button>
        <button onClick={handleShowRewarded} style={{ padding: 8 }} disabled={!rewardedLoaded}>Show Rewarded</button>

        <button onClick={handleShowBanner} style={{ padding: 8 }} disabled>Show Banner (not supported)</button>
        <button onClick={handleHideBanner} style={{ padding: 8 }} disabled>Hide Banner (not supported)</button>
        <button onClick={handleLoadNative} style={{ padding: 8 }} disabled>Load Native (not supported)</button>
      </div>

      <div style={{ marginBottom: 12 }}>
        <strong>Native ad data:</strong>
        <pre style={{ whiteSpace: 'pre-wrap', maxHeight: 140, overflow: 'auto', background: '#fafafa', padding: 8, borderRadius: 4 }}>
          {nativeAd ? JSON.stringify(nativeAd, null, 2) : 'No native ad loaded'}
        </pre>
      </div>

      <div>
        <strong>Activity log (latest first):</strong>
        <div style={{ maxHeight: 200, overflow: 'auto', background: '#fff', padding: 8, borderRadius: 4, border: '1px solid #eee' }}>
          {log.length === 0 ? <div style={{ color: '#888' }}>No activity yet</div> : (
            <ul style={{ margin: 0, paddingLeft: 16 }}>
              {log.map((l, i) => <li key={i} style={{ fontSize: 13 }}>{l}</li>)}
            </ul>
          )}
        </div>
      </div>

      <div style={{ marginTop: 12, color: '#666', fontSize: 12 }}>
        <div>Test ad unit IDs are used by the hook by default (safe for development).</div>
        <div>Install a Capacitor AdMob plugin and run <code>npx cap sync android</code> to enable native ads on device.</div>
      </div>
    </div>
  );
}
