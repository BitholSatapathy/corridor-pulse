import React from 'react';
import { MapPin, Shield, Compass, ArrowUpRight, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { getBoroughBadgeColor } from '../utils/formatters';

export default function CorridorSummary({
  corridor,
  parentCorridor,
  onSelectParent
}) {
  if (!corridor) return null;

  const isPending = corridor.enrichment_status === 'PENDING';
  const isMacro = corridor.level === 'MACRO';

  return (
    <div className="summary-card">
      {/* Top Banner & Badges */}
      <div className="summary-header">
        <div>
          <div className="summary-meta-row">
            <span className={`badge-borough ${getBoroughBadgeColor(corridor.borough)}`}>
              {corridor.borough}
            </span>
            <span className={isMacro ? 'badge-macro' : 'badge-sub'}>
              {corridor.level}
            </span>
            {isPending ? (
              <span className="badge-status-pending">
                <AlertTriangle className="icon-xs" />
                Enrichment Pending
              </span>
            ) : (
              <span className="badge-status-available">
                <CheckCircle2 className="icon-xs" />
                Enriched Profile
              </span>
            )}
          </div>
          <h2 className="summary-title">{corridor.name}</h2>
        </div>

        {/* Parent Link if Sub-Corridor */}
        {parentCorridor && (
          <div className="parent-corridor-link">
            <span className="parent-label">Macro Host:</span>
            <button
              type="button"
              className="parent-button"
              onClick={() => onSelectParent(parentCorridor)}
              title="Jump to Parent Macro Corridor"
            >
              <span>{parentCorridor.name}</span>
              <ArrowUpRight className="icon-xs" />
            </button>
          </div>
        )}
      </div>

      {/* Neighborhood Pills */}
      <div className="summary-neighborhoods">
        <span className="neighborhoods-label">Neighborhoods:</span>
        <div className="neighborhoods-pills">
          {corridor.neighborhoods?.map((n, i) => (
            <span key={i} className="neighborhood-pill">
              {n}
            </span>
          ))}
        </div>
      </div>

      {/* Character Narrative Quote */}
      {corridor.character && (
        <div className="character-box">
          <div className="character-label">
            <Compass className="icon-xs text-cyan" />
            <span>CORRIDOR CHARACTER</span>
          </div>
          <blockquote className="character-quote">
            "{corridor.character}"
          </blockquote>
        </div>
      )}

      {/* Access & Physical Connectivity */}
      <div className="access-strip">
        <div className="access-item">
          <span className="access-label">Gateway Dependency:</span>
          <span className={`access-value gateway-${corridor.access?.gateway_dependency?.toLowerCase() || 'none'}`}>
            {corridor.access?.gateway_dependency || 'NONE'}
          </span>
        </div>
        <div className="access-divider" />
        <div className="access-item flex-1">
          <span className="access-label">Connectivity Context:</span>
          <span className="access-note">
            {corridor.access?.barrier_note || 'Direct grid access with no significant physical barrier reported.'}
          </span>
        </div>
      </div>
    </div>
  );
}
