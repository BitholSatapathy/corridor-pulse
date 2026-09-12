import React from 'react';
import { ShieldCheck, Activity, Calendar, Construction, HelpCircle, Info } from 'lucide-react';

export default function ResilienceProfile({ corridor }) {
  if (!corridor) return null;

  const resilience = corridor.behavior?.resilience || {};

  const shock = resilience.shock_resilience ?? '--';
  const seasonality = resilience.seasonality_amplitude ?? '--';
  const event = resilience.event_dependency ?? '--';
  const development = resilience.development_dependency ?? '--';

  return (
    <div className="section-card">
      <div className="section-header">
        <div className="section-title-group">
          <ShieldCheck className="icon-sm text-purple" />
          <h3 className="section-title">RESILIENCE PROFILE</h3>
        </div>
        <span className="section-subtitle">Stress Tolerance & Dependency Signals</span>
      </div>

      <div className="resilience-grid">
        {/* 1. Shock Resilience */}
        <div className="resilience-card resilience-shock">
          <div className="resilience-card-top">
            <div className="resilience-name-group">
              <ShieldCheck className="icon-sm text-emerald" />
              <div>
                <h4 className="resilience-name">Shock Resilience</h4>
                <span className="resilience-semantic-tag semantic-positive">
                  Capacity Metric &bull; Higher is Better
                </span>
              </div>
            </div>
            <div className="resilience-score-box">
              <span className="resilience-score-num text-emerald">{shock}</span>
              <span className="resilience-score-max">/ 100</span>
            </div>
          </div>
          <div className="resilience-track">
            <div className="resilience-fill fill-emerald" style={{ width: `${shock}%` }} />
          </div>
          <p className="resilience-desc">
            Ability to absorb economic disruptions, tenant turnover, and sudden macro demand shocks.
          </p>
        </div>

        {/* 2. Seasonality Amplitude */}
        <div className="resilience-card resilience-seasonality">
          <div className="resilience-card-top">
            <div className="resilience-name-group">
              <Activity className="icon-sm text-amber" />
              <div>
                <h4 className="resilience-name">Seasonality Amplitude</h4>
                <span className="resilience-semantic-tag semantic-neutral">
                  Volatility Signal &bull; Variation Magnitude
                </span>
              </div>
            </div>
            <div className="resilience-score-box">
              <span className="resilience-score-num text-amber">{seasonality}</span>
              <span className="resilience-score-max">/ 100</span>
            </div>
          </div>
          <div className="resilience-track">
            <div className="resilience-fill fill-amber" style={{ width: `${seasonality}%` }} />
          </div>
          <p className="resilience-desc">
            Degree of swing between peak and trough seasons (e.g. summer tourism vs. winter lull).
          </p>
        </div>

        {/* 3. Event Dependency */}
        <div className="resilience-card resilience-event">
          <div className="resilience-card-top">
            <div className="resilience-name-group">
              <Calendar className="icon-sm text-purple" />
              <div>
                <h4 className="resilience-name">Event Dependency</h4>
                <span className="resilience-semantic-tag semantic-warning">
                  Sensitivity &bull; Higher = Greater Reliance
                </span>
              </div>
            </div>
            <div className="resilience-score-box">
              <span className="resilience-score-num text-purple">{event}</span>
              <span className="resilience-score-max">/ 100</span>
            </div>
          </div>
          <div className="resilience-track">
            <div className="resilience-fill fill-purple" style={{ width: `${event}%` }} />
          </div>
          <p className="resilience-desc">
            Vulnerability to event calendar voids (arenas, stadium games, festivals, or theater runs).
          </p>
        </div>

        {/* 4. Development Dependency */}
        <div className="resilience-card resilience-dev">
          <div className="resilience-card-top">
            <div className="resilience-name-group">
              <Construction className="icon-sm text-blue" />
              <div>
                <h4 className="resilience-name">Development Dependency</h4>
                <span className="resilience-semantic-tag semantic-neutral">
                  Sensitivity &bull; Higher = Capital Pipeline Dependent
                </span>
              </div>
            </div>
            <div className="resilience-score-box">
              <span className="resilience-score-num text-blue">{development}</span>
              <span className="resilience-score-max">/ 100</span>
            </div>
          </div>
          <div className="resilience-track">
            <div className="resilience-fill fill-blue" style={{ width: `${development}%` }} />
          </div>
          <p className="resilience-desc">
            Reliance on ongoing residential infill, construction workers, and real estate pipeline delivery.
          </p>
        </div>
      </div>
    </div>
  );
}
