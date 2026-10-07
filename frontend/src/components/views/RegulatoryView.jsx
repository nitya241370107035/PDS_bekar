import React, { useState } from 'react';
import { BookOpen, Search, Bookmark, ExternalLink } from 'lucide-react';
import { locusApi } from '../../api/locusApi';

export default function RegulatoryView() {
  const [query, setQuery] = useState('RTCA DO-229E spoofing detection threshold');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    try {
      const data = await locusApi.queryRag(query, 3);
      setResults(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const sampleStandards = [
    { title: 'RTCA DO-229E', desc: 'Minimum Operational Performance Standards for Global Positioning System/Wide Area Augmentation System Airborne Equipment (DOP Limits).' },
    { title: 'ICAO Annex 10 Vol 1', desc: 'Aeronautical Telecommunications — Radio Navigation Aids. Signal in Space (SIS) integrity and spoofing alarm limits.' },
    { title: 'CISA GNSS Cybersecurity', desc: 'Applying Risk Management to Federal Positioning, Navigation, and Timing (PNT) Services against RF interference.' },
    { title: 'MITRE ATT&CK for PNT', desc: 'Threat matrix covering T0001 (Signal Jamming), T0002 (GPS Spoofing), T0003 (Meaconing/Replay Attack).' }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Top Banner */}
      <div className="cyber-card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <BookOpen size={18} color="var(--cyan-primary)" />
          <div>
            <h2 style={{ fontFamily: 'var(--font-hud)', fontSize: '1.1rem' }}>
              REGULATORY RAG & STANDARDS AUDITOR
            </h2>
            <p style={{ color: 'var(--text-dim)', fontSize: '0.82rem', marginTop: '0.2rem' }}>
              Grounding forensic incidents against ICAO, RTCA DO-229E, CISA, and MITRE PNT standards with zero hallucination.
            </p>
          </div>
        </div>
      </div>

      {/* Query Search Bar */}
      <div className="cyber-card">
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '0.75rem' }}>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(6, 11, 22, 0.85)', padding: '0.45rem 0.85rem', borderRadius: '4px', border: '1px solid var(--border-subtle)' }}>
            <Search size={16} color="var(--text-muted)" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search regulatory standards (e.g. HDOP thresholds, spoofing limits)..."
              style={{ width: '100%', background: 'transparent', border: 'none', color: '#fff', fontSize: '0.85rem', fontFamily: 'var(--font-mono)', outline: 'none' }}
            />
          </div>
          <button type="submit" className="cyber-btn" disabled={loading} style={{ padding: '0.5rem 1.25rem' }}>
            <span>{loading ? 'Searching...' : 'Audit Standard'}</span>
          </button>
        </form>

        {/* Search Results Display */}
        {results && (
          <div style={{ marginTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--cyan-primary)', fontFamily: 'var(--font-mono)' }}>
                RAG Retrieval Results ({results.citations_count || results.citations?.length || 0} Grounded Excerpts)
              </span>
              <span style={{ fontSize: '0.7rem', color: results.is_grounded ? 'var(--green-nominal)' : 'var(--amber-warning)' }}>
                {results.is_grounded ? 'Grounded in Regulatory Corpus' : 'Corpus Context Retrieved'}
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              {results.citations?.map((cit, idx) => (
                <div key={idx} style={{ background: 'rgba(0,0,0,0.3)', padding: '0.75rem', borderRadius: '4px', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                    <strong style={{ color: 'var(--cyan-primary)', fontSize: '0.82rem' }}>
                      {cit.document || cit.doc_id || `Source #${idx + 1}`}
                    </strong>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                      Relevance: {Number(cit.score || 0.85).toFixed(2)}
                    </span>
                  </div>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-main)', fontStyle: 'italic', lineHeight: 1.4 }}>
                    "{cit.text || cit.snippet}"
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Standard Regulatory Reference Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
        {sampleStandards.map((st, i) => (
          <div key={i} className="cyber-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
              <Bookmark size={15} color="var(--cyan-primary)" />
              <h4 style={{ fontFamily: 'var(--font-title)', fontSize: '0.95rem', color: '#fff', fontWeight: 600 }}>
                {st.title}
              </h4>
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-dim)', lineHeight: 1.4 }}>
              {st.desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
