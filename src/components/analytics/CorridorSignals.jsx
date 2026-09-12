import React from 'react';
import { Users, Compass, Magnet, Info, AlertCircle } from 'lucide-react';
import { audienceSegmentsMap } from '../../data/corridorsData';
import {
  getConfidenceBadge,
  getFamilyColor,
  formatDemandSourceName,
  formatMagnetName
} from '../../utils/formatters';

const DEMAND_SOURCE_KEYS = [
  'residential',
  'workplace',
  'commuter',
  'hotel_guest_context',
  'university_context',
  'tourist_destination_context',
  'medical_context'
];

export default function CorridorSignals({ corridor }) {
  if (!corridor) return null;

  // ---------------------------------------------------------------------------
  // LEFT PANEL: Audience Affinities (Top 5)
  // ---------------------------------------------------------------------------
  const scores = corridor.audience_scores || {};
  const confidenceMap = corridor.audience_confidence || {};
  const evidenceMap = corridor.audience_evidence || {};

  const topAudiences = Object.entries(scores)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([segmentId, score]) => {
      const meta = audienceSegmentsMap.get(segmentId) || {};
      const confidence = confidenceMap[segmentId] || 'LOW';
      const evidence = evidenceMap[segmentId] || {};

      return {
        segmentId,
        label: meta.label || segmentId.replace(/_/g, ' '),
        familyId: meta.family_id || 'general',
        score,
        confidence,
        rationale: evidence.rationale || null
      };
    });

  // ---------------------------------------------------------------------------
  // RIGHT PANEL: Demand Profile (7 Sources + Top 5 Magnets)
  // ---------------------------------------------------------------------------
  const demandSources = corridor.demand_sources;
  const demandMagnets = corridor.demand_magnets;
  const isDemandPending = corridor.enrichment_status === 'PENDING' || !demandSources;

  let sortedSources = [];
  let top5Magnets = [];

  if (!isDemandPending) {
    sortedSources = DEMAND_SOURCE_KEYS
      .map(key => ({
        key,
        name: formatDemandSourceName(key),
        value: demandSources[key] ?? 0
      }))
      .sort((a, b) => b.value - a.value);

    top5Magnets = Object.entries(demandMagnets || {})
      .map(([key, val]) => ({
        key,
        name: formatMagnetName(key),
        value: val
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);
  }

  return (
    <div className="editorial-grid-2">
      {/* LEFT: Audience Affinities */}
      <div className="editorial-card">
        <div className="card-header">
          <div className="card-title-group">
            <span className="card-label">Audience Affinities</span>
            <h3 className="card-title">Top 5 Behavioral Segments</h3>
          </div>
          <span className="badge badge-status-active">
            <span className="badge-dot" />
            Affinity Index (0–10)
          </span>
        </div>

        <p className="card-description">
          Relative behavioral attraction index indicating distinct customer and visitor profiles.
        </p>

        <div className="signals-list">
          {topAudiences.map((aud, index) => {
            const confBadge = getConfidenceBadge(aud.confidence);
            const scorePct = (aud.score / 10) * 100;

            return (
              <div key={aud.segmentId} className="audience-row">
                <div className="audience-name-col">
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--text-muted)' }}>
                    #{index + 1}
                  </span>
                  <div>
                    <div className="audience-name">{aud.label}</div>
                    <span style={{ fontSize: '0.625rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                      {aud.familyId}
                    </span>
                  </div>
                </div>

                <div className="audience-meter-col">
                  <div className="meter-track" style={{ flex: 1 }}>
                    <div
                      className="meter-fill"
                      style={{
                        width: `${scorePct}%`,
                        background: index === 0 ? 'var(--accent-cyan)' : 'var(--text-secondary)'
                      }}
                    />
                  </div>
                  <span className="audience-val tabular-nums">{aud.score} / 10</span>
                </div>

                <span className={`badge ${confBadge.class}`} style={{ fontSize: '0.625rem' }}>
                  {confBadge.label}
                </span>
              </div>
            );
          })}
        </div>

        <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.5rem' }}>
          * Affinity reflects comparative behavior signals across NYC, not census headcounts.
        </div>
      </div>

      {/* RIGHT: Demand Profile */}
      <div className="editorial-card">
        <div className="card-header">
          <div className="card-title-group">
            <span className="card-label">Contextual Demand</span>
            <h3 className="card-title">Demand Sources & Magnets</h3>
          </div>
          <span className="badge badge-status-active">
            <span className="badge-dot" />
            Normalized Intensity (0.0–1.0)
          </span>
        </div>

        {isDemandPending ? (
          <div style={{
            padding: '1.5rem',
            background: 'var(--bg-surface-subtle)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-subtle)',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem'
          }}>
            <span style={{ fontWeight: 600, color: 'var(--semantic-amber)' }}>Demand Data Pending</span>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
              Detailed contextual demand source signals for {corridor.name} are pending macro-model enrichment.
            </p>
          </div>
        ) : (
          <>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              {sortedSources.slice(0, 5).map((src, idx) => {
                const pct = Math.round(src.value * 100);
                return (
                  <div key={src.key} className="demand-source-row">
                    <div className="demand-source-header">
                      <span className="demand-source-label">
                        {idx === 0 && <span style={{ color: 'var(--accent-cyan)', fontWeight: 600 }}>[Primary] </span>}
                        {src.name}
                      </span>
                      <span className="demand-source-val tabular-nums">
                        {src.value.toFixed(2)} ({pct}%)
                      </span>
                    </div>
                    <div className="meter-track">
                      <div
                        className="meter-fill"
                        style={{
                          width: `${Math.max(pct, 3)}%`,
                          background: idx === 0 ? 'var(--semantic-emerald)' : 'var(--accent-cyan)'
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Top 5 Demand Magnets */}
            <div style={{ marginTop: '0.25rem' }}>
              <span className="card-label" style={{ display: 'block', marginBottom: '0.35rem' }}>
                Top 5 Demand Magnets (Out of 15)
              </span>
              <div className="magnets-strip">
                {top5Magnets.map((mag, i) => (
                  <span key={mag.key} className={`magnet-chip ${i === 0 ? 'strong' : ''}`}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>#{i + 1}</span>
                    <span>{mag.name}</span>
                    <span className="tabular-nums" style={{ opacity: 0.8 }}>({mag.value.toFixed(2)})</span>
                  </span>
                ))}
              </div>
            </div>

            <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.5rem' }}>
              * Demand weights represent comparative contextual pull, not population totals.
            </div>
          </>
        )}
      </div>
    </div>
  );
}
