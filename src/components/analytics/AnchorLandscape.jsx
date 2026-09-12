import React from 'react';
import { ShieldCheck, Anchor, Landmark, Store, AlertCircle } from 'lucide-react';
import {
  getAnchorConcentrationCategory,
  formatPlaceClassName
} from '../../utils/formatters';

const PRIORITIZED_CLASSES = [
  'RESTAURANT',
  'CAFE',
  'RETAIL',
  'GROCERY_SUPERMARKET',
  'PARK',
  'NIGHTLIFE',
  'TRANSIT_HUB',
  'EVENT_VENUE',
  'HOTEL'
];

export default function AnchorLandscape({ corridor }) {
  if (!corridor) return null;

  // ---------------------------------------------------------------------------
  // LEFT PANEL: Stress Resilience Diagnostic
  // ---------------------------------------------------------------------------
  const resilience = corridor.behavior?.resilience || {};
  const shock = resilience.shock_resilience ?? 50;
  const seasonality = resilience.seasonality_amplitude ?? 30;
  const eventDep = resilience.event_dependency ?? 20;
  const devDep = resilience.development_dependency ?? 15;

  // ---------------------------------------------------------------------------
  // RIGHT PANEL: Anchor Landscape & Place Ecosystem
  // ---------------------------------------------------------------------------
  const anchorConc = corridor.anchor_concentration;
  const anchors = corridor.anchors || [];
  const places = corridor.places;
  const isPending = corridor.enrichment_status === 'PENDING' || !anchorConc;

  const top3Share = anchorConc?.top_three_anchor_share;
  const top1Share = anchorConc?.top_anchor_share;
  const effAnchors = anchorConc?.effective_anchor_count;
  const hhi = anchorConc?.hhi;
  const concCat = getAnchorConcentrationCategory(top3Share, effAnchors);

  // Top place classes by listing count
  const classesMap = places?.classes || {};
  const sortedClasses = PRIORITIZED_CLASSES
    .map(clsKey => {
      const data = classesMap[clsKey] || { listing_count: 0 };
      return {
        key: clsKey,
        label: formatPlaceClassName(clsKey),
        count: data.listing_count || 0
      };
    })
    .filter(c => c.count > 0)
    .sort((a, b) => b.count - a.count)
    .slice(0, 4);

  const maxClassCount = sortedClasses.length > 0 ? Math.max(...sortedClasses.map(c => c.count)) : 100;

  return (
    <div className="editorial-grid-2">
      {/* LEFT: Stress Resilience Diagnostic */}
      <div className="editorial-card">
        <div className="card-header">
          <div className="card-title-group">
            <span className="card-label">Stress Tolerance</span>
            <h3 className="card-title">Resilience & Dependencies</h3>
          </div>
          <span className="badge badge-status-active">
            <span className="badge-dot" />
            Capacity vs Sensitivity
          </span>
        </div>

        <p className="card-description">
          Diagnostic indices gauging ability to absorb shocks and withstand event or seasonal voids.
        </p>

        <div className="resilience-matrix">
          {/* Shock Resilience (Capacity) */}
          <div className="resilience-metric-card">
            <div className="resilience-header-row">
              <span className="resilience-label">Shock Resilience</span>
              <span className="resilience-tag tag-capacity">Capacity</span>
            </div>
            <div className="resilience-val tabular-nums" style={{ color: 'var(--semantic-emerald)' }}>
              {shock} <span style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>/ 100</span>
            </div>
            <div className="meter-track">
              <div className="meter-fill" style={{ width: `${shock}%`, background: 'var(--semantic-emerald)' }} />
            </div>
            <p className="resilience-desc">Absorption capacity against sudden macro & demand fluctuations.</p>
          </div>

          {/* Seasonality Amplitude (Sensitivity) */}
          <div className="resilience-metric-card">
            <div className="resilience-header-row">
              <span className="resilience-label">Seasonality Swing</span>
              <span className="resilience-tag tag-sensitivity">Sensitivity</span>
            </div>
            <div className="resilience-val tabular-nums" style={{ color: 'var(--semantic-amber)' }}>
              {seasonality} <span style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>/ 100</span>
            </div>
            <div className="meter-track">
              <div className="meter-fill" style={{ width: `${seasonality}%`, background: 'var(--semantic-amber)' }} />
            </div>
            <p className="resilience-desc">Footfall fluctuation amplitude between peak and off-peak seasons.</p>
          </div>

          {/* Event Dependency (Sensitivity) */}
          <div className="resilience-metric-card">
            <div className="resilience-header-row">
              <span className="resilience-label">Event Dependency</span>
              <span className="resilience-tag tag-sensitivity">Sensitivity</span>
            </div>
            <div className="resilience-val tabular-nums" style={{ color: 'var(--accent-purple)' }}>
              {eventDep} <span style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>/ 100</span>
            </div>
            <div className="meter-track">
              <div className="meter-fill" style={{ width: `${eventDep}%`, background: 'var(--accent-purple)' }} />
            </div>
            <p className="resilience-desc">Reliance on scheduled stadium, theater, or festival event calendars.</p>
          </div>

          {/* Development Dependency (Sensitivity) */}
          <div className="resilience-metric-card">
            <div className="resilience-header-row">
              <span className="resilience-label">Development Dependency</span>
              <span className="resilience-tag tag-sensitivity">Sensitivity</span>
            </div>
            <div className="resilience-val tabular-nums" style={{ color: 'var(--accent-cyan)' }}>
              {devDep} <span style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>/ 100</span>
            </div>
            <div className="meter-track">
              <div className="meter-fill" style={{ width: `${devDep}%`, background: 'var(--accent-cyan)' }} />
            </div>
            <p className="resilience-desc">Sensitivity to ongoing construction and capital pipeline delivery.</p>
          </div>
        </div>
      </div>

      {/* RIGHT: Anchor Landscape & Place Ecosystem */}
      <div className="editorial-card">
        <div className="card-header">
          <div className="card-title-group">
            <span className="card-label">Anchor & Venue Ecosystem</span>
            <h3 className="card-title">Anchor Landscape</h3>
          </div>
          <span className={`badge ${concCat.class}`}>
            <span className="badge-dot" />
            {concCat.label} Concentration
          </span>
        </div>

        {isPending ? (
          <div style={{
            padding: '1.5rem',
            background: 'var(--bg-surface-subtle)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-subtle)',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem'
          }}>
            <span style={{ fontWeight: 600, color: 'var(--semantic-amber)' }}>Catalog Ingestion Pending</span>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
              Detailed physical place inventory and Herfindahl concentration metrics for {corridor.name} are pending macro-model ingestion.
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
            {/* Concentration Stats */}
            <div className="anchor-metrics-row">
              <div className="anchor-stat-cell">
                <span className="anchor-stat-label">Top 1 Anchor</span>
                <span className="anchor-stat-val tabular-nums">
                  {top1Share != null ? `${(top1Share * 100).toFixed(1)}%` : '--'}
                </span>
              </div>
              <div className="anchor-stat-cell">
                <span className="anchor-stat-label">Top 3 Anchors</span>
                <span className="anchor-stat-val tabular-nums" style={{ color: 'var(--semantic-amber)' }}>
                  {top3Share != null ? `${(top3Share * 100).toFixed(1)}%` : '--'}
                </span>
              </div>
              <div className="anchor-stat-cell">
                <span className="anchor-stat-label">Effective Anchors</span>
                <span className="anchor-stat-val tabular-nums">
                  {effAnchors != null ? effAnchors.toFixed(1) : '--'}
                </span>
              </div>
            </div>

            {/* Identified Landmarks */}
            {anchors.length > 0 && (
              <div>
                <span className="card-label" style={{ display: 'block', marginBottom: '0.35rem' }}>
                  Identified Anchors & Landmarks
                </span>
                <div className="landmarks-list">
                  {anchors.slice(0, 5).map((anc, idx) => (
                    <span key={idx} className="landmark-pill">
                      <Landmark size={12} style={{ display: 'inline', marginRight: '0.25rem', color: 'var(--accent-cyan)' }} />
                      <span>{anc.name}</span>
                      <span style={{ opacity: 0.6, fontSize: '0.625rem', marginLeft: '0.25rem' }}>
                        ({formatPlaceClassName(anc.class)})
                      </span>
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Place Classes Ecosystem Mix */}
            {sortedClasses.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.75rem' }}>
                <span className="card-label">Primary Venue Ecosystem (Listings)</span>
                {sortedClasses.map(cls => {
                  const pct = Math.round((cls.count / maxClassCount) * 100);
                  return (
                    <div key={cls.key} className="place-class-bar">
                      <div className="place-class-header">
                        <span>{cls.label}</span>
                        <span className="tabular-nums" style={{ fontWeight: 600 }}>{cls.count} listings</span>
                      </div>
                      <div className="meter-track">
                        <div className="meter-fill" style={{ width: `${pct}%`, background: 'var(--accent-cyan)' }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
