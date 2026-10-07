import React, { useState } from 'react';
import { FileSearch, Copy, Check, Terminal, Shield } from 'lucide-react';

export default function EvidenceView({ bundle }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (bundle) {
      navigator.clipboard.writeText(JSON.stringify(bundle, null, 2));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!bundle) {
    return (
      <div className="cyber-card" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
        No Evidence Bundle loaded. Please select an event from the top header.
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Top Banner */}
      <div className="cyber-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <FileSearch size={18} color="var(--cyan-primary)" />
              <h2 style={{ fontFamily: 'var(--font-hud)', fontSize: '1.1rem' }}>
                FORENSIC EVIDENCE BUNDLE: {bundle.event_id}
              </h2>
            </div>
            <p style={{ color: 'var(--text-dim)', fontSize: '0.82rem', marginTop: '0.2rem' }}>
              Immutable cyber-physical evidence record. Schema: <code>locus-sec-v2.0-10d</code>. Provenance tamper-checked.
            </p>
          </div>

          <button className="cyber-btn" onClick={handleCopy} style={{ padding: '0.4rem 0.85rem' }}>
            {copied ? <Check size={14} color="var(--green-nominal)" /> : <Copy size={14} />}
            <span>{copied ? 'Copied' : 'Copy JSON'}</span>
          </button>
        </div>
      </div>

      {/* Provenance & Epoch Metadata Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
        <div className="cyber-card">
          <span className="metric-label">Event Reference</span>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.1rem', color: 'var(--cyan-primary)', fontWeight: 600 }}>
            {bundle.event_id}
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
            Session #{bundle.session_id} | Epoch #{bundle.epoch_id}
          </div>
        </div>

        <div className="cyber-card">
          <span className="metric-label">Atomic UTC Timestamp</span>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.95rem', color: '#fff' }}>
            {bundle.timestamp_utc || 'N/A'}
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
            Local PC: {bundle.timestamp_pc?.slice(11, 23) || 'N/A'}
          </div>
        </div>

        <div className="cyber-card">
          <span className="metric-label">Location (WGS-84)</span>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.95rem', color: '#fff' }}>
            {bundle.location?.latitude?.toFixed(6)}°, {bundle.location?.longitude?.toFixed(6)}°
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
            Altitude: {bundle.location?.altitude_m?.toFixed(1)} m
          </div>
        </div>

        <div className="cyber-card">
          <span className="metric-label">Pipeline Tier</span>
          <div style={{ fontFamily: 'var(--font-hud)', fontSize: '1rem', color: 'var(--green-nominal)' }}>
            {bundle.model_versions?.pipeline_tier || 'PRODUCTION'}
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
            Engine: {bundle.model_version || 'locus-production-v5.5'}
          </div>
        </div>
      </div>

      {/* Raw JSON Forensic Viewer */}
      <div className="cyber-card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
          <Terminal size={16} color="var(--cyan-primary)" />
          <h3 style={{ fontFamily: 'var(--font-hud)', fontSize: '0.9rem' }}>
            Forensic Evidence Bundle Payload (JSON)
          </h3>
        </div>
        <div className="terminal-window" style={{ maxHeight: '420px', whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
          {JSON.stringify(bundle, null, 2)}
        </div>
      </div>
    </div>
  );
}
