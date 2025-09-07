
import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.emojisliderz.app',
  appName: 'EmojiSliderz',
  webDir: 'out',
  server: {
    androidScheme: 'https',
  },
  plugins: {
    AdMob: {
      appId: "ca-app-pub-3940256099942544~3347511713", // This is a test AdMob app ID
      sync: true
    }
  }
};

export default config;
