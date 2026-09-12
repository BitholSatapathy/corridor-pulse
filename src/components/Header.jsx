import React from 'react';
import { Activity, MapPin, Compass, ShieldAlert } from 'lucide-react';

export default function Header({ totalCorridors, macroCount, subCount }) {
  return (
    <header className="header-card">
      <div className="header-top">
        <div className="header-brand">
          <div className="brand-icon-wrapper">
            <Activity className="brand-icon" />
          </div>
          <div>
            <div className="brand-title-row">
              <h1 className="brand-title">CORRIDOR PULSE</h1>
              <span className="brand-badge">NYC BEHAVIORAL INTELLIGENCE</span>
            </div>
            <p className="brand-subtitle">
              Behavioral intelligence for commercial corridors
            </p>
          </div>
        </div>

        <div className="header-stats">
          <div className="stat-pill">
            <span className="stat-value">{totalCorridors}</span>
            <span className="stat-label">Total Corridors</span>
          </div>
          <div className="stat-pill">
            <span className="stat-value text-cyan">{macroCount}</span>
            <span className="stat-label">Macro Enriched</span>
          </div>
          <div className="stat-pill">
            <span className="stat-value text-amber">{subCount}</span>
            <span className="stat-label">Sub-Corridors</span>
          </div>
        </div>
      </div>

      <div className="header-intro">
        <p>
          Explore when a corridor is active, who it serves, what drives it, and how resilient or concentrated its ecosystem appears.
        </p>
      </div>
    </header>
  );
}
