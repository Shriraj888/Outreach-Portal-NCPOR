import { useState } from 'react';
import { usePortal } from '../../context/PortalContext';
import { 
  Plus, 
  Sparkles, 
  FileText, 
  Database,
  BookOpen, 
  Image as ImageIcon, 
  Video,
  Calendar,
  CheckCircle2, 
  Clock, 
  Trash2, 
  Edit, 
  Eye, 
  RotateCcw, 
  Search, 
  Compass, 
  UploadCloud,
  AlertCircle,
  Layers,
  X
} from 'lucide-react';

export default function AdminDashboard({ navigateTo, onSelectExpedition }) {
  const { 
    expeditions, 
    datasets,
    publications, 
    mediaArchives,
    activities,
    auth, 
    deleteExpedition, 
    updateExpedition,
    deleteDataset,
    updateDataset,
    deletePublication,
    updatePublication,
    deleteMediaArchive,
    updateMediaArchive,
    deleteActivity,
    updateActivity,
    resetToDefaultData 
  } = usePortal();

  const [activeTab, setActiveTab] = useState('all'); // all, reports, datasets, publications, photos, videos, activities
  const [filterRegion, setFilterRegion] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [searchTable, setSearchTable] = useState('');

  // Metrics across all 6 Problem Statement pillars
  const totalExpeditions = expeditions.length;
  const totalDatasets = datasets.length;
  const totalPublications = publications.length;
  const totalMedia = mediaArchives.length;
  const aiGeneratedCount = expeditions.filter(e => !!e.aiGeneratedContent).length +
    datasets.filter(d => !!d.aiGeneratedContent).length +
    publications.filter(p => !!p.aiGeneratedContent).length;

  // Build unified archive items list
  const unifiedArchives = [
    ...expeditions.map(e => ({
      id: e.id,
      type: 'report',
      typeLabel: 'Expedition Report',
      title: e.title,
      region: e.region,
      year: e.year,
      authorOrChief: e.chiefScientist || 'NCPOR Scientific Team',
      status: e.status || 'published',
      aiReady: !!e.aiGeneratedContent,
      metaInfo: `${e.reports?.length || 1} Reports • ${e.stations?.length || 1} Stations`,
      heroImage: e.heroImage,
      rawItem: e
    })),
    ...datasets.map(d => ({
      id: d.id,
      type: 'dataset',
      typeLabel: 'Scientific Dataset',
      title: d.title,
      region: d.region,
      year: d.year,
      authorOrChief: d.license || 'CC-BY Open Data',
      status: d.status || 'published',
      aiReady: !!d.aiGeneratedContent,
      metaInfo: `${d.format} • ${d.fileSize || '35 MB'} • ${d.parameters?.length || 4} Variables`,
      heroImage: 'https://images.unsplash.com/photo-1517999144091-3d9dca6d1e43?auto=format&fit=crop&w=600&q=80',
      rawItem: d
    })),
    ...publications.map(p => ({
      id: p.id,
      type: 'publication',
      typeLabel: 'Research Publication',
      title: p.title,
      region: 'Antarctica',
      year: p.year,
      authorOrChief: p.authors?.join(', ') || 'NCPOR Researchers',
      status: p.status || 'published',
      aiReady: !!p.aiGeneratedContent,
      metaInfo: `${p.journal || 'Journal'} • DOI: ${p.doi}`,
      heroImage: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80',
      rawItem: p
    })),
    ...mediaArchives.map(m => ({
      id: m.id,
      type: m.type === 'video' ? 'video' : 'photo',
      typeLabel: m.type === 'video' ? 'Video Footage' : 'Photograph (WCAG-AA)',
      title: m.title,
      region: m.region,
      year: m.year || 2024,
      authorOrChief: m.resolution || m.duration || 'NCPOR Field Media',
      status: m.status || 'published',
      aiReady: !!m.altText,
      metaInfo: m.caption || m.transcript || 'Polar visual archive',
      heroImage: m.url,
      rawItem: m
    })),
    ...activities.map(a => ({
      id: a.id,
      type: 'activity',
      typeLabel: 'Institutional Outreach',
      title: a.title,
      region: 'Antarctica',
      year: 2024,
      authorOrChief: a.type || 'Smart Education',
      status: a.status || 'published',
      aiReady: !!a.aiGeneratedContent,
      metaInfo: a.date || 'August 2024',
      heroImage: 'https://images.unsplash.com/photo-1517999144091-3d9dca6d1e43?auto=format&fit=crop&w=600&q=80',
      rawItem: a
    }))
  ];

  const getTypeIcon = (type) => {
    switch (type) {
      case 'report': return <FileText size={11} />;
      case 'dataset': return <Database size={11} />;
      case 'publication': return <BookOpen size={11} />;
      case 'photo': return <ImageIcon size={11} />;
      case 'video': return <Video size={11} />;
      case 'activity': return <Calendar size={11} />;
      default: return <FileText size={11} />;
    }
  };

  const getRegionClass = (region) => {
    switch (region) {
      case 'Antarctica': return 'badge-antarctica';
      case 'Arctic': return 'badge-arctic';
      case 'Himalaya': return 'badge-himalaya';
      case 'Southern Ocean': return 'badge-ocean';
      default: return 'badge-antarctica';
    }
  };

  const filteredArchives = unifiedArchives.filter(item => {
    if (activeTab !== 'all') {
      if (activeTab === 'reports' && item.type !== 'report') return false;
      if (activeTab === 'datasets' && item.type !== 'dataset') return false;
      if (activeTab === 'publications' && item.type !== 'publication') return false;
      if (activeTab === 'photos' && item.type !== 'photo') return false;
      if (activeTab === 'videos' && item.type !== 'video') return false;
      if (activeTab === 'activities' && item.type !== 'activity') return false;
    }
    if (filterRegion !== 'All' && item.region !== filterRegion) return false;
    if (filterStatus !== 'All' && item.status !== filterStatus) return false;
    if (searchTable.trim()) {
      const q = searchTable.toLowerCase();
      return item.title.toLowerCase().includes(q) || item.authorOrChief.toLowerCase().includes(q) || item.typeLabel.toLowerCase().includes(q);
    }
    return true;
  });

  const toggleStatus = (item) => {
    const nextStatus = item.status === 'published' ? 'draft' : 'published';
    if (item.type === 'report') updateExpedition(item.id, { status: nextStatus });
    else if (item.type === 'dataset') updateDataset(item.id, { status: nextStatus });
    else if (item.type === 'publication') updatePublication(item.id, { status: nextStatus });
    else if (item.type === 'photo' || item.type === 'video') updateMediaArchive(item.id, { status: nextStatus });
    else if (item.type === 'activity') updateActivity(item.id, { status: nextStatus });
  };

  const handleDelete = (item) => {
    if (window.confirm(`Are you sure you want to delete "${item.title}" from the national archive?`)) {
      if (item.type === 'report') deleteExpedition(item.id);
      else if (item.type === 'dataset') deleteDataset(item.id);
      else if (item.type === 'publication') deletePublication(item.id);
      else if (item.type === 'photo' || item.type === 'video') deleteMediaArchive(item.id);
      else if (item.type === 'activity') deleteActivity(item.id);
    }
  };

  return (
    <div className="container admin-dashboard-page">
      {/* Top Banner */}
      <div className="admin-header-row">
        <div>
          <div className="section-eyebrow">NCPOR POLAR OUTREACH & CONTENT STUDIO</div>
          <h1 className="page-title">Science Archival & AI Studio</h1>
          <p className="page-sub">
            Logged in as <strong>{auth.user?.name || 'Dr. Arvind Shrivastava'}</strong> ({auth.user?.department || 'Outreach & Polar Science Division'})
          </p>
        </div>

        <div className="admin-header-actions">
          <div className="admin-primary-actions-row">
            <button 
              className="btn-selective-ai-header"
              onClick={() => navigateTo('admin-selective-ai')}
              title="Synthesize targeted outreach releases from selected data chunks"
            >
              <Layers size={16} />
              <span>Selective AI Studio</span>
            </button>
            <button 
              className="btn-primary-upload"
              onClick={() => navigateTo('admin-upload')}
            >
              <UploadCloud size={18} />
              <span>Upload New Polar Asset</span>
            </button>
          </div>
          <button 
            className="btn-secondary btn-reset-seed"
            onClick={() => {
              if (window.confirm("Reset all portal data back to original authentic polar datasets?")) {
                resetToDefaultData();
              }
            }}
            title="Reset to default seed data"
          >
            <RotateCcw size={14} />
            <span>Reset Seed Data</span>
          </button>
        </div>
      </div>

      {/* Upload Focus Action Cards */}
      <div className="upload-focus-banner glass-panel">
        <div className="upload-focus-header">
          <div className="upload-focus-title">
            <UploadCloud size={20} className="pulse-glow" />
            <h3>Polar Archival Ingestion Center</h3>
          </div>
          <span className="upload-focus-sub">Choose a complete expedition pipeline or upload individual publications and scientific datasets:</span>
        </div>

        <div className="quick-upload-grid three-col">
          <div className="quick-upload-card highlighted-card" onClick={() => navigateTo('admin-upload-expedition')}>
            <div className="quick-icon-box bg-blue">
              <Compass size={20} />
            </div>
            <div className="quick-card-text">
              <h4>Complete Expedition Pipeline</h4>
              <p>Expedition → Media Gallery (Photos & Videos) → Publications</p>
            </div>
            <span className="btn-quick-plus"><Plus size={14} /></span>
          </div>

          <div className="quick-upload-card" onClick={() => navigateTo('admin-upload-publications')}>
            <div className="quick-icon-box bg-amber">
              <BookOpen size={20} />
            </div>
            <div className="quick-card-text">
              <h4>Publications & Papers</h4>
              <p>Standalone Peer-reviewed Journals & Bulletins</p>
            </div>
            <span className="btn-quick-plus"><Plus size={14} /></span>
          </div>

          <div className="quick-upload-card" onClick={() => navigateTo('admin-upload-datasets')}>
            <div className="quick-icon-box bg-purple">
              <Database size={20} />
            </div>
            <div className="quick-card-text">
              <h4>Scientific Datasets</h4>
              <p>NetCDF, CSV, GeoJSON & Sensor Telemetry</p>
            </div>
            <span className="btn-quick-plus"><Plus size={14} /></span>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="admin-kpi-grid">
        <div className="glass-panel kpi-card">
          <div className="kpi-icon-box bg-blue">
            <Compass size={22} />
          </div>
          <div>
            <div className="kpi-val">{totalExpeditions}</div>
            <div className="kpi-lbl">Expedition Missions</div>
          </div>
        </div>

        <div className="glass-panel kpi-card">
          <div className="kpi-icon-box bg-purple">
            <Database size={22} />
          </div>
          <div>
            <div className="kpi-val">{totalDatasets}</div>
            <div className="kpi-lbl">Open Datasets (NetCDF/CSV)</div>
          </div>
        </div>

        <div className="glass-panel kpi-card">
          <div className="kpi-icon-box bg-amber">
            <BookOpen size={22} />
          </div>
          <div>
            <div className="kpi-val">{totalPublications}</div>
            <div className="kpi-lbl">Peer-Reviewed Papers</div>
          </div>
        </div>

        <div className="glass-panel kpi-card">
          <div className="kpi-icon-box bg-cyan">
            <ImageIcon size={22} />
          </div>
          <div>
            <div className="kpi-val">{totalMedia}</div>
            <div className="kpi-lbl">WCAG-AA Alt Media</div>
          </div>
        </div>

        <div className="glass-panel kpi-card">
          <div className="kpi-icon-box bg-green">
            <Sparkles size={22} />
          </div>
          <div>
            <div className="kpi-val">{aiGeneratedCount}</div>
            <div className="kpi-lbl">AI Outreach Packs Ready</div>
          </div>
        </div>
      </div>

      {/* Universal Multi-Asset Archive Table */}
      <div className="glass-panel table-card">
        {/* Tab Filters for 6 Pillars */}
        <div className="archive-tab-bar">
          <button className={`archive-tab-btn ${activeTab === 'all' ? 'active' : ''}`} onClick={() => setActiveTab('all')}>
            <Layers size={14} className="tab-icon" />
            <span>All Archives</span>
            <span className="tab-pill-badge">{unifiedArchives.length}</span>
          </button>
          <button className={`archive-tab-btn ${activeTab === 'reports' ? 'active' : ''}`} onClick={() => setActiveTab('reports')}>
            <FileText size={14} className="tab-icon" />
            <span>Reports</span>
            <span className="tab-pill-badge">{expeditions.length}</span>
          </button>
          <button className={`archive-tab-btn ${activeTab === 'datasets' ? 'active' : ''}`} onClick={() => setActiveTab('datasets')}>
            <Database size={14} className="tab-icon" />
            <span>Datasets</span>
            <span className="tab-pill-badge">{datasets.length}</span>
          </button>
          <button className={`archive-tab-btn ${activeTab === 'publications' ? 'active' : ''}`} onClick={() => setActiveTab('publications')}>
            <BookOpen size={14} className="tab-icon" />
            <span>Publications</span>
            <span className="tab-pill-badge">{publications.length}</span>
          </button>
          <button className={`archive-tab-btn ${activeTab === 'photos' ? 'active' : ''}`} onClick={() => setActiveTab('photos')}>
            <ImageIcon size={14} className="tab-icon" />
            <span>Photos</span>
            <span className="tab-pill-badge">{mediaArchives.filter(m => m.type === 'photo').length}</span>
          </button>
          <button className={`archive-tab-btn ${activeTab === 'videos' ? 'active' : ''}`} onClick={() => setActiveTab('videos')}>
            <Video size={14} className="tab-icon" />
            <span>Videos</span>
            <span className="tab-pill-badge">{mediaArchives.filter(m => m.type === 'video').length}</span>
          </button>
          <button className={`archive-tab-btn ${activeTab === 'activities' ? 'active' : ''}`} onClick={() => setActiveTab('activities')}>
            <Calendar size={14} className="tab-icon" />
            <span>Activities</span>
            <span className="tab-pill-badge">{activities.length}</span>
          </button>
        </div>

        <div className="table-toolbar">
          <div className="table-title-wrap">
            <h3>Archived Polar Assets & AI Lifecycle</h3>
            <p>Inspect raw reports, generate multi-platform social campaigns, and publish live to citizens and researchers.</p>
          </div>

          <div className="table-filters">
            <div className="table-search-wrap">
              <Search size={15} className="table-search-icon" />
              <input 
                type="text" 
                placeholder="Search archives by keyword, author, type..."
                value={searchTable}
                onChange={(e) => setSearchTable(e.target.value)}
                className="table-search-input"
              />
              {searchTable && (
                <button className="table-search-clear" onClick={() => setSearchTable('')} title="Clear search">
                  <X size={13} />
                </button>
              )}
            </div>

            <select 
              value={filterRegion} 
              onChange={(e) => setFilterRegion(e.target.value)}
              className="table-select"
            >
              <option value="All">All Regions</option>
              <option value="Antarctica">Antarctica</option>
              <option value="Arctic">Arctic</option>
              <option value="Himalaya">Himalaya</option>
              <option value="Southern Ocean">Southern Ocean</option>
            </select>

            <select 
              value={filterStatus} 
              onChange={(e) => setFilterStatus(e.target.value)}
              className="table-select"
            >
              <option value="All">All Statuses</option>
              <option value="published">Published</option>
              <option value="draft">Draft Review</option>
            </select>
          </div>
        </div>

        {/* Desktop Table View */}
        <div className="table-responsive desktop-table-view">
          <table className="admin-table">
            <thead>
              <tr>
                <th style={{ minWidth: '320px' }}>Asset Title & Type</th>
                <th style={{ minWidth: '150px' }}>Region / Year</th>
                <th style={{ minWidth: '170px' }}>Details / Parameters</th>
                <th style={{ minWidth: '160px' }}>AI Outreach Status</th>
                <th style={{ minWidth: '140px' }}>Live Status</th>
                <th className="text-right" style={{ minWidth: '240px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredArchives.length > 0 ? (
                filteredArchives.map((item) => (
                  <tr key={`${item.type}-${item.id}`}>
                    <td>
                      <div className="table-mission-cell">
                        <img src={item.heroImage} alt={item.title} className="table-thumb" />
                        <div className="table-mission-info">
                          <div className="table-mission-title">{item.title}</div>
                          <div className="table-type-tag">
                            <span className={`pill-type ${item.type}`}>
                              {getTypeIcon(item.type)}
                              <span>{item.typeLabel}</span>
                            </span>
                            <span className="table-mission-reports">{item.metaInfo}</span>
                          </div>
                        </div>
                      </div>
                    </td>

                    <td>
                      <div className="table-region-cell">
                        <span className={`badge ${getRegionClass(item.region)}`}>{item.region}</span>
                        <span className="table-year-text">{item.year}</span>
                      </div>
                    </td>

                    <td>
                      <span className="table-scientist-text">{item.authorOrChief}</span>
                    </td>

                    <td>
                      {item.aiReady ? (
                        <div className="ai-status-badge ready" title="AI summary, social pack, and alt text generated">
                          <Sparkles size={13} />
                          <span>Ready (AI Pack)</span>
                        </div>
                      ) : (
                        <div className="ai-status-badge pending" title="Needs AI generation">
                          <AlertCircle size={13} />
                          <span>Pending Generation</span>
                        </div>
                      )}
                    </td>

                    <td>
                      <button 
                        className={`status-toggle-btn ${item.status}`}
                        onClick={() => toggleStatus(item)}
                        title="Click to toggle status"
                      >
                        {item.status === 'published' ? (
                          <>
                            <CheckCircle2 size={13} />
                            <span>Published</span>
                          </>
                        ) : (
                          <>
                            <Clock size={13} />
                            <span>Draft Review</span>
                          </>
                        )}
                      </button>
                    </td>

                    <td className="text-right">
                      <div className="action-buttons-group">
                        {/* AI Generate Studio Button */}
                        <button 
                          className="btn-action ai"
                          onClick={() => navigateTo(`admin-generate-${item.id}`)}
                          title="Open AI Content Generation Studio"
                        >
                          <Sparkles size={13} />
                          <span>AI Studio</span>
                        </button>

                        {/* Selective Chunk AI Button */}
                        <button 
                          className="btn-action selective-ai"
                          onClick={() => navigateTo(`admin-selective-ai-${item.id}`)}
                          title="Synthesize targeted output from selected chunks"
                        >
                          <Layers size={13} />
                          <span>Chunk AI</span>
                        </button>

                        {/* Public View */}
                        {item.type === 'report' ? (
                          <button 
                            className="btn-action icon-btn view"
                            onClick={() => onSelectExpedition(item.id)}
                            title="View Public Expedition Page"
                          >
                            <Eye size={14} />
                          </button>
                        ) : (
                          <button 
                            className="btn-action icon-btn view"
                            onClick={() => navigateTo(item.type === 'dataset' || item.type === 'publication' ? 'publications' : 'home')}
                            title="View on Public Portal"
                          >
                            <Eye size={14} />
                          </button>
                        )}

                        {/* Edit */}
                        <button 
                          className="btn-action icon-btn edit"
                          onClick={() => navigateTo(`admin-edit-${item.id}`)}
                          title="Edit Asset"
                        >
                          <Edit size={14} />
                        </button>

                        {/* Delete */}
                        <button 
                          className="btn-action icon-btn delete"
                          onClick={() => handleDelete(item)}
                          title="Delete from Archive"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="table-empty-row">
                    <div className="empty-table-content">
                      <Search size={24} className="empty-table-icon" />
                      <p>No archived records match your filter criteria.</p>
                      <button 
                        className="btn-table-reset"
                        onClick={() => {
                          setSearchTable('');
                          setFilterRegion('All');
                          setFilterStatus('All');
                          setActiveTab('all');
                        }}
                      >
                        Reset Filters
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Responsive Cards View */}
        <div className="admin-mobile-cards-view">
          {filteredArchives.length > 0 ? (
            filteredArchives.map((item) => (
              <div className="admin-mobile-card" key={`mob-${item.type}-${item.id}`}>
                {/* Header: Thumbnail + Title + Type + Region/Year */}
                <div className="mobile-card-header">
                  <img src={item.heroImage} alt={item.title} className="mobile-card-thumb" />
                  <div className="mobile-card-info">
                    <div className="mobile-card-type-tags">
                      <span className={`pill-type ${item.type}`}>
                        {getTypeIcon(item.type)}
                        <span>{item.typeLabel}</span>
                      </span>
                      <span className={`badge ${getRegionClass(item.region)}`}>{item.region}</span>
                      {item.year && <span className="mobile-card-year">{item.year}</span>}
                    </div>
                    <h4 className="mobile-card-title">{item.title}</h4>
                    {item.metaInfo && <div className="mobile-card-meta">{item.metaInfo}</div>}
                  </div>
                </div>

                {/* Details / Lead Scientist */}
                {item.authorOrChief && (
                  <div className="mobile-card-author-row">
                    <span className="mobile-card-lbl">Lead / Params:</span>
                    <span className="mobile-card-val">{item.authorOrChief}</span>
                  </div>
                )}

                {/* Status Row */}
                <div className="mobile-card-status-row">
                  <div className="mobile-status-item">
                    {item.aiReady ? (
                      <div className="ai-status-badge ready" title="AI summary, social pack, and alt text generated">
                        <Sparkles size={12} />
                        <span>Ready (AI Pack)</span>
                      </div>
                    ) : (
                      <div className="ai-status-badge pending" title="Needs AI generation">
                        <AlertCircle size={12} />
                        <span>Pending AI</span>
                      </div>
                    )}
                  </div>

                  <div className="mobile-status-item">
                    <button 
                      className={`status-toggle-btn ${item.status}`}
                      onClick={() => toggleStatus(item)}
                      title="Click to toggle status"
                    >
                      {item.status === 'published' ? (
                        <>
                          <CheckCircle2 size={12} />
                          <span>Published</span>
                        </>
                      ) : (
                        <>
                          <Clock size={12} />
                          <span>Draft Review</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Actions Row */}
                <div className="mobile-card-actions">
                  <button 
                    className="btn-action ai"
                    onClick={() => navigateTo(`admin-generate-${item.id}`)}
                    title="Open AI Studio"
                  >
                    <Sparkles size={13} />
                    <span>AI Studio</span>
                  </button>

                  <button 
                    className="btn-action selective-ai"
                    onClick={() => navigateTo(`admin-selective-ai-${item.id}`)}
                    title="Selective Chunk AI"
                  >
                    <Layers size={13} />
                    <span>Chunk AI</span>
                  </button>

                  <div className="mobile-card-icon-actions">
                    {item.type === 'report' ? (
                      <button 
                        className="btn-action icon-btn view"
                        onClick={() => onSelectExpedition(item.id)}
                        title="View Public Expedition"
                      >
                        <Eye size={14} />
                      </button>
                    ) : (
                      <button 
                        className="btn-action icon-btn view"
                        onClick={() => navigateTo(item.type === 'dataset' || item.type === 'publication' ? 'publications' : 'home')}
                        title="View on Portal"
                      >
                        <Eye size={14} />
                      </button>
                    )}

                    <button 
                      className="btn-action icon-btn edit"
                      onClick={() => navigateTo(`admin-edit-${item.id}`)}
                      title="Edit Asset"
                    >
                      <Edit size={14} />
                    </button>

                    <button 
                      className="btn-action icon-btn delete"
                      onClick={() => handleDelete(item)}
                      title="Delete Asset"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="empty-table-content" style={{ padding: '2rem 1rem' }}>
              <Search size={24} className="empty-table-icon" />
              <p>No archived records match your filter criteria.</p>
              <button 
                className="btn-table-reset"
                onClick={() => {
                  setSearchTable('');
                  setFilterRegion('All');
                  setFilterStatus('All');
                  setActiveTab('all');
                }}
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .admin-dashboard-page {
          padding: 2.5rem 1.5rem 5rem;
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .admin-header-row {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .admin-header-actions {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          flex-wrap: wrap;
        }

        .admin-primary-actions-row {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .btn-selective-ai-header {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: #ecfdf5;
          color: #047857;
          border: 1px solid #a7f3d0;
          font-weight: 700;
          padding: 0.65rem 1.15rem;
          border-radius: var(--radius-sm);
          cursor: pointer;
          font-size: 0.88rem;
          box-shadow: var(--shadow-sm);
          transition: all 0.15s ease;
        }

        .btn-selective-ai-header:hover {
          background: #d1fae5;
          color: #065f46;
          border-color: #6ee7b7;
          transform: translateY(-1px);
        }

        .btn-primary-upload {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: var(--navy);
          color: #ffffff;
          font-weight: 700;
          padding: 0.65rem 1.25rem;
          border-radius: var(--radius-sm);
          border: none;
          cursor: pointer;
          font-size: 0.88rem;
          box-shadow: var(--shadow-sm);
          transition: all 0.15s ease;
        }

        .btn-primary-upload:hover {
          background: #0d3153;
          transform: translateY(-1px);
        }

        /* Upload Focus Banner */
        .upload-focus-banner {
          padding: 1.5rem;
          border-radius: var(--radius-md);
          background: #ffffff;
          border: 1px solid var(--border-card);
          box-shadow: var(--shadow-sm);
        }

        .upload-focus-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1.25rem;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .upload-focus-title {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: var(--navy);
        }

        .upload-focus-title h3 {
          font-size: 1.15rem;
          color: var(--navy);
          margin: 0;
          font-weight: 700;
        }

        .upload-focus-sub {
          font-size: 0.78rem;
          color: var(--text-muted);
        }

        .quick-upload-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1rem;
        }

        .quick-upload-card {
          display: flex;
          align-items: center;
          gap: 0.85rem;
          padding: 0.85rem 1rem;
          background: #f8fafc;
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-sm);
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .quick-upload-card:hover {
          background: #ffffff;
          border-color: #cbd5e1;
          transform: translateY(-2px);
          box-shadow: var(--shadow-sm);
        }

        .quick-card-text {
          flex: 1;
        }

        .quick-card-text h4 {
          font-size: 0.85rem;
          color: var(--navy);
          margin: 0;
          font-weight: 700;
        }

        .quick-card-text p {
          font-size: 0.7rem;
          color: var(--text-muted);
          margin: 0;
        }

        .btn-quick-plus {
          width: 26px;
          height: 26px;
          border-radius: 50%;
          background: #e2e8f0;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--navy);
        }

        .quick-upload-card:hover .btn-quick-plus {
          background: var(--navy);
          color: #ffffff;
        }

        /* KPI Grid */
        .admin-kpi-grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 1.25rem;
        }

        .kpi-card {
          padding: 1.25rem;
          display: flex;
          align-items: center;
          gap: 1rem;
          background: #ffffff;
          border: 1px solid var(--border-card);
          box-shadow: var(--shadow-sm);
          border-radius: var(--radius-md);
        }

        .quick-icon-box {
          width: 38px;
          height: 38px;
          border-radius: 9px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          border: none !important;
        }

        .kpi-icon-box {
          width: 46px;
          height: 46px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          border: none !important;
        }

        .bg-blue {
          background: #eff6ff;
          color: #0284c7;
          border: none;
        }

        .bg-green {
          background: #ecfdf5;
          color: #059669;
          border: none;
        }

        .bg-purple {
          background: #f5f3ff;
          color: #7c3aed;
          border: none;
        }

        .bg-amber {
          background: #fffbeb;
          color: #d97706;
          border: none;
        }

        .bg-cyan {
          background: #f0fdf4;
          color: #16a34a;
          border: none;
        }

        .bg-red {
          background: #fef2f2;
          color: #dc2626;
          border: none;
        }

        .kpi-val {
          font-family: var(--font-heading);
          font-size: 1.6rem;
          font-weight: 800;
          color: var(--navy);
          line-height: 1.1;
        }

        .kpi-lbl {
          font-size: 0.72rem;
          color: var(--text-muted);
          font-weight: 600;
        }

        /* Table Card & Tab Bar */
        .table-card {
          padding: 1.5rem 1.75rem;
          border-radius: var(--radius-md);
          background: #ffffff;
          border: 1px solid var(--border-card);
          box-shadow: var(--shadow-sm);
        }

        .archive-tab-bar {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          border-bottom: 1px solid #e2e8f0;
          padding-bottom: 0.85rem;
          margin-bottom: 1.25rem;
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
          scrollbar-width: none;
        }

        .archive-tab-bar::-webkit-scrollbar {
          display: none;
        }

        .archive-tab-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.45rem;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          color: var(--text-secondary);
          padding: 0.45rem 0.85rem;
          border-radius: var(--radius-sm);
          font-size: 0.82rem;
          font-weight: 600;
          cursor: pointer;
          white-space: nowrap;
          transition: all 0.15s ease;
        }

        .archive-tab-btn .tab-icon {
          color: #64748b;
          flex-shrink: 0;
        }

        .archive-tab-btn:hover {
          color: var(--navy);
          background: #f1f5f9;
          border-color: #cbd5e1;
        }

        .archive-tab-btn.active {
          background: #0f172a;
          color: #ffffff;
          border-color: #0f172a;
        }

        .archive-tab-btn.active .tab-icon {
          color: #6ee7b7;
        }

        .tab-pill-badge {
          background: #e2e8f0;
          color: #334155;
          font-size: 0.72rem;
          font-weight: 700;
          padding: 0.1rem 0.45rem;
          border-radius: var(--radius-full);
          transition: all 0.15s ease;
        }

        .archive-tab-btn.active .tab-pill-badge {
          background: rgba(255, 255, 255, 0.2);
          color: #ffffff;
        }

        .table-toolbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1.5rem;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .table-title-wrap h3 {
          font-size: 1.25rem;
          color: var(--navy);
          margin-bottom: 0.25rem;
          font-weight: 700;
        }

        .table-title-wrap p {
          font-size: 0.85rem;
          color: var(--text-muted);
          margin: 0;
        }

        .table-filters {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          flex-wrap: wrap;
        }

        .table-search-wrap {
          position: relative;
          display: flex;
          align-items: center;
          min-width: 280px;
        }

        .table-search-icon {
          position: absolute;
          left: 0.85rem;
          color: var(--text-muted);
          pointer-events: none;
        }

        .table-search-input {
          background: #f8fafc;
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-sm);
          color: var(--text-primary);
          padding: 0.55rem 2rem 0.55rem 2.4rem;
          font-size: 0.84rem;
          width: 100%;
          transition: all 0.15s ease;
        }

        .table-search-input:focus {
          outline: none;
          border-color: #059669;
          background: #ffffff;
          box-shadow: 0 0 0 3px rgba(5, 150, 105, 0.12);
        }

        .table-search-clear {
          position: absolute;
          right: 0.65rem;
          background: #e2e8f0;
          border: none;
          color: #64748b;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }

        .table-search-clear:hover {
          background: #cbd5e1;
          color: #0f172a;
        }

        .table-select {
          background: #f8fafc;
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-sm);
          color: var(--text-secondary);
          padding: 0.55rem 0.85rem;
          font-size: 0.84rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .table-select:focus {
          outline: none;
          border-color: #059669;
        }

        .table-responsive {
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
          border-radius: var(--radius-sm);
          border: 1px solid #e2e8f0;
        }

        .admin-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
          font-size: 0.85rem;
        }

        .admin-table th {
          padding: 0.9rem 1.1rem;
          color: #475569;
          font-weight: 700;
          text-transform: uppercase;
          font-size: 0.72rem;
          letter-spacing: 0.05em;
          border-bottom: 1px solid #e2e8f0;
          background: #f8fafc;
          white-space: nowrap;
        }

        .admin-table td {
          padding: 1.1rem 1.1rem;
          border-bottom: 1px solid #f1f5f9;
          vertical-align: middle;
          background: #ffffff;
        }

        .admin-table tbody tr:hover td {
          background: #f8fafc;
        }

        .table-mission-cell {
          display: flex;
          align-items: center;
          gap: 0.85rem;
        }

        .table-thumb {
          width: 48px;
          height: 48px;
          border-radius: 8px;
          object-fit: cover;
          flex-shrink: 0;
          background: #f1f5f9;
          border: 1px solid #e2e8f0;
        }

        .table-mission-info {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .table-mission-title {
          font-weight: 700;
          color: var(--navy);
          line-height: 1.3;
          font-size: 0.92rem;
        }

        .table-type-tag {
          display: flex;
          align-items: center;
          gap: 0.45rem;
          flex-wrap: wrap;
        }

        .pill-type {
          display: inline-flex;
          align-items: center;
          gap: 0.3rem;
          font-size: 0.7rem;
          font-weight: 700;
          padding: 2px 7px;
          border-radius: 4px;
        }

        .pill-type.report { background: #eff6ff; color: #1d4ed8; border: 1px solid #bfdbfe; }
        .pill-type.dataset { background: #f5f3ff; color: #6d28d9; border: 1px solid #ddd6fe; }
        .pill-type.publication { background: #fffbeb; color: #b45309; border: 1px solid #fde68a; }
        .pill-type.photo { background: #f0fdfa; color: #0f766e; border: 1px solid #99f6e4; }
        .pill-type.video { background: #fef2f2; color: #b91c1c; border: 1px solid #fecaca; }
        .pill-type.activity { background: #ecfdf5; color: #047857; border: 1px solid #a7f3d0; }

        .table-mission-reports {
          font-size: 0.75rem;
          color: #64748b;
        }

        .table-region-cell {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .table-year-text {
          font-size: 0.82rem;
          color: #64748b;
          font-weight: 500;
        }

        .table-scientist-text {
          color: var(--text-secondary);
          font-size: 0.84rem;
          font-weight: 500;
        }

        .ai-status-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          padding: 0.3rem 0.7rem;
          border-radius: var(--radius-full);
          font-size: 0.74rem;
          font-weight: 600;
          white-space: nowrap;
        }

        .ai-status-badge.ready {
          background: #eff6ff;
          color: #0284c7;
          border: 1px solid #bfdbfe;
        }

        .ai-status-badge.pending {
          background: #fffbeb;
          color: #b45309;
          border: 1px solid #fde68a;
        }

        .status-toggle-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          padding: 0.3rem 0.7rem;
          border-radius: var(--radius-full);
          font-size: 0.76rem;
          font-weight: 600;
          cursor: pointer;
          border: none;
          transition: all 0.15s ease;
          white-space: nowrap;
        }

        .status-toggle-btn.published {
          background: #ecfdf5;
          color: #047857;
          border: 1px solid #a7f3d0;
        }

        .status-toggle-btn.published:hover {
          background: #d1fae5;
        }

        .status-toggle-btn.draft {
          background: #fffbeb;
          color: #b45309;
          border: 1px solid #fde68a;
        }

        .status-toggle-btn.draft:hover {
          background: #fef3c7;
        }

        .action-buttons-group {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 0.35rem;
          white-space: nowrap;
        }

        .btn-action {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          padding: 0.4rem 0.7rem;
          border-radius: var(--radius-sm);
          font-size: 0.78rem;
          font-weight: 600;
          cursor: pointer;
          border: 1px solid transparent;
          transition: all 0.15s ease;
        }

        .btn-action.ai {
          background: #eff6ff;
          border-color: #bfdbfe;
          color: #0369a1;
        }

        .btn-action.ai:hover {
          background: #0284c7;
          color: #ffffff;
          border-color: #0284c7;
        }

        .btn-action.selective-ai {
          background: #ecfdf5;
          border-color: #a7f3d0;
          color: #047857;
        }

        .btn-action.selective-ai:hover {
          background: #059669;
          color: #ffffff;
          border-color: #059669;
        }

        .btn-action.icon-btn {
          padding: 0.4rem 0.5rem;
        }

        .btn-action.view {
          background: #f8fafc;
          border: 1px solid var(--border-subtle);
          color: var(--text-secondary);
        }

        .btn-action.view:hover {
          background: #f1f5f9;
          color: var(--navy);
          border-color: #94a3b8;
        }

        .btn-action.edit {
          background: #e0f2fe;
          color: #0369a1;
          border-color: #bae6fd;
        }

        .btn-action.edit:hover {
          background: #bae6fd;
          color: #0284c7;
        }

        .btn-action.delete {
          background: #fef2f2;
          color: #dc2626;
          border-color: #fecaca;
        }

        .btn-action.delete:hover {
          background: #fee2e2;
          color: #b91c1c;
        }

        .desktop-table-view {
          display: block;
        }

        .admin-mobile-cards-view {
          display: none;
        }

        .admin-mobile-card {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: var(--radius-md);
          padding: 0.85rem;
          display: flex;
          flex-direction: column;
          gap: 0.65rem;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
          transition: all 0.15s ease;
        }

        .admin-mobile-card:hover {
          border-color: #cbd5e1;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.07);
        }

        .mobile-card-header {
          display: flex;
          gap: 0.75rem;
          align-items: flex-start;
        }

        .mobile-card-thumb {
          width: 52px;
          height: 52px;
          border-radius: 8px;
          object-fit: cover;
          flex-shrink: 0;
          background: #f1f5f9;
          border: 1px solid #e2e8f0;
        }

        .mobile-card-info {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          flex: 1;
          min-width: 0;
        }

        .mobile-card-type-tags {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          flex-wrap: wrap;
        }

        .mobile-card-year {
          font-size: 0.72rem;
          color: #64748b;
          font-weight: 600;
          background: #f1f5f9;
          padding: 1px 6px;
          border-radius: 4px;
        }

        .mobile-card-title {
          font-size: 0.88rem;
          font-weight: 700;
          color: var(--navy);
          line-height: 1.3;
          margin: 0;
          word-break: break-word;
        }

        .mobile-card-meta {
          font-size: 0.74rem;
          color: #64748b;
        }

        .mobile-card-author-row {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.75rem;
          background: #f8fafc;
          padding: 0.35rem 0.6rem;
          border-radius: 6px;
          border: 1px solid #f1f5f9;
          word-break: break-word;
        }

        .mobile-card-lbl {
          color: #64748b;
          font-weight: 500;
          flex-shrink: 0;
        }

        .mobile-card-val {
          color: var(--navy);
          font-weight: 600;
        }

        .mobile-card-status-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.5rem;
          flex-wrap: wrap;
          padding-top: 0.15rem;
        }

        .mobile-card-actions {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.4rem;
          padding-top: 0.5rem;
          border-top: 1px solid #f1f5f9;
          flex-wrap: wrap;
        }

        .mobile-card-actions .btn-action.ai,
        .mobile-card-actions .btn-action.selective-ai {
          flex: 1;
          justify-content: center;
          min-height: 34px;
          padding: 0.35rem 0.5rem;
          font-size: 0.74rem;
        }

        .mobile-card-icon-actions {
          display: flex;
          align-items: center;
          gap: 0.3rem;
        }

        .mobile-card-icon-actions .btn-action.icon-btn {
          width: 34px;
          height: 34px;
          padding: 0;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }

        .table-empty-row {
          text-align: center;
          padding: 3rem 1rem !important;
        }

        .empty-table-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.6rem;
          color: #64748b;
        }

        .empty-table-icon {
          color: #94a3b8;
        }

        .btn-table-reset {
          background: #0f172a;
          color: #ffffff;
          border: none;
          font-size: 0.8rem;
          font-weight: 600;
          padding: 0.45rem 1rem;
          border-radius: var(--radius-sm);
          cursor: pointer;
        }

        .btn-table-reset:hover {
          background: #1e293b;
        }

        .text-right {
          text-align: right;
        }

        @media (max-width: 1100px) {
          .quick-upload-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          .admin-kpi-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        @media (max-width: 768px) {
          .admin-dashboard-page {
            padding: 1.25rem 0.75rem 3.5rem;
            gap: 1.25rem;
          }
          .admin-header-row {
            flex-direction: column;
            align-items: flex-start;
            gap: 1rem;
          }
          .admin-header-actions {
            width: 100%;
            display: flex;
            flex-direction: column;
            gap: 0.6rem;
          }
          .admin-primary-actions-row {
            width: 100%;
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 0.6rem;
          }
          .admin-primary-actions-row button {
            width: 100%;
            min-height: 44px;
            padding: 0.55rem 0.5rem;
            font-size: clamp(0.74rem, 2.4vw, 0.85rem);
            justify-content: center;
            text-align: center;
            white-space: nowrap;
          }
          .btn-reset-seed {
            width: 100%;
            min-height: 42px;
            justify-content: center;
          }
          .upload-focus-banner {
            padding: 1rem 0.85rem;
          }
          .quick-upload-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 0.75rem;
          }
          .quick-upload-card {
            padding: 0.75rem 0.75rem;
            gap: 0.65rem;
          }
          .admin-kpi-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 0.75rem;
          }
          .admin-kpi-grid .kpi-card:last-child {
            grid-column: span 2;
          }
          .kpi-card {
            padding: 0.85rem;
            gap: 0.75rem;
          }
          .kpi-val {
            font-size: 1.4rem;
          }
          .table-card {
            padding: 1rem 0.75rem;
          }
          .table-toolbar {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.85rem;
          }
          .table-filters {
            width: 100%;
            flex-direction: column;
            align-items: stretch;
          }
          .table-search-wrap {
            width: 100%;
            min-width: 0;
          }
          .table-search-input {
            width: 100%;
          }
          .table-select {
            width: 100%;
          }
          .desktop-table-view {
            display: none !important;
          }
          .admin-mobile-cards-view {
            display: flex;
            flex-direction: column;
            gap: 0.75rem;
            width: 100%;
          }
        }

        @media (max-width: 480px) {
          .admin-primary-actions-row {
            grid-template-columns: repeat(2, 1fr);
            gap: 0.45rem;
          }
          .admin-primary-actions-row button {
            min-height: 40px;
            padding: 0.45rem 0.35rem;
            font-size: 0.72rem;
            gap: 0.35rem;
          }
          .btn-reset-seed {
            min-height: 38px;
            font-size: 0.76rem;
          }
          .quick-upload-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 0.5rem;
          }
          .quick-upload-card {
            padding: 0.65rem 0.5rem;
            gap: 0.45rem;
          }
          .quick-icon-box {
            width: 32px;
            height: 32px;
            min-width: 32px;
          }
          .quick-card-text h4 {
            font-size: 0.76rem;
            line-height: 1.2;
          }
          .quick-card-text p {
            font-size: 0.62rem;
            line-height: 1.25;
          }
          .btn-quick-plus {
            display: none;
          }
          .admin-kpi-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 0.5rem;
          }
          .admin-kpi-grid .kpi-card:last-child {
            grid-column: span 2;
          }
          .kpi-card {
            padding: 0.65rem 0.6rem;
            gap: 0.55rem;
          }
          .kpi-icon-box {
            width: 34px;
            height: 34px;
            min-width: 34px;
            border-radius: 8px;
          }
          .kpi-val {
            font-size: 1.2rem;
          }
          .kpi-lbl {
            font-size: 0.64rem;
            line-height: 1.2;
          }
          .mobile-card-actions .btn-action.ai,
          .mobile-card-actions .btn-action.selective-ai {
            font-size: 0.7rem;
            padding: 0.35rem 0.35rem;
            gap: 0.25rem;
          }
          .mobile-card-icon-actions .btn-action.icon-btn {
            width: 30px;
            height: 30px;
          }
        }
      `}</style>
    </div>
  );
}
