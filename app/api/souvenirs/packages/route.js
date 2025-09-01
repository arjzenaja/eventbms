import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const dbPath = path.join(process.cwd(), 'db.json');

export async function GET(request) {
  try {
    // Read the database
    const dbData = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    const packages = dbData.souvenir_packages || [];

    return NextResponse.json({
      success: true,
      packages: packages
    });
  } catch (error) {
    console.error('Error reading souvenir packages:', error);
    return NextResponse.json({
      success: false,
      message: 'Gagal memuat data paket oleh-oleh'
    }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const formData = await request.formData();
    
    // Extract package data
    const name = formData.get('name');
    const description = formData.get('description');
    const price = parseInt(formData.get('price'));
    const souvenirId = formData.get('souvenirId');
    const souvenirTitle = formData.get('souvenirTitle');
    const available = formData.get('available') === 'true';
    const category = formData.get('category');
    const type = formData.get('type');

    // Validate required fields
    if (!name || !price || !souvenirId) {
      return NextResponse.json({
        success: false,
        message: 'Nama paket, harga, dan oleh-oleh harus diisi'
      }, { status: 400 });
    }

    // Read existing data
    const dbData = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    const packages = dbData.souvenir_packages || [];

    // Create new package
    const newPackage = {
      id: Date.now().toString(),
      name,
      description: description || '',
      price,
      souvenirId,
      souvenirTitle,
      available: available !== undefined ? available : true,
      category: category || 'Souvenir',
      type: type || 'Souvenir',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Add to packages array
    packages.push(newPackage);
    dbData.souvenir_packages = packages;

    // Write back to database
    fs.writeFileSync(dbPath, JSON.stringify(dbData, null, 2));

    return NextResponse.json({
      success: true,
      message: 'Paket oleh-oleh berhasil ditambahkan',
      package: newPackage
    });
  } catch (error) {
    console.error('Error creating souvenir package:', error);
    return NextResponse.json({
      success: false,
      message: 'Gagal menambahkan paket oleh-oleh'
    }, { status: 500 });
  }
}
