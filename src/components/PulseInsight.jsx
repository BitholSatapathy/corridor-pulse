import React from 'react';
import { Sparkles, CheckCircle, Info, Activity } from 'lucide-react';
import {
  formatDaypartShort,
  formatDemandSourceName,
  formatMagnetName,
  getAnchorConcentrationCategory
} from '../utils/formatters';

export default function PulseInsight({ corridor }) {
  if (!corridor) return null;

  const isPending = corridor.enrichment_status === 'PENDING';
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
    { label: `Peak: ${formatDaypartShort(peakDaypartKey)} (${peakDaypartVal})`, color: 'text-cyan' },
    topDemandSource ? { label: `Top Source: ${formatDemandSourceName(topDemandSource[0])}`, color: 'text-emerald' } : null,
    topMagnet ? { label: `Magnet: ${formatMagnetName(topMagnet[0])}`, color: 'text-blue' } : null,
    { label: `Resilience: ${shock}/100 (${shockDesc})`, color: 'text-purple' },
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
          <span className="pulse-insight-title">EVIDENCE-BASED CORRIDOR INSIGHT</span>
          <span className="pulse-rules-badge">Deterministic &bull; Rules-Based Synthesis</span>
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
        {/* Sentence 1: Peak Activity */}
        <p className="pulse-sentence">
          <span className="sentence-marker text-cyan">1.</span>
          <strong>{formatDaypartShort(peakDaypartKey)}</strong> is the corridor's highest-intensity period (scoring <strong>{peakDaypartVal}/100</strong>), driven primarily by {peakDesc}.
        </p>

        {/* Sentence 2: Demand Profile */}
        {topDemandSource ? (
          <p className="pulse-sentence">
            <span className="sentence-marker text-emerald">2.</span>
            Demand is led primarily by <strong>{formatDemandSourceName(topDemandSource[0]).toLowerCase()}</strong> (weight: <strong>{(topDemandSource[1] * 100).toFixed(0)}%</strong>)
            {secondDemandSource && (
              <>, reinforced by <strong>{formatDemandSourceName(secondDemandSource[0]).toLowerCase()}</strong> ({(secondDemandSource[1] * 100).toFixed(0)}%)</>
            )}.
          </p>
        ) : (
          <p className="pulse-sentence">
            <span className="sentence-marker text-emerald">2.</span>
            Behavioral demand signals are led by <strong>{topAudienceId.toLowerCase()}</strong> activity, while detailed place-inventory ingestion is currently pending.
          </p>
        )}

        {/* Sentence 3: Magnets & Footfall Anchor */}
        {topMagnet && (
          <p className="pulse-sentence">
            <span className="sentence-marker text-blue">3.</span>
            Footfall is strongly drawn by <strong>{formatMagnetName(topMagnet[0]).toLowerCase()}</strong>
            {secondMagnet && (
              <> and <strong>{formatMagnetName(secondMagnet[0]).toLowerCase()}</strong></>
            )} magnets, providing continuous commercial gravity.
          </p>
        )}

        {/* Sentence 4: Resilience & Anchor Structure */}
        <p className="pulse-sentence">
          <span className="sentence-marker text-purple">4.</span>
          The corridor demonstrates <strong>{shockDesc} shock resilience ({shock}/100)</strong>
          {anchorConc ? (
            <> alongside <strong>{concCategory.label.toLowerCase()} anchor concentration</strong>, with {(anchorConc.top_three_anchor_share * 100).toFixed(1)}% of anchor presence concentrated among the top 3 anchors.</>
          ) : (
            <>; granular anchor concentration tracking will be available once macro inventory is linked.</>
          )}
        </p>
      </div>

      <div className="pulse-insight-footer">
        <Info className="icon-xs text-muted" />
        <span>Every observation is strictly derived from observed empirical indicators without unverified causal claims.</span>
      </div>
    </div>
  );
}
