import { useState } from 'react';
import { usePortal } from '../../context/PortalContext';
import { autoGenerateImageAlt } from '../../services/aiService';
import { 
  ArrowLeft, 
  Save, 
  Sparkles, 
  Image as ImageIcon, 
  FileText, 
  Plus, 
  Trash2, 
  Layers
} from 'lucide-react';

export default function ExpeditionForm({ expeditionId, onBack, navigateTo }) {
  const { expeditions, addExpedition, updateExpedition } = usePortal();
  const isEditing = !!expeditionId;

  const existingExpedition = isEditing ? expeditions.find(e => e.id === expeditionId) : null;

  // Form fields initialized directly with existing or demo defaults
  const [title, setTitle] = useState(existingExpedition?.title || (isEditing ? '' : '44th Indian Scientific Expedition to Antarctica'));
  const [region, setRegion] = useState(existingExpedition?.region || 'Antarctica');
  const [year, setYear] = useState(existingExpedition?.year || 2024);
  const [chiefScientist, setChiefScientist] = useState(existingExpedition?.chiefScientist || (isEditing ? '' : 'Dr. Rahul Sengupta (NCPOR)'));
  const [vessel, setVessel] = useState(existingExpedition?.vessel || (isEditing ? '' : 'MV Vasiliy Golovnin (Chartered Polar Vessel)'));
  const [stationInput, setStationInput] = useState('');
  const [stations, setStations] = useState(existingExpedition?.stations || (isEditing ? [] : ['Maitri Station', 'Bharati Station']));
  const [heroImage, setHeroImage] = useState(existingExpedition?.heroImage || 'https://images.unsplash.com/photo-1517411032315-54ef2cb783bb?auto=format&fit=crop&w=1200&q=80');
  const [summary, setSummary] = useState(existingExpedition?.summary || (isEditing ? '' : 'Preliminary scientific deployment focusing on coastal ice shelf dynamics and environmental monitoring.'));
  const [scientificAbstract, setScientificAbstract] = useState(existingExpedition?.scientificAbstract || (isEditing ? '' : 'The 44th ISEA deployed advanced automatic weather monitoring arrays and continuous paleoclimatic snow pit sampling to evaluate austral summer temperature gradients.'));
  const [keyFindingsText, setKeyFindingsText] = useState((existingExpedition?.keyFindings || (isEditing ? [] : [
    'Deployed 4 automated acoustic snow depth sensors.',
    'Recorded boundary layer ozone fluctuations.',
    'Collected 80 surface snow firn samples.'
  ])).join('\n'));
  const [reportRawText, setReportRawText] = useState(
    existingExpedition?.reports?.[0]?.rawText || (isEditing ? '' : `NATIONAL CENTRE FOR POLAR AND OCEAN RESEARCH (NCPOR)
Ministry of Earth Sciences, Govt. of India
44TH INDIAN SCIENTIFIC EXPEDITION TO ANTARCTICA (ISEA)

Preliminary Science Log:
The voyage departed Cape Town with 48 scientists from MoES institutes, Survey of India, and IITs. Core missions include high-resolution aerosol monitoring at Bharati, permafrost temperature logging at Maitri, and testing cold-hardened autonomous glaciology buoys.`)
  );
  const [mediaList, setMediaList] = useState(existingExpedition?.media || (isEditing ? [] : [
    {
      id: `m-init-1`,
      type: 'photo',
      url: 'https://images.unsplash.com/photo-1517411032315-54ef2cb783bb?auto=format&fit=crop&w=1200&q=80',
      caption: 'Bharati Station under clear Antarctic skies.',
      altText: 'Modern scientific research architecture Bharati Station on rocky outcrop against pure snow background.'
    }
  ]));

  const handleAddStation = () => {
    if (stationInput.trim() && !stations.includes(stationInput.trim())) {
      setStations([...stations, stationInput.trim()]);
      setStationInput('');
    }
  };

  const handleRemoveStation = (name) => {
    setStations(stations.filter(s => s !== name));
  };

  const handleAddMedia = () => {
    const newMedia = {
      id: `m-${Date.now()}`,
      type: 'photo',
      url: 'https://images.unsplash.com/photo-1508873696983-2df5293cb32f?auto=format&fit=crop&w=1200&q=80',
      caption: 'Glaciology team conducting survey.',
      altText: autoGenerateImageAlt('Glaciology team survey', region)
    };
    setMediaList([...mediaList, newMedia]);
  };

  const handleUpdateMedia = (index, field, value) => {
    const updated = [...mediaList];
    updated[index][field] = value;
    setMediaList(updated);
  };

  const handleAutoAlt = (index) => {
    const updated = [...mediaList];
    updated[index].altText = autoGenerateImageAlt(updated[index].caption || title, region);
    setMediaList(updated);
  };

  const handleRemoveMedia = (index) => {
    setMediaList(mediaList.filter((_, i) => i !== index));
  };

  const handleSubmit = (e, andLaunchAI = false) => {
    e.preventDefault();

    const findingsArray = keyFindingsText
      .split('\n')
      .map(s => s.trim())
      .filter(Boolean);

    const expeditionData = {
      title,
      region,
      year: Number(year),
      chiefScientist,
      vessel,
      stations,
      heroImage,
      summary,
      scientificAbstract,
      keyFindings: findingsArray,
      reports: [
        {
          id: `rep-${Date.now()}`,
          title: `Technical Report: ${title}`,
          fileUrl: '#',
          fileSize: '12.4 MB',
          rawText: reportRawText
        }
      ],
      media: mediaList
    };

    let targetId = expeditionId;
    if (isEditing) {
      updateExpedition(expeditionId, expeditionData);
    } else {
      const created = addExpedition(expeditionData);
      targetId = created.id;
    }

    if (andLaunchAI) {
      navigateTo(`admin-generate-${targetId}`);
    } else {
      navigateTo('admin-dashboard');
    }
  };

  return (
    <div className="container expedition-form-page">
      {/* Top Header */}
      <div className="form-top-bar">
        <button className="btn-back" onClick={onBack}>
          <ArrowLeft size={16} />
          <span>Back to Dashboard</span>
        </button>

        <h2>{isEditing ? `Edit: ${existingExpedition?.title}` : 'Archive New Polar Expedition'}</h2>
      </div>

      <form onSubmit={(e) => handleSubmit(e, false)} className="expedition-main-form">
        {/* Section 1: Basic Metadata */}
        <div className="glass-panel form-section-card">
          <h3 className="section-title-tag">
            <Layers size={18} />
            <span>1. Mission Metadata & Classification</span>
          </h3>

          <div className="form-grid-2">
            <div className="form-group full-span">
              <label>Official Expedition Title *</label>
              <input 
                type="text" 
                required 
                value={title} 
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. 44th Indian Scientific Expedition to Antarctica"
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label>Frontier Region *</label>
              <select 
                value={region} 
                onChange={(e) => setRegion(e.target.value)}
                className="form-input"
              >
                <option value="Antarctica">Antarctica (ISEA)</option>
                <option value="Arctic">Arctic (Himadri / IndARC)</option>
                <option value="Himalaya">Himalayan Cryosphere (Himansh)</option>
                <option value="Southern Ocean">Southern Ocean</option>
              </select>
            </div>

            <div className="form-group">
              <label>Expedition Year *</label>
              <input 
                type="number" 
                required 
                value={year} 
                onChange={(e) => setYear(e.target.value)}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label>Chief Scientist / Expedition Leader</label>
              <input 
                type="text" 
                value={chiefScientist} 
                onChange={(e) => setChiefScientist(e.target.value)}
                placeholder="e.g. Dr. Alok Kumar Sharma (NCPOR)"
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label>Vessel / Transport Logistics</label>
              <input 
                type="text" 
                value={vessel} 
                onChange={(e) => setVessel(e.target.value)}
                placeholder="e.g. MV Vasiliy Golovnin (Chartered Ice-Class)"
                className="form-input"
              />
            </div>

            <div className="form-group full-span">
              <label>Research Stations / Observation Coordinates</label>
              <div className="station-input-group">
                <input 
                  type="text" 
                  value={stationInput} 
                  onChange={(e) => setStationInput(e.target.value)}
                  placeholder="e.g. Bharati Station, Larsemann Hills"
                  className="form-input"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddStation();
                    }
                  }}
                />
                <button type="button" className="btn-secondary" onClick={handleAddStation}>
                  <Plus size={15} />
                  <span>Add Station</span>
                </button>
              </div>

              <div className="station-tags-row">
                {stations.map((st, i) => (
                  <span key={i} className="station-badge">
                    <span>{st}</span>
                    <button type="button" onClick={() => handleRemoveStation(st)}>×</button>
                  </span>
                ))}
              </div>
            </div>

            <div className="form-group full-span">
              <label>Hero Photograph URL</label>
              <input 
                type="url" 
                value={heroImage} 
                onChange={(e) => setHeroImage(e.target.value)}
                className="form-input"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Scientific Report & Raw Ingestion */}
        <div className="glass-panel form-section-card">
          <h3 className="section-title-tag">
            <FileText size={18} />
            <span>2. Scientific Report & Raw Text Ingestion (Source for AI Studio)</span>
          </h3>

          <div className="form-group">
            <label>Short Public Description</label>
            <textarea 
              rows={3}
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="A brief 2-3 sentence overview..."
              className="form-textarea"
            />
          </div>

          <div className="form-group">
            <label>Scientific Abstract & Mission Scope</label>
            <textarea 
              rows={4}
              value={scientificAbstract}
              onChange={(e) => setScientificAbstract(e.target.value)}
              placeholder="Technical summary of glaciological, atmospheric, or oceanic research..."
              className="form-textarea"
            />
          </div>

          <div className="form-group">
            <label>Key Discoveries & Deliverables (One per line)</label>
            <textarea 
              rows={3}
              value={keyFindingsText}
              onChange={(e) => setKeyFindingsText(e.target.value)}
              placeholder="Recovered 122m ice core&#10;Tested green microgrid&#10;Isolated cold-active microbes"
              className="form-textarea"
            />
          </div>

          <div className="form-group">
            <div className="raw-header-row">
              <label>Extracted Technical Report Text (Ingested by AI Engine)</label>
              <span className="raw-char-count">{reportRawText.length} characters</span>
            </div>
            <textarea 
              rows={6}
              value={reportRawText}
              onChange={(e) => setReportRawText(e.target.value)}
              placeholder="Paste raw cruise reports, progress logs, or executive summaries for LLM prompt ingestion..."
              className="form-textarea font-mono"
            />
          </div>
        </div>

        {/* Section 3: Media Assets with WCAG-AA Alt-Text */}
        <div className="glass-panel form-section-card">
          <div className="section-header-flex">
            <h3 className="section-title-tag">
              <ImageIcon size={18} />
              <span>3. Media Assets & Accessibility Alt-Text</span>
            </h3>
            <button type="button" className="btn-secondary" onClick={handleAddMedia}>
              <Plus size={15} />
              <span>Add Media Photo</span>
            </button>
          </div>

          <div className="media-form-list">
            {mediaList.map((m, idx) => (
              <div key={m.id || idx} className="media-form-item">
                <div className="media-preview-box">
                  <img src={m.url} alt={m.caption} className="media-form-thumb" />
                </div>

                <div className="media-form-fields">
                  <div className="form-group">
                    <label>Image URL</label>
                    <input 
                      type="url" 
                      value={m.url}
                      onChange={(e) => handleUpdateMedia(idx, 'url', e.target.value)}
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label>Caption</label>
                    <input 
                      type="text" 
                      value={m.caption}
                      onChange={(e) => handleUpdateMedia(idx, 'caption', e.target.value)}
                      placeholder="e.g. Bharati Station under midnight sun"
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <div className="alt-label-row">
                      <label>WCAG-AA Accessibility Alt-Text</label>
                      <button 
                        type="button" 
                        className="btn-auto-alt"
                        onClick={() => handleAutoAlt(idx)}
                      >
                        <Sparkles size={12} />
                        <span>AI Auto-Generate Alt</span>
                      </button>
                    </div>
                    <textarea 
                      rows={2}
                      value={m.altText}
                      onChange={(e) => handleUpdateMedia(idx, 'altText', e.target.value)}
                      className="form-textarea"
                    />
                  </div>
                </div>

                <button 
                  type="button" 
                  className="btn-trash-media"
                  onClick={() => handleRemoveMedia(idx)}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Submit Actions */}
        <div className="form-action-footer">
          <button type="button" className="btn-secondary" onClick={onBack}>
            <span>Cancel</span>
          </button>

          <div className="submit-btns-right">
            <button type="submit" className="btn-secondary">
              <Save size={16} />
              <span>Save as Draft Archive</span>
            </button>

            <button 
              type="button" 
              className="btn-ai"
              onClick={(e) => handleSubmit(e, true)}
            >
              <Sparkles size={16} />
              <span>Save & Launch AI Content Studio</span>
            </button>
          </div>
        </div>
      </form>

      <style>{`
        .expedition-form-page {
          padding: 2.5rem 1.5rem 5rem;
          max-width: 960px;
        }

        .form-top-bar {
          display: flex;
          align-items: center;
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .form-top-bar h2 {
          font-size: 1.8rem;
          color: #ffffff;
        }

        .expedition-main-form {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .form-section-card {
          padding: 1.75rem;
          border-radius: var(--radius-md);
        }

        .section-title-tag {
          font-size: 1.15rem;
          color: #ffffff;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 1.5rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          padding-bottom: 0.75rem;
        }

        .form-grid-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.25rem;
        }

        .full-span {
          grid-column: span 2;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
        }

        .form-group label {
          font-size: 0.8rem;
          font-weight: 600;
          color: var(--text-ice);
        }

        .form-input, .form-textarea {
          background: #040810;
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-sm);
          color: #ffffff;
          padding: 0.65rem 0.85rem;
          font-size: 0.9rem;
          width: 100%;
        }

        .form-input:focus, .form-textarea:focus {
          outline: none;
          border-color: var(--accent-ice);
        }

        .font-mono {
          font-family: var(--font-mono);
          font-size: 0.82rem;
        }

        .station-input-group {
          display: flex;
          gap: 0.5rem;
        }

        .station-tags-row {
          display: flex;
          flex-wrap: wrap;
          gap: 0.4rem;
          margin-top: 0.5rem;
        }

        .station-badge {
          background: rgba(56, 189, 248, 0.15);
          border: 1px solid rgba(56, 189, 248, 0.35);
          color: #7dd3fc;
          font-size: 0.75rem;
          padding: 0.2rem 0.6rem;
          border-radius: var(--radius-full);
          display: flex;
          align-items: center;
          gap: 0.4rem;
        }

        .station-badge button {
          background: none;
          border: none;
          color: #7dd3fc;
          font-weight: 700;
          cursor: pointer;
        }

        .raw-header-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .raw-char-count {
          font-size: 0.75rem;
          color: var(--text-muted);
          font-family: var(--font-mono);
        }

        /* Media Form */
        .media-form-list {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .media-form-item {
          display: flex;
          gap: 1.25rem;
          background: rgba(7, 13, 24, 0.7);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-sm);
          padding: 1.25rem;
          align-items: flex-start;
        }

        .media-preview-box {
          width: 120px;
          height: 120px;
          border-radius: var(--radius-sm);
          overflow: hidden;
          flex-shrink: 0;
          background: #000;
        }

        .media-form-thumb {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .media-form-fields {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .alt-label-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .btn-auto-alt {
          display: flex;
          align-items: center;
          gap: 0.3rem;
          background: rgba(168, 85, 247, 0.15);
          color: #d8b4fe;
          border: 1px solid rgba(168, 85, 247, 0.3);
          padding: 2px 7px;
          border-radius: 4px;
          font-size: 0.72rem;
          cursor: pointer;
        }

        .btn-trash-media {
          background: rgba(239, 68, 68, 0.15);
          color: #fca5a5;
          border: 1px solid rgba(239, 68, 68, 0.3);
          border-radius: var(--radius-sm);
          padding: 0.5rem;
          cursor: pointer;
        }

        .form-action-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 1.5rem;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          flex-wrap: wrap;
          gap: 1rem;
        }

        .submit-btns-right {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          flex-wrap: wrap;
        }

        @media (max-width: 768px) {
          .form-grid-2 {
            grid-template-columns: 1fr;
          }
          .full-span {
            grid-column: span 1;
          }
          .media-form-item {
            flex-direction: column;
          }
          .media-preview-box {
            width: 100%;
            height: 160px;
          }
        }
      `}</style>
    </div>
  );
}
