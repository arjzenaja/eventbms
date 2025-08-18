# Dark/Light Theme Implementation

## Overview
The EventBMS application now supports both dark and light themes with a toggle button in the header. Users can switch between themes, and their preference is saved in localStorage.

## Features

### Theme Toggle
- **Location**: Header component (top-right corner)
- **Icons**: 
  - 🌙 Moon icon (light mode) - click to switch to dark mode
  - ☀️ Sun icon (dark mode) - click to switch to light mode
- **Persistence**: Theme preference is saved in localStorage
- **System Preference**: Automatically detects user's system theme preference on first visit

### Theme Context
- **File**: `context/ThemeContext.jsx`
- **Provider**: Wraps the entire application
- **Hook**: `useTheme()` for accessing theme state

### Components Updated
1. **Header** - Added theme toggle button
2. **Profile Page** - Full dark mode support
3. **Login Page** - Full dark mode support
4. **Register Page** - Full dark mode support
5. **Global CSS** - Added dark mode styles

## Implementation Details

### Theme Context Usage
```jsx
import { useTheme } from '@/context/ThemeContext';

const { theme, toggleTheme, isDark, isLight } = useTheme();
```

### CSS Classes
- Light mode: Default styling
- Dark mode: Uses `dark:` prefix classes
- Example: `bg-white dark:bg-gray-800`

### Color Scheme
- **Light Mode**: White backgrounds, dark text (gray-900), light gray sections (gray-50/100)
- **Dark Mode**: Gray-800/900 backgrounds, white text
- **Accent Colors**: Blue-600/400 for links and buttons
- **Form Elements**: Proper contrast in both modes
- **Hero Section**: Maintains dark overlay for readability over background images

## Files Modified

### New Files
- `context/ThemeContext.jsx` - Theme context and provider
- `components/ThemeToggle.jsx` - Theme toggle button component
- `THEME_IMPLEMENTATION.md` - This documentation

### Modified Files
- `app/layout.jsx` - Added ThemeProvider
- `components/Header.jsx` - Added theme toggle and light mode styling
- `app/page.jsx` - Updated main page for light mode compatibility
- `components/hero.jsx` - Updated hero section for better light mode contrast
- `app/profile/page.jsx` - Added dark mode classes
- `app/login/page.jsx` - Added dark mode classes
- `app/register/page.jsx` - Added dark mode classes
- `app/globals.css` - Added dark mode styles and improved form input colors
- `tailwind.config.mjs` - Added dark mode colors

## Usage

### For Developers
1. Import the theme context: `import { useTheme } from '@/context/ThemeContext'`
2. Use the hook in your component: `const { theme, toggleTheme, isDark } = useTheme()`
3. Add dark mode classes: `className="bg-white dark:bg-gray-800"`

### For Users
1. Click the theme toggle button in the header
2. Theme preference is automatically saved
3. Theme persists across browser sessions

## Browser Support
- Modern browsers with CSS custom properties support
- Tailwind CSS dark mode classes
- localStorage for preference persistence

## Future Enhancements
- System theme auto-detection improvements
- More granular theme controls
- Animation transitions between themes
- Additional color schemes
