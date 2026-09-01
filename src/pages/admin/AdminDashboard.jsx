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
  AlertCircle
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
      heroImage: 'https://images.unsplash.com/photo-1508873696983-2df5293cb32f?auto=format&fit=crop&w=600&q=80',
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
          <button 
            className="btn-primary-upload"
            onClick={() => navigateTo('admin-upload')}
          >
            <UploadCloud size={18} />
            <span>Upload New Polar Asset</span>
          </button>
          <button 
            className="btn-secondary"
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

      {/* Upload Focus Action Cards: 6 Problem Statement Pillars */}
      <div className="upload-focus-banner glass-panel">
        <div className="upload-focus-header">
          <div className="upload-focus-title">
            <UploadCloud size={20} className="pulse-glow" />
            <h3>Quick Archival Ingestion Center</h3>
          </div>
          <span className="upload-focus-sub">Select an asset type to upload and trigger AI content generation:</span>
        </div>

        <div className="quick-upload-grid">
          <div className="quick-upload-card" onClick={() => navigateTo('admin-upload-reports')}>
            <div className="quick-icon-box bg-blue">
              <FileText size={20} />
            </div>
            <div className="quick-card-text">
              <h4>Expedition Reports</h4>
              <p>PDF/DOCX Cruise Reports & Logs</p>
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

          <div className="quick-upload-card" onClick={() => navigateTo('admin-upload-publications')}>
            <div className="quick-icon-box bg-amber">
              <BookOpen size={20} />
            </div>
            <div className="quick-card-text">
              <h4>Publications & Papers</h4>
              <p>Peer-reviewed Journals & Bulletins</p>
            </div>
            <span className="btn-quick-plus"><Plus size={14} /></span>
          </div>

          <div className="quick-upload-card" onClick={() => navigateTo('admin-upload-photos')}>
            <div className="quick-icon-box bg-cyan">
              <ImageIcon size={20} />
            </div>
            <div className="quick-card-text">
              <h4>Photographs (WCAG-AA)</h4>
              <p>High-Res Field Imagery with AI Alt-Tags</p>
            </div>
            <span className="btn-quick-plus"><Plus size={14} /></span>
          </div>

          <div className="quick-upload-card" onClick={() => navigateTo('admin-upload-videos')}>
            <div className="quick-icon-box bg-red">
              <Video size={20} />
            </div>
            <div className="quick-card-text">
              <h4>Videos & Drone Logs</h4>
              <p>Field Documentary & Transcripts</p>
            </div>
            <span className="btn-quick-plus"><Plus size={14} /></span>
          </div>

          <div className="quick-upload-card" onClick={() => navigateTo('admin-upload-activities')}>
            <div className="quick-icon-box bg-green">
              <Calendar size={20} />
            </div>
            <div className="quick-card-text">
              <h4>Institutional Activities</h4>
              <p>School Outreach, Webinars & Events</p>
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
            All Archives ({unifiedArchives.length})
          </button>
          <button className={`archive-tab-btn ${activeTab === 'reports' ? 'active' : ''}`} onClick={() => setActiveTab('reports')}>
            📑 Reports ({expeditions.length})
          </button>
          <button className={`archive-tab-btn ${activeTab === 'datasets' ? 'active' : ''}`} onClick={() => setActiveTab('datasets')}>
            📊 Datasets ({datasets.length})
          </button>
          <button className={`archive-tab-btn ${activeTab === 'publications' ? 'active' : ''}`} onClick={() => setActiveTab('publications')}>
            📚 Publications ({publications.length})
          </button>
          <button className={`archive-tab-btn ${activeTab === 'photos' ? 'active' : ''}`} onClick={() => setActiveTab('photos')}>
            📷 Photos ({mediaArchives.filter(m => m.type === 'photo').length})
          </button>
          <button className={`archive-tab-btn ${activeTab === 'videos' ? 'active' : ''}`} onClick={() => setActiveTab('videos')}>
            🎥 Videos ({mediaArchives.filter(m => m.type === 'video').length})
          </button>
          <button className={`archive-tab-btn ${activeTab === 'activities' ? 'active' : ''}`} onClick={() => setActiveTab('activities')}>
            🏛️ Activities ({activities.length})
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
                placeholder="Search archives by keyword..."
                value={searchTable}
                onChange={(e) => setSearchTable(e.target.value)}
                className="table-search-input"
              />
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

        <div className="table-responsive">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Asset Title & Type</th>
                <th>Region / Year</th>
                <th>Details / Parameters</th>
                <th>AI Outreach Status</th>
                <th>Live Status</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredArchives.map((item) => (
                <tr key={`${item.type}-${item.id}`}>
                  <td>
                    <div className="table-mission-cell">
                      <img src={item.heroImage} alt={item.title} className="table-thumb" />
                      <div>
                        <div className="table-mission-title">{item.title}</div>
                        <div className="table-type-tag">
                          <span className={`pill-type ${item.type}`}>{item.typeLabel}</span>
                          <span className="table-mission-reports">{item.metaInfo}</span>
                        </div>
                      </div>
                    </div>
                  </td>

                  <td>
                    <div className="table-region-cell">
                      <span className="badge badge-antarctica">{item.region}</span>
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
                  </td>

                  <td className="text-right">
                    <div className="action-buttons-group">
                      {/* AI Generate Studio Button */}
                      <button 
                        className="btn-action ai"
                        onClick={() => navigateTo(`admin-generate-${item.id}`)}
                        title="Open AI Content Generation Studio"
                      >
                        <Sparkles size={14} />
                        <span>AI Studio</span>
                      </button>

                      {/* Public View */}
                      {item.type === 'report' ? (
                        <button 
                          className="btn-action view"
                          onClick={() => onSelectExpedition(item.id)}
                          title="View Public Expedition Page"
                        >
                          <Eye size={14} />
                        </button>
                      ) : (
                        <button 
                          className="btn-action view"
                          onClick={() => navigateTo(item.type === 'dataset' || item.type === 'publication' ? 'publications' : 'home')}
                          title="View on Public Portal"
                        >
                          <Eye size={14} />
                        </button>
                      )}

                      {/* Edit */}
                      <button 
                        className="btn-action edit"
                        onClick={() => navigateTo(`admin-edit-${item.id}`)}
                        title="Edit Asset"
                      >
                        <Edit size={14} />
                      </button>

                      {/* Delete */}
                      <button 
                        className="btn-action delete"
                        onClick={() => handleDelete(item)}
                        title="Delete from Archive"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
          grid-template-columns: repeat(3, 1fr);
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

        .kpi-icon-box {
          width: 46px;
          height: 46px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .bg-blue {
          background: #eff6ff;
          color: #2563eb;
          border: 1px solid #bfdbfe;
        }

        .bg-green {
          background: #ecfdf5;
          color: #059669;
          border: 1px solid #a7f3d0;
        }

        .bg-purple {
          background: #f5f3ff;
          color: #7c3aed;
          border: 1px solid #ddd6fe;
        }

        .bg-amber {
          background: #fffbeb;
          color: #d97706;
          border: 1px solid #fde68a;
        }

        .bg-cyan {
          background: #f0fdfa;
          color: #0d9488;
          border: 1px solid #99f6e4;
        }

        .bg-red {
          background: #fef2f2;
          color: #dc2626;
          border: 1px solid #fecaca;
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
          padding: 1.75rem;
          border-radius: var(--radius-md);
          background: #ffffff;
          border: 1px solid var(--border-card);
          box-shadow: var(--shadow-sm);
        }

        .archive-tab-bar {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          border-bottom: 1px solid var(--border-subtle);
          padding-bottom: 0.85rem;
          margin-bottom: 1.25rem;
          overflow-x: auto;
        }

        .archive-tab-btn {
          background: transparent;
          border: 1px solid transparent;
          color: var(--text-secondary);
          padding: 0.4rem 0.85rem;
          border-radius: var(--radius-sm);
          font-size: 0.82rem;
          font-weight: 600;
          cursor: pointer;
          white-space: nowrap;
          transition: all 0.15s ease;
        }

        .archive-tab-btn:hover {
          color: var(--navy);
          background: #f1f5f9;
        }

        .archive-tab-btn.active {
          background: #eff6ff;
          color: var(--navy);
          border-color: #bfdbfe;
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
          font-size: 0.82rem;
          color: var(--text-muted);
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
        }

        .table-search-icon {
          position: absolute;
          left: 0.75rem;
          color: var(--text-muted);
        }

        .table-search-input {
          background: #f8fafc;
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-sm);
          color: var(--text-primary);
          padding: 0.5rem 0.75rem 0.5rem 2.2rem;
          font-size: 0.82rem;
          width: 200px;
        }

        .table-search-input:focus {
          outline: none;
          border-color: var(--ice);
          background: #ffffff;
        }

        .table-select {
          background: #f8fafc;
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-sm);
          color: var(--text-secondary);
          padding: 0.5rem 0.75rem;
          font-size: 0.82rem;
          cursor: pointer;
        }

        .table-responsive {
          overflow-x: auto;
        }

        .admin-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
          font-size: 0.85rem;
        }

        .admin-table th {
          padding: 0.85rem 1rem;
          color: var(--text-muted);
          font-weight: 600;
          text-transform: uppercase;
          font-size: 0.72rem;
          letter-spacing: 0.05em;
          border-bottom: 1px solid var(--border-subtle);
          background: #f8fafc;
        }

        .admin-table td {
          padding: 1rem;
          border-bottom: 1px solid var(--border-subtle);
          vertical-align: middle;
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
        }

        .table-mission-title {
          font-weight: 700;
          color: var(--navy);
          line-height: 1.25;
        }

        .table-type-tag {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          margin-top: 0.2rem;
        }

        .pill-type {
          font-size: 0.68rem;
          font-weight: 700;
          padding: 1px 6px;
          border-radius: 4px;
        }

        .pill-type.report { background: #eff6ff; color: #1d4ed8; }
        .pill-type.dataset { background: #f5f3ff; color: #6d28d9; }
        .pill-type.publication { background: #fffbeb; color: #b45309; }
        .pill-type.photo { background: #f0fdfa; color: #0f766e; }
        .pill-type.video { background: #fef2f2; color: #b91c1c; }
        .pill-type.activity { background: #ecfdf5; color: #047857; }

        .table-mission-reports {
          font-size: 0.72rem;
          color: var(--text-muted);
        }

        .table-region-cell {
          display: flex;
          align-items: center;
          gap: 0.45rem;
        }

        .table-year-text {
          font-size: 0.8rem;
          color: var(--text-muted);
        }

        .table-scientist-text {
          color: var(--text-secondary);
          font-size: 0.8rem;
        }

        .ai-status-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          padding: 0.25rem 0.65rem;
          border-radius: var(--radius-full);
          font-size: 0.72rem;
          font-weight: 600;
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
          gap: 0.3rem;
          padding: 0.25rem 0.65rem;
          border-radius: var(--radius-full);
          font-size: 0.75rem;
          font-weight: 600;
          cursor: pointer;
          border: none;
          transition: all 0.15s ease;
        }

        .status-toggle-btn.published {
          background: #ecfdf5;
          color: #047857;
          border: 1px solid #a7f3d0;
        }

        .status-toggle-btn.draft {
          background: #fffbeb;
          color: #b45309;
          border: 1px solid #fde68a;
        }

        .action-buttons-group {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 0.4rem;
        }

        .btn-action {
          display: inline-flex;
          align-items: center;
          gap: 0.3rem;
          padding: 0.35rem 0.65rem;
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
        }

        .btn-action.view {
          background: #f8fafc;
          border: 1px solid var(--border-subtle);
          color: var(--text-secondary);
        }

        .btn-action.view:hover {
          background: #f1f5f9;
          color: var(--navy);
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

        @media (max-width: 640px) {
          .quick-upload-grid {
            grid-template-columns: 1fr;
          }
          .admin-kpi-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
