import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// GET all destination packages
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const destinationId = searchParams.get('destinationId');
    const destinationSlug = searchParams.get('destinationSlug');
    const category = searchParams.get('category');

    const dbPath = path.join(process.cwd(), 'db.json');
    const dbData = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    
    // Get all destinations
    const destinations = dbData.wisata || [];
    
    // Extract all packages from destinations
    let allPackages = [];
    
    destinations.forEach(destination => {
      if (destination.pricing && destination.pricing.packages && Array.isArray(destination.pricing.packages)) {
        destination.pricing.packages.forEach(pkg => {
          allPackages.push({
            ...pkg,
            destinationId: destination.id,
            destinationTitle: destination.title,
            destinationSlug: destination.title.toLowerCase().replace(/\s+/g, '-'),
            destinationType: destination.type,
            destinationLocation: destination.location
          });
        });
      }
    });

    // Apply filters
    if (destinationId) {
      allPackages = allPackages.filter(pkg => pkg.destinationId === destinationId);
    }
    
    if (destinationSlug) {
      allPackages = allPackages.filter(pkg => 
        pkg.destinationSlug === destinationSlug.toLowerCase()
      );
    }
    
    if (category) {
      allPackages = allPackages.filter(pkg => pkg.category === category);
    }

    return NextResponse.json({
      success: true,
      packages: allPackages,
      total: allPackages.length
    });
  } catch (error) {
    console.error('Error fetching destination packages:', error);
    return NextResponse.json({
      success: false,
      message: 'Terjadi kesalahan server'
    }, { status: 500 });
  }
}

// POST new destination package
export async function POST(request) {
  try {
    const formData = await request.formData();
    
    // Extract form data
    const destinationId = formData.get('destinationId');
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
    if (!destinationId || !name || !price) {
      return NextResponse.json({
        success: false,
        message: 'Destination ID, name, dan price harus diisi'
      }, { status: 400 });
    }
    
    const dbPath = path.join(process.cwd(), 'db.json');
    const dbData = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    
    // Find the destination
    const destinationIndex = dbData.wisata.findIndex(d => d.id === destinationId);
    if (destinationIndex === -1) {
      return NextResponse.json({
        success: false,
        message: 'Destinasi tidak ditemukan'
      }, { status: 404 });
    }
    
    // Generate new package ID
    const existingPackages = dbData.wisata[destinationIndex].pricing?.packages || [];
    const newPackageId = (existingPackages.length + 1).toString();
    
    // Create new package
    const newPackage = {
      id: newPackageId,
      name: name,
      description: description || '',
      category: category || 'Paket Standar',
      price: parseInt(price) || 0,
      facilities: facilities || '',
      duration: duration || '',
      capacity: capacity || '',
      available: available,
      popular: popular,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    // Initialize pricing structure if it doesn't exist
    if (!dbData.wisata[destinationIndex].pricing) {
      dbData.wisata[destinationIndex].pricing = {
        type: 'paid',
        unit: 'per_paket',
        value: null,
        packages: []
      };
    }
    
    // Add package to destination
    if (!dbData.wisata[destinationIndex].pricing.packages) {
      dbData.wisata[destinationIndex].pricing.packages = [];
    }
    
    dbData.wisata[destinationIndex].pricing.packages.push(newPackage);
    
    // Update destination's updated_at
    dbData.wisata[destinationIndex].updated_at = new Date().toISOString();
    
    // Write back to db.json
    fs.writeFileSync(dbPath, JSON.stringify(dbData, null, 2));
    
    return NextResponse.json({
      success: true,
      packageData: newPackage,
      message: 'Paket destinasi berhasil ditambahkan'
    }, { status: 201 });
    
  } catch (error) {
    console.error('Error creating destination package:', error);
    return NextResponse.json({
      success: false,
      message: 'Terjadi kesalahan server'
    }, { status: 500 });
  }
}
