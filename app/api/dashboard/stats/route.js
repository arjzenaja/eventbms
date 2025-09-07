import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const dbPath = path.join(process.cwd(), 'db.json');

export async function GET() {
  try {
    // Read the database file once
    const dbData = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    
    // Extract all data arrays
    const events = dbData.events || [];
    const destinations = dbData.wisata || [];
    const culinary = dbData.kuliner || [];
    const accommodations = dbData.penginapan || [];
    const souvenirs = dbData.oleh_oleh || [];
    const villages = dbData.desa_wisata || [];
    const travelAgencies = dbData.biro_perjalanan || [];
    const users = dbData.users || [];

    // Calculate statistics
    const stats = {
      totalEvents: events.length,
      totalDestinations: destinations.length,
      totalAccommodations: accommodations.length,
      totalCulinary: culinary.length,
      totalSouvenirs: souvenirs.length,
      totalVillages: villages.length,
      totalTravelAgencies: travelAgencies.length,
      totalUsers: users.length
    };

    // Get recent events (top 5)
    const recentEvents = events
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 5);

    // Prepare chart data from events
    const eventTypes = {};
    const monthlyData = {};
    
    events.forEach(event => {
      // Count by type
      const normalized = (typeof event.type === 'string' && (event.type === 'objek-wisata' || event.type.startsWith('wisata-')))
        ? 'objek-wisata'
        : event.type;
      eventTypes[normalized] = (eventTypes[normalized] || 0) + 1;
      
      // Count by month
      if (event.date) {
        const date = new Date(event.date);
        const month = date.toLocaleString('id-ID', { month: 'long' });
        monthlyData[month] = (monthlyData[month] || 0) + 1;
      }
    });

    const chartData = {
      eventTypes: Object.entries(eventTypes).map(([type, count]) => ({ type, count })),
      monthlyEvents: Object.entries(monthlyData).map(([month, count]) => ({ month, count }))
    };

    // Collect recent data from all categories (top 5 most recent)
    const allData = [];
    
    // Add events with category info
    events.slice(0, 3).forEach(event => {
      allData.push({
        ...event,
        category: 'Event',
        categoryIcon: '🎉',
        source: 'events'
      });
    });
    
    // Add destinations with category info
    destinations.slice(0, 2).forEach(dest => {
      allData.push({
        ...dest,
        category: 'Objek Wisata',
        categoryIcon: '🏔️',
        source: 'destinations'
      });
    });
    
    // Add culinary with category info
    culinary.slice(0, 2).forEach(cul => {
      allData.push({
        ...cul,
        category: 'Kuliner',
        categoryIcon: '🍽️',
        source: 'culinary'
      });
    });
    
    // Add accommodations with category info
    accommodations.slice(0, 2).forEach(acc => {
      allData.push({
        ...acc,
        category: 'Penginapan',
        categoryIcon: '🏨',
        source: 'accommodation'
      });
    });
    
    // Add souvenirs with category info
    souvenirs.slice(0, 2).forEach(sou => {
      allData.push({
        ...sou,
        category: 'Souvenir',
        categoryIcon: '🛍️',
        source: 'souvenirs'
      });
    });
    
    // Add villages with category info
    villages.slice(0, 2).forEach(vill => {
      allData.push({
        ...vill,
        category: 'Desa Wisata',
        categoryIcon: '🏘️',
        source: 'villages'
      });
    });
    
    // Add travel agencies with category info
    travelAgencies.slice(0, 2).forEach(ta => {
      allData.push({
        ...ta,
        category: 'Biro Perjalanan',
        categoryIcon: '🚌',
        source: 'travel-agencies'
      });
    });
    
    // Sort all data by creation date and take top 5
    const getEventCreatedAt = (event) => {
      if (!event) return null;
      const candidate =
        event.createdAt ||
        event.created_at ||
        event.addedAt ||
        event.added_at ||
        event.dateAdded ||
        event.date_added ||
        event.timestamp ||
        event.ts;
      return candidate || event.date || null;
    };

    const sortedAllData = allData.sort((a, b) => {
      const dateA = getEventCreatedAt(a) ? new Date(getEventCreatedAt(a)) : new Date();
      const dateB = getEventCreatedAt(b) ? new Date(getEventCreatedAt(b)) : new Date();
      return dateB - dateA;
    }).slice(0, 5);

    return NextResponse.json({
      success: true,
      stats,
      recentEvents,
      chartData,
      recentData: sortedAllData,
      lastUpdated: new Date().toISOString()
    }, {
      headers: {
        'Cache-Control': 'public, max-age=300, s-maxage=600', // 5 minutes client cache, 10 minutes CDN cache
        'ETag': `"dashboard-${Date.now()}"`,
        'Last-Modified': new Date().toUTCString()
      }
    });
    
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Terjadi kesalahan saat mengambil data dashboard'
      },
      { status: 500 }
    );
  }
}
