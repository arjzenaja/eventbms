import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const dbPath = path.join(process.cwd(), 'db.json');

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    
    // Read the database file
    const dbData = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    
    // Find the specific package by ID
    const packageItem = dbData.village_packages?.find(item => item.id === id);
    
    if (!packageItem) {
      return NextResponse.json({
        success: false,
        message: 'Village package tidak ditemukan'
      }, { status: 404 });
    }
    
    return NextResponse.json({
      success: true,
      package: packageItem
    });
  } catch (error) {
    console.error('Error reading village package:', error);
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
    
    // Find the specific package by ID
    const packageIndex = dbData.village_packages?.findIndex(item => item.id === id);
    
    if (packageIndex === -1) {
      return NextResponse.json({
        success: false,
        message: 'Village package tidak ditemukan'
      }, { status: 404 });
    }
    
    const existingPackage = dbData.village_packages[packageIndex];
    
    // Update the package with all new fields
    const updatedPackage = {
      ...existingPackage,
      title: formData.get('title') || existingPackage.title,
      description: formData.get('description') || existingPackage.description,
      price: parseInt(formData.get('price')) || existingPackage.price,
      category: formData.get('category') || existingPackage.category,
      duration: formData.get('duration') || existingPackage.duration,
      villageId: formData.get('villageId') || existingPackage.villageId,
      villageSlug: formData.get('villageSlug') || existingPackage.villageSlug,
      features: formData.get('features') ? formData.get('features').split(',').map(item => item.trim()).filter(Boolean) : existingPackage.features,
      popular: formData.get('popular') === 'true',
      available: formData.get('available') === 'true',
      rating: parseFloat(formData.get('rating')) || existingPackage.rating,
      // Field baru yang ditambahkan
      image: formData.get('image') || existingPackage.image || '',
      maxCapacity: formData.get('maxCapacity') || existingPackage.maxCapacity || '',
      minOrder: parseInt(formData.get('minOrder')) || existingPackage.minOrder || 1,
      terms: formData.get('terms') || existingPackage.terms || '',
      contact: formData.get('contact') || existingPackage.contact || '',
      location: formData.get('location') || existingPackage.location || '',
      availableTime: formData.get('availableTime') || existingPackage.availableTime || '',
      discount: formData.get('discount') || existingPackage.discount || '',
      discountType: formData.get('discountType') || existingPackage.discountType || 'percentage',
      discountValue: formData.get('discountValue') || existingPackage.discountValue || '',
      discountValidUntil: formData.get('discountValidUntil') || existingPackage.discountValidUntil || '',
      highlights: formData.get('highlights') || existingPackage.highlights || '',
      includedItems: formData.get('includedItems') ? formData.get('includedItems').split(',').map(item => item.trim()).filter(Boolean) : existingPackage.includedItems || [],
      excludedItems: formData.get('excludedItems') ? formData.get('excludedItems').split(',').map(item => item.trim()).filter(Boolean) : existingPackage.excludedItems || [],
      cancellationPolicy: formData.get('cancellationPolicy') || existingPackage.cancellationPolicy || '',
      ageRestriction: formData.get('ageRestriction') || existingPackage.ageRestriction || '',
      difficultyLevel: formData.get('difficultyLevel') || existingPackage.difficultyLevel || 'Mudah',
      seasonality: formData.get('seasonality') || existingPackage.seasonality || 'Sepanjang Tahun',
      updated_at: new Date().toISOString()
    };
    
    // Update the item in the array
    dbData.village_packages[packageIndex] = updatedPackage;
    
    // Write back to database
    fs.writeFileSync(dbPath, JSON.stringify(dbData, null, 2));
    
    return NextResponse.json({
      success: true,
      message: 'Village package berhasil diperbarui',
      package: updatedPackage
    });
  } catch (error) {
    console.error('Error updating village package:', error);
    return NextResponse.json({
      success: false,
      message: 'Terjadi kesalahan saat memperbarui village package: ' + error.message
    }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    
    // Read the database file
    const dbPath = path.join(process.cwd(), 'db.json');
    const dbData = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    
    // Find the specific package by ID
    const packageIndex = dbData.village_packages?.findIndex(item => item.id === id);
    
    if (packageIndex === -1) {
      return NextResponse.json({
        success: false,
        message: 'Village package tidak ditemukan'
      }, { status: 404 });
    }
    
    // Remove the item from the array
    const deletedPackage = dbData.village_packages.splice(packageIndex, 1)[0];
    
    // Write back to database
    fs.writeFileSync(dbPath, JSON.stringify(dbData, null, 2));
    
    return NextResponse.json({
      success: true,
      message: 'Village package berhasil dihapus',
      package: deletedPackage
    });
  } catch (error) {
    console.error('Error deleting village package:', error);
    return NextResponse.json({
      success: false,
      message: 'Terjadi kesalahan saat menghapus village package: ' + error.message
    }, { status: 500 });
  }
}
