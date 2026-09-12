import React from 'react';
import { Activity, ShieldCheck } from 'lucide-react';

export default function Header({ totalCorridors = 65, macroCount = 20, subCount = 45 }) {
  return (
    <header className="app-header">
      <div className="header-brand-group">
        <div className="header-title-row">
          <div className="app-title">
            <Activity className="w-5 h-5 text-sky-400" size={20} />
            <span>Corridor Pulse</span>
          </div>
          <span className="app-title-badge">NYC Commercial Intelligence</span>
        </div>
        <p className="app-subtitle">
          Behavioral intelligence for commercial corridors across New York City
        </p>
      </div>

      <div className="header-meta-group">
        <div className="team-attribution-badge">
          <span className="dot animate-pulse-subtle"></span>
          <span>Presented by Team The Sixth Sense</span>
        </div>
        <div className="header-stat-chip">
          <span>{totalCorridors} Corridors &bull; 5 Boroughs</span>
        </div>
      </div>
    </header>
  );
}
