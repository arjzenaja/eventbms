import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const dbPath = path.join(process.cwd(), 'db.json');

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const villageId = searchParams.get('villageId');
    const villageSlug = searchParams.get('villageSlug');
    const category = searchParams.get('category');

    // Read the database file
    const dbData = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    
    // Get village packages data
    let packages = dbData.village_packages || [];
    
    // Apply filters
    if (villageId) {
      packages = packages.filter(pkg => pkg.villageId === villageId);
    }
    
    if (villageSlug) {
      packages = packages.filter(pkg => pkg.villageSlug === villageSlug);
    }
    
    if (category) {
      packages = packages.filter(pkg => pkg.category === category);
    }
    
    return NextResponse.json({
      success: true,
      packages: packages,
      message: 'Village packages retrieved successfully'
    });
  } catch (error) {
    console.error('Error reading village packages:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to retrieve village packages',
      error: error.message
    }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const formData = await request.formData();
    
    // Read existing data
    const dbData = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    
    // Create new village package object with all new fields
    const newPackage = {
      id: Date.now().toString(),
      title: formData.get('title') || '',
      description: formData.get('description') || '',
      price: parseInt(formData.get('price')) || 0,
      category: formData.get('category') || 'Aktivitas',
      duration: formData.get('duration') || '',
      villageId: formData.get('villageId') || '',
      villageSlug: formData.get('villageSlug') || '',
      features: formData.get('features') ? formData.get('features').split(',').map(item => item.trim()).filter(Boolean) : [],
      popular: formData.get('popular') === 'true',
      available: formData.get('available') === 'true',
      rating: parseFloat(formData.get('rating')) || 4.8,
      // Field baru yang ditambahkan
      image: formData.get('image') || '',
      maxCapacity: formData.get('maxCapacity') || '',
      minOrder: parseInt(formData.get('minOrder')) || 1,
      terms: formData.get('terms') || '',
      contact: formData.get('contact') || '',
      location: formData.get('location') || '',
      availableTime: formData.get('availableTime') || '',
      discount: formData.get('discount') || '',
      discountType: formData.get('discountType') || 'percentage',
      discountValue: formData.get('discountValue') || '',
      discountValidUntil: formData.get('discountValidUntil') || '',
      highlights: formData.get('highlights') || '',
      includedItems: formData.get('includedItems') ? formData.get('includedItems').split(',').map(item => item.trim()).filter(Boolean) : [],
      excludedItems: formData.get('excludedItems') ? formData.get('excludedItems').split(',').map(item => item.trim()).filter(Boolean) : [],
      cancellationPolicy: formData.get('cancellationPolicy') || '',
      ageRestriction: formData.get('ageRestriction') || '',
      difficultyLevel: formData.get('difficultyLevel') || 'Mudah',
      seasonality: formData.get('seasonality') || 'Sepanjang Tahun',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    // Add to database
    if (!dbData.village_packages) {
      dbData.village_packages = [];
    }
    dbData.village_packages.push(newPackage);
    
    // Write back to file
    fs.writeFileSync(dbPath, JSON.stringify(dbData, null, 2));
    
    return NextResponse.json({
      success: true,
      package: newPackage,
      message: 'Village package created successfully'
    });
  } catch (error) {
    console.error('Error creating village package:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to create village package',
      error: error.message
    }, { status: 500 });
  }
}
