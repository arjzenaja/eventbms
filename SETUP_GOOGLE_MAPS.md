# 🗺️ Setup Google Maps API Key

## 🚨 IMPORTANT: Fix Required

To resolve the Google Maps API error, you need to configure your API key.

## 📋 Quick Setup

### 1. Create Environment File
Create a file named `.env.local` in your project root:

```bash
# Create .env.local file
touch .env.local
```

### 2. Add Your API Key
Add this line to `.env.local`:

```env
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_actual_google_maps_api_key_here
```

### 3. Get Google Maps API Key
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable these APIs:
   - Maps JavaScript API
   - Places API
   - Geocoding API
   - Directions API
4. Create credentials (API Key)
5. Copy the API key

### 4. Restart Development Server
```bash
npm run dev
# or
yarn dev
```

## 🔧 Alternative: Disable Google Maps

If you don't want to use Google Maps right now, you can:

1. Comment out the map components in your pages
2. Use only the fallback components
3. The app will still work without maps

## 📱 Test the Fix

After setup, visit:
```
http://localhost:3000/dolan-banyumas/wisata/34
```

The map should now load without errors.

## 🚨 Common Issues

### "InvalidKeyMapError"
- Check if `.env.local` file exists
- Verify API key is correct
- Ensure APIs are enabled in Google Cloud Console
- Check if billing is set up

### "removeChild" DOM Errors
- These are now fixed in the code
- If they persist, try refreshing the page

## 📚 More Information

See `GOOGLE_MAPS_SETUP.md` for detailed setup instructions.
