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
    const contentType = request.headers.get('content-type') || '';
    
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

    let updatedPackage = packages[packageIndex];
    if (contentType.includes('multipart/form-data')) {
      const form = await request.formData();
      const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
      if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

      // Optional image upload
      let imagePath = updatedPackage.image || '';
      const image = form.get('image');
      if (image && image instanceof File) {
        const ext = path.extname(image.name) || '.jpg';
        const filename = `souvenir_package_${Date.now()}${ext}`;
        fs.writeFileSync(path.join(uploadsDir, filename), Buffer.from(await image.arrayBuffer()));
        imagePath = `/uploads/${filename}`;
      }

      updatedPackage = {
        ...updatedPackage,
        name: form.get('name') ?? updatedPackage.name,
        description: form.get('description') ?? updatedPackage.description,
        price: form.get('price') ? parseInt(form.get('price')) : updatedPackage.price,
        souvenirId: form.get('souvenirId') ?? updatedPackage.souvenirId,
        souvenirTitle: form.get('souvenirTitle') ?? updatedPackage.souvenirTitle,
        available: form.has('available') ? String(form.get('available')) === 'true' : updatedPackage.available,
        category: form.get('category') ?? updatedPackage.category,
        type: form.get('type') ?? updatedPackage.type,
        image: imagePath,
        updatedAt: new Date().toISOString()
      };
    } else {
      const updateData = await request.json();
      updatedPackage = {
        ...updatedPackage,
        ...updateData,
        updatedAt: new Date().toISOString()
      };
    }

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
