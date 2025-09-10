// Seed events into db.json from hardcoded list
const fs = require('fs');
const path = require('path');

const dbPath = path.join(process.cwd(), 'db.json');

function readDb() {
  const raw = fs.readFileSync(dbPath, 'utf8');
  return JSON.parse(raw);
}

function writeDb(db) {
  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
}

function nextId(items) {
  const ids = (items || []).map((e) => parseInt(e.id)).filter((n) => !isNaN(n));
  return (ids.length ? Math.max(...ids) + 1 : 1).toString();
}

function dmsToDecimal(d, m, s, hemi) {
  let val = Number(d) + Number(m) / 60 + Number(s) / 3600;
  if (hemi === 'S' || hemi === 'W') val = -val;
  return val;
}

function coordsFromDms(latD, latM, latS, latH, lngD, lngM, lngS, lngH) {
  return {
    lat: dmsToDecimal(latD, latM, latS, latH),
    lng: dmsToDecimal(lngD, lngM, lngS, lngH),
  };
}

function buildEvent(o) {
  return {
    id: '',
    img_sm: '/placeholder.jpg',
    img_lg: '/placeholder.jpg',
    title: o.title,
    location: o.location,
    short_description: o.short || (o.long ? String(o.long).slice(0, 120) : ''),
    description: o.long || '',
    type: o.type || 'Event Rakyat',
    category: o.category || 'Events',
    event_type: o.event_type || '',
    latitude: o.coords ? String(o.coords.lat ?? '') : '',
    longitude: o.coords ? String(o.coords.lng ?? '') : '',
    opening_hours: o.hours || '',
    date: o.startDate || '',
    time: o.startTime || '',
    end_date: o.endDate || '',
    end_time: o.endTime || '',
    contact: o.contact || '',
    address: o.address || o.location || '',
    organizer: o.organizer || '',
    organizers: o.organizers || (o.organizer ? [{ name: o.organizer, role: 'Penyelenggara Utama' }] : []),
    features: o.features || [],
    highlights: o.highlights || [],
    performers: o.performers || '',
    pricing: o.pricing || {},
    facilities: o.facilities || [],
    poster_link: o.poster_link || '',
    ticket_link: o.ticket_link || '',
    additional_info: o.additional_info || '',
    seats: o.seats || [],
    gallery: o.gallery || [],
    recommended: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
}

const events = [
  buildEvent({
    title: 'Purwokerto Half Marathon 2025',
    type: 'Event Rakyat',
    category: 'Olahraga & Wisata',
    short: 'Ajang lari setengah maraton, berbagai kategori jarak.',
    long: 'Purwokerto Half Marathon 2025 digelar pada 11 Mei 2025. Menargetkan hingga 8.000 pelari dengan kategori 21K, 10K, 5K, dan fun run 3K. Fasilitas meliputi water station, refreshment, jersey eksklusif, medis, dan hadiah uang tunai serta doorprize. Tujuannya mempromosikan olahraga dan wisata Purwokerto.',
    startDate: '2025-05-11',
    startTime: '07.00 WIB',
    endDate: '2025-05-11',
    location: 'Menara Teratai, Purwokerto',
    organizer: 'Pemprov Jateng & Pemkab Banyumas',
    agenda: 'Race lari di rute yang sama seperti tahun sebelumnya; elemen seni budaya sepanjang rute.',
    fee: 'Rp200 rb–Rp450 rb',
    features: ['Water station', 'Minuman', 'Jersey', 'Medis', 'Refreshment area'],
    coords: coordsFromDms(7, 25, 52.4, 'S', 109, 13, 56.6, 'E'),
  }),
  buildEvent({
    title: 'Melepas Penat Purwokerto',
    type: 'Event Rakyat',
    category: 'Konser musik',
    short: 'Festival musik dengan penampilan beberapa guest star lokal.',
    long: 'Diadakan pada Sabtu, 28 Juni 2025, mulai pukul 10.00–22.00 WIB di GOR Satria Purwokerto. Menampilkan @ndxakatv, @standherealone, @azmipandemi, @dewalintang. Tiket presale bisa diperoleh melalui Goers App dan titik penjualan lokal. Diselenggarakan oleh Shaolin Music.',
    startDate: '2025-06-28',
    startTime: '10.00 WIB',
    endDate: '2025-06-28',
    location: 'GOR Satria Purwokerto',
    organizer: 'Shaolin Music',
    agenda: 'Penampilan live music sepanjang hari hingga malam.',
    performers: '@ndxakatv, @standherealone, @azmipandemi, @dewalintang',
    fee: 'Rp80 rb-Rp200 rb',
    features: ['Fasilitas umum GOR', 'Titik penjualan tiket', 'Area F&B'],
    coords: { lat: -7.417685, lng: 109.254236 },
    hours: '10.00 – 22.00 WIB',
  }),
  buildEvent({
    title: 'Karnaval Mobil Hias HUT RI ke‑80',
    type: 'Event Banyumas',
    category: 'Karnaval',
    short: 'Karnaval mobil hias bertema kemerdekaan dengan sentuhan teknologi LED.',
    long: 'Direncanakan pada 30 Agustus 2025, start pukul 09.00 WIB. Tema ‘Kilau Kreatif Budaya Nusantara 80 Tahun Merdeka’. Melibatkan masyarakat umum dan komunitas lokal. Tampilannya kreatif, memadukan teknologi LED, musikalisasi jalanan, dan pertunjukan seni Banyumas. Pendaftaran online dibuka 5–25 Agustus, technical meeting 25 Agustus.',
    startDate: '2025-08-30',
    startTime: '09.00 WIB',
    endDate: '2025-08-30',
    location: 'Kota Purwokerto (rute jalan)',
    organizer: 'Pemkab Banyumas',
    agenda: 'Parade mobil, pertunjukan seni sepanjang rute.',
    performers: 'Masyarakat umum, komunitas lokal',
    fee: 'Free',
    features: ['Parade kreatif di jalan', 'Hiburan musik jalanan', 'Teknologi LED'],
    coords: coordsFromDms(7, 25, 52.4, 'S', 109, 13, 56.6, 'E'),
    hours: 'Pukul pagi–siang',
  }),
  buildEvent({
    title: 'Festival Kentongan Purwokerto 2025',
    type: 'Event Banyumas',
    category: 'Pertunjukan',
    short: 'Festival kentongan dan budaya Banyumasan di malam hari.',
    long: 'Diselenggarakan di Alun-alun Purwokerto pada Sabtu malam, 23 Agustus 2025. Menampilkan parade kentongan berpadu dengan musik dan atraksi tari khas daerah, dimulai pukul 19.00 WIB hingga larut malam. Festival ini peringati HUT RI ke‑80 sekaligus upaya pelestarian kultur Banyumasan dengan semangat kebersamaan.',
    startDate: '2025-08-23',
    startTime: '19.00 WIB',
    endDate: '2025-08-23',
    location: 'Alun‑alun Purwokerto',
    organizer: 'Pemkab Banyumas',
    agenda: 'Parade kentongan, atraksi seni dan tari daerah sepanjang rute.',
    performers: 'Bupati Sadewa, Wakil Bupati Linwinarti, masyarakat umum',
    fee: 'Free',
    features: ['Atraksi budaya', 'UMKM', 'Musik', 'Kearifan lokal'],
    coords: coordsFromDms(7, 25, 40, 'S', 109, 14, 30, 'E'),
    hours: 'Malam hari (19.00 WIB–selesai)',
  }),
  buildEvent({
    title: 'Sky Lantern Serenade 2025',
    type: 'Event Rakyat',
    category: 'Pertunjukan',
    short: 'Malam magis lampion dengan musik akustik live.',
    long: 'Sabtu, 6 September 2025, di Menara Teratai Purwokerto. Ditambah penampilan Band Malacca dan spot foto menarik. Penuh suasana romantis dan penuh harapan.',
    startDate: '2025-09-06',
    startTime: '18.00 WIB',
    endDate: '2025-09-06',
    location: 'Menara Pandang Teratai, Purwokerto',
    organizer: 'Penyelenggara festival (Event Fest ID)',
    agenda: 'Penyelenggara festival (Event Fest ID)',
    performers: 'Band Malacca',
    fee: 'Tiket via presale',
    features: ['Lampion', 'Hiburan', 'Food stalls', 'Photospot'],
    coords: coordsFromDms(7, 25, 52.4, 'S', 109, 13, 56.6, 'E'),
    hours: '18.00 – 22.00 WIB',
  }),
  buildEvent({
    title: 'Skybridge Culture Night Festival “The Art of Transformation”',
    type: 'Event Rakyat',
    category: 'Festival seni',
    short: 'Festival malam dengan video mapping dan pertunjukan seni.',
    long: 'Minggu, 8 September 2025 di area parkir Stasiun Purwokerto (sisi timur). Menampilkan video mapping, tarian lengger, musikalisasi puisi, live painting, dan seni kontemporer untuk merayakan ikonnya Skybridge.',
    startDate: '2025-09-08',
    startTime: '19.00 WIB',
    endDate: '2025-09-08',
    location: 'Area parkir timur Stasiun Purwokerto',
    organizer: 'KAI Daop 5 Purwokerto',
    agenda: 'Video mapping, pertunjukan seni, kreasi budaya, musikalisasi puisi',
    performers: 'Seniman lokal, DKV IT Telkom Purwokerto',
    fee: 'Free',
    features: ['Hiburan visual', 'Seni', 'Kolaborasi kreatif lokal'],
    coords: coordsFromDms(7, 25, 9, 'S', 109, 13, 19, 'E'),
    hours: '19.00 WIB–selesai',
  }),
  buildEvent({
    title: 'Skybridge Run 2025',
    type: 'Event Rakyat',
    category: 'Olahraga & Wisata',
    short: 'Lomba lari 5K & 10K, rayakan HUT ke‑80 PT KAI.',
    long: 'Minggu, 21 September 2025 di Menara Teratai, Purwokerto. Diselenggarakan oleh KAI Daop 5, menargetkan sekitar 3.000 pelari. Rute melintasi lokasi ikonik dan mendukung hidup sehat.',
    startDate: '2025-09-21',
    startTime: '',
    endDate: '2025-09-21',
    location: 'Menara Teratai, Purwokerto',
    organizer: 'KAI Daop 5 Purwokerto',
    agenda: 'Lomba lari dua kategori jarak, promosi gaya hidup sehat dan kebersamaan',
    performers: 'Umum, pelari pemula dan profesional',
    fee: 'Free',
    features: ['Medis', 'Jalan aman', 'Penyelenggaraan lomba'],
    coords: coordsFromDms(7, 25, 52.4, 'S', 109, 13, 56.6, 'E'),
    hours: 'Pagi hari (diperkirakan)',
  }),
  buildEvent({
    title: 'Panggung Raya 2025',
    type: 'Event Rakyat',
    category: 'Olahraga & Wisata',
    short: 'Festival musik satu hari, didukung kreativitas & kuliner.',
    long: 'Rabu, 29 Oktober 2025 di GOR Satria Purwokerto. Penyelenggara Ruang Bermusik menghadirkan 3 guest star, band lokal, industri kreatif, serta kuliner—semua bakal seru!',
    startDate: '2025-10-29',
    startTime: '15.00 WIB',
    endDate: '2025-10-29',
    location: 'GOR Satria Purwokerto',
    organizer: 'Ruang Bermusik',
    agenda: 'Penampilan musik, industri kreatif, kuliner, suasana festival',
    performers: '3 guest star, band lokal',
    fee: '– sampai early bid Rp100 rb',
    features: ['Kuliner', 'Hiburan', 'Berbagai tenant festival'],
    coords: { lat: -7.417685, lng: 109.254236 },
    hours: '15.00 – 23.00 WIB',
  }),
];

function run() {
  const db = readDb();
  db.events = db.events || [];
  let inserted = 0;
  for (const evt of events) {
    // Avoid duplicate by title + date
    const exists = db.events.find((e) => e.title === evt.title && e.date === evt.date);
    if (exists) continue;
    evt.id = nextId(db.events);
    evt.created_at = new Date().toISOString();
    evt.updated_at = new Date().toISOString();
    db.events.push(evt);
    inserted += 1;
  }
  writeDb(db);
  console.log(`Seeded ${inserted} events. Total: ${db.events.length}`);
}

run();


