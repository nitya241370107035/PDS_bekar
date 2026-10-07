import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, Polyline } from 'react-leaflet';
import { MapPin, Navigation, Eye, AlertTriangle, Key, Layers, Globe, Settings, ExternalLink } from 'lucide-react';

export default function MapView({ telemetryHistory = [], bundle }) {
  const [showPolyline, setShowPolyline] = useState(true);
  const [basemap, setBasemap] = useState('cyber_dark'); // 'cyber_dark' | 'satellite' | 'carto'
  const [cartoApiKey, setCartoApiKey] = useState(() => localStorage.getItem('locus_carto_api_key') || '');
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [tempKey, setTempKey] = useState(cartoApiKey);

  // Fallback default coordinates if history is empty
  const defaultPos = [23.1043149, 72.5924906]; // L89HA Test Base
  const centerPos = bundle?.location?.latitude && bundle?.location?.longitude
    ? [bundle.location.latitude, bundle.location.longitude]
    : defaultPos;

  // Filter records with valid latitude/longitude
  const validPoints = telemetryHistory
    .filter((r) => r.latitude && r.longitude && Number(r.latitude) !== 0)
    .slice(-100);

  const polylineCoords = validPoints.map((r) => [Number(r.latitude), Number(r.longitude)]);

  const handleSaveKey = () => {
    localStorage.setItem('locus_carto_api_key', tempKey.trim());
    setCartoApiKey(tempKey.trim());
    setShowKeyModal(false);
  };

  // Determine tile URL & attribution based on selected basemap
  const getTileConfig = () => {
    if (basemap === 'satellite') {
      return {
        url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        attribution: '&copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
        className: ''
      };
    }
    if (basemap === 'carto') {
      const keyParam = cartoApiKey ? `?api_key=${cartoApiKey}` : '';
      return {
        url: `https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png${keyParam}`,
        attribution: '&copy; <a href="https://carto.com/">CARTO</a> &copy; OpenStreetMap',
        className: ''
      };
    }
    // Default: Zero-Key Cyber Dark (OSM with CSS inversion filter)
    return {
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      className: 'map-cyber-dark'
    };
  };

  const tileConfig = getTileConfig();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Map Header Card */}
      <div className="cyber-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <MapPin size={18} color="var(--cyan-primary)" />
              <h2 style={{ fontFamily: 'var(--font-hud)', fontSize: '1.1rem' }}>
                GEOSPATIAL TRAJECTORY TRACKING
              </h2>
            </div>
            <p style={{ color: 'var(--text-dim)', fontSize: '0.82rem', marginTop: '0.2rem' }}>
              Kinematic trajectory tracing. Classification flags: Nominal (Green), Warning (Amber), Spoofed (Red).
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            {/* Basemap Switcher */}
            <div style={{ display: 'flex', gap: '0.25rem', background: 'rgba(5, 8, 16, 0.8)', padding: '0.2rem', borderRadius: '4px', border: '1px solid var(--border-subtle)' }}>
              <button
                className={`cyber-btn ${basemap === 'cyber_dark' ? 'cyber-btn-active' : ''}`}
                onClick={() => setBasemap('cyber_dark')}
                style={{ padding: '0.25rem 0.55rem', fontSize: '0.7rem' }}
                title="Zero API Key Needed (Dark Mode)"
              >
                Cyber Dark (Free)
              </button>
              <button
                className={`cyber-btn ${basemap === 'satellite' ? 'cyber-btn-active' : ''}`}
                onClick={() => setBasemap('satellite')}
                style={{ padding: '0.25rem 0.55rem', fontSize: '0.7rem' }}
                title="Zero API Key Needed (ESRI Satellite)"
              >
                Satellite (Free)
              </button>
              <button
                className={`cyber-btn ${basemap === 'carto' ? 'cyber-btn-active' : ''}`}
                onClick={() => setBasemap('carto')}
                style={{ padding: '0.25rem 0.55rem', fontSize: '0.7rem' }}
                title="Requires CARTO API Key"
              >
                CARTO Dark
              </button>
            </div>

            {/* API Key Modal Button */}
            <button
              className="cyber-btn"
              onClick={() => { setTempKey(cartoApiKey); setShowKeyModal(true); }}
              style={{ padding: '0.3rem 0.65rem', fontSize: '0.75rem' }}
              title="Configure Map API Keys"
            >
              <Key size={13} color={cartoApiKey ? 'var(--green-nominal)' : 'var(--amber-warning)'} />
              <span>{cartoApiKey ? 'API Key: Set' : 'Map API Key'}</span>
            </button>

            {/* Trajectory Polyline Toggle */}
            <button
              className={`cyber-btn ${showPolyline ? 'cyber-btn-active' : ''}`}
              onClick={() => setShowPolyline(!showPolyline)}
              style={{ padding: '0.3rem 0.65rem', fontSize: '0.75rem' }}
            >
              <Navigation size={13} />
              <span>Vector</span>
            </button>
          </div>
        </div>
      </div>

      {/* API Key Configuration Modal */}
      {showKeyModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.75)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999
        }}>
          <div className="cyber-card" style={{ maxWidth: '520px', width: '90%', border: '1px solid var(--cyan-primary)', boxShadow: '0 0 30px rgba(0, 240, 255, 0.25)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Key size={18} color="var(--cyan-primary)" />
                <h3 style={{ fontFamily: 'var(--font-hud)', fontSize: '1rem' }}>MAP API KEY CONFIGURATION</h3>
              </div>
              <button
                onClick={() => setShowKeyModal(false)}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '1.2rem', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            <p style={{ fontSize: '0.82rem', color: 'var(--text-dim)', marginBottom: '1rem', lineHeight: '1.5' }}>
              By default, LOCUS uses <strong>Cyber Dark (OpenStreetMap)</strong> and <strong>Orbital Satellite (ESRI)</strong> which require <strong>NO API key at all</strong> (100% free with zero watermarks).
            </p>

            <div style={{ background: 'rgba(0, 240, 255, 0.05)', border: '1px solid var(--border-subtle)', borderRadius: '4px', padding: '0.75rem', marginBottom: '1rem', fontSize: '0.8rem' }}>
              <strong style={{ color: 'var(--cyan-primary)' }}>How to get a CARTO Basemap API Key:</strong>
              <ol style={{ paddingLeft: '1.2rem', marginTop: '0.5rem', color: 'var(--text-main)', lineHeight: '1.5' }}>
                <li>Go to <a href="https://carto.com/" target="_blank" rel="noreferrer" style={{ color: 'var(--cyan-primary)', textDecoration: 'underline' }}>carto.com</a> and sign up for a free account.</li>
                <li>Go to <strong>Settings</strong> &rarr; <strong>Developers</strong> &rarr; <strong>API Keys</strong>.</li>
                <li>Create or copy your <em>Master / Basemaps API Key</em>.</li>
                <li>Paste it below and click <strong>Save API Key</strong>.</li>
              </ol>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.25rem' }}>
              <label style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                CARTO API KEY:
              </label>
              <input
                type="text"
                className="cyber-input"
                placeholder="e.g. default_public or your_carto_api_key"
                value={tempKey}
                onChange={(e) => setTempKey(e.target.value)}
                style={{ width: '100%' }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button className="cyber-btn" onClick={() => setShowKeyModal(false)}>
                Cancel
              </button>
              <button className="cyber-btn cyber-btn-active" onClick={handleSaveKey}>
                Save & Apply Key
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Leaflet Map Card */}
      <div className={`cyber-card ${tileConfig.className}`} style={{ padding: '0.5rem', height: '520px', position: 'relative' }}>
        <div style={{ width: '100%', height: '100%', borderRadius: '6px', overflow: 'hidden' }}>
          <MapContainer
            center={centerPos}
            zoom={16}
            scrollWheelZoom={true}
            style={{ width: '100%', height: '100%', background: '#070b13' }}
          >
            {/* Active Basemap Tile Layer */}
            <TileLayer
              key={basemap + cartoApiKey}
              attribution={tileConfig.attribution}
              url={tileConfig.url}
            />

            {/* Trajectory Polyline */}
            {showPolyline && polylineCoords.length > 1 && (
              <Polyline
                positions={polylineCoords}
                pathOptions={{ color: '#00f0ff', weight: 3, opacity: 0.65, dashArray: '6 6' }}
              />
            )}

            {/* Individual GPS Epoch Waypoints */}
            {validPoints.map((pt, idx) => {
              const isWarning = Number(pt.hdop) > 4.0;
              const isAnomaly = Number(pt.speed_kmh) > 120.0 || (idx === validPoints.length - 1 && bundle?.physical_rules?.is_anomalous);
              const color = isAnomaly ? '#ef4444' : isWarning ? '#f59e0b' : '#00f0ff';
              const radius = isAnomaly ? 7 : 4.5;

              return (
                <CircleMarker
                  key={idx}
                  center={[Number(pt.latitude), Number(pt.longitude)]}
                  radius={radius}
                  pathOptions={{
                    fillColor: color,
                    fillOpacity: 0.85,
                    color: color,
                    weight: 1.5
                  }}
                >
                  <Popup>
                    <div style={{ color: '#000', fontSize: '0.8rem', fontFamily: 'monospace' }}>
                      <strong>Epoch #{pt.epoch_id || idx}</strong><br />
                      Time: {pt.timestamp_utc?.slice(11, 19) || 'N/A'}<br />
                      Lat: {Number(pt.latitude).toFixed(6)}°<br />
                      Lon: {Number(pt.longitude).toFixed(6)}°<br />
                      Speed: {Number(pt.speed_kmh || 0).toFixed(1)} km/h<br />
                      HDOP: {Number(pt.hdop || 1).toFixed(2)}<br />
                      Status: {isAnomaly ? 'CRITICAL ANOMALY' : isWarning ? 'WARNING' : 'NOMINAL'}
                    </div>
                  </Popup>
                </CircleMarker>
              );
            })}

            {/* Current Selected Event Highlight */}
            {bundle?.location && (
              <CircleMarker
                center={[bundle.location.latitude, bundle.location.longitude]}
                radius={10}
                pathOptions={{
                  fillColor: bundle.physical_rules?.is_anomalous ? '#ef4444' : '#10b981',
                  fillOpacity: 0.9,
                  color: '#ffffff',
                  weight: 2
                }}
              >
                <Popup>
                  <div style={{ color: '#000', fontSize: '0.82rem', fontFamily: 'monospace' }}>
                    <strong>Active Forensic Event: {bundle.event_id}</strong><br />
                    DEFCON: {bundle.physical_rules?.is_anomalous ? 'DEFCON 1/2' : 'DEFCON 5'}<br />
                    Displacement: {bundle.security_features?.disp_haversine?.toFixed(2)} m<br />
                    Velocity: {bundle.security_features?.vel_kinematic?.toFixed(2)} m/s
                  </div>
                </Popup>
              </CircleMarker>
            )}
          </MapContainer>
        </div>
      </div>
    </div>
  );
}
