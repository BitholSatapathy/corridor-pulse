import React, { useState } from 'react';
import {
  corridors,
  defaultCorridor,
  corridorsById
} from './data/corridorsData';
import Header from './components/Header';
import CorridorSelector from './components/CorridorSelector';
import CorridorSummary from './components/CorridorSummary';
import MetricCards from './components/MetricCards';
import ActivityChart from './components/ActivityChart';
import AudienceSection from './components/AudienceSection';

export default function App() {
  const [selectedCorridor, setSelectedCorridor] = useState(defaultCorridor);

  const macroCount = corridors.filter(c => c.level === 'MACRO').length;
  const subCount = corridors.filter(c => c.level === 'SUB_CORRIDOR').length;

  // Resolve parent corridor if selected corridor is a sub-corridor
  const parentCorridor = selectedCorridor?.parent_corridor_id
    ? corridorsById.get(selectedCorridor.parent_corridor_id)
    : null;

  return (
    <div className="app-container">
      {/* Top Header */}
      <Header
        totalCorridors={corridors.length}
        macroCount={macroCount}
        subCount={subCount}
      />

      {/* Main Dashboard Workspace */}
      <main className="main-content">
        {/* Corridor Selection Control */}
        <CorridorSelector
          corridors={corridors}
          selectedCorridor={selectedCorridor}
          onSelectCorridor={setSelectedCorridor}
        />

        {/* Corridor Summary & Identity */}
        <CorridorSummary
          corridor={selectedCorridor}
          parentCorridor={parentCorridor}
          onSelectParent={setSelectedCorridor}
        />

        {/* Primary Metric Highlights */}
        <MetricCards corridor={selectedCorridor} />

        {/* Dual Core Sections: When Active & Who is Associated */}
        <div className="dashboard-grid">
          <ActivityChart corridor={selectedCorridor} />
          <AudienceSection corridor={selectedCorridor} />
        </div>
      </main>

      {/* Footer */}
      <footer className="app-footer">
        <p>
          CORRIDOR PULSE &copy; {new Date().getFullYear()} &bull; Behavioral Commercial Corridor Intelligence for New York City &bull; Hackathon Edition
        </p>
      </footer>
    </div>
  );
}
