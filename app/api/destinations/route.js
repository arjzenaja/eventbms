import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// GET all destinations
export async function GET() {
  try {
    const dbPath = path.join(process.cwd(), 'db.json');
    const dbData = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    
    // Get all destination categories from the database
    const wisata = dbData.wisata || [];
    const kuliner = dbData.kuliner || [];
    const penginapan = dbData.penginapan || [];
    const olehOleh = dbData.oleh_oleh || [];
    const desaWisata = dbData.desa_wisata || [];
    const biroPerjalanan = dbData.biro_perjalanan || [];
    const events = dbData.events || [];
    
    return NextResponse.json({
      success: true,
      destinations: {
        wisata: {
          title: "Objek Wisata",
          description: "Tempat-tempat wisata alam, sejarah, dan budaya yang menarik untuk dikunjungi",
          data: wisata
        },
        kuliner: {
          title: "Kuliner",
          description: "Tempat makan dan minuman khas daerah dengan cita rasa lokal yang autentik",
          data: kuliner
        },
        penginapan: {
          title: "Penginapan",
          description: "Hotel, homestay, villa, dan tempat menginap lainnya untuk kenyamanan wisatawan",
          data: penginapan
        },
        oleh_oleh: {
          title: "Oleh-Oleh",
          description: "Souvenir, makanan khas, dan produk lokal yang cocok dibawa pulang sebagai kenang-kenangan",
          data: olehOleh
        },
        desa_wisata: {
          title: "Desa Wisata",
          description: "Desa-desa yang dikembangkan sebagai destinasi wisata dengan budaya dan kehidupan masyarakat lokal",
          data: desaWisata
        },
        biro_perjalanan: {
          title: "Biro Perjalanan",
          description: "Layanan tour dan travel untuk memudahkan perencanaan dan pelaksanaan perjalanan wisata",
          data: biroPerjalanan
        },
        events: {
          title: "Events & Acara",
          description: "Berbagai acara, festival, dan kegiatan yang dapat diikuti selama berwisata",
          data: events
        }
      }
    });
  } catch (error) {
    console.error('Error reading destinations:', error);
    return NextResponse.json({
      success: false,
      message: 'Terjadi kesalahan server'
    }, { status: 500 });
  }
}

// POST new destination
export async function POST(request) {
  try {
    const formData = await request.formData();
    
    // Extract form data
    const title = formData.get('title');
    const location = formData.get('location');
    const type = formData.get('type');
    const category = formData.get('category');
    const short_description = formData.get('short_description');
    const description = formData.get('description');
    const entrance_fee = formData.get('entrance_fee');
    const manager = formData.get('manager');
    const contact = formData.get('contact');
    const address = formData.get('address');
    const recommended = formData.get('recommended') === 'true';
    
    // Extract features if available
    let features = ['Fasilitas Dasar']; // Default features
    try {
      const featuresData = formData.get('features');
      if (featuresData) {
        features = JSON.parse(featuresData);
      }
    } catch (error) {
      console.warn('Failed to parse features:', error);
    }
    
    // Extract coordinates if available
    let coordinates = null;
    try {
      const coordsData = formData.get('coordinates');
      if (coordsData) {
        coordinates = JSON.parse(coordsData);
      }
    } catch (error) {
      console.warn('Failed to parse coordinates:', error);
    }
    // Pricing (JSON string)
    let pricing = undefined;
    try {
      const raw = formData.get('pricing');
      if (raw) {
        const parsed = JSON.parse(raw);
        // sanitize
        pricing = {
          type: parsed?.type || 'free',
          unit: parsed?.unit || 'per_tiket',
          value: typeof parsed?.value === 'number' ? parsed.value : (parsed?.value ? Number(parsed.value) : null),
          packages: Array.isArray(parsed?.packages) ? parsed.packages.map((p) => ({
            name: p?.name || '',
            price: p?.price ? Number(p.price) : null,
            unit: p?.unit || 'per_paket',
            includes: Array.isArray(p?.includes) ? p.includes : (p?.includes ? String(p.includes).split(',').map(s=>s.trim()).filter(Boolean) : []),
            terms: Array.isArray(p?.terms) ? p.terms : (p?.terms ? String(p.terms).split('\n').map(s=>s.trim()).filter(Boolean) : [])
          })) : []
        };
      }
    } catch {}
    
    // Validate required fields
    if (!title || !location || !type) {
      return NextResponse.json({
        success: false,
        message: 'Title, location, dan type harus diisi'
      }, { status: 400 });
    }
    
    // Handle image uploads
    const img_sm = formData.get('img_sm');
    const img_lg = formData.get('img_lg');
    const gallery_images = formData.getAll('gallery_images');
    
    let img_sm_path = '/placeholder.jpg';
    let img_lg_path = '/placeholder.jpg';
    let gallery_paths = [];
    
    // Create uploads directory if it doesn't exist
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
    
    // Save small image
    if (img_sm && img_sm instanceof File) {
      const img_sm_ext = path.extname(img_sm.name);
      const img_sm_filename = `dest_sm_${Date.now()}${img_sm_ext}`;
      const img_sm_path_full = path.join(uploadsDir, img_sm_filename);
      
      const img_sm_buffer = Buffer.from(await img_sm.arrayBuffer());
      fs.writeFileSync(img_sm_path_full, img_sm_buffer);
      img_sm_path = `/uploads/${img_sm_filename}`;
    }
    
    // Save large image
    if (img_lg && img_lg instanceof File) {
      const img_lg_ext = path.extname(img_lg.name);
      const img_lg_filename = `dest_lg_${Date.now()}${img_lg_ext}`;
      const img_lg_path_full = path.join(uploadsDir, img_lg_filename);
      
      const img_lg_buffer = Buffer.from(await img_lg.arrayBuffer());
      fs.writeFileSync(img_lg_path_full, img_lg_buffer);
      img_lg_path = `/uploads/${img_lg_filename}`;
    }
    
    // Save gallery images
    if (gallery_images && gallery_images.length > 0) {
      for (const galleryImage of gallery_images) {
        if (galleryImage instanceof File) {
          const gallery_ext = path.extname(galleryImage.name);
          const gallery_filename = `dest_gallery_${Date.now()}_${Math.random().toString(36).substr(2, 9)}${gallery_ext}`;
          const gallery_path_full = path.join(uploadsDir, gallery_filename);
          
          const gallery_buffer = Buffer.from(await galleryImage.arrayBuffer());
          fs.writeFileSync(gallery_path_full, gallery_buffer);
          gallery_paths.push(`/uploads/${gallery_filename}`);
        }
      }
    }
    
    // Save package images if provided
    try {
      const pkgCount = Array.isArray(pricing?.packages) ? pricing.packages.length : 0;
      for (let i = 0; i < pkgCount; i++) {
        const pkgFile = formData.get(`package_image_${i}`);
        if (pkgFile && pkgFile instanceof File) {
          const pkg_ext = path.extname(pkgFile.name);
          const pkg_filename = `package_${Date.now()}_${i}${pkg_ext}`;
          const pkg_path_full = path.join(uploadsDir, pkg_filename);
          const pkg_buffer = Buffer.from(await pkgFile.arrayBuffer());
          fs.writeFileSync(pkg_path_full, pkg_buffer);
          if (!pricing.packages[i]) pricing.packages[i] = {};
          pricing.packages[i].image = `/uploads/${pkg_filename}`;
        }
      }
    } catch {}

    const dbPath = path.join(process.cwd(), 'db.json');
    const dbData = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    
    // Generate new ID for destination
    const validIds = (dbData.wisata || [])
      .map(d => {
        const parsed = parseInt(d.id);
        return isNaN(parsed) || !isFinite(parsed) ? 0 : parsed;
      })
      .filter(id => id > 0);
    
    const newId = validIds.length > 0 ? (Math.max(...validIds) + 1).toString() : "1";
    
    // Create new destination with new structure
    const newDestination = {
      id: newId,
      img_sm: img_sm_path,
      img_lg: img_lg_path,
      gallery: gallery_paths,
      title: title,
      location: location,
      short_description: short_description || '',
      description: description || '',
      type: type,
      category: category || 'Wisata',
      entrance_fee: entrance_fee || 'Gratis',
      manager: manager || '',
      contact: contact || '',
      address: address || '',
      coordinates: coordinates,
      pricing: pricing,
      features: features,
      recommended: recommended,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    // Add to wisata array
    if (!dbData.wisata) {
      dbData.wisata = [];
    }
    dbData.wisata.push(newDestination);
    
    // Write back to db.json
    fs.writeFileSync(dbPath, JSON.stringify(dbData, null, 2));
    
    return NextResponse.json({
      success: true,
      destination: newDestination,
      message: 'Destinasi berhasil ditambahkan'
    }, { status: 201 });
    
  } catch (error) {
    console.error('Error creating destination:', error);
    return NextResponse.json({
      success: false,
      message: 'Terjadi kesalahan server'
    }, { status: 500 });
  }
}
