import { useState, useMemo } from 'react';
import { usePortal } from '../context/PortalContext';
import { 
  Search, 
  Calendar, 
  Plus, 
  X,
  RotateCcw,
  SlidersHorizontal,
  LayoutGrid,
  List,
  ArrowUpDown,
  Tag,
  Sparkles,
  FileText,
  Image as ImageIcon,
  MapPin,
  User,
  ArrowRight,
  Compass
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
    auth,
    lang,
    t
  } = usePortal();

  const [contentTypeFilter, setContentTypeFilter] = useState('all'); // all, ai, reports, media
  const [sortBy, setSortBy] = useState('newest'); // newest, oldest, title
  const [viewMode, setViewMode] = useState('grid'); // grid, list

  const regions = [
    { id: 'All', label: 'All Frontiers' },
    { id: 'Antarctica', label: 'Antarctica (ISEA)' },
    { id: 'Arctic', label: 'Arctic (Himadri)' },
    { id: 'Himalaya', label: 'Himalayas (Third Pole)' },
    { id: 'Southern Ocean', label: 'Southern Ocean' }
  ];

  // Available unique years extracted from data
  const availableYears = useMemo(() => {
    const ySet = new Set(expeditions.map(e => e.year.toString()));
    return ['All', ...Array.from(ySet).sort((a, b) => b - a)];
  }, [expeditions]);

  // Dynamic counts for each region
  const regionCounts = useMemo(() => {
    const counts = { All: expeditions.length };
    expeditions.forEach(exp => {
      counts[exp.region] = (counts[exp.region] || 0) + 1;
    });
    return counts;
  }, [expeditions]);

  // Suggested quick tags
  const quickTags = ['Bharati', 'Maitri', 'Himadri', 'Himansh', 'Ice Cores'];

  // Filtering Logic
  const filteredExpeditions = useMemo(() => {
    let result = expeditions.filter((exp) => {
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
        const titleMatch = (exp.title || '').toLowerCase().includes(q) || (exp.titleHi || '').toLowerCase().includes(q);
        const scientistMatch = (exp.chiefScientist || '').toLowerCase().includes(q);
        const summaryMatch = (exp.summary || '').toLowerCase().includes(q) || (exp.summaryHi || '').toLowerCase().includes(q);
        const tagMatch = (exp.tags || []).some(t => t.toLowerCase().includes(q));
        const stationMatch = (exp.stations || []).some(s => s.toLowerCase().includes(q));
        const vesselMatch = (exp.vessel || '').toLowerCase().includes(q);
        return titleMatch || scientistMatch || summaryMatch || tagMatch || stationMatch || vesselMatch;
      }
      return true;
    });

    // Sorting
    result.sort((a, b) => {
      if (sortBy === 'newest') return b.year - a.year;
      if (sortBy === 'oldest') return a.year - b.year;
      if (sortBy === 'title') return a.title.localeCompare(b.title);
      return 0;
    });

    return result;
  }, [expeditions, selectedRegion, selectedYear, contentTypeFilter, searchQuery, sortBy]);

  const resetFilters = () => {
    setSelectedRegion('All');
    setSelectedYear('All');
    setContentTypeFilter('all');
    setSearchQuery('');
    setSortBy('newest');
  };

  const hasActiveFilters = selectedRegion !== 'All' || selectedYear !== 'All' || contentTypeFilter !== 'all' || searchQuery.trim() !== '';

  return (
    <div className="container expeditions-page-container">
      {/* Page Header */}
      <div className="page-header-row">
        <div className="header-text-block">
          <div className="section-eyebrow">
            <Compass size={13} className="eyebrow-icon" />
            <span>POLAR ARCHIVES & EXPEDITIONS</span>
          </div>
          <h1 className="page-title">Discover India's Polar Expeditions</h1>
          <p className="page-sub">
            Browse scientific reports, high-resolution media galleries, and public outreach packages across Antarctica, Arctic, and Himalayas.
          </p>
        </div>

        {auth?.isAuthenticated && (
          <button 
            className="btn-primary upload-btn"
            onClick={() => navigateTo('admin-new-expedition')}
          >
            <Plus size={15} />
            <span>Upload New Expedition</span>
          </button>
        )}
      </div>

      {/* Ultra-Compact Unified Filter Toolbar */}
      <div className="filter-toolbar">
        {/* Row 1: Search + Select Controls + View Toggle */}
        <div className="filter-primary-row">
          {/* Search Input */}
          <div className="search-input-group">
            <Search size={15} className="search-icon" />
            <input
              type="text"
              placeholder="Search by mission, chief scientist, glacier, station, or keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input-field"
            />
            {searchQuery && (
              <button 
                className="clear-search-btn" 
                onClick={() => setSearchQuery('')}
                title="Clear search"
              >
                <X size={13} />
              </button>
            )}
          </div>

          {/* Filter Dropdowns */}
          <div className="filter-selects-group">
            <div className="select-pill-wrap">
              <Calendar size={12} className="select-icon" />
              <select 
                value={selectedYear} 
                onChange={(e) => setSelectedYear(e.target.value)}
                className="custom-select"
                aria-label="Filter by year"
              >
                <option value="All">All Years</option>
                {availableYears.filter(y => y !== 'All').map(y => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>

            <div className="select-pill-wrap">
              <SlidersHorizontal size={12} className="select-icon" />
              <select 
                value={contentTypeFilter} 
                onChange={(e) => setContentTypeFilter(e.target.value)}
                className="custom-select"
                aria-label="Filter by content type"
              >
                <option value="all">All Content</option>
                <option value="ai">Outreach Ready</option>
                <option value="reports">With Reports</option>
                <option value="media">With Photos</option>
              </select>
            </div>

            <div className="select-pill-wrap">
              <ArrowUpDown size={12} className="select-icon" />
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)}
                className="custom-select"
                aria-label="Sort expeditions"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="title">A–Z</option>
              </select>
            </div>

            <div className="view-mode-toggle" title="Switch layout">
              <button 
                className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                onClick={() => setViewMode('grid')}
                title="Grid view"
                aria-label="Grid view"
              >
                <LayoutGrid size={14} />
              </button>
              <button 
                className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
                onClick={() => setViewMode('list')}
                title="Compact list view"
                aria-label="Compact list view"
              >
                <List size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* Row 2: Region Segmented Pills + Quick Tags & Reset */}
        <div className="filter-secondary-row">
          <div className="region-pills-wrap">
            <span className="region-section-label">Region:</span>
            <div className="region-pills-list">
              {regions.map((reg) => {
                const isSelected = selectedRegion === reg.id;
                const count = regionCounts[reg.id] || 0;
                return (
                  <button
                    key={reg.id}
                    className={`region-pill-item ${isSelected ? 'active' : ''}`}
                    onClick={() => setSelectedRegion(reg.id)}
                  >
                    <span>{reg.label}</span>
                    <span className="pill-count">{count}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="secondary-right-group">
            <div className="quick-tags-list">
              {quickTags.map((tag) => (
                <button
                  key={tag}
                  className={`quick-tag-btn ${searchQuery.toLowerCase().includes(tag.toLowerCase()) ? 'active' : ''}`}
                  onClick={() => setSearchQuery(tag)}
                >
                  {tag}
                </button>
              ))}
            </div>

            {hasActiveFilters && (
              <button className="btn-reset-filters" onClick={resetFilters} title="Reset all filters">
                <RotateCcw size={12} />
                <span>Reset</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Results Header Bar */}
      <div className="results-status-bar">
        <div className="results-count-text">
          Showing <strong>{filteredExpeditions.length}</strong> of {expeditions.length} expeditions
        </div>

        {hasActiveFilters && (
          <div className="active-filter-chips">
            {selectedRegion !== 'All' && (
              <span className="active-chip">
                <span>Frontier: {selectedRegion}</span>
                <button onClick={() => setSelectedRegion('All')} aria-label="Remove region filter">×</button>
              </span>
            )}
            {selectedYear !== 'All' && (
              <span className="active-chip">
                <span>Year: {selectedYear}</span>
                <button onClick={() => setSelectedYear('All')} aria-label="Remove year filter">×</button>
              </span>
            )}
            {contentTypeFilter !== 'all' && (
              <span className="active-chip">
                <span>Type: {contentTypeFilter}</span>
                <button onClick={() => setContentTypeFilter('all')} aria-label="Remove type filter">×</button>
              </span>
            )}
            {searchQuery && (
              <span className="active-chip">
                <span>Search: "{searchQuery}"</span>
                <button onClick={() => setSearchQuery('')} aria-label="Remove search filter">×</button>
              </span>
            )}
          </div>
        )}
      </div>

      {/* Cards Grid or List View or Empty State */}
      {filteredExpeditions.length > 0 ? (
        viewMode === 'grid' ? (
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
          /* Compact List View */
          <div className="compact-list-view">
            {filteredExpeditions.map((exp) => {
              const displayTitle = (lang === 'hi' && exp.titleHi) ? exp.titleHi : exp.title;
              const scientist = exp.chiefScientist ? exp.chiefScientist.replace(/\s*\(.*?\)/g, '').trim() : '';
              const station = exp.stations?.[0] ? exp.stations[0].replace(/\s*\(.*?\)/g, '').trim() : '';

              return (
                <div 
                  key={exp.id} 
                  className="list-item-card"
                  onClick={() => onSelectExpedition(exp.id)}
                >
                  <div className="list-item-thumb">
                    <img src={exp.heroImage} alt={exp.title} loading="lazy" />
                    <span className="list-year-badge">{exp.year}</span>
                  </div>

                  <div className="list-item-content">
                    <div className="list-item-header">
                      <span className={`badge-list-region region-${(exp.region || '').toLowerCase().replace(/\s+/g, '-')}`}>
                        {exp.region}
                      </span>
                      <h3 className="list-item-title">{displayTitle}</h3>
                    </div>

                    <div className="list-item-meta">
                      {scientist && (
                        <div className="list-meta-item">
                          <User size={12} className="meta-icon" />
                          <span>{scientist}</span>
                        </div>
                      )}
                      {station && (
                        <div className="list-meta-item">
                          <MapPin size={12} className="meta-icon" />
                          <span>{station}</span>
                        </div>
                      )}
                      {exp.reports?.length > 0 && (
                        <div className="list-meta-item">
                          <FileText size={12} className="meta-icon" />
                          <span>{exp.reports.length} Report{exp.reports.length > 1 ? 's' : ''}</span>
                        </div>
                      )}
                      {exp.media?.length > 0 && (
                        <div className="list-meta-item">
                          <ImageIcon size={12} className="meta-icon" />
                          <span>{exp.media.length} Photos</span>
                        </div>
                      )}
                    </div>

                    <p className="list-item-desc">
                      {(exp.summary || '').replace(/—/g, ', ')}
                    </p>
                  </div>

                  <div className="list-item-action">
                    {exp.aiGeneratedContent && (
                      <span className="list-ai-badge">
                        <Sparkles size={11} />
                        <span>Outreach Ready</span>
                      </span>
                    )}
                    <button className="list-open-btn">
                      <span>Explore</span>
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )
      ) : (
        <div className="empty-results-box glass-panel">
          <div className="empty-icon-wrap">
            <Search size={30} />
          </div>
          <h3>No expeditions matched your criteria</h3>
          <p>Try searching for popular terms or reset your active filters to browse all missions.</p>
          <div className="empty-suggestions">
            <button className="suggestion-pill" onClick={() => setSearchQuery('Antarctica')}>Antarctica</button>
            <button className="suggestion-pill" onClick={() => setSearchQuery('Himadri')}>Himadri</button>
            <button className="suggestion-pill" onClick={() => setSearchQuery('Bharati')}>Bharati</button>
            <button className="suggestion-pill" onClick={() => setSearchQuery('Ice Cores')}>Ice Cores</button>
          </div>
          <button className="btn-secondary empty-reset-btn" onClick={resetFilters}>
            <RotateCcw size={13} />
            <span>Reset All Filters</span>
          </button>
        </div>
      )}

      <style>{`
        .expeditions-page-container {
          padding: 1.75rem 1.5rem 3.5rem;
        }

        .page-header-row {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          margin-bottom: 1.15rem;
          flex-wrap: wrap;
          gap: 0.75rem;
        }

        .header-text-block {
          max-width: 800px;
        }

        .section-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          color: #0284c7;
          margin-bottom: 0.3rem;
        }

        .eyebrow-icon {
          color: #0284c7;
        }

        .page-title {
          font-size: 1.95rem;
          font-weight: 800;
          color: #0f172a;
          margin-bottom: 0.35rem;
          letter-spacing: -0.02em;
        }

        .page-sub {
          font-size: 0.92rem;
          color: #64748b;
          line-height: 1.45;
        }

        .upload-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          white-space: nowrap;
          padding: 0.5rem 0.85rem;
          font-size: 0.82rem;
        }

        /* Ultra-Compact High-Efficiency Filter Toolbar */
        .filter-toolbar {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 11px;
          box-shadow: 0 1px 4px rgba(0, 0, 0, 0.03);
          padding: 0.75rem 0.95rem;
          margin-bottom: 1.15rem;
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
        }

        /* Row 1: Search and Selects */
        .filter-primary-row {
          display: flex;
          align-items: center;
          gap: 0.65rem;
          flex-wrap: wrap;
        }

        .search-input-group {
          flex: 1;
          min-width: 260px;
          position: relative;
          display: flex;
          align-items: center;
        }

        .search-input-group .search-icon {
          position: absolute;
          left: 0.75rem;
          color: #94a3b8;
          pointer-events: none;
        }

        .search-input-field {
          width: 100%;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          padding: 0.42rem 1.8rem 0.42rem 2.1rem;
          color: #0f172a;
          font-size: 0.83rem;
          font-weight: 500;
          height: 35px;
          transition: all 0.2s ease;
        }

        .search-input-field:focus {
          outline: none;
          background: #ffffff;
          border-color: #0284c7;
          box-shadow: 0 0 0 2.5px rgba(2, 132, 199, 0.12);
        }

        .search-input-field::placeholder {
          color: #94a3b8;
        }

        .clear-search-btn {
          position: absolute;
          right: 0.6rem;
          background: #e2e8f0;
          border: none;
          color: #475569;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: background 0.15s ease;
        }

        .clear-search-btn:hover {
          background: #cbd5e1;
          color: #0f172a;
        }

        .filter-selects-group {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .select-pill-wrap {
          position: relative;
          display: flex;
          align-items: center;
        }

        .select-pill-wrap .select-icon {
          position: absolute;
          left: 0.6rem;
          color: #64748b;
          pointer-events: none;
        }

        .custom-select {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 7px;
          color: #1e293b;
          font-size: 0.78rem;
          font-weight: 600;
          height: 35px;
          padding: 0.38rem 1.4rem 0.38rem 1.75rem;
          cursor: pointer;
          appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='11' height='11' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 0.45rem center;
          transition: all 0.15s ease;
        }

        .custom-select:hover {
          background-color: #f1f5f9;
          border-color: #cbd5e1;
        }

        .custom-select:focus {
          outline: none;
          border-color: #0284c7;
          background-color: #ffffff;
        }

        .view-mode-toggle {
          display: flex;
          align-items: center;
          background: #f1f5f9;
          border: 1px solid #e2e8f0;
          border-radius: 7px;
          padding: 2px;
          height: 35px;
          box-sizing: border-box;
        }

        .view-btn {
          border: none;
          background: none;
          color: #64748b;
          width: 27px;
          height: 27px;
          border-radius: 5px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .view-btn.active {
          background: #ffffff;
          color: #0f172a;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.08);
        }

        .view-btn:hover:not(.active) {
          color: #1e293b;
        }

        /* Row 2: Region Segmented Pills + Quick tags */
        .filter-secondary-row {
          padding-top: 0.55rem;
          border-top: 1px solid #f1f5f9;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 0.6rem;
        }

        .region-pills-wrap {
          display: flex;
          align-items: center;
          gap: 0.55rem;
          flex-wrap: wrap;
        }

        .region-section-label {
          font-size: 0.75rem;
          font-weight: 700;
          color: #64748b;
        }

        .region-pills-list {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          flex-wrap: wrap;
        }

        .region-pill-item {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          color: #334155;
          padding: 0.22rem 0.6rem;
          border-radius: 9999px;
          font-size: 0.76rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .region-pill-item .pill-count {
          background: #e2e8f0;
          color: #475569;
          font-size: 0.65rem;
          font-weight: 700;
          padding: 0.08rem 0.35rem;
          border-radius: 9999px;
          line-height: 1;
        }

        .region-pill-item:hover {
          background: #e2e8f0;
          color: #0f172a;
        }

        .region-pill-item.active {
          background: #0f172a;
          border-color: #0f172a;
          color: #ffffff;
        }

        .region-pill-item.active .pill-count {
          background: rgba(255, 255, 255, 0.25);
          color: #ffffff;
        }

        .secondary-right-group {
          display: flex;
          align-items: center;
          gap: 0.45rem;
          flex-wrap: wrap;
        }

        .quick-tags-list {
          display: flex;
          align-items: center;
          gap: 0.3rem;
          flex-wrap: wrap;
        }

        .quick-tag-btn {
          background: none;
          border: 1px dashed #cbd5e1;
          color: #64748b;
          font-size: 0.7rem;
          font-weight: 600;
          padding: 0.14rem 0.42rem;
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .quick-tag-btn:hover {
          background: #f1f5f9;
          border-color: #94a3b8;
          color: #0f172a;
        }

        .quick-tag-btn.active {
          background: #e0f2fe;
          border-color: #0284c7;
          color: #0369a1;
          border-style: solid;
        }

        .btn-reset-filters {
          display: inline-flex;
          align-items: center;
          gap: 0.3rem;
          background: #fff1f2;
          color: #e11d48;
          border: 1px solid #fecdd3;
          padding: 0.22rem 0.55rem;
          border-radius: 5px;
          font-size: 0.72rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .btn-reset-filters:hover {
          background: #ffe4e6;
          border-color: #fda4af;
        }

        /* Results Status Bar */
        .results-status-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 0.6rem;
          margin-bottom: 1.15rem;
        }

        .results-count-text {
          font-size: 0.84rem;
          color: #64748b;
        }

        .results-count-text strong {
          color: #0f172a;
          font-weight: 700;
        }

        .active-filter-chips {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          flex-wrap: wrap;
        }

        .active-chip {
          background: #e0f2fe;
          border: 1px solid #bae6fd;
          color: #0369a1;
          font-size: 0.72rem;
          font-weight: 600;
          padding: 0.12rem 0.45rem;
          border-radius: 9999px;
          display: inline-flex;
          align-items: center;
          gap: 0.3rem;
        }

        .active-chip button {
          background: none;
          border: none;
          color: #0369a1;
          font-size: 0.85rem;
          font-weight: 800;
          cursor: pointer;
          line-height: 1;
          padding: 0;
        }

        /* Grid Cards View */
        .grid-cards {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(min(100%, 330px), 1fr));
          gap: 1.35rem;
        }

        /* Compact List View */
        .compact-list-view {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .list-item-card {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 11px;
          padding: 0.85rem 1.15rem;
          display: flex;
          align-items: center;
          gap: 1.15rem;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.03);
        }

        .list-item-card:hover {
          border-color: #cbd5e1;
          transform: translateY(-2px);
          box-shadow: 0 8px 20px -4px rgba(0, 0, 0, 0.08);
        }

        .list-item-thumb {
          position: relative;
          width: 80px;
          height: 80px;
          border-radius: 7px;
          overflow: hidden;
          flex-shrink: 0;
          background: #f1f5f9;
        }

        .list-item-thumb img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .list-year-badge {
          position: absolute;
          bottom: 3px;
          right: 3px;
          background: rgba(15, 23, 42, 0.8);
          color: #ffffff;
          font-size: 0.62rem;
          font-weight: 700;
          padding: 0.08rem 0.3rem;
          border-radius: 3px;
        }

        .list-item-content {
          flex: 1;
          min-width: 0;
        }

        .list-item-header {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 0.25rem;
          flex-wrap: wrap;
        }

        .badge-list-region {
          font-size: 0.65rem;
          font-weight: 700;
          padding: 0.12rem 0.4rem;
          border-radius: 4px;
          text-transform: uppercase;
          letter-spacing: 0.02em;
        }

        .region-antarctica { background: #e0f2fe; color: #0369a1; }
        .region-arctic { background: #dcfce7; color: #15803d; }
        .region-himalaya { background: #fef3c7; color: #b45309; }
        .region-southern-ocean { background: #ede9fe; color: #6d28d9; }

        .list-item-title {
          font-size: 0.95rem;
          font-weight: 700;
          color: #0f172a;
          margin: 0;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .list-item-card:hover .list-item-title {
          color: #0284c7;
        }

        .list-item-meta {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          color: #64748b;
          font-size: 0.72rem;
          font-weight: 600;
          margin-bottom: 0.35rem;
          flex-wrap: wrap;
        }

        .list-meta-item {
          display: inline-flex;
          align-items: center;
          gap: 0.25rem;
        }

        .list-meta-item .meta-icon {
          color: #0284c7;
        }

        .list-item-desc {
          font-size: 0.76rem;
          color: #475569;
          margin: 0;
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
          line-height: 1.35;
        }

        .list-item-action {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 0.4rem;
          flex-shrink: 0;
        }

        .list-ai-badge {
          background: #ecfdf5;
          border: 1px solid #a7f3d0;
          color: #059669;
          font-size: 0.65rem;
          font-weight: 700;
          padding: 0.12rem 0.4rem;
          border-radius: 4px;
          display: inline-flex;
          align-items: center;
          gap: 0.25rem;
        }

        .list-open-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.3rem;
          background: #0f172a;
          color: #ffffff;
          border: none;
          padding: 0.38rem 0.75rem;
          border-radius: 6px;
          font-size: 0.75rem;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.15s ease;
        }

        .list-item-card:hover .list-open-btn {
          background: #0284c7;
        }

        /* Empty Results Box */
        .empty-results-box {
          padding: 3rem 2rem;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.75rem;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
        }

        .empty-icon-wrap {
          width: 54px;
          height: 54px;
          border-radius: 50%;
          background: #f1f5f9;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #64748b;
        }

        .empty-results-box h3 {
          font-size: 1.15rem;
          font-weight: 700;
          color: #0f172a;
          margin: 0;
        }

        .empty-results-box p {
          color: #64748b;
          font-size: 0.86rem;
          max-width: 440px;
          margin: 0;
        }

        .empty-suggestions {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          flex-wrap: wrap;
          justify-content: center;
          margin-top: 0.2rem;
        }

        .suggestion-pill {
          background: #f1f5f9;
          border: 1px solid #cbd5e1;
          color: #1e293b;
          font-size: 0.75rem;
          font-weight: 600;
          padding: 0.2rem 0.6rem;
          border-radius: 9999px;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .suggestion-pill:hover {
          background: #0284c7;
          border-color: #0284c7;
          color: #ffffff;
        }

        .empty-reset-btn {
          margin-top: 0.4rem;
          display: inline-flex;
          align-items: center;
          gap: 0.3rem;
          font-size: 0.78rem;
        }

        /* Responsive Breakpoints */
        @media (max-width: 768px) {
          .expeditions-page-container {
            padding: 1.25rem 1rem 3rem;
          }
          .page-title {
            font-size: 1.6rem;
          }
          .filter-toolbar {
            padding: 0.75rem;
          }
          .search-input-group {
            min-width: 100%;
          }
          .filter-selects-group {
            width: 100%;
            display: grid;
            grid-template-columns: 1fr 1fr;
          }
          .filter-selects-group .select-pill-wrap {
            width: 100%;
          }
          .filter-selects-group .custom-select {
            width: 100%;
          }
          .view-mode-toggle {
            grid-column: span 2;
            justify-content: center;
          }
          .secondary-right-group {
            width: 100%;
            justify-content: space-between;
          }
          .list-item-card {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.75rem;
          }
          .list-item-thumb {
            width: 100%;
            height: 130px;
          }
          .list-item-action {
            width: 100%;
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
          }
        }

        @media (max-width: 480px) {
          .filter-selects-group {
            grid-template-columns: 1fr;
          }
          .view-mode-toggle {
            grid-column: span 1;
          }
          .region-pill-item {
            font-size: 0.72rem;
            padding: 0.2rem 0.5rem;
          }
        }
      `}</style>
    </div>
  );
}
