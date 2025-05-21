import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.example.todo',
  appName: 'Nasos raqamli boshqaruvi',
  webDir: 'dist',
  plugins: {
    SplashScreen: {
      launchAutoHide: true
    }
  }
};

export default config;
