import React, { useMemo } from 'react';
import { Compass, MapPin, ArrowUpRight, Clock, Users, Building, Shield } from 'lucide-react';
import { formatDaypartShort, formatDemandSourceName } from '../../utils/formatters';

export default function CorridorIdentity({ corridor, parentCorridor, onSelectParent }) {
  if (!corridor) return null;

  const isPending = corridor.enrichment_status === 'PENDING' || corridor.level === 'SUB_CORRIDOR';
  const isMacro = corridor.level === 'MACRO';

  // Derive Context Strip items
  const contextData = useMemo(() => {
    // 1. Primary Anchor
    const primaryAnchor = corridor.anchors && corridor.anchors.length > 0
      ? corridor.anchors[0].name
      : (isPending ? 'Pending enrichment' : 'Dispersed retail base');

    // 2. Top Audience
    let topAudience = 'General Footfall';
    if (corridor.audience_scores) {
      const sortedAud = Object.entries(corridor.audience_scores)
        .sort(([, a], [, b]) => b - a);
      if (sortedAud.length > 0 && sortedAud[0][1] > 0) {
        topAudience = sortedAud[0][0].replace(/_/g, ' ');
      }
    }

    // 3. Peak Daypart Time
    let peakDaypart = 'Balanced rhythm';
    if (corridor.behavior?.daypart_occasion_density) {
      const dayparts = corridor.behavior.daypart_occasion_density;
      const sortedDp = Object.entries(dayparts).sort(([, a], [, b]) => b - a);
      if (sortedDp.length > 0) {
        peakDaypart = formatDaypartShort(sortedDp[0][0]);
      }
    }

    // 4. Dominant Demand
    let dominantDemand = 'Diverse neighborhood demand';
    if (corridor.demand_sources) {
      const sortedDemand = Object.entries(corridor.demand_sources).sort(([, a], [, b]) => b - a);
      if (sortedDemand.length > 0) {
        dominantDemand = formatDemandSourceName(sortedDemand[0][0]);
      }
    } else if (isPending) {
      dominantDemand = 'Awaiting macro model';
    }

    return {
      primaryAnchor,
      topAudience,
      peakDaypart,
      dominantDemand
    };
  }, [corridor, isPending]);

  return (
    <div className="corridor-identity-card">
      <div className="identity-header-row">
        <div className="identity-title-group">
          <div className="identity-tags-row">
            <span className="pill-borough">{corridor.borough}</span>
            <span className={`pill-tier ${isMacro ? 'pill-tier-macro' : 'pill-tier-sub'}`}>
              {isMacro ? 'Macro Corridor' : 'Sub-Corridor'}
            </span>
            {isPending ? (
              <span className="badge badge-status-pending">
                <span className="badge-dot"></span>
                Partial Diagnostic
              </span>
            ) : (
              <span className="badge badge-status-active">
                <span className="badge-dot"></span>
                Fully Enriched
              </span>
            )}
          </div>
          <h1 className="corridor-name">{corridor.name}</h1>
        </div>

        {/* Parent Macro Corridor link if Sub-Corridor */}
        {parentCorridor && onSelectParent && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            <span>Host Corridor:</span>
            <button
              type="button"
              className="btn-compare-action"
              style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
              onClick={() => onSelectParent(parentCorridor)}
            >
              <span>{parentCorridor.name}</span>
              <ArrowUpRight size={12} />
            </button>
          </div>
        )}
      </div>

      {/* Character Quote */}
      {corridor.character && (
        <p className="corridor-character-quote">
          "{corridor.character}"
        </p>
      )}

      {/* Quick Context Badges Strip */}
      <div className="context-strip">
        <div className="context-chip">
          <span className="context-chip-label">Primary Anchor</span>
          <span className="context-chip-val" title={contextData.primaryAnchor}>
            {contextData.primaryAnchor}
          </span>
        </div>
        <div className="context-chip">
          <span className="context-chip-label">Top Audience</span>
          <span className="context-chip-val" style={{ textTransform: 'capitalize' }} title={contextData.topAudience}>
            {contextData.topAudience}
          </span>
        </div>
        <div className="context-chip">
          <span className="context-chip-label">Peak Time</span>
          <span className="context-chip-val" title={contextData.peakDaypart}>
            {contextData.peakDaypart}
          </span>
        </div>
        <div className="context-chip">
          <span className="context-chip-label">Dominant Demand</span>
          <span className="context-chip-val" title={contextData.dominantDemand}>
            {contextData.dominantDemand}
          </span>
        </div>
      </div>
    </div>
  );
}
