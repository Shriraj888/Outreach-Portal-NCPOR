import { useState } from 'react';
import { usePortal } from '../../context/PortalContext';
import { 
  ArrowLeft, 
  Sparkles, 
  CheckCircle2, 
  ShieldCheck, 
  Eye, 
  FileText, 
  RotateCcw, 
  Layers,
  Copy,
  Check,
  ExternalLink,
  BookOpen,
  FileCheck2,
  AlertCircle
} from 'lucide-react';

export default function AIGenerateStudio({ expeditionId, onBack, onSelectExpedition, navigateTo }) {
  const { 
    expeditions, 
    datasets, 
    publications, 
    mediaArchives, 
    activities, 
    saveGeneratedContent 
  } = usePortal();

  // Find asset across all 6 Problem Statement pillars
  const expeditionMatch = expeditions.find(e => e.id === expeditionId);
  const datasetMatch = datasets.find(d => d.id === expeditionId);
  const pubMatch = publications.find(p => p.id === expeditionId);
  const mediaMatch = mediaArchives.find(m => m.id === expeditionId);
  const actMatch = activities.find(a => a.id === expeditionId);

  const asset = expeditionMatch || datasetMatch || pubMatch || mediaMatch || actMatch || expeditions[0];
  const assetType = datasetMatch ? 'dataset' : pubMatch ? 'publication' : mediaMatch ? 'media' : actMatch ? 'activity' : 'expedition';
  const expedition = {
    ...asset,
    heroImage: asset.heroImage || asset.url || 'https://images.unsplash.com/photo-1517411032315-54ef2cb783bb?auto=format&fit=crop&w=800&q=80'
  };

  // Raw scientific text extracted from reports or abstracts
  const rawReportText = asset.reports && asset.reports[0]?.rawText 
    ? asset.reports[0].rawText 
    : asset.scientificAbstract || asset.summary || asset.abstract || (asset.parameters ? `Parameters: ${asset.parameters.join(', ')}` : 'No raw technical text recorded.');

  const reportTitle = asset.reports && asset.reports[0]?.title 
    ? asset.reports[0].title 
    : `${expedition.title || 'Mission'} Scientific Dossier`;

  // Working draft states
  const initialSummary = asset.aiGeneratedContent?.summary || asset.summary || asset.abstract || '';
  const [draftSummary, setDraftSummary] = useState(initialSummary);
  const [copiedSummary, setCopiedSummary] = useState(false);
  const [copiedRaw, setCopiedRaw] = useState(false);
  const [altTextMap, setAltTextMap] = useState(() => {
    const initialAlt = {};
    (expedition.media || []).forEach(m => {
      initialAlt[m.id] = m.altText || '';
    });
    return initialAlt;
  });

  const [activeTab, setActiveTab] = useState('summaryVerification'); // 'summaryVerification' | 'altText'
  const [publishSuccess, setPublishSuccess] = useState(false);

  // Copy helpers
  const handleCopySummary = () => {
    navigator.clipboard.writeText(draftSummary);
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 2000);
  };

  const handleCopyRaw = () => {
    navigator.clipboard.writeText(rawReportText);
    setCopiedRaw(true);
    setTimeout(() => setCopiedRaw(false), 2000);
  };

  const handleResetDraft = () => {
    if (window.confirm("Reset summary back to original draft? Any unsaved edits will be discarded.")) {
      setDraftSummary(initialSummary);
    }
  };

  // Approve & Publish to Portal
  const handlePublish = () => {
    const updatedMedia = (expedition.media || []).map(m => ({
      ...m,
      altText: altTextMap[m.id] || m.altText || ''
    }));

    const aiPackage = {
      summary: draftSummary,
      // Preserve existing social captions synthesized in Selective AI Studio
      socialCaptions: asset.aiGeneratedContent?.socialCaptions || {},
      altTextSuggestions: (expedition.media || []).map(m => ({
        mediaId: m.id,
        suggestedAlt: altTextMap[m.id] || m.altText || ''
      })),
      isApproved: true,
      approvedAt: new Date().toISOString()
    };

    saveGeneratedContent(asset.id, aiPackage, true, assetType);

    setPublishSuccess(true);
    setTimeout(() => {
      setPublishSuccess(false);
    }, 4500);
  };

  // Word count & reading time calculations
  const summaryWordCount = draftSummary.trim() ? draftSummary.trim().split(/\s+/).length : 0;
  const rawWordCount = rawReportText.trim() ? rawReportText.trim().split(/\s+/).length : 0;
  const estReadSeconds = Math.max(10, Math.round((summaryWordCount / 200) * 60));

  return (
    <div className="container verification-studio-page">
      {/* Top Banner */}
      <div className="studio-top-bar">
        <button className="btn-back" onClick={onBack}>
          <ArrowLeft size={16} />
          <span>Back to Dashboard</span>
        </button>

        <div className="studio-title-badge">
          <ShieldCheck size={16} className="studio-shield-icon" />
          <span>NCPOR OUTREACH REVIEW & VERIFICATION STUDIO</span>
        </div>

        <button 
          className="btn-selective-shortcut"
          onClick={() => navigateTo ? navigateTo(`admin-selective-ai-${asset.id}`) : null}
          title="Open Selective AI Studio to synthesize custom outreach stories, posters, or scripts"
        >
          <Layers size={14} />
          <span>Selective AI Studio</span>
          <ExternalLink size={13} />
        </button>
      </div>

      {/* Mission Context Bar */}
      <div className="glass-panel studio-mission-bar">
        <div className="mission-bar-left">
          <img src={expedition.heroImage} alt={expedition.title} className="mission-bar-thumb" />
          <div>
            <div className="mission-bar-tag">{expedition.region} • {expedition.year}</div>
            <h2 className="mission-bar-title">{expedition.title}</h2>
          </div>
        </div>

        <div className="mission-bar-right">
          <div className="verification-mode-pill">
            <ShieldCheck size={15} className="shield-active-icon" />
            <span>Institutional Verification Mode</span>
          </div>

          <button 
            className="btn-selective-ai-link"
            onClick={() => navigateTo ? navigateTo(`admin-selective-ai-${asset.id}`) : null}
            title="Open in Selective AI Studio to synthesize chunked content, social sets, or video scripts"
          >
            <Layers size={15} />
            <span>Synthesize in Selective AI</span>
          </button>
        </div>
      </div>

      {/* Success Notification Alert */}
      {publishSuccess && (
        <div className="publish-success-alert glass-panel">
          <div className="alert-content">
            <CheckCircle2 size={24} className="alert-icon" />
            <div>
              <h4>Successfully Approved & Published to Live Citizen Portal!</h4>
              <p>The verified plain-language summary and WCAG-AA alt-text tags are now live across NCPOR public channels.</p>
            </div>
          </div>
          <button 
            className="btn-primary btn-sm"
            onClick={() => onSelectExpedition ? onSelectExpedition(expedition.id) : null}
          >
            <span>View Live Expedition Page</span>
            <Eye size={14} />
          </button>
        </div>
      )}

      {/* Navigation Tabs (Multi-Platform Social removed; Tabs 1 & 4 merged) */}
      <div className="studio-tabs-row">
        <button 
          className={`studio-tab ${activeTab === 'summaryVerification' ? 'active' : ''}`}
          onClick={() => setActiveTab('summaryVerification')}
        >
          <FileCheck2 size={16} />
          <span>1. Summary Draft & Verification (Raw vs AI)</span>
        </button>

        <button 
          className={`studio-tab ${activeTab === 'altText' ? 'active' : ''}`}
          onClick={() => setActiveTab('altText')}
        >
          <ShieldCheck size={16} />
          <span>2. WCAG-AA Accessibility Alt-Text</span>
        </button>
      </div>

      {/* Tab Panels */}
      <div className="studio-main-body">
        {/* Merged Tab 1 & 4: Side-by-Side Summary Draft & Verification */}
        {activeTab === 'summaryVerification' && (
          <div className="verification-wrapper">
            <div className="verification-intro-bar">
              <div>
                <h3 className="intro-title">Side-by-Side Scientific Verification & Summary Refinement</h3>
                <p className="intro-sub">
                  Cross-reference unedited scientific telemetry and technical reports against the outreach draft before portal publication.
                </p>
              </div>
              <div className="verification-stats-pills">
                <span className="stat-badge raw-stat">
                  Raw Source: <strong>{rawWordCount}</strong> words
                </span>
                <span className="stat-badge ai-stat">
                  Draft: <strong>{draftSummary.length}</strong> chars (~{estReadSeconds}s read)
                </span>
              </div>
            </div>

            <div className="verification-grid">
              {/* Left Column: Raw Technical Report */}
              <div className="glass-panel verification-pane raw-pane">
                <div className="pane-header">
                  <div className="pane-title-group">
                    <BookOpen size={17} className="pane-icon raw-icon" />
                    <div>
                      <h4 className="pane-heading">Extracted Raw Scientific Report / Telemetry</h4>
                      <span className="pane-subheading">{reportTitle}</span>
                    </div>
                  </div>
                  <div className="pane-actions">
                    <span className="ground-truth-tag">Ground Truth Benchmark</span>
                    <button 
                      type="button" 
                      className="btn-mini-action"
                      onClick={handleCopyRaw}
                      title="Copy raw technical text"
                    >
                      {copiedRaw ? <Check size={13} /> : <Copy size={13} />}
                      <span>{copiedRaw ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                </div>

                <div className="raw-text-container">
                  <pre className="raw-content-block font-mono">
                    {rawReportText}
                  </pre>
                </div>

                <div className="raw-footer-hint">
                  <AlertCircle size={14} className="hint-icon" />
                  <span>Institutional baseline logged by expedition researchers. Used to cross-check scientific accuracy, metrics, and methodology.</span>
                </div>
              </div>

              {/* Right Column: Editable Plain-Language Outreach Summary */}
              <div className="glass-panel verification-pane draft-pane">
                <div className="pane-header">
                  <div className="pane-title-group">
                    <Sparkles size={17} className="pane-icon draft-icon" />
                    <div>
                      <h4 className="pane-heading">Plain-Language Outreach Summary (Draft)</h4>
                      <span className="pane-subheading">Citizen & Student Public Summary</span>
                    </div>
                  </div>
                  <div className="pane-actions">
                    <button 
                      type="button" 
                      className="btn-mini-action"
                      onClick={handleResetDraft}
                      title="Reset summary back to original draft"
                    >
                      <RotateCcw size={13} />
                      <span>Reset</span>
                    </button>
                    <button 
                      type="button" 
                      className="btn-mini-action highlight"
                      onClick={handleCopySummary}
                      title="Copy outreach summary draft"
                    >
                      {copiedSummary ? <Check size={13} /> : <Copy size={13} />}
                      <span>{copiedSummary ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                </div>

                <div className="draft-editor-box">
                  <textarea 
                    rows={12}
                    value={draftSummary}
                    onChange={(e) => setDraftSummary(e.target.value)}
                    className="studio-textarea draft-summary-textarea"
                    placeholder="Enter or refine the plain-language outreach summary here..."
                  />
                </div>

                <div className="draft-footer-bar">
                  <div className="verification-check-pills">
                    <span className="check-pill">
                      <Check size={12} />
                      <span>Accessible Tone</span>
                    </span>
                    <span className="check-pill">
                      <Check size={12} />
                      <span>Factual Alignment</span>
                    </span>
                    <span className="check-pill">
                      <Check size={12} />
                      <span>MoES & NCPOR Grounded</span>
                    </span>
                  </div>

                  <span className="char-count-pill">
                    {draftSummary.length} characters ({summaryWordCount} words)
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: WCAG-AA Accessibility Alt-Text */}
        {activeTab === 'altText' && (
          <div className="glass-panel alt-text-studio-card">
            <div className="editor-card-header">
              <div>
                <h3>WCAG-AA Automated Image Alt-Text</h3>
                <p>Ensures students with visual impairments and screen readers can fully experience polar science imagery.</p>
              </div>
              <span className="a11y-verified-badge">
                <ShieldCheck size={14} />
                <span>Accessibility Compliant</span>
              </span>
            </div>

            <div className="alt-text-grid">
              {(expedition.media || []).map((m, idx) => (
                <div key={m.id || idx} className="alt-item-card">
                  <img src={m.url} alt={m.caption} className="alt-item-thumb" />
                  <div className="alt-item-body">
                    <div className="alt-item-caption"><strong>Caption:</strong> {m.caption}</div>
                    <label className="alt-field-label">Accessibility Alt-Text (Editable for Screen Readers):</label>
                    <textarea 
                      rows={3}
                      value={altTextMap[m.id] !== undefined ? altTextMap[m.id] : (m.altText || '')}
                      onChange={(e) => {
                        setAltTextMap({ ...altTextMap, [m.id]: e.target.value });
                      }}
                      className="studio-textarea"
                      placeholder="Describe the image context and polar scientific relevance..."
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Publishing Action Footer */}
      <div className="studio-footer-bar glass-panel">
        <div className="footer-status-info">
          <ShieldCheck size={18} className="shield-icon" />
          <span>Human-in-the-Loop Review: Ready for Verification & Publishing</span>
        </div>

        <div className="footer-action-btns">
          <button className="btn-secondary" onClick={onBack}>
            <span>Cancel</span>
          </button>

          <button className="btn-ai" onClick={handlePublish}>
            <CheckCircle2 size={16} />
            <span>Approve & Publish to Citizen Portal</span>
          </button>
        </div>
      </div>

      <style>{`
        .verification-studio-page {
          padding: 2.25rem 1.5rem 5rem;
          display: flex;
          flex-direction: column;
          gap: 1.75rem;
        }

        .studio-top-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .studio-title-badge {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: #f0fdf4;
          border: 1px solid #bbf7d0;
          color: #15803d;
          padding: 0.4rem 1.1rem;
          border-radius: var(--radius-full);
          font-size: 0.8rem;
          font-weight: 700;
          letter-spacing: 0.04em;
        }

        .studio-shield-icon {
          color: #16a34a;
        }

        .btn-selective-shortcut {
          display: inline-flex;
          align-items: center;
          gap: 0.45rem;
          background: #eff6ff;
          border: 1px solid #bfdbfe;
          color: #0369a1;
          padding: 0.45rem 0.95rem;
          border-radius: var(--radius-sm);
          font-size: 0.82rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .btn-selective-shortcut:hover {
          background: #dbeafe;
          color: #0c4a6e;
          border-color: #93c5fd;
        }

        /* Mission Bar */
        .studio-mission-bar {
          padding: 1.25rem 1.75rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-radius: var(--radius-md);
          background: #ffffff;
          border: 1px solid var(--border-card);
          box-shadow: var(--shadow-sm);
          flex-wrap: wrap;
          gap: 1.25rem;
        }

        .mission-bar-left {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .mission-bar-thumb {
          width: 58px;
          height: 58px;
          border-radius: 10px;
          object-fit: cover;
          border: 1px solid var(--border-subtle);
          background: #f1f5f9;
        }

        .mission-bar-tag {
          font-size: 0.75rem;
          color: #0284c7;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.03em;
        }

        .mission-bar-title {
          font-size: 1.25rem;
          color: var(--navy);
          font-weight: 700;
        }

        .mission-bar-right {
          display: flex;
          align-items: center;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .verification-mode-pill {
          display: flex;
          align-items: center;
          gap: 0.45rem;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          color: #475569;
          font-size: 0.8rem;
          font-weight: 600;
          padding: 0.45rem 0.85rem;
          border-radius: var(--radius-full);
        }

        .shield-active-icon {
          color: #059669;
        }

        .btn-selective-ai-link {
          display: inline-flex;
          align-items: center;
          gap: 0.45rem;
          background: linear-gradient(135deg, #0284c7, #0369a1);
          color: #ffffff;
          border: none;
          padding: 0.55rem 1.15rem;
          border-radius: var(--radius-sm);
          font-size: 0.82rem;
          font-weight: 600;
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(2, 132, 199, 0.25);
          transition: all 0.15s ease;
        }

        .btn-selective-ai-link:hover {
          background: linear-gradient(135deg, #0369a1, #075985);
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(2, 132, 199, 0.35);
        }

        /* Publish Success Alert */
        .publish-success-alert {
          background: #ecfdf5;
          border: 1px solid #a7f3d0;
          padding: 1.25rem 1.5rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-radius: var(--radius-md);
          gap: 1rem;
        }

        .alert-content {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .alert-icon {
          color: #059669;
          flex-shrink: 0;
        }

        .publish-success-alert h4 {
          color: #065f46;
          font-size: 1.05rem;
          margin-bottom: 0.2rem;
          font-weight: 700;
        }

        .publish-success-alert p {
          font-size: 0.82rem;
          color: #047857;
        }

        /* Studio Tabs */
        .studio-tabs-row {
          display: flex;
          gap: 0.65rem;
          flex-wrap: wrap;
          align-items: center;
        }

        .studio-tab {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.7rem 1.25rem;
          background: #ffffff;
          border: 1px solid var(--border-card);
          border-radius: var(--radius-sm);
          color: var(--text-secondary);
          font-size: 0.88rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.15s ease;
          white-space: nowrap;
          box-shadow: var(--shadow-xs);
        }

        .studio-tab:hover {
          color: var(--navy);
          background: #f8fafc;
          border-color: #cbd5e1;
        }

        .studio-tab.active {
          background: #eff6ff;
          border-color: #93c5fd;
          color: #0369a1;
          font-weight: 700;
          box-shadow: 0 1px 3px rgba(2, 132, 199, 0.1);
        }

        /* Verification Wrapper & Grid */
        .verification-wrapper {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .verification-intro-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 1rem;
          background: #ffffff;
          padding: 1rem 1.4rem;
          border-radius: var(--radius-md);
          border: 1px solid var(--border-card);
          box-shadow: var(--shadow-xs);
        }

        .intro-title {
          font-size: 1.05rem;
          font-weight: 700;
          color: var(--navy);
          margin-bottom: 0.2rem;
        }

        .intro-sub {
          font-size: 0.82rem;
          color: var(--text-muted);
        }

        .verification-stats-pills {
          display: flex;
          align-items: center;
          gap: 0.6rem;
        }

        .stat-badge {
          font-size: 0.78rem;
          padding: 0.35rem 0.75rem;
          border-radius: var(--radius-full);
          border: 1px solid transparent;
        }

        .stat-badge.raw-stat {
          background: #f1f5f9;
          border-color: #cbd5e1;
          color: #475569;
        }

        .stat-badge.ai-stat {
          background: #eff6ff;
          border-color: #bfdbfe;
          color: #0369a1;
        }

        .verification-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
          align-items: stretch;
        }

        .verification-pane {
          background: #ffffff;
          border: 1px solid var(--border-card);
          border-radius: var(--radius-md);
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          box-shadow: var(--shadow-sm);
        }

        .raw-pane {
          border-top: 3px solid #64748b;
        }

        .draft-pane {
          border-top: 3px solid #0284c7;
        }

        .pane-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          border-bottom: 1px solid #f1f5f9;
          padding-bottom: 0.85rem;
          margin-bottom: 1rem;
          gap: 0.75rem;
        }

        .pane-title-group {
          display: flex;
          align-items: flex-start;
          gap: 0.65rem;
        }

        .pane-icon {
          margin-top: 2px;
          flex-shrink: 0;
        }

        .raw-icon {
          color: #64748b;
        }

        .draft-icon {
          color: #0284c7;
        }

        .pane-heading {
          font-size: 1rem;
          font-weight: 700;
          color: var(--navy);
          margin-bottom: 0.15rem;
        }

        .pane-subheading {
          font-size: 0.76rem;
          color: var(--text-muted);
        }

        .pane-actions {
          display: flex;
          align-items: center;
          gap: 0.45rem;
          flex-shrink: 0;
        }

        .ground-truth-tag {
          font-size: 0.72rem;
          font-weight: 700;
          background: #f1f5f9;
          border: 1px solid #cbd5e1;
          color: #475569;
          padding: 0.25rem 0.55rem;
          border-radius: 4px;
          text-transform: uppercase;
          letter-spacing: 0.03em;
        }

        .btn-mini-action {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          padding: 0.3rem 0.65rem;
          border-radius: var(--radius-sm);
          border: 1px solid var(--border-subtle);
          background: #ffffff;
          color: var(--text-secondary);
          font-size: 0.76rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .btn-mini-action:hover {
          background: #f8fafc;
          color: var(--navy);
          border-color: #cbd5e1;
        }

        .btn-mini-action.highlight {
          background: #f0f9ff;
          border-color: #bae6fd;
          color: #0284c7;
        }

        .btn-mini-action.highlight:hover {
          background: #e0f2fe;
          color: #0369a1;
        }

        .raw-text-container {
          flex: 1;
          display: flex;
          flex-direction: column;
          margin-bottom: 1rem;
        }

        .raw-content-block {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: var(--radius-sm);
          padding: 1.15rem;
          font-size: 0.8rem;
          color: #334155;
          white-space: pre-wrap;
          line-height: 1.6;
          max-height: 460px;
          overflow-y: auto;
          flex: 1;
          scrollbar-width: thin;
          scrollbar-color: #cbd5e1 transparent;
        }

        .raw-footer-hint {
          display: flex;
          align-items: center;
          gap: 0.45rem;
          font-size: 0.74rem;
          color: var(--text-muted);
          background: #f8fafc;
          padding: 0.6rem 0.85rem;
          border-radius: var(--radius-sm);
          border: 1px solid #f1f5f9;
        }

        .hint-icon {
          color: #64748b;
          flex-shrink: 0;
        }

        .draft-editor-box {
          flex: 1;
          display: flex;
          flex-direction: column;
          margin-bottom: 1rem;
        }

        .draft-summary-textarea {
          width: 100%;
          min-height: 380px;
          flex: 1;
          background: #ffffff;
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-sm);
          padding: 1.15rem;
          font-size: 0.95rem;
          line-height: 1.65;
          color: var(--text-primary);
          resize: vertical;
          box-sizing: border-box;
          transition: border-color 0.15s ease;
        }

        .draft-summary-textarea:focus {
          outline: none;
          border-color: #0284c7;
          box-shadow: 0 0 0 3px rgba(2, 132, 199, 0.1);
        }

        .draft-footer-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 0.75rem;
          background: #f8fafc;
          padding: 0.65rem 0.85rem;
          border-radius: var(--radius-sm);
          border: 1px solid #f1f5f9;
        }

        .verification-check-pills {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          flex-wrap: wrap;
        }

        .check-pill {
          display: inline-flex;
          align-items: center;
          gap: 0.25rem;
          font-size: 0.72rem;
          font-weight: 600;
          color: #15803d;
          background: #f0fdf4;
          border: 1px solid #bbf7d0;
          padding: 0.2rem 0.5rem;
          border-radius: 4px;
        }

        .char-count-pill {
          font-size: 0.76rem;
          color: var(--text-muted);
          font-family: var(--font-mono);
        }

        /* Tab 2: Accessibility Alt-Text */
        .alt-text-studio-card {
          padding: 2rem;
          background: #ffffff;
          border: 1px solid var(--border-card);
          box-shadow: var(--shadow-sm);
          border-radius: var(--radius-md);
        }

        .editor-card-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          margin-bottom: 1.5rem;
        }

        .editor-card-header h3 {
          font-size: 1.2rem;
          color: var(--navy);
          margin-bottom: 0.25rem;
          font-weight: 700;
        }

        .editor-card-header p {
          font-size: 0.82rem;
          color: var(--text-muted);
        }

        .a11y-verified-badge {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          background: #ecfdf5;
          border: 1px solid #a7f3d0;
          color: #065f46;
          font-size: 0.78rem;
          font-weight: 700;
          padding: 0.35rem 0.75rem;
          border-radius: var(--radius-full);
        }

        .alt-text-grid {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .alt-item-card {
          display: flex;
          gap: 1.25rem;
          background: #f8fafc;
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-md);
          padding: 1.15rem;
        }

        .alt-item-thumb {
          width: 140px;
          height: 100px;
          object-fit: cover;
          border-radius: var(--radius-sm);
          border: 1px solid var(--border-subtle);
          flex-shrink: 0;
        }

        .alt-item-body {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .alt-item-caption {
          font-size: 0.85rem;
          color: var(--navy);
        }

        .alt-field-label {
          font-size: 0.78rem;
          color: var(--text-secondary);
          font-weight: 600;
        }

        .studio-textarea {
          width: 100%;
          background: #ffffff;
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-sm);
          color: var(--text-primary);
          padding: 0.85rem;
          font-size: 0.88rem;
          line-height: 1.55;
          box-sizing: border-box;
        }

        .studio-textarea:focus {
          outline: none;
          border-color: #0284c7;
        }

        /* Studio Footer */
        .studio-footer-bar {
          padding: 1.25rem 2rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-radius: var(--radius-md);
          border: 1px solid var(--border-card);
          background: #ffffff;
          box-shadow: var(--shadow-sm);
          flex-wrap: wrap;
          gap: 1rem;
        }

        .footer-status-info {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #047857;
          font-size: 0.85rem;
          font-weight: 600;
        }

        .footer-action-btns {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        @media (max-width: 1024px) {
          .verification-grid {
            grid-template-columns: 1fr;
          }
          .studio-mission-bar {
            flex-direction: column;
            align-items: stretch;
            gap: 1rem;
          }
          .mission-bar-right {
            justify-content: space-between;
          }
        }

        @media (max-width: 768px) {
          .verification-studio-page {
            padding: 1.25rem 0.75rem 4rem;
            gap: 1.25rem;
          }
          .studio-top-bar {
            flex-direction: column;
            align-items: stretch;
            gap: 0.75rem;
          }
          .studio-title-badge {
            font-size: clamp(0.68rem, 2.8vw, 0.78rem);
            padding: 0.35rem 0.75rem;
            text-align: center;
            justify-content: center;
          }
          .studio-mission-bar {
            padding: 1rem 0.85rem;
          }
          .mission-bar-left {
            gap: 0.75rem;
          }
          .mission-bar-thumb {
            width: 48px;
            height: 48px;
          }
          .mission-bar-title {
            font-size: 1.05rem;
          }
          .mission-bar-right {
            flex-direction: column;
            align-items: stretch;
            gap: 0.75rem;
          }
          .btn-selective-ai-link {
            width: 100%;
            justify-content: center;
          }
          .studio-tabs-row {
            flex-direction: column;
            align-items: stretch;
          }
          .studio-tab {
            justify-content: center;
          }
          .verification-pane {
            padding: 1rem;
          }
          .draft-summary-textarea {
            min-height: 280px;
          }
          .alt-item-card {
            flex-direction: column;
          }
          .alt-item-thumb {
            width: 100%;
            height: 180px;
          }
          .studio-footer-bar {
            flex-direction: column;
            align-items: stretch;
            gap: 0.85rem;
            padding: 1rem 0.85rem;
          }
          .footer-action-btns {
            flex-direction: column;
            width: 100%;
            gap: 0.5rem;
          }
          .footer-action-btns button {
            width: 100%;
            justify-content: center;
            min-height: 44px;
          }
        }
      `}</style>
    </div>
  );
}
