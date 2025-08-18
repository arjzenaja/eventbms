/**
 * Debug utilities for troubleshooting notification issues
 */

/**
 * Clear all flash toast data from localStorage
 */
export function clearAllFlashToasts() {
  try {
    localStorage.removeItem('flashToast');
    console.log('All flash toast data cleared');
    return true;
  } catch (error) {
    console.error('Error clearing flash toast data:', error);
    return false;
  }
}

/**
 * Check localStorage for corrupted data
 */
export function checkLocalStorageHealth() {
  try {
    const keys = Object.keys(localStorage);
    const issues = [];
    
    keys.forEach(key => {
      if (key === 'flashToast') {
        try {
          const value = localStorage.getItem(key);
          if (value) {
            const parsed = JSON.parse(value);
            if (!parsed || typeof parsed !== 'object') {
              issues.push(`Invalid flashToast data type: ${typeof parsed}`);
            } else if (!['success', 'error', 'warning', 'info'].includes(parsed.type)) {
              issues.push(`Invalid flashToast type: ${parsed.type}`);
            } else if (typeof parsed.title !== 'string' || !parsed.title.trim()) {
              issues.push(`Invalid flashToast title: ${parsed.title}`);
            } else if (typeof parsed.message !== 'string') {
              issues.push(`Invalid flashToast message type: ${typeof parsed.message}`);
            }
          }
        } catch (error) {
          issues.push(`JSON parse error for flashToast: ${error.message}`);
        }
      }
    });
    
    if (issues.length === 0) {
      console.log('✅ localStorage is healthy');
      return { healthy: true, issues: [] };
    } else {
      console.warn('⚠️ localStorage has issues:', issues);
      return { healthy: false, issues };
    }
  } catch (error) {
    console.error('Error checking localStorage health:', error);
    return { healthy: false, issues: [error.message] };
  }
}

/**
 * Force cleanup of corrupted data
 */
export function forceCleanup() {
  try {
    const health = checkLocalStorageHealth();
    if (!health.healthy) {
      clearAllFlashToasts();
      console.log('Forced cleanup completed');
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error during forced cleanup:', error);
    return false;
  }
}

/**
 * Log current localStorage state
 */
export function logLocalStorageState() {
  try {
    const keys = Object.keys(localStorage);
    console.log('📋 localStorage contents:');
    
    keys.forEach(key => {
      if (key === 'flashToast') {
        try {
          const value = localStorage.getItem(key);
          if (value) {
            const parsed = JSON.parse(value);
            console.log(`  ${key}:`, parsed);
          } else {
            console.log(`  ${key}: null/empty`);
          }
        } catch (error) {
          console.log(`  ${key}: [CORRUPTED] ${error.message}`);
        }
      } else {
        console.log(`  ${key}: [other data]`);
      }
    });
  } catch (error) {
    console.error('Error logging localStorage state:', error);
  }
}

// Auto-cleanup on import
if (typeof window !== 'undefined') {
  // Only run in browser
  setTimeout(() => {
    forceCleanup();
  }, 1000);
}
