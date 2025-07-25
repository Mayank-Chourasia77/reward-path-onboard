import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.fbfe4da55c6e48279189cd64322fe05e',
  appName: 'RewardsTracker',
  webDir: 'dist',
  server: {
    url: 'https://fbfe4da5-5c6e-4827-9189-cd64322fe05e.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#8B5CF6',
      showSpinner: false
    }
  }
};

export default config;