import React, { useState, useMemo } from 'react';
import { Search, ChevronDown, MapPin, Check, AlertCircle } from 'lucide-react';
import { getBoroughBadgeColor } from '../utils/formatters';

const BOROUGHS = ['ALL', 'Manhattan', 'Brooklyn', 'Queens', 'Bronx', 'Staten Island'];

export default function CorridorSelector({
  corridors,
  selectedCorridor,
  onSelectCorridor
}) {
  const [search, setSearch] = useState('');
  const [selectedBorough, setSelectedBorough] = useState('ALL');
  const [isOpen, setIsOpen] = useState(false);

  const filteredCorridors = useMemo(() => {
    return corridors.filter(c => {
      const matchesBorough =
        selectedBorough === 'ALL' ||
        c.borough?.toLowerCase() === selectedBorough.toLowerCase();

      const q = search.trim().toLowerCase();
      if (!q) return matchesBorough;

      const matchesName = c.name?.toLowerCase().includes(q);
      const matchesBoro = c.borough?.toLowerCase().includes(q);
      const matchesNeighborhood = c.neighborhoods?.some(n =>
        n.toLowerCase().includes(q)
      );

      return matchesBorough && (matchesName || matchesBoro || matchesNeighborhood);
    });
  }, [corridors, search, selectedBorough]);

  const handleSelect = (corridor) => {
    onSelectCorridor(corridor);
    setIsOpen(false);
    setSearch('');
  };

  return (
    <div className="selector-container">
      <div className="selector-bar">
        {/* Active Selection Display / Dropdown Trigger */}
        <div className="selector-control">
          <label className="selector-label">
            <MapPin className="icon-sm text-cyan" />
            <span>Select NYC Commercial Corridor:</span>
          </label>
          
          <button
            type="button"
            className="selector-button"
            onClick={() => setIsOpen(!isOpen)}
            aria-expanded={isOpen}
          >
            <div className="selector-button-content">
              <span className="selector-selected-name">
                {selectedCorridor?.name || 'Choose a corridor...'}
              </span>
              <span className={`badge-borough ${getBoroughBadgeColor(selectedCorridor?.borough)}`}>
                {selectedCorridor?.borough}
              </span>
              {selectedCorridor?.level === 'SUB_CORRIDOR' && (
                <span className="badge-sub">Sub-Corridor</span>
              )}
            </div>
            <ChevronDown className={`chevron-icon ${isOpen ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {/* Borough Filter Quick Chips */}
        <div className="borough-chips">
          {BOROUGHS.map(b => (
            <button
              key={b}
              type="button"
              className={`borough-chip ${selectedBorough === b ? 'active' : ''}`}
              onClick={() => {
                setSelectedBorough(b);
                setIsOpen(true);
              }}
            >
              {b}
            </button>
          ))}
        </div>
      </div>

      {/* Searchable Dropdown Modal/Menu */}
      {isOpen && (
        <div className="selector-dropdown-panel">
          <div className="selector-search-box">
            <Search className="search-icon" />
            <input
              type="text"
              className="selector-search-input"
              placeholder="Search corridor, neighborhood, or borough..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              autoFocus
            />
            {search && (
              <button
                type="button"
                className="search-clear-btn"
                onClick={() => setSearch('')}
              >
                Clear
              </button>
            )}
          </div>

          <div className="selector-results-list">
            {filteredCorridors.length === 0 ? (
              <div className="selector-empty">
                <AlertCircle className="icon-md text-amber" />
                <p>No commercial corridors match "{search}"</p>
              </div>
            ) : (
              filteredCorridors.map(c => {
                const isSelected = c.corridor_id === selectedCorridor?.corridor_id;
                const isPending = c.enrichment_status === 'PENDING';
                return (
                  <div
                    key={c.corridor_id}
                    className={`selector-item ${isSelected ? 'selected' : ''}`}
                    onClick={() => handleSelect(c)}
                  >
                    <div className="selector-item-info">
                      <div className="selector-item-title-row">
                        <span className="selector-item-name">{c.name}</span>
                        <span className={`badge-borough-sm ${getBoroughBadgeColor(c.borough)}`}>
                          {c.borough}
                        </span>
                        {c.level === 'SUB_CORRIDOR' ? (
                          <span className="badge-sub-sm">Sub-Corridor</span>
                        ) : (
                          <span className="badge-macro-sm">Macro</span>
                        )}
                        {isPending && (
                          <span className="badge-pending-sm">Pending</span>
                        )}
                      </div>
                      <div className="selector-item-neighborhoods">
                        {c.neighborhoods?.slice(0, 4).join(', ')}
                        {c.neighborhoods?.length > 4 && ` +${c.neighborhoods.length - 4} more`}
                      </div>
                    </div>
                    {isSelected && <Check className="icon-sm text-cyan" />}
                  </div>
                );
              })
            )}
          </div>

          <div className="selector-dropdown-footer">
            <span>Showing {filteredCorridors.length} of {corridors.length} corridors</span>
            <button
              type="button"
              className="close-dropdown-btn"
              onClick={() => setIsOpen(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
