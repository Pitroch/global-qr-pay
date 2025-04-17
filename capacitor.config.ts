
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.af44120cdef344ccaa660e864a39f7f3',
  appName: 'global-qr-pay',
  webDir: 'dist',
  server: {
    url: 'https://af44120c-def3-44cc-aa66-0e864a39f7f3.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 0
    }
  },
  android: {
    buildOptions: {
      keystorePath: null,
      keystorePassword: null,
      keystoreAlias: null,
      keystoreAliasPassword: null,
    }
  }
};

export default config;
