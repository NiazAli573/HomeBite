import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-control-geocoder/dist/Control.Geocoder.css';
import 'leaflet-control-geocoder';

const LocationPicker = ({ onLocationSelect, initialAddress = '', initialLat = null, initialLng = null }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);
  const [address, setAddress] = useState(initialAddress);
  const [searchQuery, setSearchQuery] = useState('');
  const [searching, setSearching] = useState(false);
  const [suggestions, setSuggestions] = useState([]);

  // Initialize map
  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    // Set default location (Pakistan center)
    const defaultLat = initialLat || 31.5204;
    const defaultLng = initialLng || 74.3587;

    mapInstanceRef.current = L.map(mapRef.current).setView([defaultLat, defaultLng], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(mapInstanceRef.current);

    // Add click listener to map
    mapInstanceRef.current.on('click', (e) => {
      handleMapClick(e.latlng.lat, e.latlng.lng);
    });

    // Add initial marker if coordinates provided
    if (initialLat && initialLng) {
      addMarker(initialLat, initialLng);
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  const addMarker = (lat, lng) => {
    if (markerRef.current) {
      markerRef.current.remove();
    }

    markerRef.current = L.marker([lat, lng], {
      icon: L.icon({
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41],
      }),
    }).addTo(mapInstanceRef.current);

    mapInstanceRef.current.setView([lat, lng], 15);
  };

  const handleMapClick = async (lat, lng) => {
    addMarker(lat, lng);
    
    // Get address from coordinates using reverse geocoding
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
      );
      const data = await response.json();
      const addressName = data.address?.city || data.address?.town || data.address?.county || 'Selected Location';
      
      setAddress(addressName);
      onLocationSelect({
        lat: lat.toFixed(6),
        lng: lng.toFixed(6),
        address: addressName,
      });
    } catch (err) {
      console.error('Reverse geocoding error:', err);
      onLocationSelect({
        lat: lat.toFixed(6),
        lng: lng.toFixed(6),
        address: `Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}`,
      });
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setSearching(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(searchQuery)}&format=json&countrycodes=pk&limit=5`
      );
      const results = await response.json();
      setSuggestions(results);
    } catch (err) {
      console.error('Search error:', err);
    }
    setSearching(false);
  };

  const handleSelectSuggestion = (suggestion) => {
    const lat = parseFloat(suggestion.lat);
    const lng = parseFloat(suggestion.lon);
    setAddress(suggestion.display_name);
    setSearchQuery('');
    setSuggestions([]);
    
    addMarker(lat, lng);
    onLocationSelect({
      lat: lat.toFixed(6),
      lng: lng.toFixed(6),
      address: suggestion.display_name,
    });
  };

  const handleSearchInputChange = (e) => {
    setSearchQuery(e.target.value);
    setSuggestions([]);
  };

  return (
    <div style={{ width: '100%' }}>
      {/* Search Box */}
      <div style={{
        marginBottom: '1rem',
        display: 'flex',
        gap: '0.5rem'
      }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchInputChange}
            placeholder="Search for a location..."
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            style={{
              width: '100%',
              padding: '0.75rem 1rem',
              border: '2px solid #E0E0E0',
              borderRadius: '0.5rem',
              fontSize: '0.95rem',
              fontFamily: 'inherit',
              transition: 'all 0.3s ease'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#3498DB';
              e.target.style.boxShadow = '0 0 0 3px rgba(52,152,219,0.1)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#E0E0E0';
              e.target.style.boxShadow = 'none';
            }}
          />
          
          {/* Suggestions Dropdown */}
          {suggestions.length > 0 && (
            <div style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              background: 'white',
              border: '2px solid #3498DB',
              borderTop: 'none',
              borderRadius: '0 0 0.5rem 0.5rem',
              maxHeight: '200px',
              overflowY: 'auto',
              zIndex: 1000
            }}>
              {suggestions.map((suggestion, idx) => (
                <div
                  key={idx}
                  onClick={() => handleSelectSuggestion(suggestion)}
                  style={{
                    padding: '0.75rem 1rem',
                    borderBottom: idx < suggestions.length - 1 ? '1px solid #E0E0E0' : 'none',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    color: '#212529',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = '#F0F7FF';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'white';
                  }}
                >
                  <i className="bi bi-geo-alt me-2" style={{ color: '#3498DB' }}></i>
                  <span style={{ 
                    fontSize: '0.85rem',
                    maxWidth: '100%',
                    display: 'inline-block',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}>
                    {suggestion.display_name.substring(0, 50)}...
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <button
          type="button"
          onClick={handleSearch}
          disabled={searching}
          style={{
            padding: '0.75rem 1.5rem',
            background: searching ? '#BDC3C7' : 'linear-gradient(135deg, #3498DB 0%, #2980B9 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '0.5rem',
            fontWeight: '600',
            cursor: searching ? 'not-allowed' : 'pointer',
            transition: 'all 0.3s ease',
            whiteSpace: 'nowrap'
          }}
          onMouseEnter={(e) => {
            if (!searching) {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 8px 16px rgba(52,152,219,0.3)';
            }
          }}
          onMouseLeave={(e) => {
            if (!searching) {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = 'none';
            }
          }}
        >
          <i className={`bi ${searching ? 'bi-hourglass-split' : 'bi-search'} me-2`}></i>
          {searching ? 'Searching...' : 'Search'}
        </button>
      </div>

      {/* Map Container */}
      <div
        ref={mapRef}
        style={{
          width: '100%',
          height: '400px',
          borderRadius: '0.75rem',
          border: '2px solid #E0E0E0',
          boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
          marginBottom: '1rem'
        }}
      />

      {/* Selected Location Display */}
      {address && (
        <div style={{
          background: '#E8F5E9',
          border: '2px solid #27AE60',
          borderRadius: '0.75rem',
          padding: '0.75rem 1rem',
          color: '#27AE60',
          fontSize: '0.9rem'
        }}>
          <i className="bi bi-check-circle me-2"></i>
          <strong>Selected:</strong> {address}
        </div>
      )}

      {/* Instructions */}
      <div style={{
        marginTop: '1rem',
        padding: '1rem',
        background: '#F0F7FF',
        border: '2px solid #3498DB',
        borderRadius: '0.75rem',
        fontSize: '0.85rem',
        color: '#2C3E50'
      }}>
        <i className="bi bi-info-circle me-2" style={{ color: '#3498DB' }}></i>
        <strong>How to use:</strong> Type a location name or click on the map to select your exact position.
      </div>
    </div>
  );
};

export default LocationPicker;
