import React, { useState } from 'react';
import { usePortal } from '../../context/PortalContext';
import { 
  Plus, 
  Sparkles, 
  FileText, 
  Layers, 
  Image as ImageIcon, 
  CheckCircle2, 
  Clock, 
  Trash2, 
  Edit, 
  Eye, 
  RotateCcw, 
  Search, 
  ShieldCheck,
  Compass,
  Download,
  AlertCircle
} from 'lucide-react';

export default function AdminDashboard({ navigateTo, onSelectExpedition }) {
  const { 
    expeditions, 
    publications, 
    auth, 
    deleteExpedition, 
    updateExpedition, 
    resetToDefaultData 
  } = usePortal();

  const [filterRegion, setFilterRegion] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [searchTable, setSearchTable] = useState('');

  // Metrics
  const totalExpeditions = expeditions.length;
  const publishedCount = expeditions.filter(e => e.status === 'published').length;
  const draftCount = totalExpeditions - publishedCount;
  const aiGeneratedCount = expeditions.filter(e => !!e.aiGeneratedContent).length;
  const totalMedia = expeditions.reduce((acc, curr) => acc + (curr.media?.length || 0), 0);
  const totalReports = expeditions.reduce((acc, curr) => acc + (curr.reports?.length || 0), 0);

  const filteredList = expeditions.filter(exp => {
    if (filterRegion !== 'All' && exp.region !== filterRegion) return false;
    if (filterStatus !== 'All' && exp.status !== filterStatus) return false;
    if (searchTable.trim()) {
      const q = searchTable.toLowerCase();
      return exp.title.toLowerCase().includes(q) || (exp.chiefScientist || '').toLowerCase().includes(q);
    }
    return true;
  });

  const toggleStatus = (id, currentStatus) => {
    const nextStatus = currentStatus === 'published' ? 'draft' : 'published';
    updateExpedition(id, { status: nextStatus });
  };

  const handleDelete = (id, title) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      deleteExpedition(id);
    }
  };

  return (
    <div className="container admin-dashboard-page">
      {/* Top Banner */}
      <div className="admin-header-row">
        <div>
          <div className="section-eyebrow">NCPOR OUTREACH & CONTENT STUDIO</div>
          <h1 className="page-title">Science Comms Administration</h1>
          <p className="page-sub">
            Logged in as <strong>{auth.user?.name || 'Lead Science Specialist'}</strong> ({auth.user?.department || 'Outreach Division, NCPOR'})
          </p>
        </div>

        <div className="admin-header-actions">
          <button 
            className="btn-primary"
            onClick={() => navigateTo('admin-new-expedition')}
          >
            <Plus size={16} />
            <span>Upload New Expedition</span>
          </button>
          <button 
            className="btn-secondary"
            onClick={() => {
              if (window.confirm("Reset all portal data back to original seed polar datasets?")) {
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

      {/* KPI Cards Grid */}
      <div className="admin-kpi-grid">
        <div className="glass-panel kpi-card">
          <div className="kpi-icon-box bg-blue">
            <Compass size={22} />
          </div>
          <div>
            <div className="kpi-val">{totalExpeditions}</div>
            <div className="kpi-lbl">Total Expeditions</div>
          </div>
        </div>

        <div className="glass-panel kpi-card">
          <div className="kpi-icon-box bg-green">
            <CheckCircle2 size={22} />
          </div>
          <div>
            <div className="kpi-val">{publishedCount}</div>
            <div className="kpi-lbl">Live Published</div>
          </div>
        </div>

        <div className="glass-panel kpi-card">
          <div className="kpi-icon-box bg-purple">
            <Sparkles size={22} />
          </div>
          <div>
            <div className="kpi-val">{aiGeneratedCount}</div>
            <div className="kpi-lbl">AI Outreach Packs Ready</div>
          </div>
        </div>

        <div className="glass-panel kpi-card">
          <div className="kpi-icon-box bg-amber">
            <FileText size={22} />
          </div>
          <div>
            <div className="kpi-val">{totalReports}</div>
            <div className="kpi-lbl">PDF Reports Extracted</div>
          </div>
        </div>

        <div className="glass-panel kpi-card">
          <div className="kpi-icon-box bg-cyan">
            <ImageIcon size={22} />
          </div>
          <div>
            <div className="kpi-val">{totalMedia}</div>
            <div className="kpi-lbl">WCAG-AA Alt-Tagged Media</div>
          </div>
        </div>
      </div>

      {/* Expeditions Management Table */}
      <div className="glass-panel table-card">
        <div className="table-toolbar">
          <div className="table-title-wrap">
            <h3>Archived Polar Expeditions & AI Lifecycle</h3>
            <p>Review raw reports, generate multi-platform social copy, and publish to the live citizen portal.</p>
          </div>

          <div className="table-filters">
            <div className="table-search-wrap">
              <Search size={15} className="table-search-icon" />
              <input 
                type="text" 
                placeholder="Search archive table..."
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
                <th>Expedition Mission</th>
                <th>Region / Year</th>
                <th>Chief Scientist</th>
                <th>AI Outreach Status</th>
                <th>Live Status</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredList.map((exp) => (
                <tr key={exp.id}>
                  <td>
                    <div className="table-mission-cell">
                      <img src={exp.heroImage} alt={exp.title} className="table-thumb" />
                      <div>
                        <div className="table-mission-title">{exp.title}</div>
                        <div className="table-mission-reports">
                          {exp.reports?.length || 0} Reports • {exp.media?.length || 0} Media Assets
                        </div>
                      </div>
                    </div>
                  </td>

                  <td>
                    <div className="table-region-cell">
                      <span className="badge badge-antarctica">{exp.region}</span>
                      <span className="table-year-text">{exp.year}</span>
                    </div>
                  </td>

                  <td>
                    <span className="table-scientist-text">{exp.chiefScientist || 'NCPOR Scientific Corps'}</span>
                  </td>

                  <td>
                    {exp.aiGeneratedContent ? (
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
                      className={`status-toggle-btn ${exp.status}`}
                      onClick={() => toggleStatus(exp.id, exp.status)}
                      title="Click to toggle status"
                    >
                      {exp.status === 'published' ? (
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
                        onClick={() => navigateTo(`admin-generate-${exp.id}`)}
                        title="Open AI Content Generation Studio"
                      >
                        <Sparkles size={14} />
                        <span>AI Studio</span>
                      </button>

                      {/* View on Public Portal */}
                      <button 
                        className="btn-action view"
                        onClick={() => onSelectExpedition(exp.id)}
                        title="View Public Expedition Page"
                      >
                        <Eye size={14} />
                      </button>

                      {/* Edit */}
                      <button 
                        className="btn-action edit"
                        onClick={() => navigateTo(`admin-edit-${exp.id}`)}
                        title="Edit Expedition"
                      >
                        <Edit size={14} />
                      </button>

                      {/* Delete */}
                      <button 
                        className="btn-action delete"
                        onClick={() => handleDelete(exp.id, exp.title)}
                        title="Delete Expedition"
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
          background: rgba(37, 99, 235, 0.18);
          color: #60a5fa;
          border: 1px solid rgba(37, 99, 235, 0.35);
        }

        .bg-green {
          background: rgba(16, 185, 129, 0.18);
          color: #6ee7b7;
          border: 1px solid rgba(16, 185, 129, 0.35);
        }

        .bg-purple {
          background: rgba(168, 85, 247, 0.18);
          color: #d8b4fe;
          border: 1px solid rgba(168, 85, 247, 0.35);
        }

        .bg-amber {
          background: rgba(245, 158, 11, 0.18);
          color: #fcd34d;
          border: 1px solid rgba(245, 158, 11, 0.35);
        }

        .bg-cyan {
          background: rgba(6, 182, 212, 0.18);
          color: #67e8f9;
          border: 1px solid rgba(6, 182, 212, 0.35);
        }

        .kpi-val {
          font-family: var(--font-heading);
          font-size: 1.6rem;
          font-weight: 800;
          color: #ffffff;
          line-height: 1.1;
        }

        .kpi-lbl {
          font-size: 0.75rem;
          color: var(--text-muted);
        }

        /* Table Card */
        .table-card {
          padding: 1.75rem;
          border-radius: var(--radius-md);
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
          color: #ffffff;
          margin-bottom: 0.25rem;
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
          background: #040810;
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-sm);
          color: #ffffff;
          padding: 0.5rem 0.75rem 0.5rem 2.2rem;
          font-size: 0.82rem;
          width: 190px;
        }

        .table-search-input:focus {
          outline: none;
          border-color: var(--accent-ice);
        }

        .table-select {
          background: #040810;
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-sm);
          color: #ffffff;
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
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .admin-table td {
          padding: 1rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.06);
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
        }

        .table-mission-title {
          font-weight: 700;
          color: #ffffff;
          line-height: 1.25;
        }

        .table-mission-reports {
          font-size: 0.75rem;
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
          color: var(--text-ice);
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
          background: rgba(168, 85, 247, 0.15);
          color: #d8b4fe;
          border: 1px solid rgba(168, 85, 247, 0.35);
        }

        .ai-status-badge.pending {
          background: rgba(245, 158, 11, 0.15);
          color: #fcd34d;
          border: 1px solid rgba(245, 158, 11, 0.35);
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
          transition: all 0.2s ease;
        }

        .status-toggle-btn.published {
          background: rgba(16, 185, 129, 0.15);
          color: #6ee7b7;
          border: 1px solid rgba(16, 185, 129, 0.35);
        }

        .status-toggle-btn.draft {
          background: rgba(245, 158, 11, 0.15);
          color: #fcd34d;
          border: 1px solid rgba(245, 158, 11, 0.35);
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
          transition: all 0.2s ease;
        }

        .btn-action.ai {
          background: linear-gradient(135deg, rgba(147, 51, 234, 0.25), rgba(217, 70, 239, 0.25));
          border-color: rgba(217, 70, 239, 0.4);
          color: #f0abfc;
        }

        .btn-action.ai:hover {
          background: linear-gradient(135deg, #9333ea, #d946ef);
          color: #ffffff;
        }

        .btn-action.view {
          background: rgba(255, 255, 255, 0.06);
          color: var(--text-secondary);
        }

        .btn-action.view:hover {
          background: rgba(255, 255, 255, 0.15);
          color: #ffffff;
        }

        .btn-action.edit {
          background: rgba(56, 189, 248, 0.1);
          color: #7dd3fc;
          border-color: rgba(56, 189, 248, 0.25);
        }

        .btn-action.edit:hover {
          background: rgba(56, 189, 248, 0.25);
          color: #ffffff;
        }

        .btn-action.delete {
          background: rgba(239, 68, 68, 0.1);
          color: #fca5a5;
          border-color: rgba(239, 68, 68, 0.25);
        }

        .btn-action.delete:hover {
          background: rgba(239, 68, 68, 0.3);
          color: #ffffff;
        }

        .text-right {
          text-align: right;
        }

        @media (max-width: 1024px) {
          .admin-kpi-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        @media (max-width: 640px) {
          .admin-kpi-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
