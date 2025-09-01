import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/**
 * Clean up corrupted localStorage data
 */
export function cleanupLocalStorage() {
  try {
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key === 'flashToast') {
        try {
          const value = localStorage.getItem(key);
          if (value) {
            const parsed = JSON.parse(value);
            // Validate the parsed data
            if (!parsed || 
                typeof parsed !== 'object' || 
                !['success', 'error', 'warning', 'info'].includes(parsed.type) ||
                typeof parsed.title !== 'string' || 
                !parsed.title.trim() ||
                typeof parsed.message !== 'string') {
              console.warn('Removing corrupted flash toast data:', parsed);
              localStorage.removeItem(key);
            }
          }
        } catch (error) {
          console.warn('Removing corrupted flash toast data due to parse error');
          localStorage.removeItem(key);
        }
      }
    });
  } catch (error) {
    console.error('Error cleaning up localStorage:', error);
  }
}

/**
 * Clean up corrupted admin localStorage data
 */
export function cleanupAdminLocalStorage() {
  try {
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key === 'adminFlashToast') {
        try {
          const value = localStorage.getItem(key);
          if (value) {
            const parsed = JSON.parse(value);
            // Validate the parsed data
            if (!parsed || 
                typeof parsed !== 'object' || 
                !['success', 'error', 'warning', 'info'].includes(parsed.type) ||
                typeof parsed.title !== 'string' || 
                !parsed.title.trim() ||
                typeof parsed.message !== 'string') {
              console.warn('Removing corrupted admin flash toast data:', parsed);
              localStorage.removeItem(key);
            }
          }
        } catch (error) {
          console.warn('Removing corrupted admin flash toast data due to parse error');
          localStorage.removeItem(key);
        }
      }
    });
  } catch (error) {
    console.error('Error cleaning up admin localStorage:', error);
  }
}

/**
 * Safe localStorage getter with validation
 */
export function getValidFlashToast() {
  try {
    const raw = localStorage.getItem('flashToast');
    if (!raw) return null;
    
    const parsed = JSON.parse(raw);
    
    // Validate the parsed data
    if (parsed && 
        typeof parsed === 'object' && 
        ['success', 'error', 'warning', 'info'].includes(parsed.type) &&
        typeof parsed.title === 'string' && 
        parsed.title.trim() &&
        typeof parsed.message === 'string') {
      return parsed;
    } else {
      console.warn('Invalid flash toast data, removing:', parsed);
      localStorage.removeItem('flashToast');
      return null;
    }
  } catch (error) {
    console.error('Error parsing flash toast:', error);
    localStorage.removeItem('flashToast');
    return null;
  }
}

/**
 * Safe admin localStorage getter with validation
 */
export function getValidAdminFlashToast() {
  try {
    const raw = localStorage.getItem('adminFlashToast');
    if (!raw) return null;
    
    const parsed = JSON.parse(raw);
    
    // Validate the parsed data
    if (parsed && 
        typeof parsed === 'object' && 
        ['success', 'error', 'warning', 'info'].includes(parsed.type) &&
        typeof parsed.title === 'string' && 
        parsed.title.trim() &&
        typeof parsed.message === 'string') {
      return parsed;
    } else {
      console.warn('Invalid admin flash toast data, removing:', parsed);
      localStorage.removeItem('adminFlashToast');
      return null;
    }
  } catch (error) {
    console.error('Error parsing admin flash toast:', error);
    localStorage.removeItem('adminFlashToast');
    return null;
  }
}
