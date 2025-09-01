import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const dbPath = path.join(process.cwd(), 'db.json');

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const eventId = searchParams.get('eventId');
    const eventSlug = searchParams.get('eventSlug');
    const category = searchParams.get('category');

    // Read the database file
    const dbData = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    
    // Get event packages data
    let packages = [];
    
    // If specific event ID is requested, get packages from that event
    if (eventId) {
      const event = dbData.events?.find(e => e.id === eventId);
      if (event && event.seats) {
        packages = event.seats.map((seat, index) => ({
          ...seat,
          id: seat.id || `${event.id}-seat-${index}`,
          eventId: event.id,
          eventTitle: event.title,
          eventSlug: event.title.toLowerCase().replace(/\s+/g, '-')
        }));
      }
    } else {
      // Get all packages from all events
      dbData.events?.forEach(event => {
        if (event.seats && Array.isArray(event.seats)) {
          event.seats.forEach((seat, index) => {
            packages.push({
              ...seat,
              id: seat.id || `${event.id}-seat-${index}`,
              eventId: event.id,
              eventTitle: event.title,
              eventSlug: event.title.toLowerCase().replace(/\s+/g, '-')
            });
          });
        }
      });
    }
    
    // Apply filters
    if (eventSlug) {
      packages = packages.filter(pkg => pkg.eventSlug === eventSlug);
    }
    
    if (category) {
      packages = packages.filter(pkg => pkg.category === category);
    }
    
    return NextResponse.json({
      success: true,
      packages: packages,
      message: 'Event packages retrieved successfully'
    });
  } catch (error) {
    console.error('Error reading event packages:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to retrieve event packages',
      error: error.message
    }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const formData = await request.formData();
    
    // Read existing data
    const dbData = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    
    // Create new package object
    const newPackage = {
      id: Date.now().toString(),
      seat: formData.get('seat') || '',
      price: parseFloat(formData.get('price')) || 0,
      desc: formData.get('desc') || '',
      category: formData.get('category') || 'regular',
      eventId: formData.get('eventId') || '',
      includes: formData.get('includes') ? formData.get('includes').split(',').map(item => item.trim()).filter(Boolean) : [],
      terms_requirements: formData.get('terms_requirements') ? formData.get('terms_requirements').split(',').map(item => item.trim()).filter(Boolean) : [],
      terms_cancellation: formData.get('terms_cancellation') ? formData.get('terms_cancellation').split(',').map(item => item.trim()).filter(Boolean) : [],
      popular: formData.get('popular') === 'true',
      available: formData.get('available') === 'true',
      capacity: parseInt(formData.get('capacity')) || 0,
      sold: parseInt(formData.get('sold')) || 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    // Find the event and add the package
    const eventIndex = dbData.events?.findIndex(e => e.id === newPackage.eventId);
    if (eventIndex !== -1) {
      if (!dbData.events[eventIndex].seats) {
        dbData.events[eventIndex].seats = [];
      }
      dbData.events[eventIndex].seats.push(newPackage);
    }
    
    // Write back to file
    fs.writeFileSync(dbPath, JSON.stringify(dbData, null, 2));
    
    return NextResponse.json({
      success: true,
      package: newPackage,
      message: 'Event package created successfully'
    });
  } catch (error) {
    console.error('Error creating event package:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to create event package',
      error: error.message
    }, { status: 500 });
  }
}
