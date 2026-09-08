import { useState } from 'react';
import { usePortal } from '../context/PortalContext';
import { 
  Search, 
  Calendar, 
  Plus, 
  X,
  RotateCcw,
  SlidersHorizontal
} from 'lucide-react';
import ExpeditionCard from '../components/ExpeditionCard';

export default function Expeditions({ onSelectExpedition, navigateTo }) {
  const { 
    expeditions, 
    searchQuery, 
    setSearchQuery, 
    selectedRegion, 
    setSelectedRegion, 
    selectedYear, 
    setSelectedYear,
    auth
  } = usePortal();

  const [contentTypeFilter, setContentTypeFilter] = useState('all'); // all, ai, reports, media

  const regions = [
    { id: 'All', label: 'All Frontiers' },
    { id: 'Antarctica', label: 'Antarctica (ISEA)' },
    { id: 'Arctic', label: 'Arctic (Himadri)' },
    { id: 'Himalaya', label: 'Himalayas (Third Pole)' },
    { id: 'Southern Ocean', label: 'Southern Ocean' }
  ];

  const years = ['All', '2024', '2023', '2022'];

  // Filtering Logic
  const filteredExpeditions = expeditions.filter((exp) => {
    // Region Filter
    if (selectedRegion !== 'All' && exp.region !== selectedRegion) {
      return false;
    }
    // Year Filter
    if (selectedYear !== 'All' && exp.year.toString() !== selectedYear) {
      return false;
    }
    // Content type filter
    if (contentTypeFilter === 'ai' && !exp.aiGeneratedContent) {
      return false;
    }
    if (contentTypeFilter === 'reports' && (!exp.reports || exp.reports.length === 0)) {
      return false;
    }
    if (contentTypeFilter === 'media' && (!exp.media || exp.media.length === 0)) {
      return false;
    }
    // Search query
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const titleMatch = exp.title.toLowerCase().includes(q);
      const scientistMatch = (exp.chiefScientist || '').toLowerCase().includes(q);
      const summaryMatch = (exp.summary || '').toLowerCase().includes(q);
      const tagMatch = (exp.tags || []).some(t => t.toLowerCase().includes(q));
      const stationMatch = (exp.stations || []).some(s => s.toLowerCase().includes(q));
      return titleMatch || scientistMatch || summaryMatch || tagMatch || stationMatch;
    }
    return true;
  });

  const resetFilters = () => {
    setSelectedRegion('All');
    setSelectedYear('All');
    setContentTypeFilter('all');
    setSearchQuery('');
  };

  return (
    <div className="container expeditions-page-container">
      {/* Header Title */}
      <div className="page-header-row">
        <div>
          <div className="section-eyebrow">POLAR ARCHIVES & EXPEDITIONS</div>
          <h1 className="page-title">Discover India's Polar Expeditions</h1>
          <p className="page-sub">
            Browse scientific reports, high-resolution media galleries, and public outreach packages across Antarctica, Arctic, and Himalayas.
          </p>
        </div>

        {auth.isAuthenticated && (
          <button 
            className="btn-primary"
            onClick={() => navigateTo('admin-new-expedition')}
          >
            <Plus size={16} />
            <span>Upload New Expedition</span>
          </button>
        )}
      </div>

      {/* Filter Toolbar */}
      <div className="glass-panel filter-toolbar">
        {/* Search row */}
        <div className="search-bar-row">
          <div className="main-search-input-wrap">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              placeholder="Search by mission name, chief scientist, glacier, station, or keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input-field"
            />
            {searchQuery && (
              <button className="clear-btn" onClick={() => setSearchQuery('')}>
                <X size={15} />
              </button>
            )}
          </div>

          <div className="filter-controls-group">
            {/* Year Select */}
            <div className="select-wrapper">
              <Calendar size={14} className="select-icon" />
              <select 
                value={selectedYear} 
                onChange={(e) => setSelectedYear(e.target.value)}
                className="custom-select"
              >
                <option value="All">All Years</option>
                {years.filter(y => y !== 'All').map(y => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>

            {/* Content Type Filter */}
            <div className="select-wrapper">
              <SlidersHorizontal size={14} className="select-icon" />
              <select 
                value={contentTypeFilter} 
                onChange={(e) => setContentTypeFilter(e.target.value)}
                className="custom-select"
              >
                <option value="all">All Content Types</option>
                <option value="ai">Outreach Pack Ready</option>
                <option value="reports">With Research Reports</option>
                <option value="media">With Photo Galleries</option>
              </select>
            </div>

            {(selectedRegion !== 'All' || selectedYear !== 'All' || contentTypeFilter !== 'all' || searchQuery) && (
              <button className="btn-reset-filters" onClick={resetFilters}>
                <RotateCcw size={14} />
                <span>Reset</span>
              </button>
            )}
          </div>
        </div>

        {/* Region Pills */}
        <div className="region-pill-row">
          <span className="region-label">Region:</span>
          <div className="region-pills">
            {regions.map((reg) => (
              <button
                key={reg.id}
                className={`region-pill-btn ${selectedRegion === reg.id ? 'active' : ''}`}
                onClick={() => setSelectedRegion(reg.id)}
              >
                {reg.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results Header */}
      <div className="results-header">
        <span className="results-count">
          Showing <strong>{filteredExpeditions.length}</strong> of {expeditions.length} expeditions
        </span>
        {selectedRegion !== 'All' && (
          <span className="active-tag-badge">
            Region: {selectedRegion}
            <button onClick={() => setSelectedRegion('All')}>×</button>
          </span>
        )}
      </div>

      {/* Cards Grid or Empty State */}
      {filteredExpeditions.length > 0 ? (
        <div className="grid-cards">
          {filteredExpeditions.map((exp) => (
            <ExpeditionCard 
              key={exp.id} 
              expedition={exp} 
              onSelect={onSelectExpedition} 
            />
          ))}
        </div>
      ) : (
        <div className="empty-results-box glass-panel">
          <div className="empty-icon-wrap">
            <Search size={36} />
          </div>
          <h3>No expeditions matched your criteria</h3>
          <p>Try clearing filters or searching for terms like "Ice Core", "Himadri", "Glacier", or "Bharati".</p>
          <button className="btn-secondary" onClick={resetFilters}>
            <RotateCcw size={15} />
            <span>Reset All Filters</span>
          </button>
        </div>
      )}

      <style>{`
        .expeditions-page-container {
          padding: 2.5rem 1.5rem 4rem;
        }

        .page-header-row {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          margin-bottom: 2rem;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .page-title {
          font-size: 2.2rem;
          font-weight: 800;
          color: var(--navy);
          margin-bottom: 0.5rem;
        }

        .page-sub {
          font-size: 1rem;
          color: var(--text-secondary);
          max-width: 780px;
        }

        /* Filter Toolbar */
        .filter-toolbar {
          padding: 1.5rem;
          border-radius: var(--radius-md);
          margin-bottom: 2rem;
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
          background: #ffffff;
          border: 1px solid var(--border-card);
          box-shadow: var(--shadow-sm);
        }

        .search-bar-row {
          display: flex;
          align-items: center;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .main-search-input-wrap {
          flex: 1;
          min-width: 280px;
          position: relative;
          display: flex;
          align-items: center;
        }

        .main-search-input-wrap .search-icon {
          position: absolute;
          left: 1rem;
          color: var(--text-muted);
        }

        .search-input-field {
          width: 100%;
          background: #f8fafc;
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-sm);
          padding: 0.75rem 2.2rem 0.75rem 2.6rem;
          color: var(--text-primary);
          font-size: 0.92rem;
          transition: all 0.2s ease;
        }

        .search-input-field:focus {
          outline: none;
          border-color: var(--ice);
          background: #ffffff;
          box-shadow: 0 0 0 3px var(--ice-glow);
        }

        .clear-btn {
          position: absolute;
          right: 0.75rem;
          background: none;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
        }

        .filter-controls-group {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          flex-wrap: wrap;
        }

        .select-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }

        .select-icon {
          position: absolute;
          left: 0.75rem;
          color: var(--text-muted);
          pointer-events: none;
        }

        .custom-select {
          background: #f8fafc;
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-sm);
          color: var(--text-primary);
          padding: 0.7rem 1.75rem 0.7rem 2.2rem;
          font-size: 0.85rem;
          cursor: pointer;
        }

        .custom-select:focus {
          outline: none;
          border-color: var(--ice);
        }

        .btn-reset-filters {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          background: #fee2e2;
          color: #b91c1c;
          border: 1px solid #fecaca;
          padding: 0.65rem 0.9rem;
          border-radius: var(--radius-sm);
          font-size: 0.82rem;
          font-weight: 600;
          cursor: pointer;
        }

        .region-pill-row {
          display: flex;
          align-items: center;
          gap: 1rem;
          flex-wrap: wrap;
          padding-top: 0.75rem;
          border-top: 1px solid #f1f5f9;
        }

        .region-label {
          font-size: 0.8rem;
          color: var(--text-muted);
          font-weight: 600;
        }

        .region-pills {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .region-pill-btn {
          background: #f8fafc;
          border: 1px solid var(--border-subtle);
          color: var(--text-secondary);
          padding: 0.4rem 0.9rem;
          border-radius: var(--radius-full);
          font-size: 0.82rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .region-pill-btn:hover {
          background: #e2e8f0;
          color: var(--navy);
        }

        .region-pill-btn.active {
          background: var(--navy);
          border-color: var(--navy);
          color: #ffffff;
          font-weight: 600;
        }

        .results-header {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1.5rem;
          font-size: 0.9rem;
          color: var(--text-secondary);
        }

        .active-tag-badge {
          background: #e0f2fe;
          border: 1px solid #bae6fd;
          color: #0369a1;
          font-size: 0.78rem;
          padding: 0.2rem 0.6rem;
          border-radius: 4px;
          display: flex;
          align-items: center;
          gap: 0.4rem;
        }

        .active-tag-badge button {
          background: none;
          border: none;
          color: #0369a1;
          font-weight: 700;
          cursor: pointer;
        }

        .empty-results-box {
          padding: 4rem 2rem;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
          background: #ffffff;
        }

        .empty-icon-wrap {
          width: 70px;
          height: 70px;
          border-radius: 50%;
          background: #f1f5f9;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #64748b;
        }

        .empty-results-box h3 {
          font-size: 1.3rem;
          color: var(--navy);
        }

        .empty-results-box p {
          color: var(--text-muted);
          font-size: 0.95rem;
          max-width: 500px;
          margin-bottom: 0.5rem;
        }

        .grid-cards {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(min(100%, 320px), 1fr));
          gap: 1.75rem;
        }

        @media (max-width: 768px) {
          .expeditions-page-container {
            padding-top: 1.5rem;
            padding-bottom: 3.5rem;
          }
          .page-header-row {
            flex-direction: column;
            align-items: flex-start;
            gap: 1rem;
          }
          .filter-toolbar {
            padding: 1.15rem;
            gap: 1rem;
          }
          .main-search-input-wrap {
            min-width: 100%;
          }
          .filter-controls-group {
            width: 100%;
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 0.65rem;
          }
          .filter-controls-group .select-wrapper {
            width: 100%;
          }
          .filter-controls-group .custom-select {
            width: 100%;
          }
          .btn-reset-filters {
            grid-column: span 2;
            justify-content: center;
          }
          .grid-cards {
            grid-template-columns: 1fr;
            gap: 1.25rem;
          }
        }

        @media (max-width: 480px) {
          .filter-controls-group {
            grid-template-columns: 1fr;
          }
          .btn-reset-filters {
            grid-column: span 1;
          }
          .region-pills {
            gap: 0.35rem;
          }
          .region-pill-btn {
            font-size: 0.76rem;
            padding: 0.35rem 0.7rem;
          }
        }
      `}</style>
    </div>
  );
}
