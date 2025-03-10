'use client';

import mixpanel from 'mixpanel-browser';
const MIXPANEL_TOKEN = '0ac400c108903b0b715f5bc3e52f692e';
let isInitialized = false;
 
export const initMixpanel = () => {
  if (isInitialized) return;
  
  if (!MIXPANEL_TOKEN) {
    console.warn('Mixpanel token is missing! Check your .env file.');
    return;
  }
 
  mixpanel.init(MIXPANEL_TOKEN, { autotrack: true });
  isInitialized = true;
}

export const trackEvent = (eventName: string, properties?: Record<string, any>) => {
  if (typeof window !== 'undefined') {
    if (!isInitialized) {
      initMixpanel();
    }
    mixpanel.track(eventName, properties);
  }
};
