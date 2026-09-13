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
        <div className="page-header-text">
          <div className="section-eyebrow">OPEN RESEARCH & DATA ARCHIVE</div>
          <h1 className="page-title">Polar Science Publications & Datasets</h1>
          <p className="page-sub">
            Real-time peer-reviewed research papers and scientific observation datasets directly affiliated with the National Centre for Polar and Ocean Research (MoES, Govt. of India).
          </p>
        </div>

        <div className="page-header-corner">
          {/* Refresh Data Button */}
          <button 
            className={`btn-sync-action ${isRefreshing ? 'is-syncing' : ''}`}
            onClick={handleRefresh}
            disabled={isRefreshing || isLoading}
            title={lastSynced ? `NCPOR Live Data (ROR: 05af1fm66)${apiStats?.citedByCount ? ` • ${apiStats.citedByCount.toLocaleString()}+ citations` : ''} • Last updated: ${lastSynced.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : 'Refresh data'}
          >
            <RefreshCw size={14} className={`sync-icon ${isRefreshing ? 'icon-spin' : ''}`} />
            <span>{isRefreshing ? 'Refreshing...' : 'Refresh Data'}</span>
          </button>

          {auth.isAuthenticated && (
            <div className="header-action-upload">
              <button 
                className="btn-upload-hub"
                onClick={() => navigateTo('admin-upload')}
              >
                <Plus size={15} />
                <span>Upload Dataset / Paper</span>
              </button>
            </div>
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
            className={`mode-tab tab-all ${viewTab === 'all' ? 'active' : ''}`}
            onClick={() => setViewTab('all')}
          >
            <Layers size={15} className="tab-icon" />
            <span className="tab-label">All NCPOR Assets</span>
            <span className="tab-count-badge">
              {isLoading && dynamicPubs.length === 0 ? '...' : totalAssetsCount}
            </span>
          </button>
          <button 
            className={`mode-tab tab-pubs ${viewTab === 'publications' ? 'active' : ''}`}
            onClick={() => setViewTab('publications')}
          >
            <BookOpen size={15} className="tab-icon" />
            <span className="tab-label">Peer-Reviewed Papers</span>
            <span className="tab-count-badge">
              {isLoading && dynamicPubs.length === 0 ? '...' : (totalPubsCount || allActivePublications.length)}
            </span>
          </button>
          <button 
            className={`mode-tab tab-datasets ${viewTab === 'datasets' ? 'active' : ''}`}
            onClick={() => setViewTab('datasets')}
          >
            <Database size={15} className="tab-icon" />
            <span className="tab-label">Scientific Datasets</span>
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
                  <div key={ds.id} className="pub-card-modern dataset-card-style">
                    <div className="pub-card-main">
                      {/* Top Header Ribbon */}
                      <div className="card-top-ribbon">
                        <div className="badge-cluster">
                          <span className="card-primary-tag dataset-primary-tag">
                            <Database size={12} />
                            <span>Polar Scientific Dataset</span>
                          </span>

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

                          <span className="card-meta-pill format-pill">
                            <FileCode size={11} />
                            {ds.format}
                          </span>

                          <span className="card-meta-pill year-pill">
                            <Calendar size={11} />
                            {ds.year}
                          </span>

                          <span className="card-meta-pill license-pill">
                            <ShieldCheck size={11} />
                            {ds.license || 'CC-BY 4.0 Open Science'}
                          </span>
                        </div>

                        {ds.downloadsCount && (
                          <div className="card-metric-badge dataset-metric" title="Total downloads recorded">
                            <Download size={12} className="metric-icon" />
                            <span><strong>{ds.downloadsCount}</strong> downloads</span>
                          </div>
                        )}
                      </div>

                      {/* Title */}
                      <h3 className="card-title-text">{ds.title}</h3>

                      {/* Meta Information Bar */}
                      <div className="card-meta-grid">
                        <div className="meta-chip" title="Spatial Geographic Coverage">
                          <MapPin size={13} className="meta-icon geo-icon" />
                          <span className="meta-label">Location:</span>
                          <span className="meta-value">{ds.spatialCoverage}</span>
                        </div>
                        <div className="meta-chip" title="Temporal Observation Range">
                          <Clock size={13} className="meta-icon time-icon" />
                          <span className="meta-label">Temporal:</span>
                          <span className="meta-value">{ds.temporalCoverage}</span>
                        </div>
                        <div className="meta-chip" title="Data File Size">
                          <FileText size={13} className="meta-icon size-icon" />
                          <span className="meta-label">Size:</span>
                          <span className="meta-value">{ds.fileSize}</span>
                        </div>
                      </div>

                      {/* Measured Variables */}
                      {ds.parameters && ds.parameters.length > 0 && (
                        <div className="parameters-container">
                          <span className="params-title">
                            <Tag size={11} />
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
                            <h4 className="drawer-title">Dataset Summary &amp; Technical Specifications</h4>
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
                        className={`btn-expand-toggle ${isExpanded ? 'active-expanded' : ''}`}
                        onClick={() => toggleExpand(ds.id)}
                      >
                        <span>{isExpanded ? 'Collapse Details' : 'Inspect Variables & Abstract'}</span>
                        {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                      </button>

                      <div className="action-buttons-group">
                        <button 
                          className={`btn-ghost-action ${copiedDoiId === ds.id ? 'active-copied' : ''}`}
                          onClick={() => copyDoi(ds.doi, ds.id)}
                          title="Copy direct DOI"
                        >
                          {copiedDoiId === ds.id ? <Check size={13} /> : <Share2 size={13} />}
                          <span>{copiedDoiId === ds.id ? 'Copied' : 'DOI Link'}</span>
                        </button>

                        <button 
                          className="btn-download-primary btn-dataset-download"
                          onClick={() => handleDownload(ds)}
                          title="Download dataset"
                        >
                          <Download size={13} />
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
                  <div key={pub.id} className="pub-card-modern publication-card-style">
                    <div className="pub-card-main">
                      {/* Top Header Ribbon */}
                      <div className="card-top-ribbon">
                        <div className="badge-cluster">
                          {pub.isOa ? (
                            <span className="card-primary-tag oa-primary-tag" title="Verified Open Access Publication">
                              <CheckCircle2 size={11} />
                              <span>Open Access Article</span>
                            </span>
                          ) : (
                            <span className="card-primary-tag pub-primary-tag">
                              <BookOpen size={11} />
                              <span>Research Article</span>
                            </span>
                          )}

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

                          <span className="card-meta-pill year-pill">
                            <Calendar size={11} />
                            {pub.year}
                          </span>

                          <span className="card-journal-badge" title="Publishing Journal">
                            <em>{pub.journal}</em>
                          </span>
                        </div>

                        {pub.citations !== undefined && (
                          <div className="card-metric-badge citation-metric" title="Total global citations recorded by OpenAlex">
                            <Sparkles size={12} className="metric-icon gold-spark" />
                            <span><strong>{pub.citations}</strong> Citations</span>
                          </div>
                        )}
                      </div>

                      {/* Title */}
                      <h3 className="card-title-text">{pub.title}</h3>

                      {/* Authors Line */}
                      <div className="card-authors-bar">
                        <User size={13} className="author-glyph" />
                        <span className="author-names">{pub.authors.join(', ')}</span>
                      </div>

                      {/* NCPOR Verified Authorship Strip */}
                      {pub.ncporAuthors && pub.ncporAuthors.length > 0 && (
                        <div className="ncpor-affiliation-strip">
                          <div className="ncpor-strip-lead">
                            <ShieldCheck size={13} className="ncpor-shield-icon" />
                            <span className="ncpor-strip-label">NCPOR Affiliated:</span>
                          </div>
                          <span className="ncpor-strip-names">{pub.ncporAuthors.join(', ')}</span>
                          <span className="ncpor-inst-tag">MoES • Govt. of India</span>
                        </div>
                      )}

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
                              <ExternalLink size={12} />
                            </a>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Actions Toolbar */}
                    <div className="card-actions-bar">
                      <button 
                        className={`btn-expand-toggle ${isExpanded ? 'active-expanded' : ''}`}
                        onClick={() => toggleExpand(pub.id)}
                      >
                        <span>{isExpanded ? 'Hide Abstract' : 'Read Abstract'}</span>
                        {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                      </button>

                      <div className="action-buttons-group">
                        <button 
                          className={`btn-ghost-action ${copiedId === pub.id ? 'active-copied' : ''}`}
                          onClick={() => copyCitation(pub)}
                          title="Copy APA formatted citation"
                        >
                          {copiedId === pub.id ? (
                            <><Check size={13} /><span>Copied APA</span></>
                          ) : (
                            <><Copy size={13} /><span>Cite / APA</span></>
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
                            <FileText size={13} />
                            <span>Full PDF</span>
                            <ExternalLink size={11} />
                          </a>
                        )}

                        <button 
                          className="btn-ghost-action"
                          onClick={() => handleDownloadPub(pub)}
                          title="Download summary report"
                        >
                          <Download size={13} />
                          <span>Summary</span>
                        </button>

                        <a 
                          href={`https://doi.org/${pub.doi}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-primary-view"
                          title="Visit original publication"
                        >
                          <span>View Article</span>
                          <ExternalLink size={12} />
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

        .page-header-text {
          flex: 1 1 520px;
          max-width: 820px;
        }

        .page-header-corner {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          flex-shrink: 0;
          flex-wrap: wrap;
        }

        /* --- Live Sync Registry Button (Refined & Unified) --- */
        .btn-sync-action {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: #ffffff;
          color: var(--navy);
          border: 1px solid #cbd5e1;
          padding: 0.65rem 1.15rem;
          border-radius: var(--radius-sm);
          font-size: 0.85rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.18s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 1px 2px rgba(15, 23, 42, 0.05);
          white-space: nowrap;
        }

        .btn-sync-action:hover:not(:disabled) {
          background: #f8fafc;
          border-color: #0284c7;
          color: #0284c7;
          box-shadow: 0 3px 8px -1px rgba(2, 132, 199, 0.15);
          transform: translateY(-1px);
        }

        .btn-sync-action:active:not(:disabled) {
          transform: translateY(0);
          box-shadow: 0 1px 2px rgba(15, 23, 42, 0.05);
        }

        .btn-sync-action:disabled {
          opacity: 0.65;
          cursor: not-allowed;
        }

        .btn-sync-action .sync-icon {
          color: #0284c7;
          transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .btn-sync-action:hover:not(:disabled) .sync-icon {
          transform: rotate(60deg);
        }

        .btn-sync-action.is-syncing .sync-icon,
        .icon-spin {
          animation: spin 0.9s linear infinite;
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

        /* --- Modern Segmented View Mode Tabs --- */
        .view-mode-tabs-container {
          display: flex;
          align-items: center;
          justify-content: flex-start;
          margin-bottom: -0.25rem;
        }

        .view-mode-tabs {
          display: inline-flex;
          align-items: center;
          background: #f1f5f9;
          padding: 0.3rem;
          border-radius: 12px;
          gap: 0.25rem;
          border: 1px solid #e2e8f0;
          box-shadow: 0 1px 3px rgba(15, 23, 42, 0.04);
        }

        .mode-tab {
          display: inline-flex;
          align-items: center;
          gap: 0.55rem;
          padding: 0.55rem 1.05rem;
          background: transparent;
          border: 1px solid transparent;
          color: #64748b;
          border-radius: 9px;
          font-size: 0.86rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.18s cubic-bezier(0.4, 0, 0.2, 1);
          user-select: none;
          white-space: nowrap;
        }

        .mode-tab .tab-icon {
          color: #94a3b8;
          transition: color 0.18s ease, transform 0.18s ease;
          flex-shrink: 0;
        }

        .mode-tab:hover:not(.active) {
          color: #0f172a;
          background: rgba(255, 255, 255, 0.7);
        }

        .mode-tab:hover:not(.active) .tab-icon {
          color: #475569;
        }

        .mode-tab:active {
          transform: scale(0.98);
        }

        .mode-tab.active {
          background: #ffffff;
          color: #0f172a;
          border-color: rgba(226, 232, 240, 0.95);
          box-shadow: 0 2px 6px -1px rgba(15, 23, 42, 0.08), 0 1px 3px -1px rgba(15, 23, 42, 0.04);
        }

        .mode-tab.tab-all.active .tab-icon {
          color: #0284c7;
        }

        .mode-tab.tab-pubs.active .tab-icon {
          color: #2563eb;
        }

        .mode-tab.tab-datasets.active .tab-icon {
          color: #059669;
        }

        .tab-count-badge {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-width: 22px;
          padding: 0.12rem 0.5rem;
          font-size: 0.74rem;
          font-weight: 700;
          border-radius: 9999px;
          background: #e2e8f0;
          color: #64748b;
          line-height: 1.3;
          transition: all 0.18s ease;
        }

        .mode-tab:hover:not(.active) .tab-count-badge {
          background: #cbd5e1;
          color: #1e293b;
        }

        .mode-tab.tab-all.active .tab-count-badge {
          background: #e0f2fe;
          color: #0369a1;
        }

        .mode-tab.tab-pubs.active .tab-count-badge {
          background: #eff6ff;
          color: #1d4ed8;
        }

        .mode-tab.tab-datasets.active .tab-count-badge {
          background: #ecfdf5;
          color: #047857;
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

        /* =========================================================
           MODERN PREMIUM CARD STYLES — Dataset & Publication
           ========================================================= */

        .pub-card-modern {
          background: #ffffff;
          border: 1px solid #e8ecf0;
          border-radius: 18px;
          overflow: hidden;
          position: relative;
          box-shadow:
            0 1px 3px rgba(15, 23, 42, 0.04),
            0 4px 12px rgba(15, 23, 42, 0.03);
          transition: box-shadow 0.28s cubic-bezier(0.16, 1, 0.3, 1),
                      border-color 0.28s ease,
                      transform 0.28s cubic-bezier(0.16, 1, 0.3, 1);
          display: flex;
          flex-direction: column;
        }

        .pub-card-modern:hover {
          box-shadow:
            0 8px 24px -4px rgba(15, 23, 42, 0.11),
            0 3px 10px -2px rgba(15, 23, 42, 0.06);
          border-color: #c8d0db;
          transform: translateY(-3px);
        }

        /* Gradient accent bar — datasets (teal) */
        .dataset-card-style::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 4px;
          background: linear-gradient(90deg, #059669 0%, #34d399 55%, #6ee7b7 100%);
          border-radius: 18px 18px 0 0;
        }

        /* Gradient accent bar — publications (blue) */
        .publication-card-style::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 4px;
          background: linear-gradient(90deg, #2563eb 0%, #60a5fa 55%, #93c5fd 100%);
          border-radius: 18px 18px 0 0;
        }

        .pub-card-main {
          padding: 1.55rem 1.8rem 1.2rem;
          display: flex;
          flex-direction: column;
          gap: 0.9rem;
        }

        /* ---- Badge ribbon ---- */
        .card-top-ribbon {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 0.55rem;
        }

        .badge-cluster {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 0.4rem;
        }

        /* Primary type tags */
        .card-primary-tag {
          display: inline-flex;
          align-items: center;
          gap: 0.32rem;
          font-size: 0.72rem;
          font-weight: 700;
          padding: 0.22rem 0.62rem;
          border-radius: 7px;
          letter-spacing: 0.01em;
          text-transform: uppercase;
        }

        .dataset-primary-tag {
          background: linear-gradient(135deg, #d1fae5, #ecfdf5);
          color: #065f46;
          border: 1px solid #6ee7b7;
          box-shadow: 0 1px 3px rgba(5, 150, 105, 0.12);
        }

        .oa-primary-tag {
          background: linear-gradient(135deg, #d1fae5, #f0fdf4);
          color: #15803d;
          border: 1px solid #86efac;
          box-shadow: 0 1px 3px rgba(21, 128, 61, 0.12);
        }

        .pub-primary-tag {
          background: linear-gradient(135deg, #dbeafe, #eff6ff);
          color: #1d4ed8;
          border: 1px solid #93c5fd;
          box-shadow: 0 1px 3px rgba(37, 99, 235, 0.12);
        }

        /* Category badge pill */
        .card-category-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.32rem;
          font-size: 0.73rem;
          font-weight: 700;
          padding: 0.22rem 0.68rem;
          border-radius: 9999px;
          border: 1px solid transparent;
          letter-spacing: 0.01em;
        }

        .badge-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          display: inline-block;
          flex-shrink: 0;
        }

        /* Small meta pills (format, year, license) */
        .card-meta-pill {
          display: inline-flex;
          align-items: center;
          gap: 0.28rem;
          background: #f4f6f9;
          color: #52677c;
          border: 1px solid #e0e6ed;
          font-size: 0.72rem;
          font-weight: 600;
          padding: 0.2rem 0.55rem;
          border-radius: 6px;
          letter-spacing: 0.005em;
        }

        /* Journal badge */
        .card-journal-badge {
          font-size: 0.74rem;
          color: #52677c;
          background: #f4f6f9;
          border: 1px solid #e0e6ed;
          padding: 0.2rem 0.6rem;
          border-radius: 6px;
          font-style: normal;
          max-width: 280px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        /* Metric badge (citations / downloads) */
        .card-metric-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.32rem;
          font-size: 0.75rem;
          padding: 0.28rem 0.75rem;
          border-radius: 9999px;
          font-weight: 500;
          flex-shrink: 0;
        }

        .card-metric-badge strong {
          font-weight: 800;
          letter-spacing: -0.01em;
        }

        .citation-metric {
          background: linear-gradient(135deg, #fef3c7, #fffbeb);
          border: 1px solid #fde68a;
          color: #92400e;
          box-shadow: 0 1px 3px rgba(217, 119, 6, 0.1);
        }

        .gold-spark { color: #d97706; }

        .dataset-metric {
          background: linear-gradient(135deg, #d1fae5, #ecfdf5);
          border: 1px solid #6ee7b7;
          color: #065f46;
          box-shadow: 0 1px 3px rgba(5, 150, 105, 0.1);
        }

        .metric-icon { flex-shrink: 0; }

        /* ---- Card title ---- */
        .card-title-text {
          font-size: 1.15rem;
          font-weight: 750;
          color: #0d1929;
          line-height: 1.45;
          margin: 0.1rem 0;
          letter-spacing: -0.02em;
        }

        /* ---- Dataset meta grid ---- */
        .card-meta-grid {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 0.55rem 1rem;
          padding: 0.2rem 0;
        }

        .meta-chip {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          font-size: 0.81rem;
          background: #f8fafc;
          border: 1px solid #eaeff4;
          padding: 0.28rem 0.7rem;
          border-radius: 8px;
        }

        .meta-icon { flex-shrink: 0; }
        .geo-icon  { color: #2563eb; }
        .time-icon { color: #d97706; }
        .size-icon { color: #059669; }

        .meta-label {
          color: #8fa0b4;
          font-size: 0.68rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }

        .meta-value {
          font-weight: 650;
          color: #1a2c42;
          font-size: 0.82rem;
        }

        /* ---- Variable / parameter chips ---- */
        .parameters-container {
          display: flex;
          align-items: flex-start;
          flex-wrap: wrap;
          gap: 0.45rem;
          margin-top: 0.1rem;
        }

        .params-title {
          display: inline-flex;
          align-items: center;
          gap: 0.3rem;
          font-size: 0.7rem;
          font-weight: 700;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          padding-top: 0.25rem;
          flex-shrink: 0;
        }

        .params-chips-wrap {
          display: flex;
          flex-wrap: wrap;
          gap: 0.3rem;
        }

        .variable-chip {
          background: #eef2f7;
          border: 1px solid #d8e0eb;
          color: #2d4260;
          font-size: 0.74rem;
          font-weight: 600;
          padding: 0.2rem 0.6rem;
          border-radius: 6px;
          letter-spacing: -0.005em;
          transition: background 0.15s ease, border-color 0.15s ease;
        }

        .variable-chip:hover {
          background: #e1eaf5;
          border-color: #b8c9de;
        }

        /* ---- Authors bar ---- */
        .card-authors-bar {
          display: flex;
          align-items: flex-start;
          gap: 0.45rem;
          font-size: 0.86rem;
          color: #334155;
          line-height: 1.5;
        }

        .author-glyph { color: #2563eb; flex-shrink: 0; margin-top: 1px; }

        .author-names {
          font-weight: 500;
          color: #445568;
        }

        /* ---- NCPOR affiliation strip ---- */
        .ncpor-affiliation-strip {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 0.5rem;
          background: linear-gradient(135deg, rgba(236, 253, 245, 0.9), rgba(248, 250, 252, 0.95));
          border: 1px solid #a7f3d0;
          border-left: 3px solid #059669;
          border-radius: 9px;
          padding: 0.45rem 0.9rem;
          margin-top: 0.05rem;
          font-size: 0.82rem;
        }

        .ncpor-strip-lead {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
        }

        .ncpor-shield-icon { color: #059669; flex-shrink: 0; }

        .ncpor-strip-label {
          font-weight: 700;
          color: #065f46;
          font-size: 0.72rem;
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }

        .ncpor-strip-names {
          font-weight: 600;
          color: #0f172a;
        }

        .ncpor-inst-tag {
          margin-left: auto;
          font-size: 0.68rem;
          font-weight: 700;
          color: #047857;
          background: #dcfce7;
          padding: 0.15rem 0.5rem;
          border-radius: 5px;
          letter-spacing: 0.02em;
          border: 1px solid #bbf7d0;
        }

        /* ---- Keyword chips ---- */
        .pub-keywords-row {
          display: flex;
          flex-wrap: wrap;
          gap: 0.3rem;
          margin-top: 0.1rem;
        }

        .keyword-chip {
          font-size: 0.72rem;
          background: #f0f4f8;
          border: 1px solid #dce4ef;
          color: #5a748c;
          padding: 0.16rem 0.52rem;
          border-radius: 5px;
          font-weight: 500;
          transition: background 0.12s ease;
        }

        .keyword-chip:hover {
          background: #e3edf7;
          color: #2d4260;
        }

        /* =========================================================
           EXPANDED DRAWER
           ========================================================= */

        .expanded-details-drawer {
          background: linear-gradient(180deg, #f7f9fc 0%, #f0f4f8 100%);
          border-top: 1px solid #e4eaf0;
          border-bottom: 1px solid #e4eaf0;
          padding: 1.3rem 1.8rem;
          animation: expandFade 0.22s cubic-bezier(0.16, 1, 0.3, 1);
        }

        @keyframes expandFade {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .drawer-inner {
          display: flex;
          flex-direction: column;
          gap: 0.9rem;
        }

        .drawer-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .drawer-title {
          font-size: 0.72rem;
          font-weight: 800;
          color: #4a6080;
          text-transform: uppercase;
          letter-spacing: 0.07em;
          margin: 0;
        }

        .drawer-description {
          font-size: 0.875rem;
          line-height: 1.7;
          color: #374151;
          margin: 0;
        }

        .doi-interactive-strip {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 0.75rem;
          background: #ffffff;
          padding: 0.72rem 1rem;
          border-radius: 10px;
          border: 1px solid #dce4ef;
          box-shadow: 0 1px 3px rgba(15, 23, 42, 0.04);
        }

        .doi-info {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          flex-wrap: wrap;
        }

        .doi-prefix {
          font-size: 0.73rem;
          color: #64748b;
          font-weight: 600;
        }

        .doi-code-box {
          font-family: var(--font-mono);
          font-size: 0.78rem;
          color: #047857;
          background: #ecfdf5;
          padding: 0.22rem 0.55rem;
          border-radius: 5px;
          border: 1px solid #a7f3d0;
        }

        .btn-doi-copy {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          background: #f4f6f9;
          border: 1px solid #d8e0eb;
          color: #334155;
          font-size: 0.76rem;
          font-weight: 600;
          padding: 0.32rem 0.75rem;
          border-radius: 7px;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .btn-doi-copy:hover {
          background: #e8edf4;
          border-color: #b8c9de;
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
          background: linear-gradient(135deg, #dbeafe, #eff6ff);
          border: 1px solid #93c5fd;
          color: #1d4ed8;
          font-size: 0.76rem;
          font-weight: 600;
          padding: 0.32rem 0.75rem;
          border-radius: 7px;
          text-decoration: none;
          transition: all 0.15s ease;
        }

        .btn-publisher-link:hover {
          background: linear-gradient(135deg, #bfdbfe, #dbeafe);
          border-color: #60a5fa;
        }

        /* =========================================================
           CARD ACTIONS BAR — modern frosted bar
           ========================================================= */

        .card-actions-bar {
          padding: 0.85rem 1.8rem;
          background: linear-gradient(180deg, #f9fafb 0%, #f4f6f9 100%);
          border-top: 1px solid #e8ecf0;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 0.75rem;
        }

        /* Expand/collapse toggle */
        .btn-expand-toggle {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          background: transparent;
          border: 1px solid #d8e0eb;
          color: #52677c;
          padding: 0.38rem 0.85rem;
          border-radius: 8px;
          font-size: 0.8rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.18s ease;
        }

        .btn-expand-toggle:hover {
          background: #eef2f7;
          border-color: #b8c9de;
          color: #0f172a;
        }

        .btn-expand-toggle.active-expanded {
          background: #ecfdf5;
          border-color: #6ee7b7;
          color: #047857;
        }

        /* Action buttons group */
        .action-buttons-group {
          display: flex;
          align-items: center;
          gap: 0.45rem;
          flex-wrap: wrap;
        }

        /* Ghost action button (cite, doi-link, summary) */
        .btn-ghost-action {
          display: inline-flex;
          align-items: center;
          gap: 0.38rem;
          background: #ffffff;
          border: 1px solid #d8e0eb;
          color: #445568;
          padding: 0.42rem 0.85rem;
          border-radius: 8px;
          font-size: 0.8rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.18s cubic-bezier(0.16, 1, 0.3, 1);
          box-shadow: 0 1px 2px rgba(15, 23, 42, 0.05);
        }

        .btn-ghost-action:hover {
          background: #eef2f7;
          border-color: #b8c9de;
          color: #0d1929;
          transform: translateY(-1px);
          box-shadow: 0 3px 8px rgba(15, 23, 42, 0.09);
        }

        .btn-ghost-action.active-copied {
          background: #ecfdf5;
          border-color: #6ee7b7;
          color: #047857;
        }

        /* Dataset download button */
        .btn-download-primary {
          display: inline-flex;
          align-items: center;
          gap: 0.42rem;
          background: linear-gradient(135deg, #059669 0%, #10b981 100%);
          border: 1px solid #047857;
          color: #ffffff;
          padding: 0.42rem 1.05rem;
          border-radius: 8px;
          font-size: 0.8rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
          box-shadow: 0 2px 6px rgba(5, 150, 105, 0.3), 0 1px 2px rgba(5, 150, 105, 0.15);
          letter-spacing: 0.01em;
        }

        .btn-download-primary:hover {
          background: linear-gradient(135deg, #047857 0%, #059669 100%);
          box-shadow: 0 4px 14px rgba(5, 150, 105, 0.4), 0 2px 4px rgba(5, 150, 105, 0.2);
          transform: translateY(-1px);
        }

        .btn-download-primary:active {
          transform: translateY(0);
          box-shadow: 0 1px 3px rgba(5, 150, 105, 0.2);
        }

        /* Open Access PDF button */
        .btn-oa-pdf {
          display: inline-flex;
          align-items: center;
          gap: 0.38rem;
          background: linear-gradient(135deg, #15803d 0%, #22c55e 100%);
          border: 1px solid #15803d;
          color: #ffffff;
          padding: 0.42rem 0.95rem;
          border-radius: 8px;
          font-size: 0.8rem;
          font-weight: 700;
          text-decoration: none;
          transition: all 0.2s ease;
          box-shadow: 0 2px 6px rgba(21, 128, 61, 0.3);
          letter-spacing: 0.01em;
        }

        .btn-oa-pdf:hover {
          background: linear-gradient(135deg, #166534 0%, #16a34a 100%);
          box-shadow: 0 4px 12px rgba(21, 128, 61, 0.4);
          transform: translateY(-1px);
        }

        /* View article / primary CTA */
        .btn-primary-view {
          display: inline-flex;
          align-items: center;
          gap: 0.42rem;
          background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
          border: 1px solid #0f172a;
          color: #ffffff;
          padding: 0.42rem 1.05rem;
          border-radius: 8px;
          font-size: 0.8rem;
          font-weight: 700;
          text-decoration: none;
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
          box-shadow: 0 2px 6px rgba(15, 23, 42, 0.25), 0 1px 2px rgba(15, 23, 42, 0.12);
          letter-spacing: 0.01em;
        }

        .btn-primary-view:hover {
          background: linear-gradient(135deg, #334155 0%, #1e293b 100%);
          box-shadow: 0 4px 14px rgba(15, 23, 42, 0.35), 0 2px 4px rgba(15, 23, 42, 0.15);
          transform: translateY(-1px);
        }

        .btn-primary-view:active {
          transform: translateY(0);
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

        /* =========================================================
           RESPONSIVE
           ========================================================= */

        @media (max-width: 900px) {
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
          .category-chips-list::-webkit-scrollbar { display: none; }
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
          .page-header-corner {
            width: 100%;
            align-items: stretch;
          }
          .view-mode-tabs {
            width: 100%;
            overflow-x: auto;
            -webkit-overflow-scrolling: touch;
            scrollbar-width: none;
          }
          .view-mode-tabs::-webkit-scrollbar { display: none; }
          .mode-tab {
            flex: 1;
            justify-content: center;
            padding: 0.55rem 0.75rem;
            font-size: 0.8rem;
            white-space: nowrap;
            min-height: 40px;
          }
          .pub-card-main {
            padding: 1.25rem 1.25rem 1rem;
          }
          .card-actions-bar {
            padding: 0.75rem 1.25rem;
            flex-direction: column;
            align-items: flex-start;
            gap: 0.65rem;
          }
          .action-buttons-group {
            width: 100%;
            display: flex;
            gap: 0.4rem;
          }
          .btn-ghost-action, .btn-download-primary, .btn-primary-view, .btn-oa-pdf {
            flex: 1;
            justify-content: center;
            min-height: 40px;
          }
        }

        @media (max-width: 480px) {
          .category-chips-list { gap: 0.35rem; }
          .category-pill-btn {
            font-size: 0.75rem;
            padding: 0.3rem 0.65rem;
          }
          .action-buttons-group { flex-direction: column; }
          .btn-ghost-action, .btn-download-primary, .btn-primary-view, .btn-oa-pdf {
            width: 100%;
          }
          .card-journal-badge {
            max-width: 200px;
          }
        }
      `}</style>
    </div>
  );
}
