import React, { useState } from 'react';
import { HelpCircle, ChevronDown, Info, ShieldCheck, Activity, Layers, ArrowUpRight } from 'lucide-react';
import { computeCorridorPulseScore } from '../../utils/scoring';

export default function PulseScoreHero({ corridor }) {
  const [showMethodology, setShowMethodology] = useState(false);

  if (!corridor) return null;

  const pulseData = computeCorridorPulseScore(corridor);
  if (!pulseData) return null;

  const { overallScore, status, statusDescription, isPartial, weights, components } = pulseData;

  const getStatusClass = (st) => {
    switch (st) {
      case 'ACTIVE': return 'badge-status-active';
      case 'BALANCED': return 'badge-status-balanced';
      case 'STABLE': return 'badge-status-stable';
      case 'CONCENTRATED': return 'badge-status-concentrated';
      case 'FRAGILE': return 'badge-status-fragile';
      default: return 'badge-status-pending';
    }
  };

  const compList = [
    {
      key: 'activity',
      name: 'Activity',
      weight: weights.activity || '30%',
      data: components.activity,
      accent: 'var(--accent-cyan)'
    },
    {
      key: 'demand',
      name: 'Demand',
      weight: weights.demand || '25%',
      data: components.demand,
      accent: 'var(--semantic-emerald)'
    },
    {
      key: 'resilience',
      name: 'Resilience',
      weight: weights.resilience || '25%',
      data: components.resilience,
      accent: 'var(--accent-purple)'
    },
    {
      key: 'diversification',
      name: 'Anchor Diversification',
      weight: weights.diversification || '20%',
      data: components.anchorDiversification,
      accent: 'var(--semantic-amber)'
    }
  ];

  return (
    <div className="pulse-score-hero">
      {/* Top Header Row */}
      <div className="hero-top-row">
        <div className="hero-title-group">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
            <span className="diagnostic-tag">
              <span className="badge-dot" style={{ background: 'var(--accent-cyan)' }} />
              Derived Diagnostic
            </span>
            <span className={`badge ${getStatusClass(status)}`}>
              <span className="badge-dot" />
              {status}
            </span>
            {isPartial && (
              <span className="badge badge-status-pending">
                Normalized Partial
              </span>
            )}
          </div>
          <h2 className="hero-heading">Corridor Pulse Diagnostic</h2>
        </div>

        {/* Methodology Toggle */}
        <button
          type="button"
          className="btn-methodology"
          onClick={() => setShowMethodology(!showMethodology)}
        >
          <HelpCircle size={13} />
          <span>Methodology & Weights</span>
          <ChevronDown size={13} style={{ transform: showMethodology ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
        </button>
      </div>

      {/* Hero Score Block */}
      <div className="hero-score-block">
        <div className="hero-score-num tabular-nums">
          {overallScore}
        </div>
        <div className="hero-score-meta">
          <span className="hero-score-denom">/ 100 Composite Score</span>
          <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
            {statusDescription}
          </span>
        </div>
      </div>

      {/* 4 Component Score Bars */}
      <div className="hero-components-grid">
        {compList.map(item => {
          const scoreVal = item.data?.score;
          const isPending = scoreVal == null || item.data?.isPending;
          return (
            <div key={item.key} className="component-bar-col">
              <div className="comp-bar-header">
                <span className="comp-bar-label">{item.name}</span>
                <span className="comp-bar-weight">{item.weight}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
                <span className="comp-bar-val tabular-nums">
                  {isPending ? 'Pending' : scoreVal}
                </span>
                {!isPending && (
                  <span style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>/ 100</span>
                )}
              </div>
              <div className="meter-track">
                <div
                  className="meter-fill"
                  style={{
                    width: isPending ? '0%' : `${scoreVal}%`,
                    background: item.accent
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Expandable Methodology Drawer */}
      {showMethodology && (
        <div style={{
          padding: '1rem',
          background: 'var(--bg-surface-subtle)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-md)',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem',
          fontSize: '0.8125rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600, color: 'var(--text-primary)' }}>
            <Info size={16} className="text-sky-400" />
            <span>Methodology & Component Definitions</span>
          </div>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.5 }}>
            Corridor Pulse calculates a transparent 0–100 composite diagnostic derived from supplied corridor signals across four core dimensions:
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem' }}>
            <div style={{ padding: '0.5rem', background: 'var(--bg-surface-elevated)', borderRadius: 'var(--radius-xs)' }}>
              <span style={{ color: 'var(--accent-cyan)', fontWeight: 600 }}>Activity (30%)</span>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Average density index across 5 diurnal dayparts.</p>
            </div>
            <div style={{ padding: '0.5rem', background: 'var(--bg-surface-elevated)', borderRadius: 'var(--radius-xs)' }}>
              <span style={{ color: 'var(--semantic-emerald)', fontWeight: 600 }}>Demand (25%)</span>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Intensity of top demand sources & 15-magnet diversity spread.</p>
            </div>
            <div style={{ padding: '0.5rem', background: 'var(--bg-surface-elevated)', borderRadius: 'var(--radius-xs)' }}>
              <span style={{ color: 'var(--accent-purple)', fontWeight: 600 }}>Resilience (25%)</span>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Shock resilience offset by seasonal volatility & event/development dependencies.</p>
            </div>
            <div style={{ padding: '0.5rem', background: 'var(--bg-surface-elevated)', borderRadius: 'var(--radius-xs)' }}>
              <span style={{ color: 'var(--semantic-amber)', fontWeight: 600 }}>Anchor Diversification (20%)</span>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Effective anchor count and resistance to top-3 anchor concentration.</p>
            </div>
          </div>
        </div>
      )}

      {/* Disclaimer Row */}
      <div className="hero-disclaimer-row">
        <span className="disclaimer-text">
          * This is a derived diagnostic based on supplied corridor signals. It is not a prediction of revenue, success, or population.
        </span>
      </div>
    </div>
  );
}
