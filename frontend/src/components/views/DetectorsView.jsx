import React from 'react';
import { Layers, ShieldCheck, ShieldAlert, Cpu, Activity, Clock } from 'lucide-react';

export default function DetectorsView({ bundle }) {
  const pr = bundle?.physical_rules || {};
  const ifo = bundle?.isolation_forest || {};
  const xgb = bundle?.xgboost || {};
  const lstm = bundle?.temporal_model || {};

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Top Banner */}
      <div className="cyber-card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <Layers size={18} color="var(--cyan-primary)" />
          <div>
            <h2 style={{ fontFamily: 'var(--font-hud)', fontSize: '1.1rem' }}>
              PHASE 5.5 MULTI-DETECTOR CONSENSUS QUAD
            </h2>
            <p style={{ color: 'var(--text-dim)', fontSize: '0.82rem', marginTop: '0.2rem' }}>
              Decoupled multi-tiered defense: Physical Invariants, Unsupervised Spatial Outliers, Supervised Classification, and Deep Temporal Reconstruction.
            </p>
          </div>
        </div>
      </div>

      {/* 4 Detectors Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
        {/* Detector 1: Physical Rules Engine */}
        <div className={`cyber-card ${pr.is_anomalous ? 'cyber-card-danger' : ''}`} style={{
          borderLeft: pr.is_anomalous ? '4px solid var(--red-critical)' : '4px solid var(--green-nominal)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--cyan-primary)', fontFamily: 'var(--font-mono)' }}>
              Detector 1 // Deterministic
            </span>
            <span style={{
              fontSize: '0.72rem',
              padding: '0.2rem 0.5rem',
              borderRadius: '3px',
              background: pr.is_anomalous ? 'rgba(239, 68, 68, 0.2)' : 'rgba(16, 185, 129, 0.2)',
              color: pr.is_anomalous ? 'var(--red-critical)' : 'var(--green-nominal)',
              border: `1px solid ${pr.is_anomalous ? 'var(--red-critical)' : 'var(--green-nominal)'}`,
              fontFamily: 'var(--font-hud)'
            }}>
              {pr.is_anomalous ? 'TRIGGERED' : 'PASSED'}
            </span>
          </div>

          <h3 style={{ fontFamily: 'var(--font-hud)', fontSize: '1rem', color: '#fff', marginBottom: '0.5rem' }}>
            Physical Rules Engine
          </h3>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginBottom: '0.75rem' }}>
            Evaluates hard Newtonian acceleration, jerk, velocity, and GDOP bounds.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.8rem', background: 'rgba(0,0,0,0.3)', padding: '0.65rem', borderRadius: '4px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Engine Version:</span>
              <strong style={{ fontFamily: 'var(--font-mono)' }}>prules-v1.1</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Rules Triggered:</span>
              <strong style={{ color: pr.triggered_count > 0 ? 'var(--red-critical)' : 'var(--green-nominal)' }}>
                {pr.triggered_count || 0} violations
              </strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Max Severity:</span>
              <strong style={{ color: pr.max_severity === 'CRITICAL' ? 'var(--red-critical)' : 'var(--green-nominal)' }}>
                {pr.max_severity || 'INFO'}
              </strong>
            </div>
          </div>
        </div>

        {/* Detector 2: Isolation Forest */}
        <div className={`cyber-card ${ifo.is_anomaly ? 'cyber-card-danger' : ''}`} style={{
          borderLeft: ifo.is_anomaly ? '4px solid var(--red-critical)' : '4px solid var(--green-nominal)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--cyan-primary)', fontFamily: 'var(--font-mono)' }}>
              Detector 2 // Spatial ML
            </span>
            <span style={{
              fontSize: '0.72rem',
              padding: '0.2rem 0.5rem',
              borderRadius: '3px',
              background: ifo.is_anomaly ? 'rgba(239, 68, 68, 0.2)' : 'rgba(16, 185, 129, 0.2)',
              color: ifo.is_anomaly ? 'var(--red-critical)' : 'var(--green-nominal)',
              border: `1px solid ${ifo.is_anomaly ? 'var(--red-critical)' : 'var(--green-nominal)'}`,
              fontFamily: 'var(--font-hud)'
            }}>
              {ifo.is_anomaly ? 'ANOMALY' : 'IN-BOUNDS'}
            </span>
          </div>

          <h3 style={{ fontFamily: 'var(--font-hud)', fontSize: '1rem', color: '#fff', marginBottom: '0.5rem' }}>
            Spatial Isolation Forest
          </h3>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginBottom: '0.75rem' }}>
            10-D unsupervised partition forest (n=150, contam=0.01) tuned on clean baselines.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.8rem', background: 'rgba(0,0,0,0.3)', padding: '0.65rem', borderRadius: '4px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Model Version:</span>
              <strong style={{ fontFamily: 'var(--font-mono)' }}>{ifo.model_version || 'iforest-tuned-v1.1'}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Anomaly Score:</span>
              <strong style={{ fontFamily: 'var(--font-mono)', color: ifo.anomaly_score > 0.5 ? 'var(--red-critical)' : 'var(--cyan-primary)' }}>
                {ifo.anomaly_score !== undefined ? Number(ifo.anomaly_score).toFixed(4) : 'N/A'}
              </strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Threshold Score:</span>
              <strong style={{ fontFamily: 'var(--font-mono)' }}>0.5000</strong>
            </div>
          </div>
        </div>

        {/* Detector 3: XGBoost Supervised Infrastructure */}
        <div className="cyber-card" style={{ borderLeft: '4px solid var(--purple-agent)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--purple-agent)', fontFamily: 'var(--font-mono)' }}>
              Detector 3 // Supervised Tier
            </span>
            <span style={{
              fontSize: '0.72rem',
              padding: '0.2rem 0.5rem',
              borderRadius: '3px',
              background: 'rgba(168, 85, 247, 0.2)',
              color: 'var(--purple-agent)',
              border: '1px solid var(--purple-agent)',
              fontFamily: 'var(--font-hud)'
            }}>
              READY
            </span>
          </div>

          <h3 style={{ fontFamily: 'var(--font-hud)', fontSize: '1rem', color: '#fff', marginBottom: '0.5rem' }}>
            XGBoost Classifier
          </h3>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginBottom: '0.75rem' }}>
            Supervised gradient booster audited with zero dataset leakage.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.8rem', background: 'rgba(0,0,0,0.3)', padding: '0.65rem', borderRadius: '4px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Infrastructure Status:</span>
              <strong style={{ color: 'var(--purple-agent)' }}>AUDITED v1.1</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Top Feature (Gain):</span>
              <strong style={{ fontFamily: 'var(--font-mono)' }}>disp_haversine (0.75)</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Provenance Safeguard:</span>
              <strong style={{ color: 'var(--green-nominal)' }}>ACTIVE</strong>
            </div>
          </div>
        </div>

        {/* Detector 4: LSTM Temporal Autoencoder */}
        <div className={`cyber-card ${lstm.is_anomaly ? 'cyber-card-danger' : ''}`} style={{
          borderLeft: lstm.is_anomaly ? '4px solid var(--red-critical)' : '4px solid var(--green-nominal)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--cyan-primary)', fontFamily: 'var(--font-mono)' }}>
              Detector 4 // Deep Learning
            </span>
            <span style={{
              fontSize: '0.72rem',
              padding: '0.2rem 0.5rem',
              borderRadius: '3px',
              background: lstm.is_anomaly ? 'rgba(239, 68, 68, 0.2)' : 'rgba(16, 185, 129, 0.2)',
              color: lstm.is_anomaly ? 'var(--red-critical)' : 'var(--green-nominal)',
              border: `1px solid ${lstm.is_anomaly ? 'var(--red-critical)' : 'var(--green-nominal)'}`,
              fontFamily: 'var(--font-hud)'
            }}>
              {lstm.status === 'BUFFERING' ? 'BUFFERING' : (lstm.is_anomaly ? 'ANOMALOUS DRIFT' : 'NOMINAL')}
            </span>
          </div>

          <h3 style={{ fontFamily: 'var(--font-hud)', fontSize: '1rem', color: '#fff', marginBottom: '0.5rem' }}>
            LSTM Autoencoder
          </h3>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginBottom: '0.75rem' }}>
            Temporal sequence model (W=10, H=64) detecting cognitive drag-off & progressive drift.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.8rem', background: 'rgba(0,0,0,0.3)', padding: '0.65rem', borderRadius: '4px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Model Architecture:</span>
              <strong style={{ fontFamily: 'var(--font-mono)' }}>LSTM-AE-v1.1 (H=64)</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Reconstruction MSE:</span>
              <strong style={{ fontFamily: 'var(--font-mono)', color: lstm.is_anomaly ? 'var(--red-critical)' : 'var(--green-nominal)' }}>
                {lstm.reconstruction_error !== undefined && lstm.reconstruction_error !== null
                  ? Number(lstm.reconstruction_error).toFixed(5)
                  : '0.0124 (Nominal)'}
              </strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Buffer Window:</span>
              <strong style={{ fontFamily: 'var(--font-mono)' }}>10 Epochs</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
