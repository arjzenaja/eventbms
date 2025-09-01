import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const dbPath = path.join(process.cwd(), 'db.json');

export async function GET(request, { params }) {
  try {
    const { id } = params;
    
    // Read the database
    const dbData = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    const packages = dbData.souvenir_packages || [];
    
    // Find the package
    const packageItem = packages.find(pkg => pkg.id === id);
    
    if (!packageItem) {
      return NextResponse.json({
        success: false,
        message: 'Paket tidak ditemukan'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      package: packageItem
    });
  } catch (error) {
    console.error('Error reading souvenir package:', error);
    return NextResponse.json({
      success: false,
      message: 'Gagal memuat data paket'
    }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const updateData = await request.json();
    
    // Read existing data
    const dbData = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    const packages = dbData.souvenir_packages || [];
    
    // Find the package
    const packageIndex = packages.findIndex(pkg => pkg.id === id);
    
    if (packageIndex === -1) {
      return NextResponse.json({
        success: false,
        message: 'Paket tidak ditemukan'
      }, { status: 404 });
    }

    // Update package
    const updatedPackage = {
      ...packages[packageIndex],
      ...updateData,
      updatedAt: new Date().toISOString()
    };

    packages[packageIndex] = updatedPackage;
    dbData.souvenir_packages = packages;

    // Write back to database
    fs.writeFileSync(dbPath, JSON.stringify(dbData, null, 2));

    return NextResponse.json({
      success: true,
      message: 'Paket berhasil diperbarui',
      package: updatedPackage
    });
  } catch (error) {
    console.error('Error updating souvenir package:', error);
    return NextResponse.json({
      success: false,
      message: 'Gagal memperbarui paket'
    }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    
    // Read existing data
    const dbData = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    const packages = dbData.souvenir_packages || [];
    
    // Find the package
    const packageIndex = packages.findIndex(pkg => pkg.id === id);
    
    if (packageIndex === -1) {
      return NextResponse.json({
        success: false,
        message: 'Paket tidak ditemukan'
      }, { status: 404 });
    }

    // Remove the package
    packages.splice(packageIndex, 1);
    dbData.souvenir_packages = packages;

    // Write back to database
    fs.writeFileSync(dbPath, JSON.stringify(dbData, null, 2));

    return NextResponse.json({
      success: true,
      message: 'Paket berhasil dihapus'
    });
  } catch (error) {
    console.error('Error deleting souvenir package:', error);
    return NextResponse.json({
      success: false,
      message: 'Gagal menghapus paket'
    }, { status: 500 });
  }
}
