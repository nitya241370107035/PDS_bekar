import React from 'react';
import { Cpu, AlertCircle, CheckCircle2, ShieldAlert } from 'lucide-react';

export default function FeaturesView({ bundle }) {
  const feats = bundle?.security_features || {};

  const definitions = [
    {
      key: 'disp_haversine',
      name: 'Haversine Displacement',
      unit: 'm',
      warn: 50.0,
      crit: 100.0,
      category: 'Kinematics',
      desc: 'Great-circle spatial jump between consecutive 1-sec ticks.'
    },
    {
      key: 'vel_kinematic',
      name: 'Kinematic Velocity',
      unit: 'm/s',
      warn: 50.0,
      crit: 85.0,
      category: 'Kinematics',
      desc: 'First differential spatial rate. Automotive/terrestrial bounds.'
    },
    {
      key: 'acc_kinematic',
      name: 'Kinematic Acceleration',
      unit: 'm/s²',
      warn: 4.0,
      crit: 10.0,
      category: 'Kinematics',
      desc: 'Second derivative of position. Detects instantaneous spoofing steps.'
    },
    {
      key: 'jerk_kinematic',
      name: 'Kinematic Jerk',
      unit: 'm/s³',
      warn: 15.0,
      crit: 25.0,
      category: 'Kinematics',
      desc: 'Third derivative of position. Unphysical force transition rate.'
    },
    {
      key: 'bearing_rate',
      name: 'Bearing Angular Rate',
      unit: '°/s',
      warn: 90.0,
      crit: 180.0,
      category: 'Kinematics',
      desc: 'Shortest circular bearing variation over 1-sec epoch interval.'
    },
    {
      key: 'HDOP',
      name: 'Horizontal Dilution (HDOP)',
      unit: 'unitless',
      warn: 4.0,
      crit: 8.0,
      category: 'Geometry',
      desc: 'Geometric satellite constellation spread on the horizontal plane.'
    },
    {
      key: 'VDOP',
      name: 'Vertical Dilution (VDOP)',
      unit: 'unitless',
      warn: 5.0,
      crit: 10.0,
      category: 'Geometry',
      desc: 'Vertical geometric positioning precision dilution.'
    },
    {
      key: 'fix_integrity',
      name: 'Fix Integrity Indicator',
      unit: 'score',
      warn: 0.45,
      crit: 0.20,
      isLowerBetter: false,
      category: 'Integrity',
      desc: 'Deterministic composite score combining fix quality, PDOP, and C/N0.'
    },
    {
      key: 'sat_count_tot',
      name: 'Total Satellites Visible',
      unit: 'count',
      warn: 6,
      crit: 4,
      isLowerBetter: false,
      category: 'Constellation',
      desc: 'Total locked space vehicles across GPS, GLONASS, Galileo, BeiDou.'
    },
    {
      key: 'sat_churn',
      name: 'Satellite Constellation Churn',
      unit: 'ratio',
      warn: 0.35,
      crit: 0.60,
      category: 'Constellation',
      desc: 'Symmetric difference ratio of tracked PRNs between epochs.'
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Header */}
      <div className="cyber-card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <Cpu size={18} color="var(--cyan-primary)" />
          <div>
            <h2 style={{ fontFamily: 'var(--font-hud)', fontSize: '1.1rem' }}>
              10-DIMENSIONAL CYBERSECURITY FEATURE MONITOR
            </h2>
            <p style={{ color: 'var(--text-dim)', fontSize: '0.82rem', marginTop: '0.2rem' }}>
              Evaluated strictly against calibrated Newtonian bounds and DO-229E geometric invariants.
            </p>
          </div>
        </div>
      </div>

      {/* Feature Vector Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1rem' }}>
        {definitions.map((def) => {
          const rawVal = feats[def.key];
          const hasVal = rawVal !== undefined && rawVal !== null && !isNaN(rawVal);
          const val = hasVal ? Number(rawVal) : 0;

          // Status calculation
          let status = 'NOMINAL';
          if (hasVal) {
            if (def.isLowerBetter === false) {
              if (val < def.crit) status = 'CRITICAL';
              else if (val < def.warn) status = 'WARNING';
            } else {
              if (val >= def.crit) status = 'CRITICAL';
              else if (val >= def.warn) status = 'WARNING';
            }
          }

          const statusColor = status === 'CRITICAL'
            ? 'var(--red-critical)'
            : status === 'WARNING'
            ? 'var(--amber-warning)'
            : 'var(--green-nominal)';

          // Percentage calculation for progress bar
          const maxScale = Math.max(def.crit * 1.35, val * 1.15, 1);
          const pct = Math.min(100, Math.max(0, (val / maxScale) * 100));

          return (
            <div key={def.key} className="cyber-card" style={{
              borderLeft: `3px solid ${statusColor}`
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                <div>
                  <span style={{ fontSize: '0.68rem', textTransform: 'uppercase', color: 'var(--cyan-primary)', fontFamily: 'var(--font-mono)' }}>
                    [{def.category}] {def.key}
                  </span>
                  <h4 style={{ fontFamily: 'var(--font-title)', fontSize: '1rem', color: '#fff', fontWeight: 600 }}>
                    {def.name}
                  </h4>
                </div>
                <span style={{
                  fontSize: '0.72rem',
                  fontFamily: 'var(--font-hud)',
                  padding: '0.2rem 0.5rem',
                  borderRadius: '3px',
                  background: status === 'CRITICAL' ? 'rgba(239, 68, 68, 0.2)' : status === 'WARNING' ? 'rgba(245, 158, 11, 0.2)' : 'rgba(16, 185, 129, 0.2)',
                  color: statusColor,
                  border: `1px solid ${statusColor}`
                }}>
                  {status}
                </span>
              </div>

              {/* Metric Value & Unit */}
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.4rem', margin: '0.5rem 0' }}>
                <span className="metric-value" style={{ fontSize: '1.6rem', color: statusColor }}>
                  {hasVal ? (val < 1 && val > 0 ? val.toFixed(3) : val.toFixed(2)) : 'N/A'}
                </span>
                <span style={{ color: 'var(--text-dim)', fontSize: '0.85rem' }}>{def.unit}</span>
              </div>

              {/* Progress Track */}
              <div style={{ width: '100%', height: '6px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '3px', overflow: 'hidden', margin: '0.5rem 0' }}>
                <div style={{
                  width: `${pct}%`,
                  height: '100%',
                  background: statusColor,
                  boxShadow: `0 0 8px ${statusColor}`,
                  transition: 'width 0.4s ease'
                }} />
              </div>

              {/* Threshold Labels */}
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                <span>Warn: {def.warn} {def.unit}</span>
                <span>Crit: {def.crit} {def.unit}</span>
              </div>

              <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '0.5rem', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '0.4rem' }}>
                {def.desc}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
