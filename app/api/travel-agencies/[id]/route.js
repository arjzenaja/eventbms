import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request, { params }) {
  try {
    const { id } = params;
    
    // Read db.json file
    const dbPath = path.join(process.cwd(), 'db.json');
    const dbData = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    
    // Find travel agency by ID
    const travelAgency = dbData.events.find(event => event.id === id && event.type === 'biro-perjalanan');
    
    if (!travelAgency) {
      return NextResponse.json({
        success: false,
        message: 'Biro perjalanan tidak ditemukan'
      }, { status: 404 });
    }
    
    return NextResponse.json({
      success: true,
      travelAgency: travelAgency
    });
  } catch (error) {
    console.error('Error reading travel agency:', error);
    return NextResponse.json({
      success: false,
      message: 'Terjadi kesalahan server'
    }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();
    
    // Read db.json file
    const dbPath = path.join(process.cwd(), 'db.json');
    const dbData = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    
    // Find travel agency by ID
    const travelAgencyIndex = dbData.events.findIndex(event => event.id === id && event.type === 'biro-perjalanan');
    
    if (travelAgencyIndex === -1) {
      return NextResponse.json({
        success: false,
        message: 'Biro perjalanan tidak ditemukan'
      }, { status: 404 });
    }
    
    // Update travel agency
    dbData.events[travelAgencyIndex] = {
      ...dbData.events[travelAgencyIndex],
      ...body,
      type: 'biro-perjalanan' // Ensure type remains the same
    };
    
    // Write back to db.json
    fs.writeFileSync(dbPath, JSON.stringify(dbData, null, 2));
    
    return NextResponse.json({
      success: true,
      travelAgency: dbData.events[travelAgencyIndex]
    });
  } catch (error) {
    console.error('Error updating travel agency:', error);
    return NextResponse.json({
      success: false,
      message: 'Terjadi kesalahan server'
    }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    
    // Read db.json file
    const dbPath = path.join(process.cwd(), 'db.json');
    const dbData = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    
    // Find travel agency by ID
    const travelAgencyIndex = dbData.events.findIndex(event => event.id === id && event.type === 'biro-perjalanan');
    
    if (travelAgencyIndex === -1) {
      return NextResponse.json({
        success: false,
        message: 'Biro perjalanan tidak ditemukan'
      }, { status: 404 });
    }
    
    // Remove travel agency
    dbData.events.splice(travelAgencyIndex, 1);
    
    // Write back to db.json
    fs.writeFileSync(dbPath, JSON.stringify(dbData, null, 2));
    
    return NextResponse.json({
      success: true,
      message: 'Biro perjalanan berhasil dihapus'
    });
  } catch (error) {
    console.error('Error deleting travel agency:', error);
    return NextResponse.json({
      success: false,
      message: 'Terjadi kesalahan server'
    }, { status: 500 });
  }
}
