"use client";
import React from 'react';

const MiniMap = ({ destination, zoom = 15, height = 180 }) => {
  const getDestinationCoords = () => {
    if (destination?.latitude && destination?.longitude) {
      const lat = parseFloat(destination.latitude);
      const lng = parseFloat(destination.longitude);
      if (!isNaN(lat) && !isNaN(lng)) return { lat, lng };
    }

    if (destination?.coordinates) {
      let coords = destination.coordinates;
      if (typeof coords === 'string') {
        try { coords = JSON.parse(coords); } catch (_) {}
      }
      if (coords && typeof coords === 'object' && coords.lat != null && coords.lng != null) {
        const lat = Number(coords.lat);
        const lng = Number(coords.lng);
        if (!isNaN(lat) && !isNaN(lng)) return { lat, lng };
      }
    }

    const loc = (destination?.location || '').toLowerCase();
    if (loc.includes('baturraden')) return { lat: -7.3056, lng: 109.2194 };
    if (loc.includes('purwokerto')) return { lat: -7.4211, lng: 109.2344 };
    if (loc.includes('ajibarang')) return { lat: -7.4167, lng: 109.0667 };
    if (loc.includes('wangon')) return { lat: -7.5167, lng: 109.0500 };
    return { lat: -7.4211, lng: 109.2344 };
  };

  const coords = getDestinationCoords();
  const query = `${coords.lat},${coords.lng}`;
  const title = encodeURIComponent(destination?.title || 'Lokasi');
  const mapUrl = `https://www.google.com/maps?q=${query}&hl=id&z=${zoom}&output=embed`;
  const viewUrl = `https://www.google.com/maps/search/?api=1&query=${query}`;

  return (
    <div className="rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="relative" style={{ height }}>
        <iframe
          title={title}
          src={mapUrl}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
        <div className="absolute bottom-2 right-2">
          <a
            href={viewUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white/90 dark:bg-gray-800/90 text-gray-700 dark:text-gray-200 border border-gray-200/70 dark:border-gray-700/70 shadow"
          >
            Lihat di Google Maps
          </a>
        </div>
      </div>
    </div>
  );
};

export default MiniMap;


