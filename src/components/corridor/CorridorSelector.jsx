import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Search, ChevronDown, GitCompare, X, Check, MapPin } from 'lucide-react';
import { getBoroughBadgeColor } from '../../utils/formatters';

const BOROUGHS = ['ALL', 'Manhattan', 'Brooklyn', 'Queens', 'Bronx', 'Staten Island'];

export default function CorridorSelector({
  corridors,
  selectedCorridor,
  onSelectCorridor,
  onToggleCompare,
  isComparing
}) {
  const [search, setSearch] = useState('');
  const [selectedBorough, setSelectedBorough] = useState('ALL');
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
    <div className="controls-bar" ref={dropdownRef}>
      {/* Borough Filter Quick Chips */}
      <div className="borough-filter-pills">
        {BOROUGHS.map(b => (
          <button
            key={b}
            type="button"
            className={`filter-chip ${selectedBorough === b ? 'active' : ''}`}
            onClick={() => {
              setSelectedBorough(b);
              if (!isOpen) setIsOpen(true);
            }}
          >
            {b}
          </button>
        ))}
      </div>

      {/* Search & Selector Input */}
      <div className="search-input-wrapper">
        <Search className="search-icon" />
        <input
          type="text"
          className="search-input"
          placeholder={`Search 65 NYC corridors... (${filteredCorridors.length} visible)`}
          value={search}
          onChange={e => {
            setSearch(e.target.value);
            if (!isOpen) setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
        />
        {search && (
          <button
            type="button"
            style={{
              position: 'absolute',
              right: '0.75rem',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--text-muted)'
            }}
            onClick={() => setSearch('')}
          >
            <X size={14} />
          </button>
        )}

        {/* Dropdown Menu */}
        {isOpen && (
          <div className="search-results-dropdown">
            {filteredCorridors.length === 0 ? (
              <div style={{ padding: '0.75rem 1rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                No corridors found matching "{search}".
              </div>
            ) : (
              filteredCorridors.map(c => {
                const isSelected = selectedCorridor?.corridor_id === c.corridor_id;
                return (
                  <button
                    key={c.corridor_id}
                    type="button"
                    className={`search-result-item ${isSelected ? 'selected' : ''}`}
                    onClick={() => handleSelect(c)}
                  >
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
                      <span className="search-result-name">{c.name}</span>
                      <div className="search-result-meta">
                        <span>{c.borough}</span>
                        <span>&bull;</span>
                        <span>{c.level === 'MACRO' ? 'Macro Enriched' : 'Sub-Corridor'}</span>
                      </div>
                    </div>
                    {isSelected && <Check size={16} className="text-sky-400" />}
                  </button>
                );
              })
            )}
          </div>
        )}
      </div>

      {/* Compare Action Button */}
      {onToggleCompare && (
        <button
          type="button"
          className={`btn-compare-action ${isComparing ? 'active' : ''}`}
          onClick={onToggleCompare}
        >
          <GitCompare size={15} />
          <span>{isComparing ? 'Exit Comparison' : 'Compare Corridors'}</span>
        </button>
      )}
    </div>
  );
}
