import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const dbPath = path.join(process.cwd(), 'db.json');

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const agencyId = searchParams.get('agencyId');
    const agencySlug = searchParams.get('agencySlug');
    const category = searchParams.get('category');

    // Read the database file
    const dbData = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    
    // Get travel agency prices data
    let prices = [];
    
    // If specific agency ID is requested, get prices from that agency
    if (agencyId) {
      const agency = dbData.biro_perjalanan?.find(a => a.id === agencyId);
      if (agency && agency.prices) {
        prices = agency.prices.map(price => ({
          ...price,
          agencyId: agency.id,
          agencyName: agency.title,
          agencySlug: agency.title.toLowerCase().replace(/\s+/g, '-')
        }));
      }
    } else {
      // Get all prices from all agencies
      dbData.biro_perjalanan?.forEach(agency => {
        if (agency.prices && Array.isArray(agency.prices)) {
          agency.prices.forEach(price => {
            prices.push({
              ...price,
              agencyId: agency.id,
              agencyName: agency.title,
              agencySlug: agency.title.toLowerCase().replace(/\s+/g, '-')
            });
          });
        }
      });
    }
    
    // Apply filters
    if (agencySlug) {
      prices = prices.filter(price => price.agencySlug === agencySlug);
    }
    
    if (category) {
      prices = prices.filter(price => price.category === category);
    }
    
    return NextResponse.json({
      success: true,
      prices: prices,
      message: 'Travel agency prices retrieved successfully'
    });
  } catch (error) {
    console.error('Error reading travel agency prices:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to retrieve travel agency prices',
      error: error.message
    }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const formData = await request.formData();
    
    // Read existing data
    const dbData = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    
    // Create new price object
    const newPrice = {
      id: Date.now().toString(),
      name: formData.get('name') || '',
      category: formData.get('category') || 'domestik',
      duration: formData.get('duration') || '',
      price: formData.get('price') || '',
      originalPrice: formData.get('originalPrice') || '',
      description: formData.get('description') || '',
      agencyId: formData.get('agencyId') || '',
      includes: formData.get('includes') ? formData.get('includes').split(',').map(item => item.trim()).filter(Boolean) : [],
      excludes: formData.get('excludes') ? formData.get('excludes').split(',').map(item => item.trim()).filter(Boolean) : [],
      departure: formData.get('departure') || '',
      capacity: formData.get('capacity') || '',
      vehicle: formData.get('vehicle') || '',
      rating: parseFloat(formData.get('rating')) || 0,
      reviews: parseInt(formData.get('reviews')) || 0,
      popular: formData.get('popular') === 'true',
      available: formData.get('available') === 'true',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    // Find the agency and add the price
    const agencyIndex = dbData.biro_perjalanan?.findIndex(a => a.id === newPrice.agencyId);
    if (agencyIndex !== -1) {
      if (!dbData.biro_perjalanan[agencyIndex].prices) {
        dbData.biro_perjalanan[agencyIndex].prices = [];
      }
      dbData.biro_perjalanan[agencyIndex].prices.push(newPrice);
    }
    
    // Write back to file
    fs.writeFileSync(dbPath, JSON.stringify(dbData, null, 2));
    
    return NextResponse.json({
      success: true,
      price: newPrice,
      message: 'Travel agency price created successfully'
    });
  } catch (error) {
    console.error('Error creating travel agency price:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to create travel agency price',
      error: error.message
    }, { status: 500 });
  }
}
