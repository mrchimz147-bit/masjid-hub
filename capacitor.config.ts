import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'org.zeenatulislam.masjidhub',
  appName: 'Masjid Hub',
  webDir: 'public',
  server: {
    // Point to live Vercel deployment for API routes
    url: 'https://masjid-hub-jb9p.vercel.app',
    cleartext: true,
    androidScheme: 'https'
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#1B5E20',
      showSpinner: false
    }
  }
};

export default config;
