import React from 'react';
import { Sparkles, Info } from 'lucide-react';
import {
  formatDaypartShort,
  formatDemandSourceName,
  formatMagnetName,
  getAnchorConcentrationCategory
} from '../utils/formatters';
import { computeCorridorPulseScore } from '../utils/scoring';

export default function PulseInsight({ corridor }) {
  if (!corridor) return null;

  const pulseData = computeCorridorPulseScore(corridor);
  const { overallScore, status, isPartial, components } = pulseData || {};

  const behavior = corridor.behavior || {};
  const dayparts = behavior.daypart_occasion_density || {};
  const resilience = behavior.resilience || {};
  const demandSources = corridor.demand_sources;
  const demandMagnets = corridor.demand_magnets;
  const anchorConc = corridor.anchor_concentration;
  const topAudienceId = corridor.dominant_audience?.[0] || 'RESIDENTS';

  // 1. Peak Daypart
  let peakDaypartKey = 'weekday_evening';
  let peakDaypartVal = 0;
  Object.entries(dayparts).forEach(([k, v]) => {
    if (v > peakDaypartVal) {
      peakDaypartVal = v;
      peakDaypartKey = k;
    }
  });

  const daypartDescMap = {
    weekday_am: 'morning commute routines',
    weekday_midday: 'midday workforce and dining flows',
    weekday_evening: 'evening social and dinner gatherings',
    late_night: 'late-night nightlife and dining activity',
    weekend_day: 'weekend shopping and leisure visits'
  };
  const peakDesc = daypartDescMap[peakDaypartKey] || 'daily activity';

  // 2. Strongest Demand Sources (if available)
  let topDemandSource = null;
  let secondDemandSource = null;
  if (demandSources) {
    const sortedDS = Object.entries(demandSources).sort((a, b) => b[1] - a[1]);
    if (sortedDS.length > 0) topDemandSource = sortedDS[0];
    if (sortedDS.length > 1) secondDemandSource = sortedDS[1];
  }

  // 3. Strongest Demand Magnets (if available)
  let topMagnet = null;
  let secondMagnet = null;
  if (demandMagnets) {
    const sortedDM = Object.entries(demandMagnets).sort((a, b) => b[1] - a[1]);
    if (sortedDM.length > 0) topMagnet = sortedDM[0];
    if (sortedDM.length > 1) secondMagnet = sortedDM[1];
  }

  // 4. Resilience & Anchor Concentration
  const shock = resilience.shock_resilience ?? 50;
  const shockDesc = shock >= 60 ? 'robust' : shock >= 45 ? 'moderate' : 'sensitive';

  const concCategory = getAnchorConcentrationCategory(
    anchorConc?.top_three_anchor_share,
    anchorConc?.effective_anchor_count
  );

  // Traceable Evidence Pill Tags
  const evidenceTags = [
    { label: `Pulse Score: ${overallScore}/100 (${status})`, color: 'text-cyan font-bold' },
    { label: `Peak: ${formatDaypartShort(peakDaypartKey)} (${peakDaypartVal})`, color: 'text-cyan' },
    topDemandSource ? { label: `Lead Demand: ${formatDemandSourceName(topDemandSource[0])}`, color: 'text-emerald' } : null,
    topMagnet ? { label: `Core Magnet: ${formatMagnetName(topMagnet[0])}`, color: 'text-blue' } : null,
    { label: `Shock Resil: ${shock}/100`, color: 'text-purple' },
    anchorConc ? { label: `Anchor Conc: ${concCategory.label}`, color: 'text-amber' } : null
  ].filter(Boolean);

  return (
    <div className="pulse-insight-card">
      <div className="pulse-insight-header">
        <div className="pulse-insight-badge-group">
          <div className="pulse-indicator">
            <span className="pulse-dot" />
            <Sparkles className="icon-xs text-cyan" />
          </div>
          <span className="pulse-insight-title">SCORE DIAGNOSTIC NARRATIVE & INSIGHT</span>
          <span className="pulse-rules-badge">Rules-Based Traceable Synthesis</span>
        </div>
        
        <div className="pulse-evidence-tags">
          {evidenceTags.map((tag, idx) => (
            <span key={idx} className={`evidence-pill ${tag.color}`}>
              {tag.label}
            </span>
          ))}
        </div>
      </div>

      <div className="pulse-insight-body">
        {/* Sentence 1: Pulse Score & Diurnal Rhythm */}
        <p className="pulse-sentence">
          <span className="sentence-marker text-cyan">1.</span>
          With an overall Pulse score of <strong>{overallScore}/100</strong> ({status}), activity centers on the <strong>{formatDaypartShort(peakDaypartKey)}</strong> window (scoring <strong>{peakDaypartVal}/100</strong>) driven by {peakDesc}.
        </p>

        {/* Sentence 2: Demand Driver Pull */}
        {topDemandSource ? (
          <p className="pulse-sentence">
            <span className="sentence-marker text-emerald">2.</span>
            Demand pulls primarily from <strong>{formatDemandSourceName(topDemandSource[0]).toLowerCase()}</strong> (weight: <strong>{(topDemandSource[1] * 100).toFixed(0)}%</strong>)
            {secondDemandSource && (
              <>, complemented by <strong>{formatDemandSourceName(secondDemandSource[0]).toLowerCase()}</strong> ({(secondDemandSource[1] * 100).toFixed(0)}%)</>
            )}, feeding steady footfall into the commercial fabric.
          </p>
        ) : (
          <p className="pulse-sentence">
            <span className="sentence-marker text-emerald">2.</span>
            Behavioral demand is led by <strong>{topAudienceId.toLowerCase()}</strong> routines, while detailed place/magnet cataloging remains pending.
          </p>
        )}

        {/* Sentence 3: Magnets & Anchor Stability */}
        {topMagnet && (
          <p className="pulse-sentence">
            <span className="sentence-marker text-blue">3.</span>
            Commercial gravity is sustained by <strong>{formatMagnetName(topMagnet[0]).toLowerCase()}</strong>
            {secondMagnet && (
              <> and <strong>{formatMagnetName(secondMagnet[0]).toLowerCase()}</strong></>
            )} magnets, supporting diversified visitation patterns.
          </p>
        )}

        {/* Sentence 4: Resilience & Dependency */}
        <p className="pulse-sentence">
          <span className="sentence-marker text-purple">4.</span>
          The ecosystem demonstrates <strong>{shockDesc} shock absorption ({shock}/100)</strong>
          {anchorConc ? (
            <> with <strong>{concCategory.label.toLowerCase()} anchor concentration</strong> (top 3 anchors hold {(anchorConc.top_three_anchor_share * 100).toFixed(1)}% of anchor presence), informing its {status.toLowerCase()} operational profile.</>
          ) : (
            <>; full anchor diversification will be integrated following sub-corridor catalog ingestion.</>
          )}
        </p>
      </div>

      <div className="pulse-insight-footer">
        <Info className="icon-xs text-muted" />
        <span>This narrative explains the factors driving the composite Pulse Score. It reflects empirical behavioral signals, not revenue or success forecasts.</span>
      </div>
    </div>
  );
}
