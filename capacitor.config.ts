
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
      appId: "ca-app-pub-3940256099942544~3347511713",
      sync: true
    }
  },
};

export default config;
