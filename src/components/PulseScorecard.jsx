import React, { useState } from 'react';
import {
  Activity,
  Compass,
  ShieldCheck,
  Layers,
  ChevronDown,
  Info,
  Sparkles,
  AlertTriangle,
  HelpCircle,
  TrendingUp,
  BarChart2
} from 'lucide-react';
import { computeCorridorPulseScore } from '../utils/scoring';

export default function PulseScorecard({ corridor }) {
  const [showMethodology, setShowMethodology] = useState(false);

  if (!corridor) return null;

  const pulseData = computeCorridorPulseScore(corridor);
  if (!pulseData) return null;

  const { overallScore, status, statusDescription, isPartial, weights, components } = pulseData;

  // Status badge styling
  const statusColorMap = {
    ACTIVE: { badge: 'badge-status-active', text: 'text-cyan', ring: '#38bdf8' },
    BALANCED: { badge: 'badge-status-balanced', text: 'text-emerald', ring: '#10b981' },
    STABLE: { badge: 'badge-status-stable', text: 'text-blue', ring: '#3b82f6' },
    CONCENTRATED: { badge: 'badge-status-concentrated', text: 'text-amber', ring: '#f59e0b' },
    FRAGILE: { badge: 'badge-status-fragile', text: 'text-rose', ring: '#f43f5e' }
  };
  const statusStyle = statusColorMap[status] || statusColorMap.BALANCED;

  // Arc stroke calculation for radial progress (circumference ~ 283)
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (overallScore / 100) * circumference;

  return (
    <div className="scorecard-container">
      {/* Top Banner & Question Header */}
      <div className="scorecard-header">
        <div className="scorecard-header-left">
          <div className="pulse-hero-pill">
            <span className="pulse-hero-dot" />
            <span className="pulse-hero-tag">Derived Diagnostic</span>
          </div>
          <h2 className="scorecard-question">
            What is the overall pulse of {corridor.name}?
          </h2>
        </div>

        {/* Methodology Toggle */}
        <button
          type="button"
          className="methodology-toggle-btn"
          onClick={() => setShowMethodology(!showMethodology)}
          aria-expanded={showMethodology}
        >
          <HelpCircle className="icon-xs text-cyan" />
          <span>How is this calculated?</span>
          <ChevronDown className={`icon-xs chevron-transition ${showMethodology ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {/* Expandable Methodology Explainer */}
      {showMethodology && (
        <div className="methodology-panel">
          <div className="methodology-panel-header">
            <div className="methodology-title-row">
              <Info className="icon-sm text-cyan" />
              <h4 className="methodology-title">Derived Pulse Scoring Methodology</h4>
            </div>
            <span className="methodology-weight-note">Normalized 0–100 Diagnostic Scale</span>
          </div>

          <div className="methodology-weights-grid">
            <div className="methodology-weight-card">
              <div className="weight-pct text-cyan">{weights.activity}</div>
              <div className="weight-name">1. Activity</div>
              <div className="weight-desc">Mean occasion density across 5 standardized diurnal dayparts.</div>
            </div>

            <div className="methodology-weight-card">
              <div className="weight-pct text-emerald">{weights.demand}</div>
              <div className="weight-name">2. Demand</div>
              <div className="weight-desc">Intensity of primary demand sources and 15-category magnet spread.</div>
            </div>

            <div className="methodology-weight-card">
              <div className="weight-pct text-purple">{weights.resilience}</div>
              <div className="weight-name">3. Resilience</div>
              <div className="weight-desc">Shock capacity offset by seasonal swings, event voids, and dev dependencies.</div>
            </div>

            <div className="methodology-weight-card">
              <div className="weight-pct text-amber">{weights.diversification}</div>
              <div className="weight-name">4. Anchor Diversification</div>
              <div className="weight-desc">Effective anchor count & resistance to top-3 anchor concentration.</div>
            </div>
          </div>

          <div className="methodology-disclaimer-callout">
            <Info className="icon-xs text-muted shrink-0" />
            <p>
              <strong>Analytical Notice:</strong> This is a derived diagnostic based on supplied corridor signals. It is not a prediction of revenue, success, or population.
            </p>
          </div>
        </div>
      )}

      {/* Scorecard Hero Body: Gauge & 4 Component Breakdown */}
      <div className="scorecard-body">
        {/* Left: Overall Score Radial Gauge */}
        <div className="scorecard-gauge-box">
          <div className="score-radial-wrapper">
            <svg className="score-radial-svg" viewBox="0 0 110 110">
              <circle
                className="radial-track"
                cx="55"
                cy="55"
                r={radius}
                strokeWidth="9"
              />
              <circle
                className="radial-progress"
                cx="55"
                cy="55"
                r={radius}
                strokeWidth="9"
                stroke={statusStyle.ring}
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                transform="rotate(-90 55 55)"
              />
            </svg>
            <div className="score-radial-content">
              <span className="score-number">{overallScore}</span>
              <span className="score-max">/ 100</span>
            </div>
          </div>

          <div className="score-status-group">
            <div className="score-status-badge-row">
              <span className={`badge-pulse-status ${statusStyle.badge}`}>
                {status}
              </span>
              {isPartial && (
                <span className="badge-partial" title="Evaluated across available Activity and Resilience components">
                  Partial Diagnostic
                </span>
              )}
            </div>
            <p className="score-status-desc">{statusDescription}</p>
          </div>
        </div>

        {/* Right: 4 Component Score Bars */}
        <div className="scorecard-components-grid">
          {/* Component 1: Activity (30%) */}
          <div className="component-score-card">
            <div className="component-card-top">
              <div className="component-title-row">
                <Activity className="icon-xs text-cyan" />
                <span className="component-name">Activity Density</span>
                <span className="component-weight">{weights.activity}</span>
              </div>
              <span className="component-score-val text-cyan">
                {components.activity.score}
              </span>
            </div>
            <div className="component-track">
              <div
                className="component-fill fill-cyan"
                style={{ width: `${components.activity.score}%` }}
              />
            </div>
            <div className="component-meta">
              <span>Mean Daypart: {components.activity.meanDaypart}</span>
              <span>Peak: {components.activity.peakDaypart}</span>
            </div>
          </div>

          {/* Component 2: Demand (25%) */}
          <div className="component-score-card">
            <div className="component-card-top">
              <div className="component-title-row">
                <Compass className="icon-xs text-emerald" />
                <span className="component-name">Demand Pull</span>
                <span className="component-weight">{weights.demand}</span>
              </div>
              {components.demand.isPending ? (
                <span className="badge-pending-comp">Enrichment pending</span>
              ) : (
                <span className="component-score-val text-emerald">
                  {components.demand.score}
                </span>
              )}
            </div>
            <div className="component-track">
              <div
                className="component-fill fill-emerald"
                style={{ width: `${components.demand.score || 0}%` }}
              />
            </div>
            <div className="component-meta">
              {components.demand.isPending ? (
                <span>Sub-corridor inventory pending</span>
              ) : (
                <>
                  <span>Source Pull: {components.demand.strengthScore}</span>
                  <span>Diversity: {components.demand.diversityScore}</span>
                </>
              )}
            </div>
          </div>

          {/* Component 3: Resilience (25%) */}
          <div className="component-score-card">
            <div className="component-card-top">
              <div className="component-title-row">
                <ShieldCheck className="icon-xs text-purple" />
                <span className="component-name">Stress Resilience</span>
                <span className="component-weight">{weights.resilience}</span>
              </div>
              <span className="component-score-val text-purple">
                {components.resilience.score}
              </span>
            </div>
            <div className="component-track">
              <div
                className="component-fill fill-purple"
                style={{ width: `${components.resilience.score}%` }}
              />
            </div>
            <div className="component-meta">
              <span>Shock Base: {components.resilience.shockScore}</span>
              <span>Dampener: -{components.resilience.penaltyScore}</span>
            </div>
          </div>

          {/* Component 4: Anchor Diversification (20%) */}
          <div className="component-score-card">
            <div className="component-card-top">
              <div className="component-title-row">
                <Layers className="icon-xs text-amber" />
                <span className="component-name">Anchor Dispersion</span>
                <span className="component-weight">{weights.diversification}</span>
              </div>
              {components.diversification.isPending ? (
                <span className="badge-pending-comp">Enrichment pending</span>
              ) : (
                <span className="component-score-val text-amber">
                  {components.diversification.score}
                </span>
              )}
            </div>
            <div className="component-track">
              <div
                className="component-fill fill-amber"
                style={{ width: `${components.diversification.score || 0}%` }}
              />
            </div>
            <div className="component-meta">
              {components.diversification.isPending ? (
                <span>Sub-corridor anchors pending</span>
              ) : (
                <>
                  <span>Top 3 Share: {components.diversification.top3Share}%</span>
                  <span>Eff. Anchors: {components.diversification.effectiveCount?.toFixed(1)}</span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Pulse Diagnostic Narrative Banner */}
      <div className="scorecard-narrative-footer">
        <Sparkles className="icon-xs text-cyan shrink-0" />
        <p className="narrative-text">
          {corridor.name} exhibits an overall Pulse score of <strong>{overallScore}/100</strong> ({status}).{' '}
          {overallScore >= 70
            ? 'Strong multimodal footfall and high shock resilience combine to create a durable, active commercial ecosystem.'
            : overallScore >= 60
            ? 'The corridor presents a balanced commercial core with solid neighborhood anchors and steady daytime circulation.'
            : 'Activity is localized with specialized demand pull, showing higher sensitivity to single-anchor reliance or seasonal shifts.'}
          {isPartial && ' (Score calculated from available diurnal activity and resilience components during sub-corridor ingestion).'}
        </p>
      </div>

      {/* Mandatory Official Disclaimer Strip */}
      <div className="scorecard-disclaimer-strip">
        <Info className="icon-xs text-muted shrink-0" />
        <span>
          This is a derived diagnostic based on supplied corridor signals. It is not a prediction of revenue, success, or population.
        </span>
      </div>
    </div>
  );
}
