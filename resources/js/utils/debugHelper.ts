/**
 * Debug Helper Utility
 * Helps track authentication and navigation flow for troubleshooting
 */

// Debug levels
type DebugLevel = 'info' | 'warn' | 'error';

/**
 * Log a debug message with context
 */
export const debugLog = (context: string, message: string, level: DebugLevel = 'info', data?: any) => {
  const timestamp = new Date().toISOString();
  const prefix = `[${timestamp}][${context}]`;
  
  switch (level) {
    case 'info':
      console.log(`${prefix} ${message}`, data !== undefined ? data : '');
      break;
    case 'warn':
      console.warn(`${prefix} ${message}`, data !== undefined ? data : '');
      break;
    case 'error':
      console.error(`${prefix} ${message}`, data !== undefined ? data : '');
      break;
  }
  
  // Also add to session storage for persistent debugging
  try {
    const logs = JSON.parse(sessionStorage.getItem('mrt_debug_logs') || '[]');
    logs.push({
      timestamp,
      context,
      level,
      message,
      data: data ? JSON.stringify(data) : undefined
    });
    
    // Keep only the last 100 logs
    if (logs.length > 100) {
      logs.shift();
    }
    
    sessionStorage.setItem('mrt_debug_logs', JSON.stringify(logs));
  } catch (e) {
    console.error('Error saving debug log to session storage', e);
  }
};

/**
 * Track navigation events
 */
export const trackNavigation = (from: string, to: string, data?: any) => {
  debugLog('Navigation', `From: ${from} → To: ${to}`, 'info', data);
};

/**
 * Track API calls
 */
export const trackApiCall = (endpoint: string, method: string, data?: any) => {
  debugLog('API', `${method.toUpperCase()} ${endpoint}`, 'info', data);
};

/**
 * Track authentication events
 */
export const trackAuth = (event: string, success: boolean, data?: any) => {
  debugLog('Auth', `${event} - ${success ? 'Success' : 'Failed'}`, success ? 'info' : 'error', data);
};

/**
 * Get all debug logs
 */
export const getDebugLogs = () => {
  try {
    return JSON.parse(sessionStorage.getItem('mrt_debug_logs') || '[]');
  } catch (e) {
    console.error('Error retrieving debug logs', e);
    return [];
  }
};

/**
 * Clear all debug logs
 */
export const clearDebugLogs = () => {
  sessionStorage.removeItem('mrt_debug_logs');
};

export default {
  debugLog,
  trackNavigation,
  trackApiCall,
  trackAuth,
  getDebugLogs,
  clearDebugLogs
};