import React from 'react';
import { Compass, Magnet, Layers, AlertCircle, Info } from 'lucide-react';
import { formatDemandSourceName, formatMagnetName } from '../utils/formatters';

const DEMAND_SOURCE_KEYS = [
  'residential',
  'workplace',
  'commuter',
  'hotel_guest_context',
  'university_context',
  'tourist_destination_context',
  'medical_context'
];

export default function DemandProfile({ corridor }) {
  if (!corridor) return null;

  const demandSources = corridor.demand_sources;
  const demandMagnets = corridor.demand_magnets;
  const isPending = corridor.enrichment_status === 'PENDING' || !demandSources;

  if (isPending) {
    return (
      <div className="section-card">
        <div className="section-header">
          <div className="section-title-group">
            <Compass className="icon-sm text-emerald" />
            <h3 className="section-title">DEMAND PROFILE & MAGNETS</h3>
          </div>
          <span className="section-subtitle">Contextual Demand Signals</span>
        </div>
        <div className="pending-notice-card">
          <AlertCircle className="icon-md text-amber" />
          <div>
            <h4 className="pending-title">Demand Metrics Pending for Sub-Corridor</h4>
            <p className="pending-desc">
              Granular demand source weights and magnet driver classifications for <strong>{corridor.name}</strong> are currently in progress. Please refer to behavioral dayparts and audience affinities in the sections above.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Sort demand sources descending
  const sortedSources = DEMAND_SOURCE_KEYS
    .map(key => ({
      key,
      name: formatDemandSourceName(key),
      value: demandSources[key] ?? 0
    }))
    .sort((a, b) => b.value - a.value);

  // Top 2-3 sources for text interpretation
  const top1 = sortedSources[0];
  const top2 = sortedSources[1];
  const top3 = sortedSources[2];

  // Top 5 demand magnets
  const top5Magnets = Object.entries(demandMagnets || {})
    .map(([key, val]) => ({
      key,
      name: formatMagnetName(key),
      value: val
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);

  return (
    <div className="section-card">
      <div className="section-header">
        <div className="section-title-group">
          <Compass className="icon-sm text-emerald" />
          <h3 className="section-title">DEMAND PROFILE</h3>
        </div>
        <span className="section-subtitle">Relative Contextual Pull Signals</span>
      </div>

      {/* Interpretive Callout */}
      <div className="demand-interpretation-card">
        <div className="interpretation-lead">
          <strong>{top1.name}</strong> is the strongest demand source (weight: <strong>{top1.value.toFixed(2)}</strong>), followed by <strong>{top2.name.toLowerCase()}</strong> ({top2.value.toFixed(2)}) and <strong>{top3.name.toLowerCase()}</strong> ({top3.value.toFixed(2)}).
        </div>
        <div className="disclaimer-mini">
          <Info className="icon-xs text-muted shrink-0" />
          <span>Demand values represent normalized comparative context intensity (0.00–1.00), not census headcount.</span>
        </div>
      </div>

      {/* Demand Sources Bar Chart */}
      <div className="demand-sources-block">
        <h4 className="sub-section-title">7 Standardized Demand Sources</h4>
        <div className="demand-sources-grid">
          {sortedSources.map((src, idx) => {
            const pct = Math.round(src.value * 100);
            const isTop = idx < 2;

            return (
              <div key={src.key} className={`demand-bar-row ${isTop ? 'is-top-source' : ''}`}>
                <div className="demand-label-col">
                  <span className="demand-source-name">{src.name}</span>
                  {idx === 0 && <span className="rank-pill rank-pill-lead">Primary</span>}
                  {idx === 1 && <span className="rank-pill">Secondary</span>}
                </div>

                <div className="demand-track">
                  <div
                    className={`demand-fill ${isTop ? 'fill-emerald' : 'fill-slate'}`}
                    style={{ width: `${Math.max(pct, 3)}%` }}
                  />
                </div>

                <div className="demand-value-col">
                  <span className="demand-num-value">{src.value.toFixed(3)}</span>
                  <span className="demand-pct-value">({pct}%)</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Top 5 Demand Magnets */}
      <div className="demand-magnets-block">
        <div className="magnets-header">
          <div className="magnets-title-row">
            <Magnet className="icon-xs text-cyan" />
            <h4 className="sub-section-title">Top 5 Demand Magnets</h4>
          </div>
          <span className="magnets-count-note">Out of 15 classified magnets</span>
        </div>

        <div className="magnets-grid">
          {top5Magnets.map((mag, idx) => {
            const magPct = Math.round(mag.value * 100);
            return (
              <div key={mag.key} className="magnet-card">
                <div className="magnet-card-header">
                  <span className="magnet-rank">#{idx + 1}</span>
                  <span className="magnet-name">{mag.name}</span>
                </div>
                <div className="magnet-bar-row">
                  <div className="magnet-track">
                    <div className="magnet-fill" style={{ width: `${Math.max(magPct, 4)}%` }} />
                  </div>
                  <span className="magnet-score-text">{mag.value.toFixed(2)}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
