import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// GET specific destination package by ID
export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const packageId = id;
    
    const dbPath = path.join(process.cwd(), 'db.json');
    const dbData = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    
    // Search for package across all destinations
    let foundPackage = null;
    let destinationId = null;
    
    for (const destination of dbData.wisata || []) {
      if (destination.pricing && destination.pricing.packages) {
        const pkgIndex = destination.pricing.packages.findIndex(pkg => pkg.id === packageId);
        if (pkgIndex !== -1) {
          foundPackage = destination.pricing.packages[pkgIndex];
          destinationId = destination.id;
          break;
        }
      }
    }
    
    if (!foundPackage) {
      return NextResponse.json({
        success: false,
        message: 'Paket tidak ditemukan'
      }, { status: 404 });
    }
    
    return NextResponse.json({
      success: true,
      packageData: foundPackage,
      destinationId: destinationId
    });
    
  } catch (error) {
    console.error('Error fetching destination package:', error);
    return NextResponse.json({
      success: false,
      message: 'Terjadi kesalahan server'
    }, { status: 500 });
  }
}

// PUT update destination package
export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const packageId = id;
    const formData = await request.formData();
    
    // Extract form data
    const name = formData.get('name');
    const description = formData.get('description');
    const category = formData.get('category');
    const price = formData.get('price');
    const facilities = formData.get('facilities');
    const duration = formData.get('duration');
    const capacity = formData.get('capacity');
    const available = formData.get('available') === 'true';
    const popular = formData.get('popular') === 'true';
    
    // Validate required fields
    if (!name || !price) {
      return NextResponse.json({
        success: false,
        message: 'Name dan price harus diisi'
      }, { status: 400 });
    }
    
    const dbPath = path.join(process.cwd(), 'db.json');
    const dbData = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    
    // Find package and destination
    let pkgIndex = -1;
    let destinationIndex = -1;
    
    for (let i = 0; i < dbData.wisata.length; i++) {
      const destination = dbData.wisata[i];
      if (destination.pricing && destination.pricing.packages) {
        const foundPkgIndex = destination.pricing.packages.findIndex(pkg => pkg.id === packageId);
        if (foundPkgIndex !== -1) {
          pkgIndex = foundPkgIndex;
          destinationIndex = i;
          break;
        }
      }
    }
    
    if (pkgIndex === -1 || destinationIndex === -1) {
      return NextResponse.json({
        success: false,
        message: 'Paket tidak ditemukan'
      }, { status: 404 });
    }
    
    // Update package
    const updatedPackage = {
      ...dbData.wisata[destinationIndex].pricing.packages[pkgIndex],
      name: name,
      description: description || '',
      category: category || 'Paket Standar',
      price: parseInt(price) || 0,
      facilities: facilities || '',
      duration: duration || '',
      capacity: capacity || '',
      available: available,
      popular: popular,
      updated_at: new Date().toISOString()
    };
    
    dbData.wisata[destinationIndex].pricing.packages[pkgIndex] = updatedPackage;
    
    // Update destination's updated_at
    dbData.wisata[destinationIndex].updated_at = new Date().toISOString();
    
    // Write back to db.json
    fs.writeFileSync(dbPath, JSON.stringify(dbData, null, 2));
    
    return NextResponse.json({
      success: true,
      packageData: updatedPackage,
      message: 'Paket destinasi berhasil diperbarui'
    });
    
  } catch (error) {
    console.error('Error updating destination package:', error);
    return NextResponse.json({
      success: false,
      message: 'Terjadi kesalahan server'
    }, { status: 500 });
  }
}

// DELETE destination package
export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    const packageId = id;
    
    const dbPath = path.join(process.cwd(), 'db.json');
    const dbData = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    
    // Find package and destination
    let pkgIndex = -1;
    let destinationIndex = -1;
    
    for (let i = 0; i < dbData.wisata.length; i++) {
      const destination = dbData.wisata[i];
      if (destination.pricing && destination.pricing.packages) {
        const foundPkgIndex = destination.pricing.packages.findIndex(pkg => pkg.id === packageId);
        if (foundPkgIndex !== -1) {
          pkgIndex = foundPkgIndex;
          destinationIndex = i;
          break;
        }
      }
    }
    
    if (pkgIndex === -1 || destinationIndex === -1) {
      return NextResponse.json({
        success: false,
        message: 'Paket tidak ditemukan'
      }, { status: 404 });
    }
    
    // Remove package
    dbData.wisata[destinationIndex].pricing.packages.splice(pkgIndex, 1);
    
    // Update destination's updated_at
    dbData.wisata[destinationIndex].updated_at = new Date().toISOString();
    
    // Write back to db.json
    fs.writeFileSync(dbPath, JSON.stringify(dbData, null, 2));
    
    return NextResponse.json({
      success: true,
      message: 'Paket destinasi berhasil dihapus'
    });
    
  } catch (error) {
    console.error('Error deleting destination package:', error);
    return NextResponse.json({
      success: false,
      message: 'Terjadi kesalahan server'
    }, { status: 500 });
  }
}
