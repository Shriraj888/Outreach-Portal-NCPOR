import { useState } from 'react';
import { usePortal } from '../../context/PortalContext';
import { 
  generateOutreachPackage, 
  AI_AUDIENCE_TONES, 
  buildPromptTemplate 
} from '../../services/aiService';
import { 
  ArrowLeft, 
  Sparkles, 
  CheckCircle2, 
  ShieldCheck, 
  Eye, 
  FileText, 
  Share2, 
  RotateCcw, 
  Code,
  Terminal
} from 'lucide-react';
import { TwitterIcon, InstagramIcon, LinkedinIcon } from '../../components/SocialIcons';
import SocialCardPreview from '../../components/SocialCardPreview';

export default function AIGenerateStudio({ expeditionId, onBack, onSelectExpedition }) {
  const { expeditions, saveGeneratedContent } = usePortal();
  const expedition = expeditions.find(e => e.id === expeditionId) || expeditions[0];

  const [audience, setAudience] = useState('general');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showPromptInspector, setShowPromptInspector] = useState(false);
  const [activeTab, setActiveTab] = useState('summary'); // summary, social, altText, compare

  // Working draft states
  const [draftSummary, setDraftSummary] = useState(expedition.aiGeneratedContent?.summary || expedition.summary || '');
  const [draftTwitter, setDraftTwitter] = useState(expedition.aiGeneratedContent?.socialCaptions?.twitter || '');
  const [draftInstagram, setDraftInstagram] = useState(expedition.aiGeneratedContent?.socialCaptions?.instagram || '');
  const [draftLinkedin, setDraftLinkedin] = useState(expedition.aiGeneratedContent?.socialCaptions?.linkedin || '');
  const [draftFactCards, setDraftFactCards] = useState(expedition.aiGeneratedContent?.factCards || [
    "Deep ice core extracted near Dome C margin.",
    "Zero-waste solar green microgrid tested at Bharati.",
    "Over 8,000 years of paleoclimate history documented."
  ]);
  const [altTextMap, setAltTextMap] = useState({});

  const [publishSuccess, setPublishSuccess] = useState(false);

  // Trigger Generation
  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const rawReport = expedition.reports && expedition.reports[0]?.rawText ? expedition.reports[0].rawText : expedition.scientificAbstract;
      const result = await generateOutreachPackage({
        expedition: { ...expedition, scientificAbstract: rawReport },
        audience
      });

      setDraftSummary(result.summary);
      setDraftTwitter(result.socialCaptions.twitter);
      setDraftInstagram(result.socialCaptions.instagram);
      setDraftLinkedin(result.socialCaptions.linkedin);
      setDraftFactCards(result.factCards);

      // Map Alt texts
      const newAltMap = {};
      (result.altTextSuggestions || []).forEach(item => {
        newAltMap[item.mediaId] = item.suggestedAlt;
      });
      setAltTextMap(newAltMap);
    } catch (e) {
      console.error(e);
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePublish = () => {
    const aiPackage = {
      summary: draftSummary,
      socialCaptions: {
        twitter: draftTwitter,
        instagram: draftInstagram,
        linkedin: draftLinkedin
      },
      factCards: draftFactCards,
      isApproved: true,
      approvedAt: new Date().toISOString()
    };

    saveGeneratedContent(expedition.id, aiPackage, true);
    setPublishSuccess(true);
    setTimeout(() => {
      setPublishSuccess(false);
    }, 4000);
  };

  const prompts = buildPromptTemplate({
    title: expedition.title,
    region: expedition.region,
    year: expedition.year,
    chiefScientist: expedition.chiefScientist,
    rawText: expedition.reports?.[0]?.rawText || expedition.scientificAbstract,
    audience: AI_AUDIENCE_TONES.find(a => a.id === audience)?.label || "General Public",
    contentType: "summary"
  });

  return (
    <div className="container ai-studio-page">
      {/* Top Banner */}
      <div className="studio-top-bar">
        <button className="btn-back" onClick={onBack}>
          <ArrowLeft size={16} />
          <span>Back to Dashboard</span>
        </button>

        <div className="studio-title-badge">
          <Sparkles size={16} className="studio-sparkle pulse-glow" />
          <span>NCPOR AI CONTENT GENERATION & REVIEW STUDIO</span>
        </div>

        <button 
          className="btn-text-action"
          onClick={() => setShowPromptInspector(!showPromptInspector)}
        >
          <Code size={14} />
          <span>{showPromptInspector ? 'Hide Prompt Design' : 'Inspect LLM Prompts'}</span>
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
          <div className="tone-selector-wrap">
            <span className="tone-label">Target Audience & Tone:</span>
            <select 
              value={audience} 
              onChange={(e) => setAudience(e.target.value)}
              className="tone-select-field"
            >
              {AI_AUDIENCE_TONES.map(t => (
                <option key={t.id} value={t.id}>{t.label}</option>
              ))}
            </select>
          </div>

          <button 
            className="btn-ai generate-btn"
            onClick={handleGenerate}
            disabled={isGenerating}
          >
            <Sparkles size={16} className={isGenerating ? 'spin-anim' : ''} />
            <span>{isGenerating ? 'Synthesizing with AI...' : 'Generate All Outreach Content'}</span>
          </button>
        </div>
      </div>

      {/* Prompt Inspector Modal / Collapsible */}
      {showPromptInspector && (
        <div className="glass-panel prompt-inspector-card">
          <div className="prompt-header">
            <Terminal size={16} className="prompt-term-icon" />
            <h4>Prompt Engineering & Institutional Grounding Architecture</h4>
          </div>
          <div className="prompt-grid">
            <div>
              <div className="prompt-box-label">System Role Prompt:</div>
              <pre className="prompt-code-block">{prompts.systemPrompt}</pre>
            </div>
            <div>
              <div className="prompt-box-label">Task Instruction Prompt ({audience}):</div>
              <pre className="prompt-code-block">{prompts.taskPrompt}</pre>
            </div>
          </div>
        </div>
      )}

      {/* Success Notification Alert */}
      {publishSuccess && (
        <div className="publish-success-alert glass-panel">
          <div className="alert-content">
            <CheckCircle2 size={24} className="alert-icon" />
            <div>
              <h4>Successfully Approved & Published to Live Citizen Portal!</h4>
              <p>The AI-enhanced summary, alt-text tags, and social press kit are now publicly discoverable.</p>
            </div>
          </div>
          <button 
            className="btn-primary btn-sm"
            onClick={() => onSelectExpedition(expedition.id)}
          >
            <span>View Live Expedition Page</span>
            <Eye size={14} />
          </button>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="studio-tabs-row">
        <button 
          className={`studio-tab ${activeTab === 'summary' ? 'active' : ''}`}
          onClick={() => setActiveTab('summary')}
        >
          <FileText size={15} />
          <span>1. Plain-Language Summary Draft</span>
        </button>

        <button 
          className={`studio-tab ${activeTab === 'social' ? 'active' : ''}`}
          onClick={() => setActiveTab('social')}
        >
          <Share2 size={15} />
          <span>2. Multi-Platform Social Media Studio</span>
        </button>

        <button 
          className={`studio-tab ${activeTab === 'altText' ? 'active' : ''}`}
          onClick={() => setActiveTab('altText')}
        >
          <ShieldCheck size={15} />
          <span>3. WCAG-AA Accessibility Alt-Text</span>
        </button>

        <button 
          className={`studio-tab ${activeTab === 'compare' ? 'active' : ''}`}
          onClick={() => setActiveTab('compare')}
        >
          <RotateCcw size={15} />
          <span>4. Side-by-Side Verification (Raw vs AI)</span>
        </button>
      </div>

      {/* Tab Panels */}
      <div className="studio-main-body">
        {/* Tab 1: Plain-Language Summary */}
        {activeTab === 'summary' && (
          <div className="glass-panel studio-editor-card">
            <div className="editor-card-header">
              <div>
                <h3>Plain-Language Outreach Summary</h3>
                <p>Designed for students, journalists, and citizens. Edit directly below before final publishing.</p>
              </div>
              <span className="char-indicator">{draftSummary.length} characters</span>
            </div>

            <textarea 
              rows={6}
              value={draftSummary}
              onChange={(e) => setDraftSummary(e.target.value)}
              className="studio-textarea summary-field"
              placeholder="Click 'Generate All Outreach Content' above or type draft summary..."
            />

            {/* Fact Cards / Bullets Editor */}
            <div className="fact-cards-editor-section">
              <h4>Classroom Fact Cards & Slide Bullets</h4>
              <div className="fact-cards-inputs">
                {draftFactCards.map((fact, idx) => (
                  <div key={idx} className="fact-input-row">
                    <span className="fact-idx">0{idx + 1}</span>
                    <input 
                      type="text"
                      value={fact}
                      onChange={(e) => {
                        const updated = [...draftFactCards];
                        updated[idx] = e.target.value;
                        setDraftFactCards(updated);
                      }}
                      className="form-input"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Social Media Studio */}
        {activeTab === 'social' && (
          <div className="studio-social-layout">
            <div className="glass-panel social-editor-pane">
              <h3>Edit Social Media Captions</h3>
              <p>Platform tone variants tuned with Government of India and polar research tags.</p>

              <div className="social-edit-group">
                <div className="social-label-row">
                  <span className="platform-tag twitter"><TwitterIcon size={13} /> Twitter / X (Under 280 chars)</span>
                  <span className="char-badge">{draftTwitter.length} / 280</span>
                </div>
                <textarea 
                  rows={4}
                  value={draftTwitter}
                  onChange={(e) => setDraftTwitter(e.target.value)}
                  className="studio-textarea"
                />
              </div>

              <div className="social-edit-group">
                <div className="social-label-row">
                  <span className="platform-tag instagram"><InstagramIcon size={13} /> Instagram (Storytelling + Hashtags)</span>
                </div>
                <textarea 
                  rows={6}
                  value={draftInstagram}
                  onChange={(e) => setDraftInstagram(e.target.value)}
                  className="studio-textarea"
                />
              </div>

              <div className="social-edit-group">
                <div className="social-label-row">
                  <span className="platform-tag linkedin"><LinkedinIcon size={13} /> LinkedIn (Executive & Policy Impact)</span>
                </div>
                <textarea 
                  rows={6}
                  value={draftLinkedin}
                  onChange={(e) => setDraftLinkedin(e.target.value)}
                  className="studio-textarea"
                />
              </div>
            </div>

            {/* Live Interactive Preview */}
            <div className="social-preview-pane">
              <SocialCardPreview 
                aiContent={{
                  socialCaptions: {
                    twitter: draftTwitter,
                    instagram: draftInstagram,
                    linkedin: draftLinkedin
                  },
                  factCards: draftFactCards
                }}
                expeditionTitle={expedition.title}
                region={expedition.region}
                mediaUrl={expedition.media && expedition.media[0]?.url}
              />
            </div>
          </div>
        )}

        {/* Tab 3: Accessibility Alt-Text */}
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
                    <label className="alt-field-label">AI Suggested Alt-Text (Editable):</label>
                    <textarea 
                      rows={3}
                      value={altTextMap[m.id] || m.altText}
                      onChange={(e) => {
                        setAltTextMap({ ...altTextMap, [m.id]: e.target.value });
                      }}
                      className="studio-textarea"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: Side-by-Side Comparison */}
        {activeTab === 'compare' && (
          <div className="compare-grid">
            <div className="glass-panel compare-pane">
              <div className="compare-pane-header">
                <FileText size={16} />
                <h4>Original Raw Technical Scientific Report (Extracted Text)</h4>
              </div>
              <pre className="compare-raw-box font-mono">
                {expedition.reports && expedition.reports[0]?.rawText ? expedition.reports[0].rawText : expedition.scientificAbstract}
              </pre>
            </div>

            <div className="glass-panel compare-pane ai-pane">
              <div className="compare-pane-header">
                <Sparkles size={16} />
                <h4>AI-Generated Public Outreach Summary</h4>
              </div>
              <div className="compare-ai-box">
                <p>{draftSummary}</p>
                <div className="compare-social-snippets">
                  <div className="snippet-item">
                    <strong>Twitter Draft:</strong> {draftTwitter}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Publishing Action Footer */}
      <div className="studio-footer-bar glass-panel">
        <div className="footer-status-info">
          <ShieldCheck size={18} className="shield-icon" />
          <span>Human-in-the-Loop Review: Ready for Approval</span>
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
        .ai-studio-page {
          padding: 2.5rem 1.5rem 5rem;
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
          gap: 0.45rem;
          background: linear-gradient(135deg, rgba(147, 51, 234, 0.25), rgba(217, 70, 239, 0.25));
          border: 1px solid rgba(217, 70, 239, 0.4);
          color: #f0abfc;
          padding: 0.35rem 1rem;
          border-radius: var(--radius-full);
          font-size: 0.78rem;
          font-weight: 700;
          letter-spacing: 0.04em;
        }

        .studio-sparkle {
          color: #d946ef;
        }

        /* Mission Bar */
        .studio-mission-bar {
          padding: 1.25rem 1.75rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-radius: var(--radius-md);
          border: 1px solid rgba(56, 189, 248, 0.3);
          flex-wrap: wrap;
          gap: 1.25rem;
        }

        .mission-bar-left {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .mission-bar-thumb {
          width: 56px;
          height: 56px;
          border-radius: 10px;
          object-fit: cover;
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .mission-bar-tag {
          font-size: 0.75rem;
          color: var(--accent-cyan);
          font-weight: 700;
        }

        .mission-bar-title {
          font-size: 1.25rem;
          color: #ffffff;
        }

        .mission-bar-right {
          display: flex;
          align-items: center;
          gap: 1.25rem;
          flex-wrap: wrap;
        }

        .tone-selector-wrap {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .tone-label {
          font-size: 0.78rem;
          color: var(--text-muted);
        }

        .tone-select-field {
          background: #040810;
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-sm);
          color: #ffffff;
          padding: 0.5rem 0.85rem;
          font-size: 0.82rem;
          cursor: pointer;
        }

        .spin-anim {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          100% { transform: rotate(360deg); }
        }

        /* Prompt Inspector */
        .prompt-inspector-card {
          padding: 1.5rem;
          background: #040810;
          border: 1px solid rgba(56, 189, 248, 0.3);
        }

        .prompt-header {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: var(--accent-cyan);
          margin-bottom: 1rem;
        }

        .prompt-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.25rem;
        }

        .prompt-box-label {
          font-size: 0.75rem;
          color: var(--text-muted);
          margin-bottom: 0.35rem;
          font-weight: 600;
        }

        .prompt-code-block {
          background: #091322;
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: var(--radius-sm);
          padding: 1rem;
          font-family: var(--font-mono);
          font-size: 0.75rem;
          color: #94a3b8;
          white-space: pre-wrap;
          line-height: 1.45;
          max-height: 200px;
          overflow-y: auto;
        }

        /* Publish Success Alert */
        .publish-success-alert {
          background: rgba(16, 185, 129, 0.15);
          border: 1px solid rgba(16, 185, 129, 0.4);
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
          color: #10b981;
          flex-shrink: 0;
        }

        .publish-success-alert h4 {
          color: #ffffff;
          font-size: 1.05rem;
          margin-bottom: 0.2rem;
        }

        .publish-success-alert p {
          font-size: 0.82rem;
          color: #6ee7b7;
        }

        /* Studio Tabs */
        .studio-tabs-row {
          display: flex;
          gap: 0.5rem;
          overflow-x: auto;
        }

        .studio-tab {
          display: flex;
          align-items: center;
          gap: 0.45rem;
          padding: 0.65rem 1.25rem;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-sm);
          color: var(--text-secondary);
          font-size: 0.85rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          white-space: nowrap;
        }

        .studio-tab:hover {
          color: #ffffff;
          background: rgba(255, 255, 255, 0.08);
        }

        .studio-tab.active {
          background: rgba(147, 51, 234, 0.2);
          border-color: #c084fc;
          color: #f0abfc;
        }

        /* Editor Card */
        .studio-editor-card {
          padding: 2rem;
        }

        .editor-card-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          margin-bottom: 1.25rem;
        }

        .editor-card-header h3 {
          font-size: 1.25rem;
          color: #ffffff;
          margin-bottom: 0.25rem;
        }

        .editor-card-header p {
          font-size: 0.82rem;
          color: var(--text-muted);
        }

        .char-indicator {
          font-size: 0.75rem;
          color: var(--text-muted);
          font-family: var(--font-mono);
        }

        .studio-textarea {
          width: 100%;
          background: #040810;
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-sm);
          color: #ffffff;
          padding: 1rem;
          font-size: 0.95rem;
          line-height: 1.6;
        }

        .studio-textarea:focus {
          outline: none;
          border-color: var(--accent-ice);
        }

        .summary-field {
          font-size: 1.05rem;
          margin-bottom: 2rem;
        }

        .fact-cards-editor-section h4 {
          font-size: 1rem;
          color: #fbbf24;
          margin-bottom: 1rem;
        }

        .fact-cards-inputs {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .fact-input-row {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .fact-idx {
          font-family: var(--font-mono);
          color: #fbbf24;
          font-weight: 700;
          font-size: 0.85rem;
        }

        /* Social Layout */
        .studio-social-layout {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.75rem;
        }

        .social-editor-pane {
          padding: 1.75rem;
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .social-edit-group {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
        }

        .social-label-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .platform-tag {
          font-size: 0.78rem;
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 0.35rem;
        }

        .platform-tag.twitter { color: #38bdf8; }
        .platform-tag.instagram { color: #f43f5e; }
        .platform-tag.linkedin { color: #60a5fa; }

        /* Alt-Text Studio */
        .alt-text-studio-card {
          padding: 2rem;
        }

        .alt-text-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
        }

        .alt-item-card {
          display: flex;
          gap: 1rem;
          background: rgba(7, 13, 24, 0.7);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-sm);
          padding: 1rem;
        }

        .alt-item-thumb {
          width: 110px;
          height: 110px;
          border-radius: var(--radius-sm);
          object-fit: cover;
          flex-shrink: 0;
        }

        .alt-item-body {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .alt-item-caption {
          font-size: 0.82rem;
          color: #ffffff;
        }

        .alt-field-label {
          font-size: 0.72rem;
          color: var(--accent-cyan);
          font-weight: 600;
        }

        /* Compare Grid */
        .compare-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.75rem;
        }

        .compare-pane {
          padding: 1.75rem;
          display: flex;
          flex-direction: column;
        }

        .compare-pane-header {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #ffffff;
          margin-bottom: 1rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          padding-bottom: 0.75rem;
        }

        .compare-raw-box {
          background: #040810;
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: var(--radius-sm);
          padding: 1.25rem;
          font-size: 0.78rem;
          color: #94a3b8;
          white-space: pre-wrap;
          line-height: 1.5;
          max-height: 400px;
          overflow-y: auto;
          flex: 1;
        }

        .compare-ai-box {
          font-size: 0.95rem;
          line-height: 1.65;
          color: #f1f5f9;
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .compare-social-snippets {
          background: rgba(147, 51, 234, 0.1);
          border: 1px solid rgba(168, 85, 247, 0.3);
          border-radius: var(--radius-sm);
          padding: 1rem;
          font-size: 0.85rem;
          color: #e2e8f0;
        }

        /* Studio Footer */
        .studio-footer-bar {
          padding: 1.25rem 2rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-radius: var(--radius-md);
          border: 1px solid rgba(168, 85, 247, 0.4);
          background: linear-gradient(180deg, rgba(24, 18, 48, 0.9) 0%, rgba(15, 29, 53, 0.95) 100%);
          flex-wrap: wrap;
          gap: 1rem;
        }

        .footer-status-info {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #6ee7b7;
          font-size: 0.85rem;
          font-weight: 600;
        }

        .footer-action-btns {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        @media (max-width: 1024px) {
          .studio-social-layout, .prompt-grid, .alt-text-grid, .compare-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
