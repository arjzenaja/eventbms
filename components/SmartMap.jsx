"use client";
import { useGoogleMaps } from '../hooks/useGoogleMaps';
import InteractiveMap from './InteractiveMap';
import MapFallback from './MapFallback';

const SmartMap = ({ destination, onDistanceCalculated }) => {
  const { isHidden } = useGoogleMaps();

  // If maps should be hidden (no API key), show fallback
  if (isHidden) {
    return <MapFallback destination={destination} />;
  }

  // Otherwise show interactive map
  return (
    <InteractiveMap
      destination={destination}
      onDistanceCalculated={onDistanceCalculated}
    />
  );
};

export default SmartMap;
