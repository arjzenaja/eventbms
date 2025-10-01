# Desa Wisata Coordinates Feature

## Overview
This document describes the implementation of location coordinates for the "Desa Wisata" (Tourist Village) section in the EventBMS application.

## Features Added

### 1. Coordinate Input Fields
- **Latitude (Latitude)**: Input field for latitude coordinates
- **Longitude (Longitude)**: Input field for longitude coordinates
- Added to both new village creation and edit forms

### 2. Coordinate Display
- New "KOORDINAT" column in the main villages listing table
- Shows both latitude and longitude values
- Handles both coordinate formats (latitude/longitude and lat/lng)

### 3. Data Export
- Coordinates included in CSV export functionality
- Separate columns for Latitude and Longitude

## Implementation Details

### Frontend Changes

#### New Village Form (`/admin/villages/new`)
- Added `coordinates: { lat: "", lng: "" }` to form state
- Added `handleCoordinateChange` function for coordinate updates
- Added coordinate input section with helpful instructions
- Updated form submission to send coordinates as separate latitude/longitude fields

#### Edit Village Form (`/admin/villages/[id]`)
- Added coordinates to form state
- Added coordinate input section
- Updated data fetching to populate coordinate fields
- Handles both coordinate formats from existing data

#### Main Villages Listing (`/admin/villages`)
- Added "KOORDINAT" column to table header
- Displays coordinates in compact format (Lat: X, Lng: Y)
- Updated table colspan for "no data" message
- Enhanced export function to include coordinates

### Backend Changes

#### API Route (`/api/villages/[id]`)
- Updated PUT method to handle latitude and longitude form data
- Stores coordinates in standardized format: `{ latitude: X, longitude: Y }`

#### Existing API (`/api/desa_wisata`)
- Already supported coordinates in POST method
- Uses `latitude` and `longitude` fields for consistency

## Coordinate Format

### Input Format
- **Latitude**: Decimal degrees (e.g., -7.123456)
  - Negative values for Southern Hemisphere
  - Positive values for Northern Hemisphere
- **Longitude**: Decimal degrees (e.g., 109.123456)
  - Positive values for Eastern Hemisphere
  - Negative values for Western Hemisphere

### Storage Format
```json
{
  "coordinates": {
    "latitude": "-7.123456",
    "longitude": "109.123456"
  }
}
```

## User Instructions

### Getting Coordinates
1. **Google Maps Method**:
   - Open Google Maps and search for the tourist village location
   - Right-click on the location and select "What's here?"
   - Coordinates will appear at the bottom of the screen

2. **GPS App Method**:
   - Use a GPS app on your smartphone
   - Navigate to the tourist village location
   - Copy the displayed coordinates

### Input Guidelines
- Enter coordinates with 6 decimal places for precision
- Include the negative sign for Southern Hemisphere latitudes
- Include the positive sign for Eastern Hemisphere longitudes
- Example: `-7.123456, 109.123456`

## Benefits

1. **Location Accuracy**: Precise location data for mapping applications
2. **Navigation**: Enables GPS navigation to tourist villages
3. **Integration**: Ready for future map integration features
4. **Data Export**: Coordinates available for external mapping tools
5. **User Experience**: Clear instructions and validation for coordinate input

## Future Enhancements

1. **Map Integration**: Display villages on interactive maps
2. **Distance Calculation**: Calculate distances between locations
3. **Route Planning**: Generate routes to tourist villages
4. **Geolocation Services**: Enable location-based features
5. **Coordinate Validation**: Real-time coordinate format validation

## Technical Notes

- Coordinates are stored as strings to preserve precision
- Backward compatibility maintained for existing data
- Form validation ensures proper coordinate format
- Responsive design for mobile and desktop input
- Helpful tooltips and instructions for users
