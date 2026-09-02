import { useState } from 'react';
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
  ShieldCheck
} from 'lucide-react';

export default function Publications({ navigateTo }) {
  const { publications, datasets, auth } = usePortal();
  const [viewTab, setViewTab] = useState('all'); // all, publications, datasets
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [expandedId, setExpandedId] = useState(null);
  const [copiedId, setCopiedId] = useState(null);
  const [downloadToast, setDownloadToast] = useState(null);

  const categories = [
    'All',
    'Glaciology & Paleoclimate',
    'Oceanography',
    'Himalayan Cryosphere',
    'Atmospheric Sciences',
    'Polar Biology'
  ];

  const filteredPubs = publications.filter(pub => {
    if (selectedCategory !== 'All' && pub.category !== selectedCategory) {
      return false;
    }
    if (searchTerm.trim() !== '') {
      const q = searchTerm.toLowerCase();
      const titleMatch = pub.title.toLowerCase().includes(q);
      const authorMatch = pub.authors.some(a => a.toLowerCase().includes(q));
      const journalMatch = (pub.journal || '').toLowerCase().includes(q);
      const tagMatch = (pub.tags || []).some(t => t.toLowerCase().includes(q));
      return titleMatch || authorMatch || journalMatch || tagMatch;
    }
    return true;
  });

  const filteredDatasets = datasets.filter(ds => {
    if (selectedCategory !== 'All' && ds.category !== selectedCategory) {
      return false;
    }
    if (searchTerm.trim() !== '') {
      const q = searchTerm.toLowerCase();
      const titleMatch = ds.title.toLowerCase().includes(q);
      const regionMatch = (ds.region || '').toLowerCase().includes(q);
      const paramMatch = (ds.parameters || []).some(p => p.toLowerCase().includes(q));
      return titleMatch || regionMatch || paramMatch;
    }
    return true;
  });

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const copyCitation = (pub) => {
    const citation = `${pub.authors.join(', ')} (${pub.year}). ${pub.title}. ${pub.journal}. https://doi.org/${pub.doi}`;
    navigator.clipboard.writeText(citation);
    setCopiedId(pub.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleDownload = (ds) => {
    setDownloadToast(`Initiated direct open-access download for "${ds.title}" (${ds.format})`);
    setTimeout(() => setDownloadToast(null), 3500);
  };

  return (
    <div className="container publications-page-container">
      {/* Header */}
      <div className="page-header-row">
        <div>
          <div className="section-eyebrow">OPEN RESEARCH & DATA ARCHIVE</div>
          <h1 className="page-title">Polar Science Publications & Datasets</h1>
          <p className="page-sub">
            Access peer-reviewed research papers, verified open paleoclimate datasets (NetCDF/CSV), and technical summaries from India's polar missions.
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

      {downloadToast && (
        <div className="download-toast-box">
          <Download size={16} />
          <span>{downloadToast}</span>
        </div>
      )}

      {/* Main Mode Tabs */}
      <div className="view-mode-tabs">
        <button 
          className={`mode-tab ${viewTab === 'all' ? 'active' : ''}`}
          onClick={() => setViewTab('all')}
        >
          <span>All Open Assets ({publications.length + datasets.length})</span>
        </button>
        <button 
          className={`mode-tab ${viewTab === 'publications' ? 'active' : ''}`}
          onClick={() => setViewTab('publications')}
        >
          <BookOpen size={16} />
          <span>Peer-Reviewed Papers ({publications.length})</span>
        </button>
        <button 
          className={`mode-tab ${viewTab === 'datasets' ? 'active' : ''}`}
          onClick={() => setViewTab('datasets')}
        >
          <Database size={16} />
          <span>Scientific Datasets ({datasets.length})</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="glass-panel filter-box">
        <div className="search-row">
          <div className="search-input-wrap">
            <Search size={18} className="search-icon" />
            <input 
              type="text" 
              placeholder="Search by title, author, parameter, DOI, or keyword..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-field"
            />
          </div>
        </div>

        <div className="category-pills">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`category-btn ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Results List */}
      <div className="publications-list-wrapper">
        {/* DATASETS SECTION */}
        {(viewTab === 'all' || viewTab === 'datasets') && filteredDatasets.length > 0 && (
          <div className="section-block">
            <div className="list-count-header">
              <span className="section-type-title">
                <Database size={18} className="icon-cyan" />
                <span>Open Scientific Datasets ({filteredDatasets.length})</span>
              </span>
            </div>

            <div className="pubs-vertical-stack">
              {filteredDatasets.map((ds) => {
                const isExpanded = expandedId === ds.id;
                return (
                  <div key={ds.id} className="glass-panel pub-record-card dataset-card-accent">
                    <div className="pub-card-top">
                      <div className="pub-badge-line">
                        <span className="pub-discipline-badge dataset-badge">{ds.category}</span>
                        <span className="pub-format-badge">{ds.format}</span>
                        <span className="pub-year-badge">
                          <Calendar size={12} /> {ds.year}
                        </span>
                        <span className="license-pill">
                          <ShieldCheck size={12} /> {ds.license || 'CC-BY Open Data'}
                        </span>
                      </div>

                      <h3 className="pub-title-text">{ds.title}</h3>

                      <div className="dataset-meta-row">
                        <span className="dataset-meta-item">
                          <MapPin size={13} /> {ds.spatialCoverage}
                        </span>
                        <span className="dataset-meta-item">
                          <Clock size={13} /> {ds.temporalCoverage}
                        </span>
                        <span className="dataset-meta-item">
                          <FileText size={13} /> Size: {ds.fileSize}
                        </span>
                      </div>

                      {/* Parameters Tags */}
                      {ds.parameters && (
                        <div className="param-chips-row">
                          <span className="param-label">Measured Variables:</span>
                          {ds.parameters.map((p, i) => (
                            <span key={i} className="param-chip">{p}</span>
                          ))}
                        </div>
                      )}
                    </div>

                    {isExpanded && (
                      <div className="abstract-expanded-box">
                        <h5 className="abstract-title">Dataset Description & Ingestion Notes</h5>
                        <p className="abstract-body">{ds.summary}</p>
                        <div className="doi-direct-row">
                          <span>DOI Identifier: <strong>https://doi.org/{ds.doi}</strong></span>
                        </div>
                      </div>
                    )}

                    <div className="pub-card-actions">
                      <button 
                        className="btn-text-expand"
                        onClick={() => toggleExpand(ds.id)}
                      >
                        {isExpanded ? (
                          <><span>Hide Metadata</span><ChevronUp size={15} /></>
                        ) : (
                          <><span>Inspect Variables & Abstract</span><ChevronDown size={15} /></>
                        )}
                      </button>

                      <div className="pub-right-actions">
                        <button 
                          className="btn-action-pill download"
                          onClick={() => handleDownload(ds)}
                          title="Download dataset file"
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
            <div className="list-count-header">
              <span className="section-type-title">
                <BookOpen size={18} className="icon-amber" />
                <span>Peer-Reviewed Publications ({filteredPubs.length})</span>
              </span>
            </div>

            <div className="pubs-vertical-stack">
              {filteredPubs.map((pub) => {
                const isExpanded = expandedId === pub.id;
                return (
                  <div key={pub.id} className="glass-panel pub-record-card">
                    <div className="pub-card-top">
                      <div className="pub-badge-line">
                        <span className="pub-discipline-badge">{pub.category}</span>
                        <span className="pub-year-badge">
                          <Calendar size={12} /> {pub.year}
                        </span>
                        <span className="citation-pill">
                          📚 {pub.citations} Citations
                        </span>
                      </div>

                      <h3 className="pub-title-text">{pub.title}</h3>

                      <div className="pub-authors-line">
                        <User size={14} className="author-icon" />
                        <span>{pub.authors.join(', ')}</span>
                      </div>

                      <div className="pub-journal-line">
                        <em>{pub.journal}</em> • DOI: <span className="doi-text">{pub.doi}</span>
                      </div>

                      {pub.tags && (
                        <div className="pub-tags-list">
                          {pub.tags.map((tag, i) => (
                            <span key={i} className="mini-tag">{tag}</span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Abstract Section (collapsible) */}
                    {isExpanded && (
                      <div className="abstract-expanded-box">
                        <h5 className="abstract-title">Abstract</h5>
                        <p className="abstract-body">{pub.abstract}</p>
                      </div>
                    )}

                    <div className="pub-card-actions">
                      <button 
                        className="btn-text-expand"
                        onClick={() => toggleExpand(pub.id)}
                      >
                        {isExpanded ? (
                          <><span>Hide Abstract</span><ChevronUp size={15} /></>
                        ) : (
                          <><span>Read Abstract</span><ChevronDown size={15} /></>
                        )}
                      </button>

                      <div className="pub-right-actions">
                        <button 
                          className={`btn-action-pill ${copiedId === pub.id ? 'copied' : ''}`}
                          onClick={() => copyCitation(pub)}
                          title="Copy reference citation"
                        >
                          {copiedId === pub.id ? (
                            <><Check size={14} /><span>Copied!</span></>
                          ) : (
                            <><Copy size={14} /><span>Cite</span></>
                          )}
                        </button>

                        <a 
                          href={`https://doi.org/${pub.doi}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-action-pill doi-link"
                          title="View on publisher website"
                        >
                          <span>DOI Link</span>
                          <ExternalLink size={13} />
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <style>{`
        .publications-page-container {
          padding: 2.5rem 1.5rem 5rem;
          display: flex;
          flex-direction: column;
          gap: 1.75rem;
        }

        .page-header-row {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .btn-upload-hub {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          background: var(--navy);
          color: #ffffff;
          font-weight: 600;
          padding: 0.65rem 1.2rem;
          border-radius: var(--radius-sm);
          font-size: 0.85rem;
          border: none;
          cursor: pointer;
          box-shadow: var(--shadow-sm);
        }

        .download-toast-box {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: #ecfdf5;
          border: 1px solid #a7f3d0;
          color: #047857;
          padding: 0.75rem 1.25rem;
          border-radius: var(--radius-sm);
          font-size: 0.85rem;
          font-weight: 600;
        }

        .view-mode-tabs {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          border-bottom: 1px solid var(--border-subtle);
          padding-bottom: 0.5rem;
        }

        .mode-tab {
          display: flex;
          align-items: center;
          gap: 0.45rem;
          padding: 0.55rem 1rem;
          background: transparent;
          border: 1px solid transparent;
          color: var(--text-secondary);
          border-radius: var(--radius-sm);
          font-size: 0.85rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .mode-tab:hover {
          color: var(--navy);
          background: #f1f5f9;
        }

        .mode-tab.active {
          background: #eff6ff;
          border-color: #bfdbfe;
          color: var(--navy);
        }

        .section-block {
          margin-bottom: 2rem;
        }

        .section-type-title {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 1.15rem;
          font-weight: 700;
          color: var(--navy);
        }

        .icon-cyan { color: #059669; }
        .icon-amber { color: #d97706; }

        .filter-box {
          padding: 1.25rem 1.5rem;
          border-radius: var(--radius-md);
          display: flex;
          flex-direction: column;
          gap: 1rem;
          background: #ffffff;
          border: 1px solid var(--border-card);
          box-shadow: var(--shadow-sm);
        }

        .search-input-wrap {
          position: relative;
          display: flex;
          align-items: center;
          width: 100%;
        }

        .search-icon {
          position: absolute;
          left: 1rem;
          color: var(--text-muted);
        }

        .search-field {
          width: 100%;
          background: #f8fafc;
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-sm);
          padding: 0.75rem 1rem 0.75rem 2.75rem;
          color: var(--text-primary);
          font-size: 0.95rem;
        }

        .search-field:focus {
          outline: none;
          border-color: var(--ice);
          background: #ffffff;
          box-shadow: 0 0 0 3px var(--ice-glow);
        }

        .category-pills {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .category-btn {
          background: #f8fafc;
          border: 1px solid var(--border-subtle);
          color: var(--text-secondary);
          padding: 0.35rem 0.85rem;
          border-radius: var(--radius-full);
          font-size: 0.8rem;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .category-btn:hover {
          color: var(--navy);
          background: #e2e8f0;
        }

        .category-btn.active {
          background: var(--navy);
          border-color: var(--navy);
          color: #ffffff;
          font-weight: 600;
        }

        .publications-list-wrapper {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .list-count-header {
          font-size: 0.85rem;
          color: var(--text-muted);
          margin-bottom: 0.75rem;
        }

        .pubs-vertical-stack {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .pub-record-card {
          padding: 1.5rem;
          border-radius: var(--radius-md);
          display: flex;
          flex-direction: column;
          gap: 1rem;
          background: #ffffff;
          border: 1px solid var(--border-card);
          box-shadow: var(--shadow-sm);
        }

        .dataset-card-accent {
          border-left: 3px solid #059669;
        }

        .pub-badge-line {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          flex-wrap: wrap;
          margin-bottom: 0.4rem;
        }

        .pub-discipline-badge {
          background: #ecfdf5;
          color: #047857;
          border: 1px solid #a7f3d0;
          font-size: 0.75rem;
          font-weight: 600;
          padding: 0.2rem 0.6rem;
          border-radius: var(--radius-full);
        }

        .dataset-badge {
          background: #f0fdf4;
          color: #047857;
          border: 1px solid #bbf7d0;
        }

        .pub-format-badge {
          background: #f1f5f9;
          color: #475569;
          border: 1px solid #e2e8f0;
          font-size: 0.72rem;
          font-weight: 700;
          padding: 0.15rem 0.55rem;
          border-radius: 4px;
        }

        .license-pill {
          display: flex;
          align-items: center;
          gap: 0.3rem;
          font-size: 0.72rem;
          color: var(--text-muted);
        }

        .pub-year-badge {
          display: flex;
          align-items: center;
          gap: 0.3rem;
          font-size: 0.75rem;
          color: var(--text-muted);
        }

        .citation-pill {
          font-size: 0.72rem;
          color: #b45309;
          background: #fffbeb;
          border: 1px solid #fde68a;
          padding: 0.15rem 0.5rem;
          border-radius: 4px;
          font-weight: 600;
        }

        .pub-title-text {
          font-size: 1.15rem;
          color: var(--navy);
          font-weight: 700;
          line-height: 1.35;
          margin: 0.3rem 0;
        }

        .dataset-meta-row {
          display: flex;
          align-items: center;
          gap: 1.25rem;
          font-size: 0.8rem;
          color: var(--text-secondary);
          flex-wrap: wrap;
          margin-top: 0.3rem;
        }

        .dataset-meta-item {
          display: flex;
          align-items: center;
          gap: 0.35rem;
        }

        .param-chips-row {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          flex-wrap: wrap;
          margin-top: 0.5rem;
        }

        .param-label {
          font-size: 0.72rem;
          color: var(--text-muted);
          font-weight: 600;
        }

        .param-chip {
          background: #f1f5f9;
          border: 1px solid #e2e8f0;
          color: var(--text-secondary);
          font-size: 0.72rem;
          padding: 0.15rem 0.5rem;
          border-radius: 4px;
        }

        .pub-authors-line {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.85rem;
          color: var(--text-secondary);
        }

        .author-icon {
          color: #0284c7;
        }

        .pub-journal-line {
          font-size: 0.82rem;
          color: var(--text-muted);
        }

        .doi-text {
          font-family: var(--font-mono);
          color: var(--text-muted);
        }

        .pub-tags-list {
          display: flex;
          flex-wrap: wrap;
          gap: 0.35rem;
          margin-top: 0.4rem;
        }

        .mini-tag {
          font-size: 0.72rem;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          color: var(--text-muted);
          padding: 0.1rem 0.45rem;
          border-radius: 3px;
        }

        .abstract-expanded-box {
          background: #f8fafc;
          border-radius: var(--radius-sm);
          padding: 1rem;
          border-left: 3px solid #059669;
        }

        .abstract-title {
          font-size: 0.8rem;
          color: #059669;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 0.4rem;
          font-weight: 700;
        }

        .abstract-body {
          font-size: 0.85rem;
          line-height: 1.55;
          color: var(--text-secondary);
        }

        .doi-direct-row {
          margin-top: 0.6rem;
          font-size: 0.78rem;
          color: var(--text-muted);
        }

        .pub-card-actions {
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-top: 1px solid #f1f5f9;
          padding-top: 0.85rem;
          flex-wrap: wrap;
          gap: 0.75rem;
        }

        .btn-text-expand {
          display: flex;
          align-items: center;
          gap: 0.3rem;
          background: transparent;
          border: none;
          color: #059669;
          font-size: 0.82rem;
          font-weight: 600;
          cursor: pointer;
        }

        .pub-right-actions {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .btn-action-pill {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          background: #ffffff;
          border: 1px solid var(--border-subtle);
          color: var(--text-secondary);
          padding: 0.35rem 0.75rem;
          border-radius: var(--radius-sm);
          font-size: 0.78rem;
          font-weight: 600;
          cursor: pointer;
          text-decoration: none;
          transition: all 0.15s ease;
        }

        .btn-action-pill:hover {
          background: #f8fafc;
          color: var(--navy);
          border-color: #cbd5e1;
        }

        .btn-action-pill.download {
          background: #ecfdf5;
          color: #047857;
          border-color: #a7f3d0;
        }

        .btn-action-pill.download:hover {
          background: #a7f3d0;
          color: #065f46;
        }

        .btn-action-pill.copied {
          background: #ecfdf5;
          color: #047857;
          border-color: #a7f3d0;
        }

        .doi-link {
          color: #059669;
        }
      `}</style>
    </div>
  );
}
