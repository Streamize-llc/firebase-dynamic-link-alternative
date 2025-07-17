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
  
  try {
    mixpanel.init(MIXPANEL_TOKEN, { autotrack: true });
    isInitialized = true;
  } catch (error) {
    console.error('Mixpanel 초기화 중 오류 발생:', error);
  }
}

export const trackEvent = (eventName: string, properties?: Record<string, any>) => {
  try {
    if (typeof window === 'undefined') return;
    
    if (!isInitialized) {
      initMixpanel();
    }
    
    mixpanel.track(eventName, properties);
  } catch (error) {
    console.error('이벤트 추적 중 오류 발생:', error);
  }
};
