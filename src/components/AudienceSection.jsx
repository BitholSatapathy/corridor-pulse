import React from 'react';
import { Users, Info, ShieldCheck } from 'lucide-react';
import { audienceSegmentsMap } from '../data/corridorsData';
import { getConfidenceBadge, getFamilyColor } from '../utils/formatters';

export default function AudienceSection({ corridor }) {
  if (!corridor) return null;

  const scores = corridor.audience_scores || {};
  const confidenceMap = corridor.audience_confidence || {};
  const evidenceMap = corridor.audience_evidence || {};

  // Top 5 audience segments based on audience_scores
  const topAudiences = Object.entries(scores)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([segmentId, score]) => {
      const meta = audienceSegmentsMap.get(segmentId) || {};
      const confidence = confidenceMap[segmentId] || 'LOW';
      const evidence = evidenceMap[segmentId] || {};

      return {
        segmentId,
        label: meta.label || segmentId.replace(/_/g, ' '),
        familyId: meta.family_id || 'general',
        score,
        confidence,
        rationale: evidence.rationale || null
      };
    });

  return (
    <div className="section-card">
      <div className="section-header">
        <div className="section-title-group">
          <Users className="icon-sm text-cyan" />
          <h3 className="section-title">WHO IS ASSOCIATED WITH THIS CORRIDOR</h3>
        </div>
        <span className="section-subtitle">
          Top 5 Behavioral Audience Segments
        </span>
      </div>

      {/* Mandatory Behavioral Intelligence Disclaimer */}
      <div className="methodology-alert">
        <Info className="icon-xs text-cyan shrink-0" />
        <p>
          <strong>Comparative Behavioral Signals:</strong> Audience scores represent relative affinity and behavioral relevance signals across NYC corridors (0–10 index), <em>not</em> raw census population counts.
        </p>
      </div>

      {/* Top 5 Audience Cards */}
      <div className="audience-list">
        {topAudiences.map((aud, index) => {
          const confBadge = getConfidenceBadge(aud.confidence);
          const scorePercent = (aud.score / 10) * 100;

          return (
            <div key={aud.segmentId} className="audience-card">
              <div className="audience-card-top">
                <div className="audience-rank-label">
                  <span className="audience-rank">#{index + 1}</span>
                  <div>
                    <h4 className="audience-name">{aud.label}</h4>
                    <span className={`audience-family-tag ${getFamilyColor(aud.familyId)}`}>
                      {aud.familyId}
                    </span>
                  </div>
                </div>

                <div className="audience-score-group">
                  <div className="audience-score-badge">
                    <span className="audience-score-number">{aud.score}</span>
                    <span className="audience-score-out-of">/ 10</span>
                  </div>
                  <span className={`confidence-pill ${confBadge.class}`}>
                    {confBadge.label}
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="audience-bar-track">
                <div
                  className="audience-bar-fill"
                  style={{ width: `${scorePercent}%` }}
                />
              </div>

              {/* Rationale Snippet if Available */}
              {aud.rationale && (
                <p className="audience-rationale">
                  "{aud.rationale}"
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
