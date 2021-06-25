import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'in.cowin.android',
  appName: 'CowinVue',
  webDir: 'dist',
  bundledWebRuntime: false,
  plugins: {
    SplashScreen: {
        launchAutoHide: true,
        launchShowDuration: 1000,
        androidScaleType: "CENTER_CROP",
        showSpinner: false,
        splashFullScreen: false,
        splashImmersive: false
    }
}
};

export default config;
