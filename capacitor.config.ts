import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.emojisliderz.app',
  appName: 'EmojiSliderz',
  webDir: 'out',
  plugins: {
    SplashScreen: {
      launchShowDuration: 0,
    },
    AdMob: {
      appId: "ca-app-pub-6516108479140141~8598170190",
    },
  },
};

export default config;
