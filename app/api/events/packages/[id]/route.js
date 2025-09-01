import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const dbPath = path.join(process.cwd(), 'db.json');

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    
    // Read the database file
    const dbData = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    
    // Find the specific package by ID across all events
    let foundPackage = null;
    let eventTitle = '';
    
    for (const event of dbData.events || []) {
      if (event.seats && Array.isArray(event.seats)) {
        const seat = event.seats.find(s => s.id === id);
        if (seat) {
          foundPackage = { ...seat, eventId: event.id, eventTitle: event.title };
          break;
        }
      }
    }
    
    if (!foundPackage) {
      return NextResponse.json({
        success: false,
        message: 'Event package tidak ditemukan'
      }, { status: 404 });
    }
    
    return NextResponse.json({
      success: true,
      package: foundPackage
    });
  } catch (error) {
    console.error('Error reading event package:', error);
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
    
    // Find the specific package by ID across all events
    let foundEventIndex = -1;
    let foundPackageIndex = -1;
    
    for (let i = 0; i < (dbData.events || []).length; i++) {
      const event = dbData.events[i];
      if (event.seats && Array.isArray(event.seats)) {
        const packageIndex = event.seats.findIndex(s => s.id === id);
        if (packageIndex !== -1) {
          foundEventIndex = i;
          foundPackageIndex = packageIndex;
          break;
        }
      }
    }
    
    if (foundEventIndex === -1 || foundPackageIndex === -1) {
      return NextResponse.json({
        success: false,
        message: 'Event package tidak ditemukan'
      }, { status: 404 });
    }
    
    const existingPackage = dbData.events[foundEventIndex].seats[foundPackageIndex];
    
    // Update the package
    const updatedPackage = {
      ...existingPackage,
      seat: formData.get('seat') || existingPackage.seat,
      price: parseFloat(formData.get('price')) || existingPackage.price,
      desc: formData.get('desc') || existingPackage.desc,
      category: formData.get('category') || existingPackage.category,
      includes: formData.get('includes') ? formData.get('includes').split(',').map(item => item.trim()).filter(Boolean) : existingPackage.includes,
      terms_requirements: formData.get('terms_requirements') ? formData.get('terms_requirements').split(',').map(item => item.trim()).filter(Boolean) : existingPackage.terms_requirements,
      terms_cancellation: formData.get('terms_cancellation') ? formData.get('terms_cancellation').split(',').map(item => item.trim()).filter(Boolean) : existingPackage.terms_cancellation,
      popular: formData.get('popular') === 'true',
      available: formData.get('available') === 'true',
      capacity: parseInt(formData.get('capacity')) || existingPackage.capacity,
      sold: parseInt(formData.get('sold')) || existingPackage.sold,
      updated_at: new Date().toISOString()
    };
    
    // Update the package in the array
    dbData.events[foundEventIndex].seats[foundPackageIndex] = updatedPackage;
    
    // Write back to database
    fs.writeFileSync(dbPath, JSON.stringify(dbData, null, 2));
    
    return NextResponse.json({
      success: true,
      message: 'Event package berhasil diperbarui',
      package: updatedPackage
    });
  } catch (error) {
    console.error('Error updating event package:', error);
    return NextResponse.json({
      success: false,
      message: 'Terjadi kesalahan saat memperbarui event package: ' + error.message
    }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    
    // Read the database file
    const dbData = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    
    // Find the specific package by ID across all events
    let foundEventIndex = -1;
    let foundPackageIndex = -1;
    
    for (let i = 0; i < (dbData.events || []).length; i++) {
      const event = dbData.events[i];
      if (event.seats && Array.isArray(event.seats)) {
        const packageIndex = event.seats.findIndex(s => s.id === id);
        if (packageIndex !== -1) {
          foundEventIndex = i;
          foundPackageIndex = packageIndex;
          break;
        }
      }
    }
    
    if (foundEventIndex === -1 || foundPackageIndex === -1) {
      return NextResponse.json({
        success: false,
        message: 'Event package tidak ditemukan'
      }, { status: 404 });
    }
    
    // Remove the package from the array
    const deletedPackage = dbData.events[foundEventIndex].seats.splice(foundPackageIndex, 1)[0];
    
    // Write back to database
    fs.writeFileSync(dbPath, JSON.stringify(dbData, null, 2));
    
    return NextResponse.json({
      success: true,
      message: 'Event package berhasil dihapus',
      package: deletedPackage
    });
  } catch (error) {
    console.error('Error deleting event package:', error);
    return NextResponse.json({
      success: false,
      message: 'Terjadi kesalahan saat menghapus event package: ' + error.message
    }, { status: 500 });
  }
}
