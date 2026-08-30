import React, { useState } from 'react';
import { usePortal } from '../context/PortalContext';
import { 
  FileText, 
  Search, 
  BookOpen, 
  ExternalLink, 
  Copy, 
  Check, 
  Layers, 
  Calendar, 
  User, 
  ChevronDown, 
  ChevronUp, 
  Filter,
  Plus
} from 'lucide-react';

export default function Publications({ navigateTo }) {
  const { publications, auth } = usePortal();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [expandedPubId, setExpandedPubId] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

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

  const toggleExpand = (id) => {
    setExpandedPubId(expandedPubId === id ? null : id);
  };

  const copyCitation = (pub) => {
    const citation = `${pub.authors.join(', ')} (${pub.year}). ${pub.title}. ${pub.journal}. https://doi.org/${pub.doi}`;
    navigator.clipboard.writeText(citation);
    setCopiedId(pub.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  return (
    <div className="container publications-page-container">
      {/* Header */}
      <div className="page-header-row">
        <div>
          <div className="section-eyebrow">OPEN RESEARCH ARCHIVE</div>
          <h1 className="page-title">Polar Science Publications & Datasets</h1>
          <p className="page-sub">
            Access peer-reviewed research papers, open paleoclimate datasets, and cruise scientific summaries from India's polar missions.
          </p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="glass-panel filter-box">
        <div className="search-row">
          <div className="search-input-wrap">
            <Search size={18} className="search-icon" />
            <input 
              type="text"
              placeholder="Search by paper title, author, journal, or topic..."
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
        <div className="list-count-header">
          <span>Found <strong>{filteredPubs.length}</strong> publications</span>
        </div>

        <div className="pubs-vertical-stack">
          {filteredPubs.map((pub) => {
            const isExpanded = expandedPubId === pub.id;
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

                {/* Card Actions */}
                <div className="pub-card-actions">
                  <button 
                    className="btn-text-action"
                    onClick={() => toggleExpand(pub.id)}
                  >
                    <span>{isExpanded ? 'Hide Abstract' : 'Read Abstract'}</span>
                    {isExpanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                  </button>

                  <div className="pub-action-btns-right">
                    <button 
                      className="btn-secondary btn-sm"
                      onClick={() => copyCitation(pub)}
                      title="Copy APA Citation"
                    >
                      {copiedId === pub.id ? (
                        <>
                          <Check size={13} className="check-icon" />
                          <span>Citation Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy size={13} />
                          <span>Copy Citation</span>
                        </>
                      )}
                    </button>

                    <a 
                      href={`https://doi.org/${pub.doi}`} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="btn-primary btn-sm"
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

      <style>{`
        .publications-page-container {
          padding: 2.5rem 1.5rem 5rem;
        }

        .filter-box {
          padding: 1.5rem;
          margin-bottom: 2rem;
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .search-input-wrap {
          position: relative;
          display: flex;
          align-items: center;
        }

        .search-input-wrap .search-icon {
          position: absolute;
          left: 1rem;
          color: var(--text-muted);
        }

        .search-field {
          width: 100%;
          background: rgba(7, 13, 24, 0.7);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-sm);
          padding: 0.75rem 1rem 0.75rem 2.6rem;
          color: #ffffff;
          font-size: 0.92rem;
        }

        .search-field:focus {
          outline: none;
          border-color: var(--accent-ice);
        }

        .category-pills {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .category-btn {
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid var(--border-subtle);
          color: var(--text-secondary);
          padding: 0.4rem 0.85rem;
          border-radius: var(--radius-full);
          font-size: 0.8rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .category-btn:hover {
          background: rgba(255, 255, 255, 0.1);
          color: #ffffff;
        }

        .category-btn.active {
          background: rgba(56, 189, 248, 0.15);
          border-color: var(--accent-ice);
          color: var(--accent-ice);
          font-weight: 600;
        }

        .list-count-header {
          font-size: 0.9rem;
          color: var(--text-secondary);
          margin-bottom: 1.25rem;
        }

        .pubs-vertical-stack {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .pub-record-card {
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .pub-badge-line {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          margin-bottom: 0.6rem;
          flex-wrap: wrap;
        }

        .pub-discipline-badge {
          background: rgba(56, 189, 248, 0.12);
          color: #7dd3fc;
          font-size: 0.72rem;
          font-weight: 700;
          padding: 2px 8px;
          border-radius: 4px;
        }

        .pub-year-badge {
          font-size: 0.75rem;
          color: var(--text-muted);
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }

        .citation-pill {
          background: rgba(251, 191, 36, 0.12);
          color: #fcd34d;
          font-size: 0.72rem;
          padding: 2px 7px;
          border-radius: 4px;
          font-weight: 600;
        }

        .pub-title-text {
          font-size: 1.25rem;
          color: #ffffff;
          line-height: 1.35;
          margin-bottom: 0.5rem;
        }

        .pub-authors-line {
          display: flex;
          align-items: center;
          gap: 0.45rem;
          font-size: 0.85rem;
          color: #cbd5e1;
          margin-bottom: 0.35rem;
        }

        .author-icon {
          color: var(--accent-cyan);
          flex-shrink: 0;
        }

        .pub-journal-line {
          font-size: 0.82rem;
          color: var(--text-ice);
          margin-bottom: 0.75rem;
        }

        .doi-text {
          font-family: var(--font-mono);
          color: var(--text-muted);
        }

        .pub-tags-list {
          display: flex;
          flex-wrap: wrap;
          gap: 0.35rem;
        }

        .abstract-expanded-box {
          background: #040810;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: var(--radius-sm);
          padding: 1.25rem;
        }

        .abstract-title {
          font-size: 0.85rem;
          color: var(--accent-cyan);
          margin-bottom: 0.5rem;
          text-transform: uppercase;
        }

        .abstract-body {
          font-size: 0.9rem;
          color: #cbd5e1;
          line-height: 1.6;
        }

        .pub-card-actions {
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
          padding-top: 0.85rem;
          flex-wrap: wrap;
          gap: 0.75rem;
        }

        .btn-text-action {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          background: none;
          border: none;
          color: var(--accent-ice);
          font-size: 0.85rem;
          font-weight: 600;
          cursor: pointer;
        }

        .pub-action-btns-right {
          display: flex;
          align-items: center;
          gap: 0.6rem;
        }

        .btn-sm {
          padding: 0.4rem 0.85rem;
          font-size: 0.8rem;
        }
      `}</style>
    </div>
  );
}
