# Event Packages Management System

## Overview
The Event Packages Management System provides comprehensive CRUD operations for managing event ticket packages, similar to the village packages and souvenir packages systems. This system allows administrators to create, read, update, and delete different types of event packages with detailed information.

## Features

### Core Functionality
- **Create Packages**: Add new event packages with comprehensive details
- **List Packages**: View all packages with filtering and search capabilities
- **Edit Packages**: Modify existing package information
- **Delete Packages**: Remove packages from the system
- **Status Management**: Toggle package availability and popularity

### Package Categories
- **Regular**: Standard event packages
- **VIP**: Premium packages with enhanced benefits
- **Premium**: High-tier packages
- **Early Bird**: Special pricing for early bookings
- **Group**: Packages designed for group bookings

### Package Information
- **Basic Details**: Name, description, category, price
- **Event Association**: Links packages to specific events
- **Capacity Management**: Track total capacity and sold tickets
- **Inclusions**: What's included in the package
- **Terms & Requirements**: Booking conditions and requirements
- **Cancellation Policy**: Refund and cancellation terms
- **Status Flags**: Popular and available status

## API Routes

### Main Packages Route
- **Path**: `/api/events/packages`
- **GET**: Retrieve all packages with optional filtering
- **POST**: Create new package

### Individual Package Route
- **Path**: `/api/events/packages/[id]`
- **GET**: Retrieve specific package by ID
- **PUT**: Update existing package
- **DELETE**: Remove package

## Admin UI

### Main Packages Page
- **Path**: `/admin/events/packages`
- **Features**:
  - Package listing with search and filters
  - Summary statistics (total, available, popular)
  - Quick actions (edit, delete, toggle status)
  - Event and category filtering

### New Package Form
- **Path**: `/admin/events/packages/new`
- **Features**:
  - Comprehensive form for package creation
  - Event selection dropdown
  - Category and pricing options
  - Detailed package information fields

### Edit Package Form
- **Path**: `/admin/events/packages/[id]`
- **Features**:
  - Pre-filled form with existing data
  - All fields editable
  - Validation and error handling

## Database Structure

### Package Object
```json
{
  "id": "unique_id",
  "seat": "Package Name",
  "desc": "Package Description",
  "category": "regular|vip|premium|early-bird|group",
  "price": 150000,
  "eventId": "event_id",
  "includes": ["Tiket Masuk", "Makan Siang"],
  "terms_requirements": ["Min. 1 orang", "Bayar full H-7"],
  "terms_cancellation": ["H-7: 100%", "H-3: 50%"],
  "capacity": 100,
  "sold": 25,
  "popular": false,
  "available": true,
  "created_at": "2024-01-01T00:00:00.000Z",
  "updated_at": "2024-01-01T00:00:00.000Z"
}
```

### Event Integration
Packages are stored within the `seats` array of each event object in the database, maintaining the relationship between events and their packages.

## Usage

### Accessing the System
1. Navigate to `/admin/events` (main events page)
2. Click the "📦 Kelola Paket" button
3. This will take you to `/admin/events/packages`

### Creating a New Package
1. Click "Tambah Paket" button
2. Fill in all required fields
3. Select the associated event
4. Set package category and pricing
5. Add package details and terms
6. Submit the form

### Managing Existing Packages
1. Use search and filters to find specific packages
2. Click the edit (✏️) button to modify packages
3. Use the delete (🗑️) button to remove packages
4. Toggle availability status as needed

### Filtering and Search
- **Search**: Find packages by name or description
- **Event Filter**: Show packages for specific events
- **Category Filter**: Filter by package category
- **Status Indicators**: Visual indicators for popular and available packages

## Integration with Existing Systems

### Event Display
The packages are automatically displayed on the event detail page (`/dolan-banyumas/event/[id]`) through the existing `EventPackages` component.

### Admin Navigation
The system integrates seamlessly with the existing admin navigation, providing easy access from the main events management page.

## Benefits

1. **Centralized Management**: All event packages in one place
2. **Flexible Pricing**: Support for various package types and pricing models
3. **Capacity Tracking**: Monitor ticket sales and availability
4. **Detailed Information**: Comprehensive package details for customers
5. **Status Management**: Easy control over package availability and popularity
6. **Event Association**: Clear linking between packages and events

## Future Enhancements

- **Bulk Operations**: Import/export package data
- **Advanced Analytics**: Sales tracking and reporting
- **Package Templates**: Reusable package configurations
- **Multi-language Support**: Localized package descriptions
- **Image Support**: Package-specific images and graphics
- **Integration APIs**: Connect with external ticketing systems
