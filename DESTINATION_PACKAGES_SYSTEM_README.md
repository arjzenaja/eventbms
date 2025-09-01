# Destination Packages Management System

## Overview
The Destination Packages Management System is a comprehensive CRUD (Create, Read, Update, Delete) system for managing tour packages associated with tourist destinations. This system allows administrators to create, edit, delete, and manage various tour packages with detailed information including pricing, inclusions, exclusions, and availability status.

## Features

### 🎯 Core Functionality
- **Package Management**: Full CRUD operations for destination packages
- **Destination Association**: Each package is linked to a specific tourist destination
- **Category System**: Organized package categories (Family, Adventure, Romantic, etc.)
- **Status Management**: Available/Unavailable and Popular/Not Popular flags
- **Search & Filtering**: Advanced search and filtering capabilities
- **Data Export**: CSV export functionality for data analysis

### 📊 Package Information
- **Basic Details**: Name, description, category
- **Pricing**: Package price and duration
- **Capacity**: Maximum number of participants
- **Inclusions**: What's included in the package
- **Exclusions**: What's not included in the package
- **Status**: Availability and popularity indicators

### 🔍 Search & Filter Options
- **Text Search**: Search by package name or description
- **Destination Filter**: Filter packages by specific destination
- **Category Filter**: Filter by package category
- **Real-time Results**: Instant filtering and search results

## System Architecture

### API Endpoints

#### 1. Main Packages Route (`/api/destinations/packages`)
- **GET**: Retrieve all packages with optional filtering
- **POST**: Create new package for a destination

#### 2. Individual Package Route (`/api/destinations/packages/[id]`)
- **GET**: Retrieve specific package by ID
- **PUT**: Update existing package
- **DELETE**: Remove package from destination

### Database Structure
Packages are stored within the `pricing.packages` array of each destination in the `wisata` collection:

```json
{
  "id": "1",
  "name": "Paket Keluarga Weekend",
  "description": "Paket wisata keluarga untuk weekend",
  "category": "Paket Keluarga",
  "price": "500.000",
  "inclusions": "Tiket masuk, makan siang, pemandu wisata",
  "exclusions": "Transportasi, akomodasi",
  "duration": "2 hari 1 malam",
  "capacity": "4 orang",
  "available": true,
  "popular": false,
  "created_at": "2025-01-27T10:00:00.000Z",
  "updated_at": "2025-01-27T10:00:00.000Z"
}
```

## Admin Interface

### 1. Main Packages Page (`/admin/destinations/packages`)
- **Package Listing**: Table view of all packages with key information
- **Quick Actions**: Toggle availability and popularity status
- **Summary Cards**: Total packages, available packages, popular packages, unique destinations
- **Search & Filter**: Advanced filtering and search functionality
- **Export Functionality**: CSV export for data analysis

### 2. New Package Form (`/admin/destinations/packages/new`)
- **Destination Selection**: Dropdown to select associated destination
- **Package Details**: Name, description, category inputs
- **Pricing & Duration**: Price, duration, and capacity fields
- **Inclusions & Exclusions**: Detailed package content information
- **Status Options**: Available and popular checkboxes

### 3. Edit Package Form (`/admin/destinations/packages/[id]`)
- **Package Information**: Display current package details
- **Editable Fields**: All package information can be modified
- **Validation**: Required field validation and error handling
- **Update Functionality**: Save changes to existing packages

## User Experience Features

### 🎨 Modern UI Design
- **Responsive Layout**: Mobile-friendly design with Tailwind CSS
- **Intuitive Navigation**: Clear navigation between pages
- **Visual Indicators**: Icons and color coding for better UX
- **Loading States**: Proper loading and error handling

### 🔄 Interactive Elements
- **Status Toggles**: Quick availability and popularity toggles
- **Real-time Updates**: Immediate UI updates after actions
- **Confirmation Dialogs**: User confirmation for destructive actions
- **Success/Error Messages**: Clear feedback for all operations

### 📱 Responsive Design
- **Mobile First**: Optimized for mobile devices
- **Tablet Support**: Responsive design for tablet screens
- **Desktop Experience**: Full-featured desktop interface

## Technical Implementation

### Frontend Technologies
- **Next.js 14**: React framework with App Router
- **React Hooks**: useState, useEffect for state management
- **Tailwind CSS**: Utility-first CSS framework
- **Protected Routes**: Authentication and authorization

### Backend Technologies
- **Next.js API Routes**: Server-side API endpoints
- **File System**: JSON-based data storage (`db.json`)
- **FormData**: Handling form submissions and file uploads
- **Error Handling**: Comprehensive error handling and validation

### Data Flow
1. **User Input**: Form data collection and validation
2. **API Processing**: Server-side data processing and storage
3. **Database Update**: JSON file updates with new package data
4. **UI Refresh**: Real-time interface updates
5. **User Feedback**: Success/error messages and navigation

## Security Features

### 🔐 Authentication
- **Protected Routes**: Admin-only access to package management
- **Session Management**: Secure user session handling
- **Role-based Access**: Admin role verification

### 🛡️ Data Validation
- **Input Validation**: Server-side form validation
- **Data Sanitization**: Clean data processing
- **Error Handling**: Secure error message handling

## Usage Instructions

### For Administrators

#### 1. Accessing the System
- Navigate to `/admin/destinations/packages`
- Ensure you have admin privileges
- Use the "Kelola Paket" button from the main destinations page

#### 2. Creating New Packages
- Click "Tambah Paket Baru" button
- Select destination from dropdown
- Fill in package details (name, description, price, etc.)
- Set availability and popularity status
- Click "Simpan Paket"

#### 3. Managing Existing Packages
- View all packages in the main listing
- Use search and filters to find specific packages
- Toggle availability and popularity status
- Edit package details using the edit button
- Delete packages using the delete button

#### 4. Exporting Data
- Use the "Export" button to download CSV data
- Filter data before export for specific datasets
- CSV includes all package information for analysis

### For Developers

#### 1. API Integration
```javascript
// Fetch all packages
const response = await fetch('/api/destinations/packages');
const data = await response.json();

// Create new package
const formData = new FormData();
formData.append('destinationId', '1');
formData.append('name', 'Package Name');
formData.append('price', '500.000');
// ... other fields

const response = await fetch('/api/destinations/packages', {
  method: 'POST',
  body: formData
});
```

#### 2. Customization
- Modify package categories in the form components
- Add new fields by updating API routes and forms
- Customize validation rules in API endpoints
- Extend filtering options in the main listing page

## File Structure

```
app/
├── admin/
│   └── destinations/
│       └── packages/
│           ├── page.jsx                    # Main packages listing
│           ├── new/
│           │   └── page.jsx               # New package form
│           └── [id]/
│               └── page.jsx               # Edit package form
├── api/
│   └── destinations/
│       └── packages/
│           ├── route.js                   # Main packages API
│           └── [id]/
│               └── route.js               # Individual package API
└── components/                            # Shared components
```

## Dependencies

### Required Components
- `ProtectedRoute`: Authentication wrapper
- `LoadingSpinner`: Loading state component
- `ErrorHandler`: Error handling component

### External Dependencies
- `next/navigation`: Next.js routing
- `next/link`: Next.js link component
- `react`: React hooks and components

## Future Enhancements

### 🚀 Planned Features
- **Bulk Operations**: Mass edit and delete functionality
- **Advanced Analytics**: Package performance metrics
- **Image Management**: Package photo galleries
- **Booking Integration**: Direct booking system integration
- **Multi-language Support**: Internationalization support

### 🔧 Technical Improvements
- **Database Migration**: Move to proper database system
- **API Rate Limiting**: Request throttling and security
- **Caching Layer**: Redis or similar caching system
- **Real-time Updates**: WebSocket integration for live updates

## Troubleshooting

### Common Issues

#### 1. Package Not Saving
- Check required fields (destinationId, name, price)
- Verify destination exists in database
- Check browser console for error messages

#### 2. Search Not Working
- Ensure search term is entered correctly
- Check filter selections
- Verify data exists in database

#### 3. API Errors
- Check network connectivity
- Verify API endpoint URLs
- Check server logs for detailed errors

### Debug Information
- Use browser developer tools for client-side debugging
- Check Network tab for API request/response details
- Review console logs for JavaScript errors
- Verify database file permissions and structure

## Support and Maintenance

### 🆘 Getting Help
- Check this documentation for common solutions
- Review API response messages for error details
- Verify database structure and permissions
- Test with minimal data to isolate issues

### 🧹 Maintenance Tasks
- Regular database backups
- Monitor API performance
- Update package information regularly
- Clean up unused or outdated packages

---

**Last Updated**: January 27, 2025  
**Version**: 1.0.0  
**Author**: EventBMS Development Team
