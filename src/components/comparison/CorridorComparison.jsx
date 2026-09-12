import React from 'react';
import {
  ArrowLeft,
  GitCompare,
  Sparkles,
  Clock,
  Users,
  Compass,
  ShieldCheck,
  Anchor,
  Info
} from 'lucide-react';
import { compareCorridors } from '../../utils/comparison';
import {
  getBoroughBadgeColor,
  getConfidenceBadge,
  formatDaypartShort,
  formatDaypartTime
} from '../../utils/formatters';

export default function CorridorComparison({
  corridorA,
  corridorB,
  onExitComparison,
  onSelectCorridorA,
  onSelectCorridorB,
  allCorridors
}) {
  if (!corridorA || !corridorB) return null;

  const comparison = compareCorridors(corridorA, corridorB);
  if (!comparison) return null;

  const {
    pulseA,
    pulseB,
    componentComparison,
    daypartsComparison,
    audiencesA,
    audiencesB,
    demandSourcesA,
    demandSourcesB,
    demandMagnetsA,
    demandMagnetsB,
    resilienceMatrix,
    anchorsComparison,
    keyDifferences
  } = comparison;

  const componentRows = [
    { key: 'activity', name: 'Activity Density', weight: '30%', data: componentComparison.activity },
    { key: 'demand', name: 'Demand Pull', weight: '25%', data: componentComparison.demand },
    { key: 'resilience', name: 'Stress Resilience', weight: '25%', data: componentComparison.resilience },
    { key: 'diversification', name: 'Anchor Diversification', weight: '20%', data: componentComparison.diversification }
  ];

  return (
    <div className="comparison-workspace">
      {/* Top Header & Navigation */}
      <div className="comparison-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <GitCompare size={20} className="text-sky-400" />
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              Corridor Comparison Workspace
            </h2>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Differential behavioral diagnostic across two commercial corridors
            </p>
          </div>
        </div>

        <button
          type="button"
          className="btn-compare-action"
          onClick={onExitComparison}
        >
          <ArrowLeft size={14} />
          <span>Exit Comparison</span>
        </button>
      </div>

      {/* Selectors for Corridor A and Corridor B */}
      <div className="comparison-columns-grid">
        {/* Corridor A Selector */}
        <div className="comp-column corridor-a">
          <div className="comp-column-header">
            <div>
              <span className="card-label" style={{ color: 'var(--accent-cyan)' }}>Corridor A (Baseline)</span>
              <h3 className="comp-corridor-title">{corridorA.name}</h3>
            </div>
            <span className="pill-borough">{corridorA.borough}</span>
          </div>

          <select
            className="search-input"
            value={corridorA.corridor_id}
            onChange={(e) => {
              const found = allCorridors.find(c => c.corridor_id === e.target.value);
              if (found) onSelectCorridorA(found);
            }}
          >
            {allCorridors.map(c => (
              <option key={c.corridor_id} value={c.corridor_id} style={{ background: '#0e1420', color: '#f1f5f9' }}>
                {c.name} ({c.borough}) {c.level === 'SUB_CORRIDOR' ? '[Sub]' : ''}
              </option>
            ))}
          </select>
        </div>

        {/* Corridor B Selector */}
        <div className="comp-column corridor-b">
          <div className="comp-column-header">
            <div>
              <span className="card-label" style={{ color: 'var(--accent-purple)' }}>Corridor B (Comparison)</span>
              <h3 className="comp-corridor-title">{corridorB.name}</h3>
            </div>
            <span className="pill-borough">{corridorB.borough}</span>
          </div>

          <select
            className="search-input"
            value={corridorB.corridor_id}
            onChange={(e) => {
              const found = allCorridors.find(c => c.corridor_id === e.target.value);
              if (found) onSelectCorridorB(found);
            }}
          >
            {allCorridors.map(c => (
              <option key={c.corridor_id} value={c.corridor_id} style={{ background: '#0e1420', color: '#f1f5f9' }}>
                {c.name} ({c.borough}) {c.level === 'SUB_CORRIDOR' ? '[Sub]' : ''}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Key Differences Banner */}
      {keyDifferences && keyDifferences.length > 0 && (
        <div className="comp-contrast-banner">
          <span className="comp-banner-title">Analytical Contrast & Key Differences</span>
          <div className="comp-contrasts-list">
            {keyDifferences.map((diff, i) => (
              <div key={i} className="comp-contrast-item">
                &bull; {diff}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 1. Pulse Score Comparison */}
      <div className="editorial-card">
        <div className="card-header">
          <div className="card-title-group">
            <span className="card-label">Overall Pulse Comparison</span>
            <h3 className="card-title">Score & Component Breakdown</h3>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
          {/* Corridor A Score */}
          <div style={{ padding: '1rem', background: 'var(--bg-surface-subtle)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
            <span style={{ fontSize: '0.6875rem', fontFamily: 'var(--font-mono)', color: 'var(--accent-cyan)' }}>
              {corridorA.name}
            </span>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem', margin: '0.35rem 0' }}>
              <span className="tabular-nums" style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                {pulseA.overallScore}
              </span>
              <span className="badge badge-status-active">{pulseA.status}</span>
              {pulseA.isPartial && <span className="badge badge-status-pending">Partial</span>}
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{pulseA.statusDescription}</p>
          </div>

          {/* Corridor B Score */}
          <div style={{ padding: '1rem', background: 'var(--bg-surface-subtle)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
            <span style={{ fontSize: '0.6875rem', fontFamily: 'var(--font-mono)', color: 'var(--accent-purple)' }}>
              {corridorB.name}
            </span>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem', margin: '0.35rem 0' }}>
              <span className="tabular-nums" style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                {pulseB.overallScore}
              </span>
              <span className="badge badge-status-stable">{pulseB.status}</span>
              {pulseB.isPartial && <span className="badge badge-status-pending">Partial</span>}
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{pulseB.statusDescription}</p>
          </div>
        </div>

        {/* 4 Components Comparative Rows */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.75rem' }}>
          {componentRows.map(({ key, name, weight, data }) => {
            const valA = data?.isPendingA ? 'Pending' : (data?.scoreA ?? '--');
            const valB = data?.isPendingB ? 'Pending' : (data?.scoreB ?? '--');
            const diffText = data?.diff != null ? `Δ ${data.diff} pts` : '--';

            return (
              <div key={key} style={{
                display: 'grid',
                gridTemplateColumns: '1fr auto 1fr',
                alignItems: 'center',
                gap: '1rem',
                padding: '0.65rem 0.875rem',
                background: 'var(--bg-surface-elevated)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-subtle)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.8125rem', fontWeight: 500 }}>{name}</span>
                  <span className="tabular-nums" style={{ fontWeight: 600, color: 'var(--accent-cyan)' }}>{valA}</span>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <span style={{ fontSize: '0.6875rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                    {weight}
                  </span>
                  <div style={{ fontSize: '0.625rem', color: 'var(--text-muted)' }}>{diffText}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span className="tabular-nums" style={{ fontWeight: 600, color: 'var(--accent-purple)' }}>{valB}</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {data?.winner === 'B' ? 'B leads' : data?.winner === 'A' ? 'A leads' : 'Tied'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Diurnal Dayparts Comparison */}
      {daypartsComparison && (
        <div className="editorial-card">
          <div className="card-header">
            <div className="card-title-group">
              <span className="card-label">Diurnal Rhythms</span>
              <h3 className="card-title">Daypart Occasion Density Comparison</h3>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '0.75rem' }}>
            {daypartsComparison.map(dp => (
              <div key={dp.key} style={{
                padding: '0.75rem',
                background: 'var(--bg-surface-subtle)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-subtle)',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.35rem',
                textAlign: 'center'
              }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-primary)' }}>{dp.label}</span>
                <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'baseline', marginTop: '0.25rem' }}>
                  <span className="tabular-nums" style={{ color: 'var(--accent-cyan)', fontWeight: 600, fontSize: '0.9375rem' }}>
                    {dp.valA}
                  </span>
                  <span style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>vs</span>
                  <span className="tabular-nums" style={{ color: 'var(--accent-purple)', fontWeight: 600, fontSize: '0.9375rem' }}>
                    {dp.valB}
                  </span>
                </div>
                <span style={{ fontSize: '0.625rem', color: 'var(--text-muted)' }}>
                  Δ {dp.diff} pts {dp.winner !== 'TIE' ? `(${dp.winner})` : ''}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. Side-by-Side Signals Grid (Audiences & Demands) */}
      <div className="comparison-columns-grid">
        {/* Corridor A Signals */}
        <div className="comp-column">
          <span className="card-label" style={{ color: 'var(--accent-cyan)' }}>
            {corridorA.name} Signals
          </span>

          {/* Top Audiences */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Top Audiences</span>
            {(audiencesA || []).slice(0, 3).map(aud => (
              <div key={aud.id || aud.segmentId} className="audience-row" style={{ padding: '0.4rem 0.6rem' }}>
                <span style={{ fontSize: '0.75rem' }}>{aud.label}</span>
                <span className="tabular-nums" style={{ fontSize: '0.75rem', fontWeight: 600 }}>{aud.score}/10</span>
              </div>
            ))}
          </div>

          {/* Top Demand Sources */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.5rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Top Demand Sources</span>
            {demandSourcesA && demandSourcesA.length > 0 ? (
              demandSourcesA.slice(0, 3).map(src => (
                <div key={src.key} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>{src.label || src.name}</span>
                  <span className="tabular-nums" style={{ fontWeight: 600 }}>{(src.value * 100).toFixed(0)}%</span>
                </div>
              ))
            ) : (
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>Demand profile pending enrichment</span>
            )}
          </div>
        </div>

        {/* Corridor B Signals */}
        <div className="comp-column">
          <span className="card-label" style={{ color: 'var(--accent-purple)' }}>
            {corridorB.name} Signals
          </span>

          {/* Top Audiences */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Top Audiences</span>
            {(audiencesB || []).slice(0, 3).map(aud => (
              <div key={aud.id || aud.segmentId} className="audience-row" style={{ padding: '0.4rem 0.6rem' }}>
                <span style={{ fontSize: '0.75rem' }}>{aud.label}</span>
                <span className="tabular-nums" style={{ fontSize: '0.75rem', fontWeight: 600 }}>{aud.score}/10</span>
              </div>
            ))}
          </div>

          {/* Top Demand Sources */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.5rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Top Demand Sources</span>
            {demandSourcesB && demandSourcesB.length > 0 ? (
              demandSourcesB.slice(0, 3).map(src => (
                <div key={src.key} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>{src.label || src.name}</span>
                  <span className="tabular-nums" style={{ fontWeight: 600 }}>{(src.value * 100).toFixed(0)}%</span>
                </div>
              ))
            ) : (
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>Demand profile pending enrichment</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
