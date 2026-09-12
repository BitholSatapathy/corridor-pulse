import React from 'react';
import {
  Flame,
  TrendingUp,
  ShieldAlert,
  Footprints,
  Layers,
  HelpCircle
} from 'lucide-react';
import { formatDaypartShort } from '../utils/formatters';

export default function MetricCards({ corridor }) {
  if (!corridor) return null;

  const behavior = corridor.behavior || {};
  const dayparts = behavior.daypart_occasion_density || {};
  const resilience = behavior.resilience || {};

  // 1. Peak Activity: find the daypart key with highest score
  let peakKey = 'weekday_evening';
  let peakScore = 0;
  Object.entries(dayparts).forEach(([k, v]) => {
    if (v > peakScore) {
      peakScore = v;
      peakKey = k;
    }
  });

  // 2. Timing Alpha
  const timingAlpha = behavior.timing_alpha ?? '--';

  // 3. Shock Resilience
  const shockResilience = resilience.shock_resilience ?? '--';

  // 4. Path-of-Travel Friction
  const travelFriction = behavior.path_of_travel_friction ?? '--';

  // 5. Magnet Diversity (Available only for enriched corridors)
  const isPending = corridor.enrichment_status === 'PENDING';
  const magnetDiversity = corridor.magnet_diversity;

  return (
    <div className="metric-cards-grid">
      {/* 1. Peak Activity */}
      <div className="metric-card">
        <div className="metric-header">
          <span className="metric-title">Peak Activity</span>
          <div className="metric-icon-wrapper text-cyan bg-cyan-500/10">
            <Flame className="icon-sm" />
          </div>
        </div>
        <div className="metric-value-row">
          <span className="metric-value text-cyan">{peakScore}</span>
          <span className="metric-unit">/ 100</span>
        </div>
        <div className="metric-badge-row">
          <span className="metric-pill pill-cyan">
            {formatDaypartShort(peakKey)}
          </span>
        </div>
        <p className="metric-desc">Diurnal occasion density peak</p>
      </div>

      {/* 2. Timing Alpha */}
      <div className="metric-card">
        <div className="metric-header">
          <span className="metric-title">Timing Alpha</span>
          <div className="metric-icon-wrapper text-emerald bg-emerald-500/10">
            <TrendingUp className="icon-sm" />
          </div>
        </div>
        <div className="metric-value-row">
          <span className="metric-value text-emerald">{timingAlpha}</span>
          <span className="metric-unit">/ 100</span>
        </div>
        <div className="metric-badge-row">
          <span className="metric-pill pill-emerald">
            {timingAlpha >= 65 ? 'High Momentum' : timingAlpha >= 50 ? 'Moderate Growth' : 'Steady State'}
          </span>
        </div>
        <p className="metric-desc">Growth & early-demand signal</p>
      </div>

      {/* 3. Shock Resilience */}
      <div className="metric-card">
        <div className="metric-header">
          <span className="metric-title">Shock Resilience</span>
          <div className="metric-icon-wrapper text-purple bg-purple-500/10">
            <ShieldAlert className="icon-sm" />
          </div>
        </div>
        <div className="metric-value-row">
          <span className="metric-value text-purple">{shockResilience}</span>
          <span className="metric-unit">/ 100</span>
        </div>
        <div className="metric-badge-row">
          <span className="metric-pill pill-purple">
            {shockResilience >= 60 ? 'Robust Ecosystem' : 'Moderate Tolerance'}
          </span>
        </div>
        <p className="metric-desc">Capacity to absorb demand disruptions</p>
      </div>

      {/* 4. Path-of-Travel Friction */}
      <div className="metric-card">
        <div className="metric-header">
          <span className="metric-title">Travel Friction</span>
          <div className="metric-icon-wrapper text-amber bg-amber-500/10">
            <Footprints className="icon-sm" />
          </div>
        </div>
        <div className="metric-value-row">
          <span className="metric-value text-amber">{travelFriction}</span>
          <span className="metric-unit">/ 100</span>
        </div>
        <div className="metric-badge-row">
          <span className="metric-pill pill-amber">
            {travelFriction >= 60 ? 'Topographic Barriers' : 'Accessible Walkway'}
          </span>
        </div>
        <p className="metric-desc">Circulation resistance & grid barriers</p>
      </div>

      {/* 5. Magnet Diversity */}
      <div className="metric-card">
        <div className="metric-header">
          <span className="metric-title">Magnet Diversity</span>
          <div className="metric-icon-wrapper text-blue bg-blue-500/10">
            <Layers className="icon-sm" />
          </div>
        </div>
        {isPending || magnetDiversity == null ? (
          <div className="metric-pending-state">
            <span className="metric-pending-text">Enrichment pending</span>
            <p className="metric-desc">Sub-corridor anchor data pending</p>
          </div>
        ) : (
          <>
            <div className="metric-value-row">
              <span className="metric-value text-blue">
                {(magnetDiversity * 100).toFixed(1)}%
              </span>
              <span className="metric-unit">Index</span>
            </div>
            <div className="metric-badge-row">
              <span className="metric-pill pill-blue">
                {magnetDiversity >= 0.92 ? 'Highly Diverse' : 'Balanced Drivers'}
              </span>
            </div>
            <p className="metric-desc">Spread across 15 demand driver categories</p>
          </>
        )}
      </div>
    </div>
  );
}
