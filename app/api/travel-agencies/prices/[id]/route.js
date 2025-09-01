import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const dbPath = path.join(process.cwd(), 'db.json');

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    
    // Read the database file
    const dbData = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    
    // Find the specific price by ID across all agencies
    let foundPrice = null;
    let agencyName = '';
    
    for (const agency of dbData.biro_perjalanan || []) {
      if (agency.prices && Array.isArray(agency.prices)) {
        const price = agency.prices.find(p => p.id === id);
        if (price) {
          foundPrice = { ...price, agencyId: agency.id, agencyName: agency.title };
          break;
        }
      }
    }
    
    if (!foundPrice) {
      return NextResponse.json({
        success: false,
        message: 'Travel agency price tidak ditemukan'
      }, { status: 404 });
    }
    
    return NextResponse.json({
      success: true,
      price: foundPrice
    });
  } catch (error) {
    console.error('Error reading travel agency price:', error);
    return NextResponse.json({
      success: false,
      message: 'Terjadi kesalahan server'
    }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const formData = await request.formData();
    
    // Read the database file
    const dbData = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    
    // Find the specific price by ID across all agencies
    let foundAgencyIndex = -1;
    let foundPriceIndex = -1;
    
    for (let i = 0; i < (dbData.biro_perjalanan || []).length; i++) {
      const agency = dbData.biro_perjalanan[i];
      if (agency.prices && Array.isArray(agency.prices)) {
        const priceIndex = agency.prices.findIndex(p => p.id === id);
        if (priceIndex !== -1) {
          foundAgencyIndex = i;
          foundPriceIndex = priceIndex;
          break;
        }
      }
    }
    
    if (foundAgencyIndex === -1 || foundPriceIndex === -1) {
      return NextResponse.json({
        success: false,
        message: 'Travel agency price tidak ditemukan'
      }, { status: 404 });
    }
    
    const existingPrice = dbData.biro_perjalanan[foundAgencyIndex].prices[foundPriceIndex];
    
    // Update the price
    const updatedPrice = {
      ...existingPrice,
      name: formData.get('name') || existingPrice.name,
      category: formData.get('category') || existingPrice.category,
      duration: formData.get('duration') || existingPrice.duration,
      price: formData.get('price') || existingPrice.price,
      originalPrice: formData.get('originalPrice') || existingPrice.originalPrice,
      description: formData.get('description') || existingPrice.description,
      includes: formData.get('includes') ? formData.get('includes').split(',').map(item => item.trim()).filter(Boolean) : existingPrice.includes,
      excludes: formData.get('excludes') ? formData.get('excludes').split(',').map(item => item.trim()).filter(Boolean) : existingPrice.excludes,
      departure: formData.get('departure') || existingPrice.departure,
      capacity: formData.get('capacity') || existingPrice.capacity,
      vehicle: formData.get('vehicle') || existingPrice.vehicle,
      rating: parseFloat(formData.get('rating')) || existingPrice.rating,
      reviews: parseInt(formData.get('reviews')) || existingPrice.reviews,
      popular: formData.get('popular') === 'true',
      available: formData.get('available') === 'true',
      updated_at: new Date().toISOString()
    };
    
    // Update the price in the array
    dbData.biro_perjalanan[foundAgencyIndex].prices[foundPriceIndex] = updatedPrice;
    
    // Write back to database
    fs.writeFileSync(dbPath, JSON.stringify(dbData, null, 2));
    
    return NextResponse.json({
      success: true,
      message: 'Travel agency price berhasil diperbarui',
      price: updatedPrice
    });
  } catch (error) {
    console.error('Error updating travel agency price:', error);
    return NextResponse.json({
      success: false,
      message: 'Terjadi kesalahan saat memperbarui travel agency price: ' + error.message
    }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    
    // Read the database file
    const dbData = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    
    // Find the specific price by ID across all agencies
    let foundAgencyIndex = -1;
    let foundPriceIndex = -1;
    
    for (let i = 0; i < (dbData.biro_perjalanan || []).length; i++) {
      const agency = dbData.biro_perjalanan[i];
      if (agency.prices && Array.isArray(agency.prices)) {
        const priceIndex = agency.prices.findIndex(p => p.id === id);
        if (priceIndex !== -1) {
          foundAgencyIndex = i;
          foundPriceIndex = priceIndex;
          break;
        }
      }
    }
    
    if (foundAgencyIndex === -1 || foundPriceIndex === -1) {
      return NextResponse.json({
        success: false,
        message: 'Travel agency price tidak ditemukan'
      }, { status: 404 });
    }
    
    // Remove the price from the array
    const deletedPrice = dbData.biro_perjalanan[foundAgencyIndex].prices.splice(foundPriceIndex, 1)[0];
    
    // Write back to database
    fs.writeFileSync(dbPath, JSON.stringify(dbData, null, 2));
    
    return NextResponse.json({
      success: true,
      message: 'Travel agency price berhasil dihapus',
      price: deletedPrice
    });
  } catch (error) {
    console.error('Error deleting travel agency price:', error);
    return NextResponse.json({
      success: false,
      message: 'Terjadi kesalahan saat menghapus travel agency price: ' + error.message
    }, { status: 500 });
  }
}
