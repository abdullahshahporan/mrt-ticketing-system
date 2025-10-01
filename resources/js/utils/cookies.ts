// Minimal cookie management utility

export const COOKIE_KEYS = {
  CONSENT: 'mrt_cookie_consent',
  CONSENT_DATE: 'mrt_consent_date',
  PREFERENCES: 'mrt_preferences'
} as const;

/**
 * Check if user has given cookie consent
 */
export const hasGivenConsent = (): boolean => {
  try {
    const consent = localStorage.getItem(COOKIE_KEYS.CONSENT);
    return consent === 'accepted';
  } catch {
    return false;
  }
};

/**
 * Check if consent has expired (30 days)
 */
export const isConsentExpired = (): boolean => {
  try {
    const consentDate = localStorage.getItem(COOKIE_KEYS.CONSENT_DATE);
    if (!consentDate) return true;
    
    const consentTime = new Date(consentDate).getTime();
    const now = new Date().getTime();
    const thirtyDays = 30 * 24 * 60 * 60 * 1000;
    
    return (now - consentTime) > thirtyDays;
  } catch {
    return true;
  }
};

/**
 * Set cookie consent
 */
export const setCookieConsent = (accepted: boolean): void => {
  try {
    localStorage.setItem(COOKIE_KEYS.CONSENT, accepted ? 'accepted' : 'declined');
    localStorage.setItem(COOKIE_KEYS.CONSENT_DATE, new Date().toISOString());
    
    // Simple preferences
    const preferences = {
      necessary: true,
      analytics: accepted,
      preferences: accepted
    };
    localStorage.setItem(COOKIE_KEYS.PREFERENCES, JSON.stringify(preferences));
    
    // Log to backend if accepted
    if (accepted) {
      logConsentToBackend('accepted', preferences);
    }
  } catch (error) {
    console.warn('Failed to set cookie consent:', error);
  }
};

/**
 * Log consent to backend
 */
const logConsentToBackend = async (consentType: string, preferences: any): Promise<void> => {
  try {
    await fetch('/api/cookie-consent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
      },
      body: JSON.stringify({
        consent_type: consentType,
        preferences: preferences
      })
    });
  } catch (error) {
    console.warn('Failed to log consent:', error);
  }
};

/**
 * Get cookie preferences
 */
export const getCookiePreferences = () => {
  try {
    const stored = localStorage.getItem(COOKIE_KEYS.PREFERENCES);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.warn('Failed to get preferences:', error);
  }
  
  return {
    necessary: true,
    analytics: false,
    preferences: false
  };
};