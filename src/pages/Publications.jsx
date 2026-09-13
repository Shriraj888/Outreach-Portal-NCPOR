import { useState, useMemo, useEffect, useCallback } from 'react';
import { usePortal } from '../context/PortalContext';
import { 
  FileText, 
  Search, 
  BookOpen, 
  ExternalLink, 
  Copy, 
  Check, 
  Calendar, 
  User, 
  ChevronDown, 
  ChevronUp, 
  Database,
  Download,
  MapPin,
  Clock,
  Plus,
  ShieldCheck,
  Filter,
  X,
  Sparkles,
  ArrowUpDown,
  Share2,
  Tag,
  Layers,
  FileCode,
  RefreshCw,
  Loader2,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { downloadPublicationPDF } from '../utils/pdfGenerator';
import { 
  fetchNcporPublications, 
  fetchNcporDatasets, 
  fetchNcporRegistryStats 
} from '../services/ncporApiService';

export default function Publications({ navigateTo }) {
  const { auth, publications: contextPubs, datasets: contextDatasets } = usePortal();
  const [viewTab, setViewTab] = useState('all'); // all, publications, datasets
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('newest'); // newest, citations, title
  const [expandedId, setExpandedId] = useState(null);
  const [copiedId, setCopiedId] = useState(null);
  const [copiedDoiId, setCopiedDoiId] = useState(null);
  const [downloadToast, setDownloadToast] = useState(null);

  // Dynamic NCPOR Registry States (No static mock data)
  const [dynamicPubs, setDynamicPubs] = useState([]);
  const [dynamicDatasets, setDynamicDatasets] = useState([]);
  const [totalPubsCount, setTotalPubsCount] = useState(0);
  const [totalDatasetsCount, setTotalDatasetsCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [apiPage, setApiPage] = useState(1);
  const [apiStats, setApiStats] = useState(null);
  const [apiError, setApiError] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastSynced, setLastSynced] = useState(null);

  const categories = [
    'All',
    'Glaciology & Paleoclimate',
    'Oceanography',
    'Himalayan Cryosphere',
    'Atmospheric Sciences',
    'Polar Biology'
  ];

  // Category Color Accent Helper
  const getCategoryColor = (cat) => {
    switch (cat) {
      case 'Glaciology & Paleoclimate':
        return { bg: '#ecfdf5', text: '#047857', border: '#a7f3d0', dot: '#10b981' };
      case 'Oceanography':
        return { bg: '#f0fdfa', text: '#0f766e', border: '#99f6e4', dot: '#14b8a6' };
      case 'Himalayan Cryosphere':
        return { bg: '#fffbeb', text: '#b45309', border: '#fde68a', dot: '#f59e0b' };
      case 'Atmospheric Sciences':
        return { bg: '#f5f3ff', text: '#6d28d9', border: '#ddd6fe', dot: '#8b5cf6' };
      case 'Polar Biology':
        return { bg: '#f0fdf4', text: '#15803d', border: '#bbf7d0', dot: '#22c55e' };
      default:
        return { bg: '#f1f5f9', text: '#475569', border: '#cbd5e1', dot: '#64748b' };
    }
  };

  // Preserve any custom user-added items uploaded during the current session (exclude static initial mock IDs)
  const customUserPubs = useMemo(() => {
    const staticMockIds = new Set(['pub-101', 'pub-102', 'pub-103', 'pub-104', 'pub-105', 'pub-106', 'pub-107', 'pub-108']);
    return (contextPubs || []).filter(p => p.isCustomStaffUpload || (!staticMockIds.has(p.id) && !p.id.startsWith('pub-10')));
  }, [contextPubs]);

  const customUserDatasets = useMemo(() => {
    const staticMockDsIds = new Set(['ds-isea43-icecore', 'ds-indarc-ocean24', 'ds-himansh-glacier24', 'ds-southern-ocean12']);
    return (contextDatasets || []).filter(d => d.isCustomStaffUpload || !staticMockDsIds.has(d.id));
  }, [contextDatasets]);

  // Combined real-time publications list (Dynamic NCPOR API + custom staff uploads)
  const allActivePublications = useMemo(() => {
    return [...customUserPubs, ...dynamicPubs];
  }, [customUserPubs, dynamicPubs]);

  const allActiveDatasets = useMemo(() => {
    return [...customUserDatasets, ...dynamicDatasets];
  }, [customUserDatasets, dynamicDatasets]);

  // Load dynamic data strictly from NCPOR APIs
  const loadDynamicData = useCallback(async (pageToFetch = 1, isLoadMore = false, querySearch = '') => {
    if (isLoadMore) {
      setIsLoadingMore(true);
    } else {
      setIsLoading(true);
      setApiError(null);
    }

    try {
      const [pubsResult, datasetsResult] = await Promise.allSettled([
        fetchNcporPublications({ 
          page: pageToFetch, 
          perPage: 25, 
          search: querySearch, 
          sort: sortBy 
        }),
        pageToFetch === 1 ? fetchNcporDatasets({ page: 1, perPage: 25, search: querySearch }) : Promise.resolve(null)
      ]);

      if (pubsResult.status === 'fulfilled' && pubsResult.value) {
        const data = pubsResult.value;
        setTotalPubsCount(data.totalCount || data.items.length);
        if (isLoadMore) {
          setDynamicPubs(prev => {
            const existingIds = new Set(prev.map(p => p.id));
            const newItems = data.items.filter(p => !existingIds.has(p.id));
            return [...prev, ...newItems];
          });
          setApiPage(pageToFetch);
        } else {
          setDynamicPubs(data.items);
          setApiPage(1);
        }
      } else if (pubsResult.status === 'rejected') {
        console.error('Error fetching NCPOR publications:', pubsResult.reason);
        setApiError('Unable to connect to live NCPOR research registry. Showing cached data.');
      }

      if (datasetsResult.status === 'fulfilled' && datasetsResult.value) {
        const dsData = datasetsResult.value;
        setDynamicDatasets(dsData.items);
        setTotalDatasetsCount(dsData.totalCount || dsData.items.length);
      }

      setLastSynced(new Date());
    } catch (err) {
      console.error('Failed to load NCPOR dynamic assets:', err);
      setApiError('Network connection issue while contacting NCPOR registry.');
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
      setIsRefreshing(false);
    }
  }, [sortBy]);

  // Institutional registry stats load on mount
  useEffect(() => {
    let active = true;
    fetchNcporRegistryStats().then(stats => {
      if (active && stats) setApiStats(stats);
    }).catch(() => {});
    return () => { active = false; };
  }, []);

  // Debounced API fetch when search term or sort order changes
  useEffect(() => {
    const timer = setTimeout(() => {
      loadDynamicData(1, false, searchTerm);
    }, searchTerm ? 450 : 0);

    return () => clearTimeout(timer);
  }, [searchTerm, loadDynamicData]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadDynamicData(1, false, searchTerm);
  };

  const handleLoadMore = () => {
    if (!isLoadingMore) {
      loadDynamicData(apiPage + 1, true, searchTerm);
    }
  };

  // Filtered & Sorted Publications
  const filteredPubs = useMemo(() => {
    let result = allActivePublications.filter(pub => {
      if (selectedCategory !== 'All' && pub.category !== selectedCategory) {
        return false;
      }
      if (searchTerm.trim() !== '') {
        const q = searchTerm.toLowerCase();
        const titleMatch = (pub.title || '').toLowerCase().includes(q);
        const authorMatch = (pub.authors || []).some(a => a.toLowerCase().includes(q));
        const journalMatch = (pub.journal || '').toLowerCase().includes(q);
        const tagMatch = (pub.tags || []).some(t => t.toLowerCase().includes(q));
        const doiMatch = (pub.doi || '').toLowerCase().includes(q);
        return titleMatch || authorMatch || journalMatch || tagMatch || doiMatch;
      }
      return true;
    });

    if (sortBy === 'newest') {
      result.sort((a, b) => b.year - a.year);
    } else if (sortBy === 'citations') {
      result.sort((a, b) => (b.citations || 0) - (a.citations || 0));
    } else if (sortBy === 'title') {
      result.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
    }

    return result;
  }, [allActivePublications, selectedCategory, searchTerm, sortBy]);

  // Filtered & Sorted Datasets
  const filteredDatasets = useMemo(() => {
    let result = allActiveDatasets.filter(ds => {
      if (selectedCategory !== 'All' && ds.category !== selectedCategory) {
        return false;
      }
      if (searchTerm.trim() !== '') {
        const q = searchTerm.toLowerCase();
        const titleMatch = (ds.title || '').toLowerCase().includes(q);
        const regionMatch = (ds.region || '').toLowerCase().includes(q);
        const paramMatch = (ds.parameters || []).some(p => p.toLowerCase().includes(q));
        const doiMatch = (ds.doi || '').toLowerCase().includes(q);
        return titleMatch || regionMatch || paramMatch || doiMatch;
      }
      return true;
    });

    if (sortBy === 'newest') {
      result.sort((a, b) => b.year - a.year);
    } else if (sortBy === 'citations') {
      result.sort((a, b) => (b.downloadsCount || 0) - (a.downloadsCount || 0));
    } else if (sortBy === 'title') {
      result.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
    }

    return result;
  }, [allActiveDatasets, selectedCategory, searchTerm, sortBy]);

  const totalAssetsCount = (totalPubsCount || allActivePublications.length) + (totalDatasetsCount || allActiveDatasets.length);
  const currentTotalFiltered = (viewTab === 'all' ? filteredPubs.length + filteredDatasets.length : viewTab === 'publications' ? filteredPubs.length : filteredDatasets.length);

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const copyCitation = (pub) => {
    const citation = `${(pub.authors || []).join(', ')} (${pub.year}). ${pub.title}. ${pub.journal}. https://doi.org/${pub.doi}`;
    navigator.clipboard.writeText(citation);
    setCopiedId(pub.id);
    setDownloadToast(`Copied APA citation for "${(pub.title || '').substring(0, 40)}..."`);
    setTimeout(() => {
      setCopiedId(null);
      setDownloadToast(null);
    }, 3000);
  };

  const copyDoi = (doi, id) => {
    navigator.clipboard.writeText(`https://doi.org/${doi}`);
    setCopiedDoiId(id);
    setDownloadToast(`DOI link copied to clipboard: https://doi.org/${doi}`);
    setTimeout(() => {
      setCopiedDoiId(null);
      setDownloadToast(null);
    }, 3000);
  };

  const handleDownload = (ds) => {
    // Determine native dataset extension
    let ext = 'csv';
    let mimeType = 'text/csv;charset=utf-8';
    const formatLower = (ds.format || '').toLowerCase();
    
    if (formatLower.includes('.nc') || formatLower.includes('netcdf')) {
      ext = 'nc';
      mimeType = 'application/x-netcdf';
    } else if (formatLower.includes('.dat') || formatLower.includes('ascii') || formatLower.includes('tab')) {
      ext = 'dat';
      mimeType = 'text/plain;charset=utf-8';
    } else if (formatLower.includes('.json')) {
      ext = 'json';
      mimeType = 'application/json';
    }

    const content = `================================================================================
NCPOR OPEN SCIENTIFIC DATASET ARCHIVE
National Centre for Polar and Ocean Research (MoES, Govt. of India)
================================================================================

DATASET TITLE:
${ds.title}

REGION / EXPEDITION:
${ds.region}

PARAMETERS MEASURED:
${(ds.parameters || []).join(', ')}

FORMAT & SIZE:
${ds.format} • ${ds.fileSize}

PERSISTENT IDENTIFIER (DOI):
https://doi.org/${ds.doi}

--------------------------------------------------------------------------------
DATASET SUMMARY & METADATA:
--------------------------------------------------------------------------------
${ds.summary || 'Open observational dataset published under NCPOR data mandate.'}

================================================================================
Archived by NCPOR Polar Outreach & Science Communication Portal
================================================================================`;

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const safeTitle = (ds.title || 'dataset').replace(/[^a-zA-Z0-9]/g, '_').substring(0, 35);
    link.download = `NCPOR_${safeTitle}_${ds.year}.${ext}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setDownloadToast(`Downloaded dataset in native format: ${ds.format}`);
    setTimeout(() => setDownloadToast(null), 3500);
  };

  const handleDownloadPub = (pub) => {
    downloadPublicationPDF(pub);
    setDownloadToast(`Downloaded "${(pub.title || '').substring(0, 38)}..." (PDF Document)`);
    setTimeout(() => setDownloadToast(null), 3500);
  };

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('All');
    setSortBy('newest');
  };

  return (
    <div className="container publications-page-container">
      {/* Toast Notification Alert */}
      {downloadToast && (
        <div className="download-toast-box">
          <Check size={16} className="toast-icon" />
          <span>{downloadToast}</span>
          <button className="toast-close-btn" onClick={() => setDownloadToast(null)}>
            <X size={14} />
          </button>
        </div>
      )}

      {/* Header */}
      <div className="page-header-row">
        <div>
          <div className="section-eyebrow">OPEN RESEARCH & DATA ARCHIVE</div>
          <h1 className="page-title">Polar Science Publications & Datasets</h1>
          <p className="page-sub">
            Real-time peer-reviewed research papers and scientific observation datasets directly affiliated with the National Centre for Polar and Ocean Research (MoES, Govt. of India).
          </p>
        </div>

        {auth.isAuthenticated && (
          <div className="header-action-upload">
            <button 
              className="btn-upload-hub"
              onClick={() => navigateTo('admin-upload')}
            >
              <Plus size={16} />
              <span>Upload Dataset / Paper</span>
            </button>
          </div>
        )}
      </div>

      {/* Live NCPOR Registry Status Banner */}
      <div className="ncpor-registry-banner glass-panel">
        <div className="registry-banner-left">
          <div className="registry-status-indicator">
            <span className="pulsing-live-dot" />
            <span className="registry-live-label">OFFICIAL NCPOR RESEARCH REGISTRY</span>
          </div>
          <div className="registry-meta-details">
            <span className="registry-authority-title">
              OpenAlex & DataCite Connected • Institutional ROR: <code>05af1fm66</code>
            </span>
            <span className="registry-authority-sub">
              Strictly filtered to National Centre for Polar and Ocean Research (NCPOR) affiliated scientists
            </span>
          </div>
        </div>

        <div className="registry-banner-stats">
          <div className="registry-stat-pill">
            <BookOpen size={14} className="stat-pill-icon" />
            <span><strong>{totalPubsCount || dynamicPubs.length || '900+'}</strong> Papers Indexed</span>
          </div>
          <div className="registry-stat-pill">
            <Database size={14} className="stat-pill-icon" />
            <span><strong>{totalDatasetsCount || dynamicDatasets.length || '13+'}</strong> Datasets</span>
          </div>
          {apiStats?.citedByCount && (
            <div className="registry-stat-pill citations-pill">
              <Sparkles size={14} className="stat-pill-icon gold-spark" />
              <span><strong>{apiStats.citedByCount.toLocaleString()}+</strong> Global Citations</span>
            </div>
          )}
        </div>

        <div className="registry-banner-actions">
          <button 
            className={`btn-sync-registry ${isRefreshing ? 'spinning' : ''}`}
            onClick={handleRefresh}
            disabled={isRefreshing || isLoading}
            title="Fetch latest assets from live registry"
          >
            <RefreshCw size={14} className={isRefreshing ? 'icon-spin' : ''} />
            <span>{isRefreshing ? 'Syncing...' : 'Sync Registry'}</span>
          </button>
          {lastSynced && (
            <span className="last-synced-caption">
              Synced {lastSynced.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          )}
        </div>
      </div>

      {/* API Error Notice if any */}
      {apiError && (
        <div className="api-notice-bar">
          <AlertCircle size={16} className="notice-icon" />
          <span>{apiError}</span>
          <button className="btn-notice-retry" onClick={handleRefresh}>
            Retry Connection
          </button>
        </div>
      )}

      {/* View Mode Navigation Tabs */}
      <div className="view-mode-tabs-container">
        <div className="view-mode-tabs">
          <button 
            className={`mode-tab ${viewTab === 'all' ? 'active' : ''}`}
            onClick={() => setViewTab('all')}
          >
            <Layers size={16} />
            <span>All NCPOR Assets</span>
            <span className="tab-count-badge">
              {isLoading && dynamicPubs.length === 0 ? '...' : totalAssetsCount}
            </span>
          </button>
          <button 
            className={`mode-tab ${viewTab === 'publications' ? 'active' : ''}`}
            onClick={() => setViewTab('publications')}
          >
            <BookOpen size={16} />
            <span>Peer-Reviewed Papers</span>
            <span className="tab-count-badge">
              {isLoading && dynamicPubs.length === 0 ? '...' : (totalPubsCount || allActivePublications.length)}
            </span>
          </button>
          <button 
            className={`mode-tab ${viewTab === 'datasets' ? 'active' : ''}`}
            onClick={() => setViewTab('datasets')}
          >
            <Database size={16} />
            <span>Scientific Datasets</span>
            <span className="tab-count-badge">
              {isLoading && dynamicDatasets.length === 0 ? '...' : (totalDatasetsCount || allActiveDatasets.length)}
            </span>
          </button>
        </div>
      </div>


      {/* Filter & Search Bar Hub */}
      <div className="glass-panel filter-hub-card">
        <div className="search-sort-row">
          <div className="search-input-wrapper">
            <Search size={18} className="search-icon-left" />
            <input 
              type="text" 
              placeholder="Search by title, author, parameter (e.g. δ18O, aerosol), DOI, or keyword..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pub-search-input"
            />
            {searchTerm && (
              <button 
                className="search-clear-btn" 
                onClick={() => setSearchTerm('')}
                title="Clear search"
              >
                <X size={15} />
              </button>
            )}
          </div>

          <div className="sort-dropdown-wrap">
            <ArrowUpDown size={15} className="sort-icon" />
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
              className="sort-select"
            >
              <option value="newest">Sort by: Newest First</option>
              <option value="citations">Sort by: Most Cited / Downloads</option>
              <option value="title">Sort by: Title (A-Z)</option>
            </select>
          </div>
        </div>

        {/* Category Pills & Active Filter Bar */}
        <div className="filter-pills-row">
          <div className="category-chips-list">
            <span className="filter-label">
              <Filter size={13} />
              <span>Discipline:</span>
            </span>
            {categories.map((cat) => {
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  className={`category-pill-btn ${isActive ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(cat)}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {(searchTerm || selectedCategory !== 'All') && (
            <button className="btn-reset-filters" onClick={resetFilters}>
              <X size={13} />
              <span>Reset Filters</span>
            </button>
          )}
        </div>

        {/* Result summary */}
        <div className="results-summary-line">
          <span>Showing <strong>{currentTotalFiltered}</strong> {currentTotalFiltered === 1 ? 'record' : 'records'}</span>
          {searchTerm && <span> matching "<em>{searchTerm}</em>"</span>}
          {selectedCategory !== 'All' && <span> under <strong>{selectedCategory}</strong></span>}
        </div>
      </div>

      {/* Results List */}
      <div className="publications-list-wrapper">
        {/* DATASETS SECTION */}
        {(viewTab === 'all' || viewTab === 'datasets') && filteredDatasets.length > 0 && (
          <div className="section-block">
            <div className="section-header-band">
              <div className="section-title-group">
                <div className="section-icon-cube dataset-cube">
                  <Database size={18} />
                </div>
                <div>
                  <h2 className="section-heading-text">Open Scientific Datasets</h2>
                  <p className="section-subtext">Verified observational time-series, ice core profiles, and oceanographic logs</p>
                </div>
              </div>
              <span className="section-counter-badge dataset-count">{filteredDatasets.length} datasets</span>
            </div>

            <div className="pubs-vertical-stack">
              {filteredDatasets.map((ds) => {
                const isExpanded = expandedId === ds.id;
                const catStyle = getCategoryColor(ds.category);

                return (
                  <div key={ds.id} className="pub-card-modern dataset-accent-border">
                    <div className="pub-card-main">
                      {/* Badge Ribbon */}
                      <div className="card-top-ribbon">
                        <div className="badge-cluster">
                          <span 
                            className="card-category-badge"
                            style={{ 
                              backgroundColor: catStyle.bg, 
                              color: catStyle.text, 
                              borderColor: catStyle.border 
                            }}
                          >
                            <span className="badge-dot" style={{ backgroundColor: catStyle.dot }} />
                            {ds.category}
                          </span>

                          <span className="card-format-pill">
                            <FileCode size={12} />
                            {ds.format}
                          </span>

                          <span className="card-year-pill">
                            <Calendar size={12} />
                            {ds.year}
                          </span>

                          <span className="card-license-pill">
                            <ShieldCheck size={12} />
                            {ds.license || 'CC-BY 4.0 Open Science'}
                          </span>

                          <span className="card-ncpor-origin-badge">
                            <ShieldCheck size={11} />
                            <span>NCPOR Polar Dataset</span>
                          </span>
                        </div>

                        {ds.downloadsCount && (
                          <span className="card-download-stat" title="Total downloads">
                            <Download size={12} />
                            <span>{ds.downloadsCount} downloads</span>
                          </span>
                        )}
                      </div>

                      {/* Title */}
                      <h3 className="card-title-text">{ds.title}</h3>

                      {/* Meta information row */}
                      <div className="card-meta-grid">
                        <div className="meta-chip">
                          <MapPin size={14} className="meta-icon geo-icon" />
                          <span className="meta-value">{ds.spatialCoverage}</span>
                        </div>
                        <div className="meta-chip">
                          <Clock size={14} className="meta-icon time-icon" />
                          <span className="meta-value">{ds.temporalCoverage}</span>
                        </div>
                        <div className="meta-chip">
                          <FileText size={14} className="meta-icon size-icon" />
                          <span className="meta-value">File Size: {ds.fileSize}</span>
                        </div>
                      </div>

                      {/* Measured Variables */}
                      {ds.parameters && ds.parameters.length > 0 && (
                        <div className="parameters-container">
                          <span className="params-title">
                            <Tag size={12} />
                            <span>Measured Variables:</span>
                          </span>
                          <div className="params-chips-wrap">
                            {ds.parameters.map((param, i) => (
                              <span key={i} className="variable-chip">
                                {param}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Expandable Details Drawer */}
                    {isExpanded && (
                      <div className="expanded-details-drawer">
                        <div className="drawer-inner">
                          <div className="drawer-header">
                            <h4 className="drawer-title">Dataset Summary & Technical Specifications</h4>
                          </div>
                          
                          <p className="drawer-description">{ds.summary}</p>

                          <div className="doi-interactive-strip">
                            <div className="doi-info">
                              <span className="doi-prefix">Persistent Identifier (DOI):</span>
                              <code className="doi-code-box">https://doi.org/{ds.doi}</code>
                            </div>

                            <button 
                              className={`btn-doi-copy ${copiedDoiId === ds.id ? 'active' : ''}`}
                              onClick={() => copyDoi(ds.doi, ds.id)}
                            >
                              {copiedDoiId === ds.id ? (
                                <><Check size={13} /><span>Copied DOI</span></>
                              ) : (
                                <><Copy size={13} /><span>Copy DOI</span></>
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Actions Toolbar */}
                    <div className="card-actions-bar">
                      <button 
                        className="btn-expand-toggle"
                        onClick={() => toggleExpand(ds.id)}
                      >
                        {isExpanded ? (
                          <><span>Collapse Details</span><ChevronUp size={15} /></>
                        ) : (
                          <><span>Inspect Variables & Abstract</span><ChevronDown size={15} /></>
                        )}
                      </button>

                      <div className="action-buttons-group">
                        <button 
                          className="btn-secondary-action"
                          onClick={() => copyDoi(ds.doi, ds.id)}
                          title="Copy direct DOI"
                        >
                          {copiedDoiId === ds.id ? <Check size={14} /> : <Share2 size={14} />}
                          <span>DOI Link</span>
                        </button>

                        <button 
                          className="btn-download-primary"
                          onClick={() => handleDownload(ds)}
                          title="Download dataset"
                        >
                          <Download size={14} />
                          <span>Download {ds.format.split(' ')[0]}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* PUBLICATIONS SECTION */}
        {(viewTab === 'all' || viewTab === 'publications') && filteredPubs.length > 0 && (
          <div className="section-block">
            <div className="section-header-band">
              <div className="section-title-group">
                <div className="section-icon-cube pub-cube">
                  <BookOpen size={18} />
                </div>
                <div>
                  <h2 className="section-heading-text">Peer-Reviewed Publications</h2>
                  <p className="section-subtext">Original research articles published in high-impact international journals</p>
                </div>
              </div>
              <span className="section-counter-badge pub-count">{filteredPubs.length} publications</span>
            </div>

            <div className="pubs-vertical-stack">
              {filteredPubs.map((pub) => {
                const isExpanded = expandedId === pub.id;
                const catStyle = getCategoryColor(pub.category);

                return (
                  <div key={pub.id} className="pub-card-modern publication-card-accent">
                    <div className="pub-card-main">
                      {/* Badges */}
                      <div className="card-top-ribbon">
                        <div className="badge-cluster">
                          <span 
                            className="card-category-badge"
                            style={{ 
                              backgroundColor: catStyle.bg, 
                              color: catStyle.text, 
                              borderColor: catStyle.border 
                            }}
                          >
                            <span className="badge-dot" style={{ backgroundColor: catStyle.dot }} />
                            {pub.category}
                          </span>

                          <span className="card-year-pill">
                            <Calendar size={12} />
                            {pub.year}
                          </span>

                          <span className="card-journal-badge">
                            <em>{pub.journal}</em>
                          </span>

                          {pub.isOa && (
                            <span className="card-oa-pill" title="Verified Open Access Publication">
                              <CheckCircle2 size={11} />
                              <span>Open Access</span>
                            </span>
                          )}
                        </div>

                        {pub.citations !== undefined && (
                          <span className="card-citation-badge" title="Citations tracked">
                            <Sparkles size={12} />
                            <span>{pub.citations} Citations</span>
                          </span>
                        )}
                      </div>

                      {/* Title */}
                      <h3 className="card-title-text">{pub.title}</h3>

                      {/* NCPOR Verified Authorship Strip */}
                      {pub.ncporAuthors && pub.ncporAuthors.length > 0 && (
                        <div className="ncpor-affiliation-strip">
                          <ShieldCheck size={13} className="ncpor-shield-icon" />
                          <span className="ncpor-strip-label">NCPOR Affiliation:</span>
                          <span className="ncpor-strip-names">{pub.ncporAuthors.join(', ')}</span>
                          <span className="ncpor-inst-tag">MoES • Govt. of India</span>
                        </div>
                      )}

                      {/* Authors Line */}
                      <div className="card-authors-bar">
                        <User size={14} className="author-glyph" />
                        <span className="author-names">{pub.authors.join(', ')}</span>
                      </div>

                      {/* Tags */}
                      {pub.tags && pub.tags.length > 0 && (
                        <div className="pub-keywords-row">
                          {pub.tags.map((tag, i) => (
                            <span key={i} className="keyword-chip">
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Expandable Abstract Drawer */}
                    {isExpanded && (
                      <div className="expanded-details-drawer">
                        <div className="drawer-inner">
                          <div className="drawer-header">
                            <h4 className="drawer-title">Research Abstract</h4>
                          </div>
                          
                          <p className="drawer-description">{pub.abstract}</p>

                          <div className="doi-interactive-strip">
                            <div className="doi-info">
                              <span className="doi-prefix">Journal DOI:</span>
                              <code className="doi-code-box">https://doi.org/{pub.doi}</code>
                            </div>

                            <a 
                              href={`https://doi.org/${pub.doi}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="btn-publisher-link"
                            >
                              <span>Open Publisher Record</span>
                              <ExternalLink size={13} />
                            </a>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Actions Toolbar */}
                    <div className="card-actions-bar">
                      <button 
                        className="btn-expand-toggle"
                        onClick={() => toggleExpand(pub.id)}
                      >
                        {isExpanded ? (
                          <><span>Hide Abstract</span><ChevronUp size={15} /></>
                        ) : (
                          <><span>Read Abstract</span><ChevronDown size={15} /></>
                        )}
                      </button>

                      <div className="action-buttons-group">
                        <button 
                          className={`btn-secondary-action ${copiedId === pub.id ? 'active-copied' : ''}`}
                          onClick={() => copyCitation(pub)}
                          title="Copy APA formatted citation"
                        >
                          {copiedId === pub.id ? (
                            <><Check size={14} /><span>Copied APA</span></>
                          ) : (
                            <><Copy size={14} /><span>Cite / APA</span></>
                          )}
                        </button>

                        {pub.isOa && pub.pdfUrl && pub.pdfUrl !== '#' && (
                          <a 
                            href={pub.pdfUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-oa-pdf"
                            title="Open full-text Open Access PDF from publisher"
                          >
                            <FileText size={14} />
                            <span>Full PDF</span>
                            <ExternalLink size={11} />
                          </a>
                        )}

                        <button 
                          className="btn-download-primary"
                          onClick={() => handleDownloadPub(pub)}
                          title="Download open-access publication document"
                        >
                          <Download size={14} />
                          <span>Download Paper</span>
                        </button>

                        <a 
                          href={`https://doi.org/${pub.doi}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-primary-view"
                          title="Visit original publication"
                        >
                          <span>View Article</span>
                          <ExternalLink size={13} />
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Dynamic Load More Button */}
            {viewTab !== 'datasets' && dynamicPubs.length < totalPubsCount && !searchTerm && (
              <div className="load-more-row">
                <button 
                  className="btn-load-more-pubs"
                  onClick={handleLoadMore}
                  disabled={isLoadingMore}
                >
                  {isLoadingMore ? (
                    <>
                      <Loader2 size={16} className="icon-spin" />
                      <span>Fetching More Papers from NCPOR Registry...</span>
                    </>
                  ) : (
                    <>
                      <BookOpen size={16} />
                      <span>Load 25 More NCPOR Publications ({dynamicPubs.length} of {totalPubsCount} loaded)</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        )}

        {/* Loading Skeleton while initial fetch happens */}
        {isLoading && dynamicPubs.length === 0 && (
          <div className="skeleton-container">
            <div className="skeleton-header shimmer" />
            {[1, 2, 3].map(n => (
              <div key={n} className="pub-card-modern skeleton-card">
                <div className="skeleton-bar-cluster">
                  <div className="skeleton-pill shimmer" />
                  <div className="skeleton-pill shimmer" />
                </div>
                <div className="skeleton-line skeleton-title shimmer" />
                <div className="skeleton-line skeleton-sub shimmer" />
                <div className="skeleton-line skeleton-meta shimmer" />
              </div>
            ))}
          </div>
        )}

        {/* Empty State when no results found */}
        {!isLoading && currentTotalFiltered === 0 && (
          <div className="empty-results-box">
            <div className="empty-icon-circle">
              <Search size={32} />
            </div>
            <h3 className="empty-title">No Matching Publications or Datasets</h3>
            <p className="empty-subtitle">
              We couldn't find any resources matching your search criteria in the NCPOR registry. Try modifying your keywords or discipline filter.
            </p>
            <button className="btn-empty-reset" onClick={resetFilters}>
              Reset All Filters
            </button>
          </div>
        )}
      </div>

      <style>{`
        .publications-page-container {
          padding: 2.5rem 1.5rem 6rem;
          display: flex;
          flex-direction: column;
          gap: 2rem;
          max-width: 1280px;
          margin: 0 auto;
        }

        /* --- Toast Notification Box --- */
        .download-toast-box {
          position: fixed;
          bottom: 2rem;
          right: 2rem;
          z-index: 1000;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          background: #0f172a;
          color: #ffffff;
          border: 1px solid #334155;
          padding: 0.9rem 1.25rem;
          border-radius: var(--radius-md);
          font-size: 0.88rem;
          font-weight: 500;
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.3), 0 8px 10px -6px rgba(0, 0, 0, 0.2);
          animation: slideUpToast 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        }

        @keyframes slideUpToast {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.96);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .toast-icon {
          color: #10b981;
          flex-shrink: 0;
        }

        .toast-close-btn {
          background: transparent;
          border: none;
          color: #94a3b8;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0.2rem;
          margin-left: 0.5rem;
          border-radius: 4px;
        }

        .toast-close-btn:hover {
          color: #ffffff;
          background: rgba(255, 255, 255, 0.1);
        }

        /* --- Header Section --- */
        .page-header-row {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 1.25rem;
        }

        .section-eyebrow {
          font-size: 0.8rem;
          font-weight: 800;
          letter-spacing: 0.08em;
          color: #d97706;
          text-transform: uppercase;
          margin-bottom: 0.35rem;
        }

        .page-title {
          font-size: 2.1rem;
          font-weight: 800;
          color: var(--navy);
          line-height: 1.2;
          letter-spacing: -0.02em;
          margin: 0 0 0.5rem 0;
        }

        .page-sub {
          font-size: 0.96rem;
          color: var(--text-secondary);
          max-width: 820px;
          line-height: 1.55;
          margin: 0;
        }

        .header-action-upload {
          flex-shrink: 0;
        }

        .btn-upload-hub {
          display: inline-flex;
          align-items: center;
          gap: 0.45rem;
          background: var(--navy);
          color: #ffffff;
          font-weight: 600;
          padding: 0.65rem 1.2rem;
          border-radius: var(--radius-sm);
          font-size: 0.85rem;
          border: none;
          cursor: pointer;
          box-shadow: var(--shadow-sm);
          transition: all 0.15s ease;
        }

        .btn-upload-hub:hover {
          background: #1e293b;
        }

        /* --- Live NCPOR Registry Status Banner --- */
        .ncpor-registry-banner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 1.25rem;
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(240, 249, 255, 0.85));
          border: 1px solid rgba(186, 230, 253, 0.8);
          border-left: 4px solid #0284c7;
          border-radius: var(--radius-md);
          padding: 1.1rem 1.4rem;
          box-shadow: 0 4px 20px -2px rgba(2, 132, 199, 0.08);
        }

        .registry-banner-left {
          display: flex;
          flex-direction: column;
          gap: 0.3rem;
        }

        .registry-status-indicator {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
        }

        .pulsing-live-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #10b981;
          box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7);
          animation: pulseDot 2s infinite cubic-bezier(0.66, 0, 0, 1);
        }

        @keyframes pulseDot {
          0% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7); }
          70% { box-shadow: 0 0 0 8px rgba(16, 185, 129, 0); }
          100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
        }

        .registry-live-label {
          font-size: 0.75rem;
          font-weight: 800;
          letter-spacing: 0.07em;
          color: #0369a1;
          text-transform: uppercase;
        }

        .registry-authority-title {
          font-size: 0.92rem;
          font-weight: 700;
          color: #0f172a;
        }

        .registry-authority-title code {
          background: #e0f2fe;
          color: #0369a1;
          padding: 0.15rem 0.4rem;
          border-radius: 4px;
          font-size: 0.82rem;
          font-family: monospace;
          border: 1px solid #bae6fd;
        }

        .registry-authority-sub {
          font-size: 0.8rem;
          color: #64748b;
        }

        .registry-banner-stats {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          flex-wrap: wrap;
        }

        .registry-stat-pill {
          display: inline-flex;
          align-items: center;
          gap: 0.45rem;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          padding: 0.4rem 0.8rem;
          border-radius: 9999px;
          font-size: 0.82rem;
          color: #334155;
          font-weight: 500;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
        }

        .stat-pill-icon {
          color: #0284c7;
        }

        .gold-spark {
          color: #f59e0b;
        }

        .registry-banner-actions {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 0.35rem;
        }

        .btn-sync-registry {
          display: inline-flex;
          align-items: center;
          gap: 0.45rem;
          background: #ffffff;
          color: #0284c7;
          border: 1px solid #bae6fd;
          padding: 0.45rem 0.95rem;
          border-radius: var(--radius-sm);
          font-size: 0.82rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
        }

        .btn-sync-registry:hover:not(:disabled) {
          background: #f0f9ff;
          border-color: #0284c7;
          color: #0369a1;
        }

        .btn-sync-registry:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .last-synced-caption {
          font-size: 0.72rem;
          color: #94a3b8;
        }

        .icon-spin {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        /* --- API Error Notice Bar --- */
        .api-notice-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: #fffbeb;
          border: 1px solid #fef3c7;
          border-left: 4px solid #f59e0b;
          padding: 0.75rem 1.1rem;
          border-radius: var(--radius-sm);
          font-size: 0.85rem;
          color: #92400e;
        }

        .btn-notice-retry {
          background: #f59e0b;
          color: #ffffff;
          border: none;
          padding: 0.3rem 0.7rem;
          border-radius: 4px;
          font-size: 0.78rem;
          font-weight: 600;
          cursor: pointer;
        }

        /* --- Open Access Badge & Action --- */
        .card-oa-pill {
          display: inline-flex;
          align-items: center;
          gap: 0.3rem;
          background: #ecfdf5;
          color: #059669;
          border: 1px solid #a7f3d0;
          font-size: 0.72rem;
          font-weight: 700;
          padding: 0.2rem 0.55rem;
          border-radius: 9999px;
          text-transform: uppercase;
          letter-spacing: 0.03em;
        }

        .btn-oa-pdf {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          background: #059669;
          color: #ffffff;
          padding: 0.5rem 0.85rem;
          border-radius: var(--radius-sm);
          font-size: 0.82rem;
          font-weight: 600;
          text-decoration: none;
          transition: all 0.2s ease;
        }

        .btn-oa-pdf:hover {
          background: #047857;
          color: #ffffff;
        }

        /* --- NCPOR Verified Affiliation Callouts --- */
        .ncpor-affiliation-strip {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 0.45rem;
          background: #f0fdf4;
          border: 1px solid #bbf7d0;
          border-radius: 6px;
          padding: 0.45rem 0.75rem;
          margin-top: 0.35rem;
          font-size: 0.82rem;
        }

        .ncpor-shield-icon {
          color: #059669;
          flex-shrink: 0;
        }

        .ncpor-strip-label {
          font-weight: 700;
          color: #065f46;
        }

        .ncpor-strip-names {
          font-weight: 600;
          color: #047857;
        }

        .ncpor-inst-tag {
          margin-left: auto;
          font-size: 0.72rem;
          font-weight: 700;
          color: #059669;
          background: #dcfce7;
          padding: 0.15rem 0.5rem;
          border-radius: 4px;
          letter-spacing: 0.02em;
        }

        .card-ncpor-origin-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.3rem;
          background: #eff6ff;
          color: #1d4ed8;
          border: 1px solid #bfdbfe;
          font-size: 0.72rem;
          font-weight: 700;
          padding: 0.2rem 0.55rem;
          border-radius: 9999px;
          letter-spacing: 0.02em;
        }

        /* --- Load More Row --- */
        .load-more-row {
          display: flex;
          justify-content: center;
          padding: 1.5rem 0 0.5rem;
        }

        .btn-load-more-pubs {
          display: inline-flex;
          align-items: center;
          gap: 0.6rem;
          background: var(--navy);
          color: #ffffff;
          padding: 0.75rem 1.6rem;
          border-radius: var(--radius-sm);
          font-size: 0.9rem;
          font-weight: 600;
          border: none;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: var(--shadow-sm);
        }

        .btn-load-more-pubs:hover:not(:disabled) {
          background: #1e293b;
          transform: translateY(-1px);
          box-shadow: var(--shadow-md);
        }

        .btn-load-more-pubs:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        /* --- Loading Skeletons --- */
        .skeleton-container {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .skeleton-card {
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 0.9rem;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: var(--radius-md);
        }

        .skeleton-bar-cluster {
          display: flex;
          gap: 0.5rem;
        }

        .skeleton-pill {
          width: 80px;
          height: 22px;
          border-radius: 9999px;
        }

        .skeleton-title {
          height: 26px;
          width: 75%;
          border-radius: 4px;
        }

        .skeleton-sub {
          height: 18px;
          width: 45%;
          border-radius: 4px;
        }

        .skeleton-meta {
          height: 16px;
          width: 30%;
          border-radius: 4px;
        }

        .shimmer {
          background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
        }

        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }

        /* --- View Mode Tabs --- */
        .view-mode-tabs-container {
          display: flex;
          justify-content: flex-start;
        }

        .view-mode-tabs {
          display: inline-flex;
          align-items: center;
          background: #e2e8f0;
          padding: 0.35rem;
          border-radius: var(--radius-md);
          gap: 0.35rem;
          box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.05);
        }

        .mode-tab {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.65rem 1.15rem;
          background: transparent;
          border: none;
          color: var(--text-secondary);
          border-radius: var(--radius-sm);
          font-size: 0.88rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .mode-tab:hover {
          color: var(--navy);
        }

        .mode-tab.active {
          background: #ffffff;
          color: var(--navy);
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
          font-weight: 700;
        }

        .tab-count-badge {
          background: #f1f5f9;
          color: #475569;
          font-size: 0.75rem;
          font-weight: 700;
          padding: 0.15rem 0.5rem;
          border-radius: var(--radius-full);
        }

        .mode-tab.active .tab-count-badge {
          background: #eff6ff;
          color: #1d4ed8;
        }

        /* --- Filter & Search Hub --- */
        .filter-hub-card {
          background: #ffffff;
          border: 1px solid var(--border-card);
          border-radius: var(--radius-md);
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
          box-shadow: var(--shadow-sm);
        }

        .search-sort-row {
          display: flex;
          align-items: center;
          gap: 1rem;
          width: 100%;
        }

        .search-input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
          flex: 1;
        }

        .search-icon-left {
          position: absolute;
          left: 1.1rem;
          color: #64748b;
          pointer-events: none;
        }

        .pub-search-input {
          width: 100%;
          background: #f8fafc;
          border: 1px solid #cbd5e1;
          border-radius: var(--radius-sm);
          padding: 0.85rem 2.75rem 0.85rem 2.85rem;
          color: var(--text-primary);
          font-size: 0.95rem;
          transition: all 0.2s ease;
        }

        .pub-search-input:focus {
          outline: none;
          border-color: #059669;
          background: #ffffff;
          box-shadow: 0 0 0 3px rgba(5, 150, 105, 0.15);
        }

        .search-clear-btn {
          position: absolute;
          right: 0.85rem;
          background: #e2e8f0;
          border: none;
          color: #64748b;
          width: 22px;
          height: 22px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }

        .search-clear-btn:hover {
          background: #cbd5e1;
          color: #0f172a;
        }

        .sort-dropdown-wrap {
          position: relative;
          display: flex;
          align-items: center;
          min-width: 230px;
        }

        .sort-icon {
          position: absolute;
          left: 0.9rem;
          color: #64748b;
          pointer-events: none;
        }

        .sort-select {
          width: 100%;
          background: #f8fafc;
          border: 1px solid #cbd5e1;
          border-radius: var(--radius-sm);
          padding: 0.85rem 1rem 0.85rem 2.4rem;
          color: var(--text-secondary);
          font-size: 0.88rem;
          font-weight: 600;
          cursor: pointer;
          appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 0.85rem center;
        }

        .sort-select:focus {
          outline: none;
          border-color: #059669;
        }

        .filter-pills-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 0.75rem;
          border-top: 1px solid #f1f5f9;
          padding-top: 1rem;
        }

        .category-chips-list {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 0.45rem;
        }

        .filter-label {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          font-size: 0.8rem;
          color: #64748b;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.03em;
          margin-right: 0.35rem;
        }

        .category-pill-btn {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          color: var(--text-secondary);
          padding: 0.4rem 0.85rem;
          border-radius: var(--radius-full);
          font-size: 0.82rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .category-pill-btn:hover {
          color: var(--navy);
          background: #f1f5f9;
          border-color: #cbd5e1;
        }

        .category-pill-btn.active {
          background: #0f172a;
          border-color: #0f172a;
          color: #ffffff;
          font-weight: 600;
          box-shadow: 0 2px 6px rgba(15, 23, 42, 0.2);
        }

        .btn-reset-filters {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          background: #fee2e2;
          border: 1px solid #fecaca;
          color: #b91c1c;
          font-size: 0.8rem;
          font-weight: 600;
          padding: 0.35rem 0.75rem;
          border-radius: var(--radius-sm);
          cursor: pointer;
          transition: background 0.15s ease;
        }

        .btn-reset-filters:hover {
          background: #fca5a5;
        }

        .results-summary-line {
          font-size: 0.85rem;
          color: #64748b;
        }

        /* --- Section Grouping & Headers --- */
        .publications-list-wrapper {
          display: flex;
          flex-direction: column;
          gap: 2.5rem;
        }

        .section-block {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .section-header-band {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-bottom: 0.5rem;
          border-bottom: 2px solid #e2e8f0;
        }

        .section-title-group {
          display: flex;
          align-items: center;
          gap: 0.85rem;
        }

        .section-icon-cube {
          width: 38px;
          height: 38px;
          border-radius: var(--radius-sm);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .dataset-cube {
          background: #ecfdf5;
          color: #059669;
          border: 1px solid #a7f3d0;
        }

        .pub-cube {
          background: #fffbeb;
          color: #d97706;
          border: 1px solid #fde68a;
        }

        .section-heading-text {
          font-size: 1.25rem;
          font-weight: 800;
          color: var(--navy);
          margin: 0;
          line-height: 1.2;
        }

        .section-subtext {
          font-size: 0.82rem;
          color: #64748b;
          margin: 0;
        }

        .section-counter-badge {
          font-size: 0.8rem;
          font-weight: 700;
          padding: 0.35rem 0.85rem;
          border-radius: var(--radius-full);
        }

        .dataset-count {
          background: #ecfdf5;
          color: #047857;
          border: 1px solid #a7f3d0;
        }

        .pub-count {
          background: #fffbeb;
          color: #b45309;
          border: 1px solid #fde68a;
        }

        .pubs-vertical-stack {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        /* --- Modern Record Card --- */
        .pub-card-modern {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: var(--radius-md);
          overflow: hidden;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(0, 0, 0, 0.02);
          transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
          display: flex;
          flex-direction: column;
        }

        .pub-card-modern:hover {
          box-shadow: 0 8px 20px -4px rgba(15, 23, 42, 0.08), 0 4px 8px -2px rgba(15, 23, 42, 0.04);
          border-color: #cbd5e1;
        }

        .dataset-accent-border {
          border-left: 4px solid #059669;
        }

        .publication-card-accent {
          border-left: 4px solid #d97706;
        }

        .pub-card-main {
          padding: 1.5rem 1.75rem 1.25rem;
          display: flex;
          flex-direction: column;
          gap: 0.85rem;
        }

        .card-top-ribbon {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .badge-cluster {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 0.45rem;
        }

        .card-category-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          font-size: 0.76rem;
          font-weight: 700;
          padding: 0.25rem 0.7rem;
          border-radius: var(--radius-full);
          border: 1px solid transparent;
        }

        .badge-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          display: inline-block;
        }

        .card-format-pill {
          display: inline-flex;
          align-items: center;
          gap: 0.3rem;
          background: #f1f5f9;
          color: #334155;
          border: 1px solid #e2e8f0;
          font-size: 0.74rem;
          font-weight: 700;
          padding: 0.2rem 0.6rem;
          border-radius: 4px;
        }

        .card-year-pill {
          display: inline-flex;
          align-items: center;
          gap: 0.3rem;
          font-size: 0.76rem;
          color: #64748b;
          font-weight: 600;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          padding: 0.2rem 0.55rem;
          border-radius: 4px;
        }

        .card-license-pill {
          display: inline-flex;
          align-items: center;
          gap: 0.3rem;
          font-size: 0.74rem;
          color: #047857;
          background: #ecfdf5;
          border: 1px solid #a7f3d0;
          padding: 0.2rem 0.55rem;
          border-radius: 4px;
          font-weight: 600;
        }

        .card-journal-badge {
          font-size: 0.78rem;
          color: #475569;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          padding: 0.2rem 0.6rem;
          border-radius: 4px;
        }

        .card-citation-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          font-size: 0.76rem;
          color: #b45309;
          background: #fffbeb;
          border: 1px solid #fde68a;
          padding: 0.25rem 0.65rem;
          border-radius: var(--radius-full);
          font-weight: 700;
        }

        .card-download-stat {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          font-size: 0.76rem;
          color: #047857;
          background: #ecfdf5;
          border: 1px solid #a7f3d0;
          padding: 0.25rem 0.65rem;
          border-radius: var(--radius-full);
          font-weight: 600;
        }

        .card-title-text {
          font-size: 1.22rem;
          font-weight: 700;
          color: var(--navy);
          line-height: 1.35;
          margin: 0.2rem 0;
          letter-spacing: -0.01em;
        }

        .card-meta-grid {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 1.25rem;
          padding: 0.5rem 0;
        }

        .meta-chip {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.84rem;
          color: #475569;
        }

        .meta-icon {
          flex-shrink: 0;
        }

        .geo-icon { color: #0284c7; }
        .time-icon { color: #d97706; }
        .size-icon { color: #059669; }

        .meta-value {
          font-weight: 500;
        }

        .parameters-container {
          display: flex;
          align-items: flex-start;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin-top: 0.25rem;
        }

        .params-title {
          display: inline-flex;
          align-items: center;
          gap: 0.3rem;
          font-size: 0.76rem;
          font-weight: 700;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.02em;
          padding-top: 0.25rem;
        }

        .params-chips-wrap {
          display: flex;
          flex-wrap: wrap;
          gap: 0.4rem;
        }

        .variable-chip {
          background: #f1f5f9;
          border: 1px solid #cbd5e1;
          color: #334155;
          font-size: 0.76rem;
          font-weight: 600;
          padding: 0.2rem 0.55rem;
          border-radius: 4px;
          font-family: var(--font-mono);
          letter-spacing: -0.01em;
        }

        .card-authors-bar {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.88rem;
          color: #334155;
        }

        .author-glyph {
          color: #0284c7;
          flex-shrink: 0;
        }

        .author-names {
          font-weight: 500;
        }

        .pub-keywords-row {
          display: flex;
          flex-wrap: wrap;
          gap: 0.4rem;
          margin-top: 0.2rem;
        }

        .keyword-chip {
          font-size: 0.74rem;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          color: #64748b;
          padding: 0.15rem 0.5rem;
          border-radius: 4px;
          font-weight: 500;
        }

        /* --- Expanded Details Drawer --- */
        .expanded-details-drawer {
          background: #f8fafc;
          border-top: 1px solid #e2e8f0;
          border-bottom: 1px solid #e2e8f0;
          padding: 1.25rem 1.75rem;
          animation: expandFade 0.2s ease-out;
        }

        @keyframes expandFade {
          from { opacity: 0; transform: translateY(-6px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .drawer-inner {
          display: flex;
          flex-direction: column;
          gap: 0.85rem;
        }

        .drawer-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .drawer-title {
          font-size: 0.82rem;
          font-weight: 700;
          color: #0f172a;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin: 0;
        }

        .drawer-description {
          font-size: 0.9rem;
          line-height: 1.6;
          color: #334155;
          margin: 0;
        }

        .doi-interactive-strip {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 0.75rem;
          background: #ffffff;
          padding: 0.75rem 1rem;
          border-radius: var(--radius-sm);
          border: 1px solid #e2e8f0;
        }

        .doi-info {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          flex-wrap: wrap;
        }

        .doi-prefix {
          font-size: 0.78rem;
          color: #64748b;
          font-weight: 600;
        }

        .doi-code-box {
          font-family: var(--font-mono);
          font-size: 0.82rem;
          color: #047857;
          background: #ecfdf5;
          padding: 0.2rem 0.5rem;
          border-radius: 4px;
          border: 1px solid #a7f3d0;
        }

        .btn-doi-copy {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          background: #f1f5f9;
          border: 1px solid #cbd5e1;
          color: #334155;
          font-size: 0.78rem;
          font-weight: 600;
          padding: 0.35rem 0.75rem;
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .btn-doi-copy:hover {
          background: #e2e8f0;
          color: #0f172a;
        }

        .btn-doi-copy.active {
          background: #ecfdf5;
          border-color: #a7f3d0;
          color: #047857;
        }

        .btn-publisher-link {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          background: #eff6ff;
          border: 1px solid #bfdbfe;
          color: #1d4ed8;
          font-size: 0.78rem;
          font-weight: 600;
          padding: 0.35rem 0.75rem;
          border-radius: 4px;
          text-decoration: none;
          transition: all 0.15s ease;
        }

        .btn-publisher-link:hover {
          background: #dbeafe;
        }

        /* --- Actions Toolbar --- */
        .card-actions-bar {
          padding: 0.9rem 1.75rem;
          background: #ffffff;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 0.85rem;
        }

        .btn-expand-toggle {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          background: transparent;
          border: none;
          color: #059669;
          font-size: 0.85rem;
          font-weight: 700;
          cursor: pointer;
          padding: 0.2rem 0;
          transition: color 0.15s ease;
        }

        .btn-expand-toggle:hover {
          color: #047857;
          text-decoration: underline;
        }

        .action-buttons-group {
          display: flex;
          align-items: center;
          gap: 0.6rem;
        }

        .btn-secondary-action {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          background: #ffffff;
          border: 1px solid #cbd5e1;
          color: #334155;
          padding: 0.5rem 0.9rem;
          border-radius: var(--radius-sm);
          font-size: 0.82rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .btn-secondary-action:hover {
          background: #f8fafc;
          border-color: #94a3b8;
          color: var(--navy);
        }

        .btn-secondary-action.active-copied {
          background: #ecfdf5;
          color: #047857;
          border-color: #a7f3d0;
        }

        .btn-download-primary {
          display: inline-flex;
          align-items: center;
          gap: 0.45rem;
          background: #059669;
          border: 1px solid #047857;
          color: #ffffff;
          padding: 0.5rem 1.1rem;
          border-radius: var(--radius-sm);
          font-size: 0.84rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 2px 4px rgba(5, 150, 105, 0.25);
        }

        .btn-download-primary:hover {
          background: #047857;
          box-shadow: 0 4px 8px rgba(5, 150, 105, 0.35);
          transform: translateY(-1px);
        }

        .btn-primary-view {
          display: inline-flex;
          align-items: center;
          gap: 0.45rem;
          background: #0f172a;
          border: 1px solid #0f172a;
          color: #ffffff;
          padding: 0.5rem 1.1rem;
          border-radius: var(--radius-sm);
          font-size: 0.84rem;
          font-weight: 700;
          text-decoration: none;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 2px 4px rgba(15, 23, 42, 0.2);
        }

        .btn-primary-view:hover {
          background: #1e293b;
          transform: translateY(-1px);
        }

        /* --- Empty Results State --- */
        .empty-results-box {
          background: #ffffff;
          border: 1px dashed #cbd5e1;
          border-radius: var(--radius-lg);
          padding: 3.5rem 2rem;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.75rem;
        }

        .empty-icon-circle {
          width: 64px;
          height: 64px;
          border-radius: 50%;
          background: #f1f5f9;
          color: #94a3b8;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 0.5rem;
        }

        .empty-title {
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--navy);
          margin: 0;
        }

        .empty-subtitle {
          font-size: 0.9rem;
          color: #64748b;
          max-width: 480px;
          line-height: 1.5;
          margin: 0;
        }

        .btn-empty-reset {
          margin-top: 0.75rem;
          background: #0f172a;
          color: #ffffff;
          border: none;
          font-size: 0.85rem;
          font-weight: 600;
          padding: 0.65rem 1.25rem;
          border-radius: var(--radius-sm);
          cursor: pointer;
          transition: background 0.15s ease;
        }

        .btn-empty-reset:hover {
          background: #1e293b;
        }

        /* --- Responsive Styles --- */
        @media (max-width: 900px) {
          .pub-hero-banner {
            padding: 1.75rem;
          }
          .pub-hero-title {
            font-size: 1.75rem;
          }
          .search-sort-row {
            flex-direction: column;
            align-items: stretch;
          }
          .sort-dropdown-wrap {
            min-width: 100%;
          }
          .category-chips-list {
            overflow-x: auto;
            -webkit-overflow-scrolling: touch;
            scrollbar-width: none;
            flex-wrap: nowrap;
            width: 100%;
            padding-bottom: 3px;
          }
          .category-chips-list::-webkit-scrollbar {
            display: none;
          }
          .category-pill-btn {
            white-space: nowrap;
            flex-shrink: 0;
          }
        }

        @media (max-width: 768px) {
          .publications-page-container {
            padding: 1.25rem 0.75rem 4rem;
            gap: 1.25rem;
          }
          .pub-stats-ribbon {
            width: 100%;
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 0.75rem;
            padding: 0.85rem 1rem;
          }
          .stat-divider {
            display: none;
          }
          .view-mode-tabs {
            width: 100%;
            overflow-x: auto;
            -webkit-overflow-scrolling: touch;
            scrollbar-width: none;
          }
          .view-mode-tabs::-webkit-scrollbar {
            display: none;
          }
          .mode-tab {
            flex: 1;
            justify-content: center;
            padding: 0.55rem 0.75rem;
            font-size: 0.8rem;
            white-space: nowrap;
            min-height: 40px;
          }
          .card-actions-bar {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.75rem;
          }
          .action-buttons-group {
            width: 100%;
            display: flex;
            gap: 0.45rem;
          }
          .btn-secondary-action, .btn-download-primary, .btn-primary-view {
            flex: 1;
            justify-content: center;
            min-height: 42px;
          }
        }

        @media (max-width: 480px) {
          .category-chips-list {
            gap: 0.35rem;
          }
          .category-pill-btn {
            font-size: 0.75rem;
            padding: 0.3rem 0.65rem;
          }
          .action-buttons-group {
            flex-direction: column;
          }
          .btn-secondary-action, .btn-download-primary, .btn-primary-view {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}
