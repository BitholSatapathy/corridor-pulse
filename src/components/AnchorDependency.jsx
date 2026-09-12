import React from 'react';
import { Anchor, AlertCircle, Info, Landmark, Layers } from 'lucide-react';
import { getAnchorConcentrationCategory, formatPlaceClassName } from '../utils/formatters';

export default function AnchorDependency({ corridor }) {
  if (!corridor) return null;

  const anchorConc = corridor.anchor_concentration;
  const anchors = corridor.anchors;
  const isPending = corridor.enrichment_status === 'PENDING' || !anchorConc;

  if (isPending) {
    return (
      <div className="section-card">
        <div className="section-header">
          <div className="section-title-group">
            <Anchor className="icon-sm text-amber" />
            <h3 className="section-title">ANCHOR DEPENDENCY</h3>
          </div>
          <span className="section-subtitle">Concentration & Core Anchors</span>
        </div>
        <div className="pending-notice-card">
          <AlertCircle className="icon-md text-amber" />
          <div>
            <h4 className="pending-title">Anchor Metrics: Enrichment Pending</h4>
            <p className="pending-desc">
              Anchor identification and Herfindahl concentration calculations for <strong>{corridor.name}</strong> are pending catalog ingestion.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const top3Share = anchorConc.top_three_anchor_share;
  const top1Share = anchorConc.top_anchor_share;
  const effAnchors = anchorConc.effective_anchor_count;
  const hhi = anchorConc.hhi;
  const proxy = anchorConc.anchor_concentration_proxy;

  const concCategory = getAnchorConcentrationCategory(top3Share, effAnchors);

  return (
    <div className="section-card">
      <div className="section-header">
        <div className="section-title-group">
          <Anchor className="icon-sm text-amber" />
          <h3 className="section-title">ANCHOR DEPENDENCY</h3>
        </div>
        <span className="section-subtitle">Concentration Metrics & Key Anchors</span>
      </div>

      {/* Concentration Level Badge & Rule Explanation */}
      <div className="concentration-banner">
        <div className="concentration-level-row">
          <span className="conc-label-title">Concentration Level:</span>
          <span className={`badge-conc ${concCategory.class}`}>
            {concCategory.label}
          </span>
        </div>
        <p className="conc-rule-desc">
          <strong>Empirical Classification:</strong> {concCategory.desc}. Evaluated from empirical NYC share distribution (Top 3 share: {(top3Share * 100).toFixed(1)}%).
        </p>
      </div>

      {/* Concentration Metrics Grid */}
      <div className="anchor-metrics-row">
        <div className="anchor-metric-cell">
          <span className="anchor-metric-val">{(top1Share * 100).toFixed(1)}%</span>
          <span className="anchor-metric-lbl">Top Anchor Share</span>
        </div>
        <div className="anchor-metric-cell">
          <span className="anchor-metric-val text-amber">{(top3Share * 100).toFixed(1)}%</span>
          <span className="anchor-metric-lbl">Top 3 Anchors Share</span>
        </div>
        <div className="anchor-metric-cell">
          <span className="anchor-metric-val">{effAnchors ? effAnchors.toFixed(1) : '--'}</span>
          <span className="anchor-metric-lbl">Effective Anchors</span>
        </div>
        <div className="anchor-metric-cell">
          <span className="anchor-metric-val">{hhi ? hhi.toFixed(3) : '--'}</span>
          <span className="anchor-metric-lbl">HHI Index</span>
        </div>
      </div>

      {/* Actual Anchors Listing */}
      <div className="anchors-list-block">
        <h4 className="sub-section-title">Identified Anchor Locations</h4>
        <div className="anchors-list">
          {!anchors || anchors.length === 0 ? (
            <div className="no-anchors-note">No individual anchor locations specified.</div>
          ) : (
            anchors.map((anc, idx) => (
              <div key={idx} className="anchor-item-card">
                <div className="anchor-item-header">
                  <div className="anchor-name-row">
                    <Landmark className="icon-xs text-amber shrink-0" />
                    <span className="anchor-name">{anc.name}</span>
                  </div>
                  <div className="anchor-tags-row">
                    <span className="anchor-class-tag">
                      {formatPlaceClassName(anc.class)}
                    </span>
                    <span className={`anchor-relation-tag ${anc.relation === 'CORE' ? 'relation-core' : 'relation-overlay'}`}>
                      {anc.relation === 'CORE' ? 'Core' : 'Overlay'}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
