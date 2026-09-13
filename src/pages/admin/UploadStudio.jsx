import { useState } from 'react';
import { usePortal } from '../../context/PortalContext';
import { autoGenerateImageAlt } from '../../services/aiService';
import { 
  ArrowLeft, 
  Database, 
  BookOpen, 
  Image as ImageIcon, 
  Video,
  Sparkles, 
  CheckCircle2, 
  Plus, 
  Tag, 
  Check,
  MapPin, 
  Compass, 
  ArrowRight, 
  Trash2, 
  User, 
  Film 
} from 'lucide-react';

export default function UploadStudio({ onBack, navigateTo, initialCategory = 'expedition' }) {
  const { 
    expeditions,
    addExpedition, 
    addDataset, 
    addPublication, 
    addMediaArchive 
  } = usePortal();

  // Normalize initial category
  const getNormalizedMode = (cat) => {
    if (cat === 'publications' || cat === 'publication') return 'publication';
    if (cat === 'datasets' || cat === 'dataset') return 'dataset';
    return 'expedition';
  };

  const [activeMode, setActiveMode] = useState(() => getNormalizedMode(initialCategory));
  const [expeditionStep, setExpeditionStep] = useState(1); // 1: Expedition, 2: Media Gallery, 3: Publications

  const [successToast, setSuccessToast] = useState(null);

  // ==========================================
  // 1. EXPEDITION STEP 1: Core Details
  // ==========================================
  const [expTitle, setExpTitle] = useState('44th Indian Scientific Expedition to Antarctica (ISEA)');
  const [expRegion, setExpRegion] = useState('Antarctica');
  const [expYear, setExpYear] = useState(2024);
  const [expStartDate, setExpStartDate] = useState('Nov 2023');
  const [expEndDate, setExpEndDate] = useState('Apr 2024');
  const [expChiefScientist, setExpChiefScientist] = useState('Dr. Rahul Sengupta (Senior Scientist, NCPOR)');
  const [expVessel, setExpVessel] = useState('MV Vasiliy Golovnin (Chartered Ice-Class)');
  const [expStations, setExpStations] = useState(['Maitri Station', 'Bharati Station', 'Dome C Margin']);
  const [expStationInput, setExpStationInput] = useState('');
  const [expLat, setExpLat] = useState(-69.406);
  const [expLng, setExpLng] = useState(76.190);
  const [expLocationLabel, setExpLocationLabel] = useState('Larsemann Hills, East Antarctica');
  const [expSummary, setExpSummary] = useState('Comprehensive multi-disciplinary expedition log covering deep glaciological ice coring, boundary layer aerosol dynamics, autonomous buoys, and polar clean microgrids.');
  const [expAbstract, setExpAbstract] = useState('The 44th ISEA mission focused on executing high-latitude paleoclimate ice core extraction, assessing atmospheric black carbon flux at Bharati, and upgrading Maitri research station environmental telemetry.');
  const [expHeroImage, setExpHeroImage] = useState('https://images.unsplash.com/photo-1517999144091-3d9dca6d1e43?auto=format&fit=crop&w=1600&q=80');
  const [expTags, setExpTags] = useState(['Glaciology', 'Aerosol Physics', 'Green Microgrid', 'Climate Dynamics']);
  const [expTagInput, setExpTagInput] = useState('');

  // ==========================================
  // 2. EXPEDITION STEP 2: Media Gallery (Photos + Videos)
  // ==========================================
  const [galleryItems, setGalleryItems] = useState([
    {
      id: 'g-1',
      type: 'photo',
      url: 'https://images.unsplash.com/photo-1517999144091-3d9dca6d1e43?auto=format&fit=crop&w=1200&q=80',
      caption: 'Glaciologists preparing electromechanical drill at Dronning Maud Land ice shelf margin.',
      altText: 'Polar researchers in red parkas assembling ice core drill rig on Antarctic snow plain under clear blue sky.',
      tags: ['Glaciology', 'Fieldwork', 'Antarctica']
    },
    {
      id: 'g-2',
      type: 'photo',
      url: 'https://images.unsplash.com/photo-1517411032315-54ef2cb783bb?auto=format&fit=crop&w=1200&q=80',
      caption: 'Bharati Research Base elevated station module bathed in 24-hour midnight summer sunlight.',
      altText: 'Modern elevated research base Bharati with solar arrays overlooking snow and turquoise icebergs.',
      tags: ['Bharati', 'Clean Energy', 'Infrastructure']
    },
    {
      id: 'g-3',
      type: 'video',
      url: 'https://images.unsplash.com/photo-1548366086-7f1b76106622?auto=format&fit=crop&w=1200&q=80',
      videoStreamUrl: 'https://www.youtube.com/watch?v=sample-polar',
      duration: '4 min 12 sec',
      caption: 'Aerial 4K Drone Footage: Continental ice sheet calving dynamics and weather balloon deployment.',
      altText: 'Drone video recording ice sheet flow and atmospheric radiosonde launch into polar troposphere.',
      tags: ['Drone Log', 'Atmosphere', '4K Video']
    }
  ]);

  // Temporary Media Add Inputs
  const [mediaTypeToAdd, setMediaTypeToAdd] = useState('photo'); // photo | video
  const [newMediaUrl, setNewMediaUrl] = useState('');
  const [newVideoStreamUrl, setNewVideoStreamUrl] = useState('');
  const [newMediaDuration, setNewMediaDuration] = useState('3 min 45 sec');
  const [newMediaCaption, setNewMediaCaption] = useState('');
  const [newMediaAltText, setNewMediaAltText] = useState('');
  const [newMediaTags, setNewMediaTags] = useState('Fieldwork, Antarctica');

  // ==========================================
  // 3. EXPEDITION STEP 3: Linked Publications
  // ==========================================
  const [expAttachedPubs, setExpAttachedPubs] = useState([
    {
      id: 'pub-isea44-init-1',
      title: 'High-resolution 8,000-year paleoclimate reconstruction from East Antarctic ice core records',
      authors: ['Dr. A. K. Sharma', 'Dr. R. Thamban', 'Dr. Rahul Sengupta'],
      journal: 'Journal of Glaciology & Climate Dynamics',
      year: 2024,
      doi: '10.1017/jog.2024.108',
      category: 'Glaciology & Paleoclimate',
      abstract: 'We present a continuous, high-resolution isotopic and chemical profile from a 122m ice core extracted near Dome C margin during the 44th ISEA.',
      citations: 18
    }
  ]);

  // Temporary Pub Add Inputs
  const [newPubTitle, setNewPubTitle] = useState('');
  const [newPubAuthors, setNewPubAuthors] = useState('');
  const [newPubJournal, setNewPubJournal] = useState('Polar Science & Cryosphere Letters');
  const [newPubYear, setNewPubYear] = useState(2024);
  const [newPubDoi, setNewPubDoi] = useState('10.1016/j.polar.2024.1042');
  const [newPubCategory, setNewPubCategory] = useState('Glaciology & Paleoclimate');
  const [newPubAbstract, setNewPubAbstract] = useState('');
  const [newPubCitations, setNewPubCitations] = useState(0);

  // ==========================================
  // STANDALONE PUBLICATION / PAPER STATES
  // ==========================================
  const [standalonePubTitle, setStandalonePubTitle] = useState('Atmospheric aerosol optical depths and black carbon transport over East Antarctic coast');
  const [standalonePubAuthors, setStandalonePubAuthors] = useState('Dr. P. R. Sinha, Dr. Alok Kumar Sharma, Dr. M. M. Nambiar');
  const [standalonePubJournal, setStandalonePubJournal] = useState('Journal of Geophysical Research: Atmospheres');
  const [standalonePubYear, setStandalonePubYear] = useState(2024);
  const [standalonePubDoi, setStandalonePubDoi] = useState('10.1029/2024JD039821');
  const [standalonePubCategory, setStandalonePubCategory] = useState('Atmospheric Sciences');
  const [standalonePubExpId, setStandalonePubExpId] = useState('isea-43');
  const [standalonePubAbstract, setStandalonePubAbstract] = useState('Simultaneous multi-wavelength aethalometer observations demonstrate pristine baseline aerosol optical depth punctuated by rare biomass burning plumes transported across Southern Ocean trajectories.');
  const [standalonePubCitations, setStandalonePubCitations] = useState(14);

  // ==========================================
  // STANDALONE DATASET STATES
  // ==========================================
  const [dsTitle, setDsTitle] = useState('Kongsfjorden Fjord Subsurface CTD & Ocean Carbon Flux Time-Series');
  const [dsRegion, setDsRegion] = useState('Arctic');
  const [dsYear, setDsYear] = useState(2024);
  const [dsExpId, setDsExpId] = useState('arctic-2024');
  const [dsFormat, setDsFormat] = useState('NetCDF (.nc)');
  const [dsParams, setDsParams] = useState(['Water Temperature (°C)', 'Practical Salinity (PSU)', 'pCO2 (μatm)', 'Dissolved Oxygen (mg/L)']);
  const [dsParamInput, setDsParamInput] = useState('');
  const [dsDoi, setDsDoi] = useState('10.5281/zenodo.10984420');
  const [dsSpatial, setDsSpatial] = useState("78°59'N, 11°48'E (Kongsfjorden Fjord, Ny-Ålesund)");
  const [dsTemporal, setDsTemporal] = useState('March 2023 - October 2024');
  const [dsFileSize, setDsFileSize] = useState('42.8 MB');
  const [dsSummary, setDsSummary] = useState('Continuous subsurface oceanographic time-series monitoring Atlantic water intrusion and biogeochemical fluxes in the Arctic IndARC observatory.');

  // Tag helper
  const handleAddStation = () => {
    if (expStationInput.trim() && !expStations.includes(expStationInput.trim())) {
      setExpStations([...expStations, expStationInput.trim()]);
      setExpStationInput('');
    }
  };

  const handleRemoveStation = (index) => {
    setExpStations(expStations.filter((_, i) => i !== index));
  };

  const handleAddExpTag = () => {
    if (expTagInput.trim() && !expTags.includes(expTagInput.trim())) {
      setExpTags([...expTags, expTagInput.trim()]);
      setExpTagInput('');
    }
  };

  const handleRemoveExpTag = (index) => {
    setExpTags(expTags.filter((_, i) => i !== index));
  };

  // Add media item to expedition gallery
  const handleAddGalleryItem = () => {
    if (!newMediaCaption && !newMediaUrl) {
      alert('Please provide a media URL or caption.');
      return;
    }

    const fallbackPhoto = 'https://images.unsplash.com/photo-1517999144091-3d9dca6d1e43?auto=format&fit=crop&w=1200&q=80';
    const fallbackVideoThumb = 'https://images.unsplash.com/photo-1548366086-7f1b76106622?auto=format&fit=crop&w=1200&q=80';

    const newItem = {
      id: `gallery-${Date.now()}`,
      type: mediaTypeToAdd,
      url: newMediaUrl || (mediaTypeToAdd === 'video' ? fallbackVideoThumb : fallbackPhoto),
      videoStreamUrl: mediaTypeToAdd === 'video' ? (newVideoStreamUrl || 'https://www.youtube.com/watch?v=sample') : undefined,
      duration: mediaTypeToAdd === 'video' ? newMediaDuration : undefined,
      caption: newMediaCaption || (mediaTypeToAdd === 'video' ? 'Polar Field Documentary Video' : 'Polar Research Field Photograph'),
      altText: newMediaAltText || autoGenerateImageAlt(newMediaCaption || expTitle, expRegion),
      tags: newMediaTags.split(',').map(t => t.trim()).filter(Boolean)
    };

    setGalleryItems([...galleryItems, newItem]);
    setNewMediaUrl('');
    setNewVideoStreamUrl('');
    setNewMediaCaption('');
    setNewMediaAltText('');
    setNewMediaTags('Fieldwork, Polar');
    setSuccessToast(`Added ${mediaTypeToAdd === 'video' ? 'Video' : 'Photo'} to Expedition Gallery!`);
    setTimeout(() => setSuccessToast(null), 2500);
  };

  const handleRemoveGalleryItem = (id) => {
    setGalleryItems(galleryItems.filter(item => item.id !== id));
  };

  // Add publication to expedition
  const handleAddExpPub = () => {
    if (!newPubTitle.trim()) {
      alert('Please enter a publication title.');
      return;
    }

    const authorsList = newPubAuthors.trim() 
      ? newPubAuthors.split(',').map(a => a.trim()).filter(Boolean)
      : ['NCPOR Scientific Corps'];

    const newPub = {
      id: `pub-${Date.now()}`,
      title: newPubTitle,
      authors: authorsList,
      journal: newPubJournal,
      year: Number(newPubYear) || 2024,
      doi: newPubDoi,
      category: newPubCategory,
      abstract: newPubAbstract || 'Original research collected during this polar scientific expedition.',
      citations: Number(newPubCitations) || 0
    };

    setExpAttachedPubs([...expAttachedPubs, newPub]);
    setNewPubTitle('');
    setNewPubAuthors('');
    setNewPubAbstract('');
    setSuccessToast('Attached research publication to expedition!');
    setTimeout(() => setSuccessToast(null), 2500);
  };

  const handleRemoveExpPub = (id) => {
    setExpAttachedPubs(expAttachedPubs.filter(p => p.id !== id));
  };

  // Add parameter to dataset
  const handleAddDsParam = () => {
    if (dsParamInput.trim() && !dsParams.includes(dsParamInput.trim())) {
      setDsParams([...dsParams, dsParamInput.trim()]);
      setDsParamInput('');
    }
  };

  // ==========================================
  // SAVE / PUBLISH ACTIONS
  // ==========================================

  // 1. Submit Full Expedition Flow
  const handleSaveFullExpedition = () => {
    const newExpId = `isea-${Date.now().toString().slice(-4)}`;
    
    // Save all attached publications into global publications registry as well
    const createdPubIds = [];
    expAttachedPubs.forEach(pub => {
      const pubItem = {
        ...pub,
        expeditionId: newExpId
      };
      addPublication(pubItem);
      createdPubIds.push(pub.id);
    });

    // Save all gallery media items
    galleryItems.forEach(item => {
      addMediaArchive({
        type: item.type,
        title: item.caption,
        region: expRegion,
        expeditionId: newExpId,
        year: Number(expYear),
        url: item.url,
        videoStreamUrl: item.videoStreamUrl,
        duration: item.duration,
        caption: item.caption,
        altText: item.altText,
        tags: item.tags,
        category: item.type === 'video' ? 'Videos' : 'Photographs'
      });
    });

    // Create full expedition record
    addExpedition({
      id: newExpId,
      title: expTitle,
      region: expRegion,
      year: Number(expYear),
      startDate: expStartDate,
      endDate: expEndDate,
      chiefScientist: expChiefScientist,
      vessel: expVessel,
      stations: expStations,
      coordinates: {
        lat: Number(expLat),
        lng: Number(expLng),
        label: expLocationLabel
      },
      heroImage: expHeroImage,
      summary: expSummary,
      scientificAbstract: expAbstract,
      tags: expTags,
      status: 'published',
      media: galleryItems.map(item => ({
        id: item.id,
        type: item.type,
        url: item.url,
        caption: item.caption,
        altText: item.altText
      })),
      publications: createdPubIds
    });

    setSuccessToast(`Successfully published ${expTitle}! Redirecting to Expeditions...`);
    setTimeout(() => {
      navigateTo('expeditions');
    }, 1200);
  };

  // 2. Submit Standalone Publication
  const handleSaveStandalonePublication = () => {
    if (!standalonePubTitle.trim()) {
      alert('Please provide a publication title.');
      return;
    }

    const authorsList = standalonePubAuthors.split(',').map(a => a.trim()).filter(Boolean);

    addPublication({
      title: standalonePubTitle,
      authors: authorsList.length > 0 ? authorsList : ['NCPOR Scientific Team'],
      journal: standalonePubJournal,
      year: Number(standalonePubYear) || 2024,
      doi: standalonePubDoi,
      category: standalonePubCategory,
      expeditionId: standalonePubExpId || undefined,
      abstract: standalonePubAbstract,
      citations: Number(standalonePubCitations) || 0,
      status: 'published'
    });

    setSuccessToast(`Published "${standalonePubTitle.substring(0, 35)}..." to Publications Archive!`);
    setTimeout(() => {
      navigateTo('publications');
    }, 1200);
  };

  // 3. Submit Standalone Dataset
  const handleSaveStandaloneDataset = () => {
    if (!dsTitle.trim()) {
      alert('Please provide a dataset title.');
      return;
    }

    addDataset({
      title: dsTitle,
      region: dsRegion,
      year: Number(dsYear),
      expeditionId: dsExpId,
      category: 'Glaciology & Paleoclimate',
      format: dsFormat,
      fileSize: dsFileSize || '12.4 MB',
      parameters: dsParams,
      doi: dsDoi,
      spatialCoverage: dsSpatial,
      temporalCoverage: dsTemporal,
      summary: dsSummary,
      status: 'published'
    });

    setSuccessToast(`Published dataset to Open Research Archive!`);
    setTimeout(() => {
      navigateTo('publications');
    }, 1200);
  };



  return (
    <div className="container upload-studio-page">
      {/* Top Header */}
      <div className="upload-header-row">
        <button className="btn-back" onClick={onBack}>
          <ArrowLeft size={16} />
          <span>Back to Dashboard</span>
        </button>

        <div className="upload-header-text">
          <div className="section-eyebrow">NCPOR SCIENTIFIC INGESTION PIPELINE</div>
          <h1 className="page-title">Admin Science Upload Studio</h1>
          <p className="page-sub">
            Create complete expedition packages (Expedition ➔ Media Gallery ➔ Publications) or upload individual research papers and scientific datasets directly to the public repository.
          </p>
        </div>
      </div>

      {successToast && (
        <div className="toast-notification">
          <CheckCircle2 size={16} />
          <span>{successToast}</span>
        </div>
      )}

      {/* Main Mode Navigation Bar */}
      <div className="mode-selection-bar">
        <button 
          className={`mode-tab-card ${activeMode === 'expedition' ? 'active' : ''}`}
          onClick={() => setActiveMode('expedition')}
        >
          <div className="mode-card-header">
            <div className="mode-icon-box bg-blue">
              <Compass size={20} />
            </div>
            <div>
              <div className="mode-title">Complete Expedition Pipeline</div>
              <div className="mode-flow-badge">Expedition ➔ Media Gallery ➔ Publication</div>
            </div>
          </div>
          <p className="mode-desc">Structured 3-step pipeline to ingest an expedition with photos, videos, and linked papers.</p>
        </button>

        <button 
          className={`mode-tab-card ${activeMode === 'publication' ? 'active' : ''}`}
          onClick={() => setActiveMode('publication')}
        >
          <div className="mode-card-header">
            <div className="mode-icon-box bg-amber">
              <BookOpen size={20} />
            </div>
            <div>
              <div className="mode-title">Individual Publication / Paper</div>
              <div className="mode-flow-badge standalone">Main Publications Page</div>
            </div>
          </div>
          <p className="mode-desc">Directly upload a standalone peer-reviewed paper or journal article to the public repository.</p>
        </button>

        <button 
          className={`mode-tab-card ${activeMode === 'dataset' ? 'active' : ''}`}
          onClick={() => setActiveMode('dataset')}
        >
          <div className="mode-card-header">
            <div className="mode-icon-box bg-purple">
              <Database size={20} />
            </div>
            <div>
              <div className="mode-title">Individual Scientific Dataset</div>
              <div className="mode-flow-badge standalone">Open Data Archive</div>
            </div>
          </div>
          <p className="mode-desc">Upload NetCDF, CSV, or sensor telemetry datasets with DOIs to Open Data repository.</p>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* MODE 1: COMPLETE EXPEDITION PIPELINE (Expedition -> Media -> Publication) */}
      {/* ========================================================================= */}
      {activeMode === 'expedition' && (
        <div className="expedition-pipeline-container">
          {/* Step Progress Indicator */}
          <div className="pipeline-steps-bar glass-panel">
            <button 
              className={`pipeline-step-btn ${expeditionStep === 1 ? 'active' : ''} ${expeditionStep > 1 ? 'completed' : ''}`}
              onClick={() => setExpeditionStep(1)}
            >
              <div className="step-num-circle">
                {expeditionStep > 1 ? <Check size={14} /> : '1'}
              </div>
              <div className="step-text-wrap">
                <span className="step-label">Step 1</span>
                <span className="step-heading">Expedition Details</span>
              </div>
            </button>

            <div className={`step-connector ${expeditionStep >= 2 ? 'active' : ''}`} />

            <button 
              className={`pipeline-step-btn ${expeditionStep === 2 ? 'active' : ''} ${expeditionStep > 2 ? 'completed' : ''}`}
              onClick={() => setExpeditionStep(2)}
            >
              <div className="step-num-circle">
                {expeditionStep > 2 ? <Check size={14} /> : '2'}
              </div>
              <div className="step-text-wrap">
                <span className="step-label">Step 2</span>
                <span className="step-heading">Media Gallery ({galleryItems.length} items)</span>
              </div>
            </button>

            <div className={`step-connector ${expeditionStep >= 3 ? 'active' : ''}`} />

            <button 
              className={`pipeline-step-btn ${expeditionStep === 3 ? 'active' : ''}`}
              onClick={() => setExpeditionStep(3)}
            >
              <div className="step-num-circle">3</div>
              <div className="step-text-wrap">
                <span className="step-label">Step 3</span>
                <span className="step-heading">Publications ({expAttachedPubs.length})</span>
              </div>
            </button>
          </div>

          {/* STEP 1: EXPEDITION CORE DETAILS */}
          {expeditionStep === 1 && (
            <div className="glass-panel step-content-panel">
              <div className="step-panel-header">
                <div>
                  <h2 className="step-title">1. Expedition Mission Details</h2>
                  <p className="step-subtitle">Configure expedition metadata, research vessel, stations, and scientific abstract.</p>
                </div>
                <span className="step-badge">Stage 1 of 3</span>
              </div>

              <div className="form-two-col-layout">
                {/* Left Fields */}
                <div className="form-col">
                  <div className="form-group">
                    <label>Official Expedition Title *</label>
                    <input 
                      type="text" 
                      value={expTitle} 
                      onChange={(e) => setExpTitle(e.target.value)} 
                      className="form-input"
                      placeholder="e.g. 44th Indian Scientific Expedition to Antarctica"
                      required
                    />
                  </div>

                  <div className="form-grid-2">
                    <div className="form-group">
                      <label>Polar Region *</label>
                      <select value={expRegion} onChange={(e) => setExpRegion(e.target.value)} className="form-input">
                        <option value="Antarctica">Antarctica (ISEA)</option>
                        <option value="Arctic">Arctic (Himadri / IndARC)</option>
                        <option value="Himalaya">Himalayan Cryosphere (Himansh)</option>
                        <option value="Southern Ocean">Southern Ocean</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label>Year / Season *</label>
                      <input 
                        type="number" 
                        value={expYear} 
                        onChange={(e) => setExpYear(e.target.value)} 
                        className="form-input" 
                      />
                    </div>
                  </div>

                  <div className="form-grid-2">
                    <div className="form-group">
                      <label>Start Date / Month</label>
                      <input 
                        type="text" 
                        value={expStartDate} 
                        onChange={(e) => setExpStartDate(e.target.value)} 
                        className="form-input"
                        placeholder="e.g. Nov 2023"
                      />
                    </div>

                    <div className="form-group">
                      <label>End Date / Month</label>
                      <input 
                        type="text" 
                        value={expEndDate} 
                        onChange={(e) => setExpEndDate(e.target.value)} 
                        className="form-input"
                        placeholder="e.g. Apr 2024"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Chief Scientist / Mission Leader</label>
                    <input 
                      type="text" 
                      value={expChiefScientist} 
                      onChange={(e) => setExpChiefScientist(e.target.value)} 
                      className="form-input"
                      placeholder="e.g. Dr. Rahul Sengupta (Senior Scientist, NCPOR)"
                    />
                  </div>

                  <div className="form-group">
                    <label>Research Vessel / Aircraft / Transport</label>
                    <input 
                      type="text" 
                      value={expVessel} 
                      onChange={(e) => setExpVessel(e.target.value)} 
                      className="form-input"
                      placeholder="e.g. MV Vasiliy Golovnin (Chartered Ice-Class Vessel)"
                    />
                  </div>
                </div>

                {/* Right Fields */}
                <div className="form-col">
                  <div className="form-group">
                    <label>Research Stations & Deployment Bases</label>
                    <div className="tag-input-row">
                      <input 
                        type="text" 
                        value={expStationInput} 
                        onChange={(e) => setExpStationInput(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddStation(); }}}
                        placeholder="Type station name and press Add (e.g. Bharati Station)"
                        className="form-input"
                      />
                      <button type="button" className="btn-add-tag" onClick={handleAddStation}>
                        <Plus size={14} /> Add
                      </button>
                    </div>
                    <div className="tags-pills-list">
                      {expStations.map((st, i) => (
                        <span key={i} className="station-pill">
                          <MapPin size={11} />
                          <span>{st}</span>
                          <button type="button" onClick={() => handleRemoveStation(i)}>×</button>
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="form-grid-2">
                    <div className="form-group">
                      <label>Latitude (°)</label>
                      <input 
                        type="number" 
                        step="0.001"
                        value={expLat} 
                        onChange={(e) => setExpLat(e.target.value)} 
                        className="form-input" 
                      />
                    </div>
                    <div className="form-group">
                      <label>Longitude (°)</label>
                      <input 
                        type="number" 
                        step="0.001"
                        value={expLng} 
                        onChange={(e) => setExpLng(e.target.value)} 
                        className="form-input" 
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Geographic Region Label</label>
                    <input 
                      type="text" 
                      value={expLocationLabel} 
                      onChange={(e) => setExpLocationLabel(e.target.value)} 
                      className="form-input"
                      placeholder="e.g. Larsemann Hills, East Antarctica"
                    />
                  </div>

                  <div className="form-group">
                    <label>Hero Image URL</label>
                    <input 
                      type="text" 
                      value={expHeroImage} 
                      onChange={(e) => setExpHeroImage(e.target.value)} 
                      className="form-input"
                      placeholder="https://..."
                    />
                  </div>

                  <div className="form-group">
                    <label>Scientific Disciplines / Keywords</label>
                    <div className="tag-input-row">
                      <input 
                        type="text" 
                        value={expTagInput} 
                        onChange={(e) => setExpTagInput(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddExpTag(); }}}
                        placeholder="Add tag (e.g. Paleoclimate) and press Add"
                        className="form-input"
                      />
                      <button type="button" className="btn-add-tag" onClick={handleAddExpTag}>
                        <Plus size={14} /> Add
                      </button>
                    </div>
                    <div className="tags-pills-list">
                      {expTags.map((tag, i) => (
                        <span key={i} className="discipline-pill">
                          <Tag size={11} />
                          <span>{tag}</span>
                          <button type="button" onClick={() => handleRemoveExpTag(i)}>×</button>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="form-group full-width" style={{ marginTop: '1rem' }}>
                <label>Mission Summary & Plain Language Overview</label>
                <textarea 
                  rows={2} 
                  value={expSummary} 
                  onChange={(e) => setExpSummary(e.target.value)}
                  className="form-input"
                  placeholder="Summary describing goals and operations..."
                />
              </div>

              <div className="form-group full-width" style={{ marginTop: '1rem' }}>
                <label>Scientific Abstract & Mission Objectives</label>
                <textarea 
                  rows={3} 
                  value={expAbstract} 
                  onChange={(e) => setExpAbstract(e.target.value)}
                  className="form-input"
                  placeholder="Comprehensive scientific abstract..."
                />
              </div>

              <div className="step-actions-footer">
                <div></div>
                <button 
                  className="btn-primary-step" 
                  onClick={() => setExpeditionStep(2)}
                >
                  <span>Continue to Media Gallery</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: MEDIA GALLERY (PHOTOS & VIDEOS) */}
          {expeditionStep === 2 && (
            <div className="glass-panel step-content-panel">
              <div className="step-panel-header">
                <div>
                  <h2 className="step-title">2. Expedition Media Gallery (Photos & Videos)</h2>
                  <p className="step-subtitle">Attach high-resolution photos and documentary videos with WCAG-AA alt-tagging to this expedition.</p>
                </div>
                <span className="step-badge">Stage 2 of 3</span>
              </div>

              {/* Add Media Creator Box */}
              <div className="media-creator-box glass-panel">
                <div className="media-creator-header">
                  <div className="media-type-selector">
                    <button 
                      type="button" 
                      className={`type-toggle-btn ${mediaTypeToAdd === 'photo' ? 'active' : ''}`}
                      onClick={() => setMediaTypeToAdd('photo')}
                    >
                      <ImageIcon size={15} />
                      <span>Add Photograph</span>
                    </button>
                    <button 
                      type="button" 
                      className={`type-toggle-btn ${mediaTypeToAdd === 'video' ? 'active' : ''}`}
                      onClick={() => setMediaTypeToAdd('video')}
                    >
                      <Video size={15} />
                      <span>Add Video / Drone Log</span>
                    </button>
                  </div>
                  <span className="media-mode-hint">Include photos and videos in one unified gallery</span>
                </div>

                <div className="form-two-col-layout" style={{ marginTop: '1rem' }}>
                  <div className="form-col">
                    <div className="form-group">
                      <label>{mediaTypeToAdd === 'video' ? 'Video Thumbnail Image URL *' : 'Image Asset URL *'}</label>
                      <input 
                        type="text" 
                        value={newMediaUrl} 
                        onChange={(e) => setNewMediaUrl(e.target.value)}
                        placeholder="https://images.unsplash.com/..." 
                        className="form-input"
                      />
                    </div>

                    {mediaTypeToAdd === 'video' && (
                      <div className="form-grid-2">
                        <div className="form-group">
                          <label>Video Stream / YouTube URL</label>
                          <input 
                            type="text" 
                            value={newVideoStreamUrl} 
                            onChange={(e) => setNewVideoStreamUrl(e.target.value)}
                            placeholder="https://youtube.com/watch?v=..." 
                            className="form-input"
                          />
                        </div>
                        <div className="form-group">
                          <label>Duration</label>
                          <input 
                            type="text" 
                            value={newMediaDuration} 
                            onChange={(e) => setNewMediaDuration(e.target.value)}
                            placeholder="e.g. 4 min 20 sec" 
                            className="form-input"
                          />
                        </div>
                      </div>
                    )}

                    <div className="form-group">
                      <label>Caption / Title *</label>
                      <input 
                        type="text" 
                        value={newMediaCaption} 
                        onChange={(e) => setNewMediaCaption(e.target.value)}
                        placeholder="Descriptive caption of field activities..." 
                        className="form-input"
                      />
                    </div>
                  </div>

                  <div className="form-col">
                    <div className="form-group">
                      <div className="label-with-action">
                        <label>WCAG-AA Accessibility Alt-Text</label>
                        <button 
                          type="button" 
                          className="btn-auto-alt"
                          onClick={() => {
                            const alt = autoGenerateImageAlt(newMediaCaption || expTitle, expRegion);
                            setNewMediaAltText(alt);
                          }}
                        >
                          <Sparkles size={12} />
                          <span>Auto-Generate</span>
                        </button>
                      </div>
                      <textarea 
                        rows={2} 
                        value={newMediaAltText} 
                        onChange={(e) => setNewMediaAltText(e.target.value)}
                        placeholder="Detailed visual description for screen readers and accessibility..."
                        className="form-input"
                      />
                    </div>

                    <div className="form-group">
                      <label>Tags (Comma separated)</label>
                      <input 
                        type="text" 
                        value={newMediaTags} 
                        onChange={(e) => setNewMediaTags(e.target.value)}
                        placeholder="Fieldwork, Antarctica, Glacier" 
                        className="form-input"
                      />
                    </div>
                  </div>
                </div>

                <div className="media-add-action-row">
                  <button 
                    type="button" 
                    className="btn-add-media-item"
                    onClick={handleAddGalleryItem}
                  >
                    <Plus size={15} />
                    <span>Add {mediaTypeToAdd === 'video' ? 'Video' : 'Photo'} to Expedition Gallery</span>
                  </button>
                </div>
              </div>

              {/* Current Queued Media List */}
              <div className="queued-media-section">
                <div className="queued-section-header">
                  <h3>Attached Expedition Gallery Assets ({galleryItems.length})</h3>
                  <span className="queued-count-badge">{galleryItems.filter(i => i.type === 'photo').length} Photos • {galleryItems.filter(i => i.type === 'video').length} Videos</span>
                </div>

                {galleryItems.length > 0 ? (
                  <div className="queued-media-grid">
                    {galleryItems.map((item) => (
                      <div key={item.id} className="queued-media-card">
                        <div className="queued-thumb-wrap">
                          <img src={item.url} alt={item.altText || item.caption} />
                          <span className={`media-type-badge ${item.type}`}>
                            {item.type === 'video' ? <Film size={11} /> : <ImageIcon size={11} />}
                            <span>{item.type.toUpperCase()}</span>
                          </span>
                        </div>
                        <div className="queued-media-info">
                          <div className="queued-media-caption">{item.caption}</div>
                          {item.altText && (
                            <div className="queued-alt-preview">
                              <strong>Alt:</strong> {item.altText.substring(0, 60)}...
                            </div>
                          )}
                          <div className="queued-card-footer">
                            <span className="queued-tags-count">{(item.tags || []).join(', ')}</span>
                            <button 
                              type="button" 
                              className="btn-remove-media"
                              onClick={() => handleRemoveGalleryItem(item.id)}
                              title="Remove asset"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="empty-queued-box">
                    <ImageIcon size={28} className="empty-icon" />
                    <p>No media added yet. Use the form above to attach photographs and videos to this expedition.</p>
                  </div>
                )}
              </div>

              <div className="step-actions-footer">
                <button 
                  className="btn-step-back" 
                  onClick={() => setExpeditionStep(1)}
                >
                  <ArrowLeft size={16} />
                  <span>Back to Expedition Details</span>
                </button>

                <button 
                  className="btn-primary-step" 
                  onClick={() => setExpeditionStep(3)}
                >
                  <span>Continue to Publications</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: LINKED PUBLICATIONS */}
          {expeditionStep === 3 && (
            <div className="glass-panel step-content-panel">
              <div className="step-panel-header">
                <div>
                  <h2 className="step-title">3. Link Publications & Finalize Package</h2>
                  <p className="step-subtitle">Attach peer-reviewed papers produced under this expedition. They will be linked to the mission and displayed in the main Publications repository.</p>
                </div>
                <span className="step-badge">Stage 3 of 3</span>
              </div>

              {/* Add Publication Box */}
              <div className="media-creator-box glass-panel">
                <div className="media-creator-header">
                  <div className="media-type-selector">
                    <span className="section-inline-title">
                      <BookOpen size={16} />
                      <span>Attach Research Publication to Expedition</span>
                    </span>
                  </div>
                </div>

                <div className="form-two-col-layout" style={{ marginTop: '1rem' }}>
                  <div className="form-col">
                    <div className="form-group">
                      <label>Publication Title *</label>
                      <input 
                        type="text" 
                        value={newPubTitle} 
                        onChange={(e) => setNewPubTitle(e.target.value)}
                        placeholder="e.g. Decadal mass balance and surface velocity changes of benchmark glaciers..."
                        className="form-input"
                      />
                    </div>

                    <div className="form-group">
                      <label>Authors (Comma separated)</label>
                      <input 
                        type="text" 
                        value={newPubAuthors} 
                        onChange={(e) => setNewPubAuthors(e.target.value)}
                        placeholder="Dr. A. K. Sharma, Dr. R. Thamban, Dr. P. Sharma"
                        className="form-input"
                      />
                    </div>

                    <div className="form-grid-2">
                      <div className="form-group">
                        <label>Journal Name</label>
                        <input 
                          type="text" 
                          value={newPubJournal} 
                          onChange={(e) => setNewPubJournal(e.target.value)}
                          className="form-input"
                        />
                      </div>
                      <div className="form-group">
                        <label>Year</label>
                        <input 
                          type="number" 
                          value={newPubYear} 
                          onChange={(e) => setNewPubYear(e.target.value)}
                          className="form-input"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="form-col">
                    <div className="form-grid-2">
                      <div className="form-group">
                        <label>DOI Identifier *</label>
                        <input 
                          type="text" 
                          value={newPubDoi} 
                          onChange={(e) => setNewPubDoi(e.target.value)}
                          placeholder="10.1017/jog.2024.108"
                          className="form-input"
                        />
                      </div>

                      <div className="form-group">
                        <label>Scientific Discipline</label>
                        <select 
                          value={newPubCategory} 
                          onChange={(e) => setNewPubCategory(e.target.value)}
                          className="form-input"
                        >
                          <option value="Glaciology & Paleoclimate">Glaciology & Paleoclimate</option>
                          <option value="Oceanography">Oceanography</option>
                          <option value="Atmospheric Sciences">Atmospheric Sciences</option>
                          <option value="Himalayan Cryosphere">Himalayan Cryosphere</option>
                          <option value="Polar Biology">Polar Biology</option>
                        </select>
                      </div>
                    </div>

                    <div className="form-group">
                      <label>Abstract & Key Findings</label>
                      <textarea 
                        rows={2} 
                        value={newPubAbstract} 
                        onChange={(e) => setNewPubAbstract(e.target.value)}
                        placeholder="Abstract describing discoveries and data..."
                        className="form-input"
                      />
                    </div>

                    <div className="form-group">
                      <label>Indexed Citations</label>
                      <input 
                        type="number" 
                        value={newPubCitations} 
                        onChange={(e) => setNewPubCitations(e.target.value)}
                        className="form-input"
                      />
                    </div>
                  </div>
                </div>

                <div className="media-add-action-row">
                  <button 
                    type="button" 
                    className="btn-add-media-item"
                    onClick={handleAddExpPub}
                  >
                    <Plus size={15} />
                    <span>Attach Paper to Expedition</span>
                  </button>
                </div>
              </div>

              {/* Attached Publications List */}
              <div className="queued-media-section">
                <div className="queued-section-header">
                  <h3>Attached Research Papers ({expAttachedPubs.length})</h3>
                  <span className="queued-count-badge">Will appear in both Expedition & Main Publications Repository</span>
                </div>

                {expAttachedPubs.length > 0 ? (
                  <div className="attached-pubs-list">
                    {expAttachedPubs.map((pub) => (
                      <div key={pub.id} className="attached-pub-card">
                        <div className="attached-pub-icon">
                          <BookOpen size={20} />
                        </div>
                        <div className="attached-pub-details">
                          <div className="attached-pub-top">
                            <span className="attached-pub-cat">{pub.category}</span>
                            <span className="attached-pub-year">{pub.year}</span>
                            <span className="attached-pub-doi">DOI: {pub.doi}</span>
                          </div>
                          <h4 className="attached-pub-title">{pub.title}</h4>
                          <div className="attached-pub-authors">
                            <User size={12} />
                            <span>{(pub.authors || []).join(', ')} • <em>{pub.journal}</em></span>
                          </div>
                        </div>
                        <button 
                          type="button" 
                          className="btn-remove-pub"
                          onClick={() => handleRemoveExpPub(pub.id)}
                          title="Remove publication"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="empty-queued-box">
                    <BookOpen size={28} className="empty-icon" />
                    <p>No publications attached yet. You can attach papers now or publish the expedition directly.</p>
                  </div>
                )}
              </div>

              <div className="step-actions-footer">
                <button 
                  className="btn-step-back" 
                  onClick={() => setExpeditionStep(2)}
                >
                  <ArrowLeft size={16} />
                  <span>Back to Media Gallery</span>
                </button>

                <button 
                  className="btn-publish-all" 
                  onClick={handleSaveFullExpedition}
                >
                  <Sparkles size={16} />
                  <span>🚀 Publish Complete Expedition Package</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODE 2: STANDALONE PUBLICATION / RESEARCH PAPER UPLOAD                    */}
      {/* ========================================================================= */}
      {activeMode === 'publication' && (
        <div className="glass-panel standalone-card">
          <div className="standalone-header-row">
            <div>
              <div className="section-eyebrow">STANDALONE RESEARCH INGESTION</div>
              <h2 className="standalone-title">Upload Individual Publication / Paper</h2>
              <p className="standalone-subtitle">Directly add peer-reviewed research papers or MoES science bulletins to the main public Publications repository.</p>
            </div>
            <div className="standalone-dest-badge">
              <CheckCircle2 size={14} />
              <span>Visible on Main Publications Page</span>
            </div>
          </div>

          <div className="form-two-col-layout" style={{ marginTop: '1.25rem' }}>
            <div className="form-col">
              <div className="form-group">
                <label>Publication Title *</label>
                <input 
                  type="text" 
                  value={standalonePubTitle} 
                  onChange={(e) => setStandalonePubTitle(e.target.value)}
                  className="form-input"
                  placeholder="e.g. High-latitude black carbon measurements..."
                  required
                />
              </div>

              <div className="form-group">
                <label>Authors (Comma separated) *</label>
                <input 
                  type="text" 
                  value={standalonePubAuthors} 
                  onChange={(e) => setStandalonePubAuthors(e.target.value)}
                  className="form-input"
                  placeholder="Dr. P. R. Sinha, Dr. Alok Kumar Sharma, Dr. M. M. Nambiar"
                  required
                />
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label>Journal / Bulletin *</label>
                  <input 
                    type="text" 
                    value={standalonePubJournal} 
                    onChange={(e) => setStandalonePubJournal(e.target.value)}
                    className="form-input"
                    placeholder="Journal of Geophysical Research"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Year of Publication *</label>
                  <input 
                    type="number" 
                    value={standalonePubYear} 
                    onChange={(e) => setStandalonePubYear(e.target.value)}
                    className="form-input"
                    required
                  />
                </div>
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label>Digital Object Identifier (DOI) *</label>
                  <input 
                    type="text" 
                    value={standalonePubDoi} 
                    onChange={(e) => setStandalonePubDoi(e.target.value)}
                    className="form-input"
                    placeholder="10.1029/2024JD039821"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Discipline / Category *</label>
                  <select 
                    value={standalonePubCategory} 
                    onChange={(e) => setStandalonePubCategory(e.target.value)}
                    className="form-input"
                  >
                    <option value="Glaciology & Paleoclimate">Glaciology & Paleoclimate</option>
                    <option value="Oceanography">Oceanography</option>
                    <option value="Atmospheric Sciences">Atmospheric Sciences</option>
                    <option value="Himalayan Cryosphere">Himalayan Cryosphere</option>
                    <option value="Polar Biology">Polar Biology</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="form-col">
              <div className="form-group">
                <label>Linked Expedition (Optional)</label>
                <select 
                  value={standalonePubExpId} 
                  onChange={(e) => setStandalonePubExpId(e.target.value)}
                  className="form-input"
                >
                  <option value="">None (Independent Study)</option>
                  {expeditions.map(exp => (
                    <option key={exp.id} value={exp.id}>{exp.title} ({exp.year})</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Abstract & Scientific Deliverables</label>
                <textarea 
                  rows={4} 
                  value={standalonePubAbstract} 
                  onChange={(e) => setStandalonePubAbstract(e.target.value)}
                  className="form-input"
                  placeholder="Full abstract text..."
                />
              </div>

              <div className="form-group">
                <label>Indexed Academic Citations</label>
                <input 
                  type="number" 
                  value={standalonePubCitations} 
                  onChange={(e) => setStandalonePubCitations(e.target.value)}
                  className="form-input"
                />
              </div>
            </div>
          </div>

          <div className="standalone-footer-actions">
            <button className="btn-secondary" onClick={onBack}>
              Cancel
            </button>
            <button className="btn-primary-publish" onClick={handleSaveStandalonePublication}>
              <BookOpen size={16} />
              <span>Publish Paper to Main Repository</span>
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODE 3: STANDALONE SCIENTIFIC DATASET UPLOAD                              */}
      {/* ========================================================================= */}
      {activeMode === 'dataset' && (
        <div className="glass-panel standalone-card">
          <div className="standalone-header-row">
            <div>
              <div className="section-eyebrow">OPEN DATA ARCHIVE INGESTION</div>
              <h2 className="standalone-title">Upload Individual Scientific Dataset</h2>
              <p className="standalone-subtitle">Publish NetCDF (.nc), CSV, or sensor telemetry datasets directly into the open-access portal.</p>
            </div>
            <div className="standalone-dest-badge purple">
              <Database size={14} />
              <span>Visible on Main Datasets & Publications Page</span>
            </div>
          </div>

          <div className="form-two-col-layout" style={{ marginTop: '1.25rem' }}>
            <div className="form-col">
              <div className="form-group">
                <label>Dataset Title *</label>
                <input 
                  type="text" 
                  value={dsTitle} 
                  onChange={(e) => setDsTitle(e.target.value)}
                  className="form-input"
                  placeholder="e.g. Kongsfjorden CTD Timeseries"
                  required
                />
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label>Polar Region *</label>
                  <select value={dsRegion} onChange={(e) => setDsRegion(e.target.value)} className="form-input">
                    <option value="Antarctica">Antarctica (ISEA)</option>
                    <option value="Arctic">Arctic (Himadri / IndARC)</option>
                    <option value="Himalaya">Himalayan Cryosphere (Himansh)</option>
                    <option value="Southern Ocean">Southern Ocean</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Year *</label>
                  <input 
                    type="number" 
                    value={dsYear} 
                    onChange={(e) => setDsYear(e.target.value)}
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label>Dataset Format *</label>
                  <select value={dsFormat} onChange={(e) => setDsFormat(e.target.value)} className="form-input">
                    <option value="NetCDF (.nc)">NetCDF (.nc)</option>
                    <option value="CSV (.csv)">CSV (.csv)</option>
                    <option value="GeoJSON (.geojson)">GeoJSON (.geojson)</option>
                    <option value="ASCII / Tab (.dat)">ASCII / Tab (.dat)</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>File Size / Volume</label>
                  <input 
                    type="text" 
                    value={dsFileSize} 
                    onChange={(e) => setDsFileSize(e.target.value)}
                    className="form-input"
                    placeholder="e.g. 42.8 MB"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Persistent DOI</label>
                <input 
                  type="text" 
                  value={dsDoi} 
                  onChange={(e) => setDsDoi(e.target.value)}
                  className="form-input"
                  placeholder="10.5281/zenodo.10984420"
                />
              </div>

              <div className="form-group">
                <label>Linked Expedition</label>
                <select value={dsExpId} onChange={(e) => setDsExpId(e.target.value)} className="form-input">
                  {expeditions.map(exp => (
                    <option key={exp.id} value={exp.id}>{exp.title} ({exp.year})</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-col">
              <div className="form-group">
                <label>Measured Parameters</label>
                <div className="tag-input-row">
                  <input 
                    type="text" 
                    value={dsParamInput} 
                    onChange={(e) => setDsParamInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddDsParam(); }}}
                    placeholder="Add parameter (e.g. Salinity) and press Add"
                    className="form-input"
                  />
                  <button type="button" className="btn-add-tag" onClick={handleAddDsParam}>
                    <Plus size={14} /> Add
                  </button>
                </div>
                <div className="tags-pills-list">
                  {dsParams.map((p, i) => (
                    <span key={i} className="station-pill">
                      <span>{p}</span>
                      <button type="button" onClick={() => setDsParams(dsParams.filter((_, idx) => idx !== i))}>×</button>
                    </span>
                  ))}
                </div>
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label>Spatial Coverage</label>
                  <input 
                    type="text" 
                    value={dsSpatial} 
                    onChange={(e) => setDsSpatial(e.target.value)}
                    className="form-input"
                    placeholder="e.g. 78°59'N, 11°48'E"
                  />
                </div>

                <div className="form-group">
                  <label>Temporal Coverage</label>
                  <input 
                    type="text" 
                    value={dsTemporal} 
                    onChange={(e) => setDsTemporal(e.target.value)}
                    className="form-input"
                    placeholder="e.g. 2023 - 2024"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Dataset Summary</label>
                <textarea 
                  rows={3} 
                  value={dsSummary} 
                  onChange={(e) => setDsSummary(e.target.value)}
                  className="form-input"
                  placeholder="Detailed dataset summary and instrumentation..."
                />
              </div>
            </div>
          </div>

          <div className="standalone-footer-actions">
            <button className="btn-secondary" onClick={onBack}>
              Cancel
            </button>
            <button className="btn-primary-publish bg-purple-btn" onClick={handleSaveStandaloneDataset}>
              <Database size={16} />
              <span>Publish Dataset to Open Archive</span>
            </button>
          </div>
        </div>
      )}



      {/* Embedded Styles */}
      <style>{`
        .upload-studio-page {
          padding-top: 1.5rem;
          padding-bottom: 4rem;
        }

        .upload-header-row {
          display: flex;
          align-items: flex-start;
          gap: 1.5rem;
          margin-bottom: 2rem;
          flex-wrap: wrap;
        }

        .btn-back {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: #ffffff;
          border: 1px solid #cbd5e1;
          color: #334155;
          padding: 0.5rem 0.9rem;
          border-radius: var(--radius-sm);
          font-size: 0.85rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .btn-back:hover {
          background: #f8fafc;
          border-color: #94a3b8;
          color: var(--navy);
        }

        .upload-header-text {
          flex: 1;
        }

        .section-eyebrow {
          font-size: 0.72rem;
          font-weight: 800;
          color: #0284c7;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          margin-bottom: 0.25rem;
        }

        .page-title {
          font-size: 2rem;
          font-weight: 800;
          color: var(--navy);
          margin: 0 0 0.5rem;
          letter-spacing: -0.02em;
        }

        .page-sub {
          font-size: 0.95rem;
          color: var(--text-secondary);
          margin: 0;
          max-width: 850px;
          line-height: 1.5;
        }

        /* Mode Selection Cards Bar */
        .mode-selection-bar {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .mode-tab-card {
          background: #ffffff;
          border: 2px solid #e2e8f0;
          border-radius: 12px;
          padding: 1.25rem;
          text-align: left;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
        }

        .mode-tab-card:hover {
          border-color: #cbd5e1;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.04);
        }

        .mode-tab-card.active {
          border-color: #0284c7;
          background: #f0f9ff;
          box-shadow: 0 4px 16px rgba(2, 132, 199, 0.12);
        }

        .mode-card-header {
          display: flex;
          align-items: center;
          gap: 0.85rem;
        }

        .mode-icon-box {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #ffffff;
          flex-shrink: 0;
        }

        .mode-icon-box.bg-blue { background: #0284c7; }
        .mode-icon-box.bg-amber { background: #d97706; }
        .mode-icon-box.bg-purple { background: #7c3aed; }
        .mode-icon-box.bg-cyan { background: #0891b2; }

        .mode-title {
          font-size: 0.95rem;
          font-weight: 700;
          color: var(--navy);
          line-height: 1.3;
        }

        .mode-flow-badge {
          display: inline-block;
          font-size: 0.68rem;
          font-weight: 700;
          color: #0369a1;
          background: #e0f2fe;
          padding: 0.15rem 0.5rem;
          border-radius: 4px;
          margin-top: 0.25rem;
        }

        .mode-flow-badge.standalone {
          color: #047857;
          background: #ecfdf5;
        }

        .mode-desc {
          font-size: 0.8rem;
          color: #64748b;
          margin: 0;
          line-height: 1.45;
        }

        /* Pipeline Steps Bar */
        .pipeline-steps-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1rem 1.5rem;
          border-radius: 14px;
          margin-bottom: 1.5rem;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          flex-wrap: wrap;
          gap: 0.75rem;
        }

        .pipeline-step-btn {
          display: flex;
          align-items: center;
          gap: 0.85rem;
          background: none;
          border: none;
          cursor: pointer;
          padding: 0.5rem 0.85rem;
          border-radius: 8px;
          transition: all 0.15s ease;
          text-align: left;
        }

        .pipeline-step-btn:hover {
          background: #f8fafc;
        }

        .step-num-circle {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #e2e8f0;
          color: #64748b;
          font-size: 0.85rem;
          font-weight: 800;
          transition: all 0.2s ease;
        }

        .pipeline-step-btn.active .step-num-circle {
          background: #0284c7;
          color: #ffffff;
          box-shadow: 0 0 0 4px rgba(2, 132, 199, 0.18);
        }

        .pipeline-step-btn.completed .step-num-circle {
          background: #059669;
          color: #ffffff;
        }

        .step-text-wrap {
          display: flex;
          flex-direction: column;
        }

        .step-label {
          font-size: 0.7rem;
          color: #94a3b8;
          font-weight: 700;
          text-transform: uppercase;
        }

        .step-heading {
          font-size: 0.88rem;
          font-weight: 700;
          color: #334155;
        }

        .pipeline-step-btn.active .step-heading {
          color: #0284c7;
        }

        .step-connector {
          flex: 1;
          height: 2px;
          background: #e2e8f0;
          min-width: 30px;
          max-width: 100px;
          transition: background 0.3s ease;
        }

        .step-connector.active {
          background: #059669;
        }

        /* Step Content Panels */
        .step-content-panel {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 14px;
          padding: 2rem;
          box-shadow: 0 2px 10px rgba(0,0,0,0.02);
        }

        .step-panel-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          border-bottom: 1px solid #f1f5f9;
          padding-bottom: 1.25rem;
          margin-bottom: 1.5rem;
          gap: 1rem;
        }

        .step-title {
          font-size: 1.35rem;
          font-weight: 800;
          color: var(--navy);
          margin: 0 0 0.25rem;
        }

        .step-subtitle {
          font-size: 0.88rem;
          color: #64748b;
          margin: 0;
        }

        .step-badge {
          font-size: 0.75rem;
          font-weight: 700;
          color: #0284c7;
          background: #e0f2fe;
          padding: 0.3rem 0.8rem;
          border-radius: var(--radius-full);
        }

        /* Forms Layout */
        .form-two-col-layout {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 1.5rem;
        }

        .form-col {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
        }

        .form-group label {
          font-size: 0.82rem;
          font-weight: 700;
          color: #334155;
        }

        .label-with-action {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .btn-auto-alt {
          display: inline-flex;
          align-items: center;
          gap: 0.3rem;
          background: #e0f2fe;
          border: 1px solid #bae6fd;
          color: #0369a1;
          font-size: 0.72rem;
          font-weight: 700;
          padding: 0.15rem 0.5rem;
          border-radius: 4px;
          cursor: pointer;
        }

        .btn-auto-alt:hover {
          background: #bae6fd;
        }

        .form-input {
          padding: 0.6rem 0.85rem;
          border: 1px solid #cbd5e1;
          border-radius: 8px;
          font-size: 0.88rem;
          color: #0f172a;
          background: #ffffff;
          outline: none;
          transition: border-color 0.15s ease, box-shadow 0.15s ease;
        }

        .form-input:focus {
          border-color: #0284c7;
          box-shadow: 0 0 0 3px rgba(2, 132, 199, 0.1);
        }

        .form-grid-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }

        .tag-input-row {
          display: flex;
          gap: 0.5rem;
        }

        .btn-add-tag {
          display: inline-flex;
          align-items: center;
          gap: 0.3rem;
          background: #f1f5f9;
          border: 1px solid #cbd5e1;
          color: #334155;
          padding: 0 0.85rem;
          border-radius: 8px;
          font-size: 0.8rem;
          font-weight: 700;
          cursor: pointer;
          flex-shrink: 0;
        }

        .btn-add-tag:hover {
          background: #e2e8f0;
        }

        .tags-pills-list {
          display: flex;
          flex-wrap: wrap;
          gap: 0.4rem;
          margin-top: 0.4rem;
        }

        .station-pill, .discipline-pill {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          background: #f8fafc;
          border: 1px solid #cbd5e1;
          padding: 0.2rem 0.55rem;
          border-radius: 6px;
          font-size: 0.76rem;
          font-weight: 600;
          color: #334155;
        }

        .station-pill button, .discipline-pill button {
          background: none;
          border: none;
          color: #94a3b8;
          cursor: pointer;
          font-size: 1rem;
          line-height: 1;
          padding: 0;
          margin-left: 2px;
        }

        .station-pill button:hover, .discipline-pill button:hover {
          color: #dc2626;
        }

        /* Media Creator Box inside Step 2 */
        .media-creator-box {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 1.5rem;
          margin-bottom: 2rem;
        }

        .media-creator-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 0.75rem;
          border-bottom: 1px solid #e2e8f0;
          padding-bottom: 0.85rem;
        }

        .media-type-selector {
          display: flex;
          gap: 0.5rem;
        }

        .type-toggle-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          background: #ffffff;
          border: 1px solid #cbd5e1;
          color: #475569;
          font-size: 0.82rem;
          font-weight: 700;
          padding: 0.45rem 0.9rem;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .type-toggle-btn.active {
          background: #0284c7;
          border-color: #0284c7;
          color: #ffffff;
        }

        .media-mode-hint {
          font-size: 0.78rem;
          font-weight: 600;
          color: #059669;
        }

        .media-add-action-row {
          margin-top: 1rem;
          display: flex;
          justify-content: flex-end;
        }

        .btn-add-media-item {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          background: #059669;
          border: 1px solid #047857;
          color: #ffffff;
          padding: 0.55rem 1.25rem;
          border-radius: 8px;
          font-size: 0.85rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .btn-add-media-item:hover {
          background: #047857;
          transform: translateY(-1px);
        }

        /* Queued Media Grid */
        .queued-media-section {
          margin-top: 1.5rem;
        }

        .queued-section-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1rem;
        }

        .queued-section-header h3 {
          font-size: 1.1rem;
          font-weight: 800;
          color: var(--navy);
          margin: 0;
        }

        .queued-count-badge {
          font-size: 0.78rem;
          font-weight: 700;
          color: #0369a1;
          background: #e0f2fe;
          padding: 0.25rem 0.65rem;
          border-radius: 6px;
        }

        .queued-media-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 1rem;
        }

        .queued-media-card {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 10px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          box-shadow: 0 1px 3px rgba(0,0,0,0.03);
        }

        .queued-thumb-wrap {
          position: relative;
          height: 140px;
          background: #0f172a;
        }

        .queued-thumb-wrap img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .media-type-badge {
          position: absolute;
          top: 8px;
          left: 8px;
          display: inline-flex;
          align-items: center;
          gap: 0.25rem;
          font-size: 0.68rem;
          font-weight: 800;
          padding: 0.2rem 0.5rem;
          border-radius: 4px;
          color: #ffffff;
        }

        .media-type-badge.photo { background: rgba(2, 132, 199, 0.9); }
        .media-type-badge.video { background: rgba(220, 38, 38, 0.9); }

        .queued-media-info {
          padding: 0.85rem 1rem;
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
          flex: 1;
        }

        .queued-media-caption {
          font-size: 0.85rem;
          font-weight: 700;
          color: #1e293b;
          line-height: 1.35;
        }

        .queued-alt-preview {
          font-size: 0.74rem;
          color: #64748b;
          line-height: 1.3;
        }

        .queued-card-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: auto;
          padding-top: 0.5rem;
          border-top: 1px solid #f1f5f9;
        }

        .queued-tags-count {
          font-size: 0.7rem;
          color: #94a3b8;
          font-weight: 600;
        }

        .btn-remove-media, .btn-remove-pub {
          background: #fee2e2;
          border: 1px solid #fecaca;
          color: #dc2626;
          padding: 0.25rem 0.45rem;
          border-radius: 4px;
          cursor: pointer;
        }

        .btn-remove-media:hover, .btn-remove-pub:hover {
          background: #fecaca;
        }

        /* Attached Pubs List */
        .attached-pubs-list {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .attached-pub-card {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 10px;
          padding: 1rem 1.25rem;
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .attached-pub-icon {
          width: 38px;
          height: 38px;
          border-radius: 8px;
          background: #fef3c7;
          color: #d97706;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .attached-pub-details {
          flex: 1;
        }

        .attached-pub-top {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          flex-wrap: wrap;
          margin-bottom: 0.2rem;
        }

        .attached-pub-cat {
          font-size: 0.7rem;
          font-weight: 700;
          color: #047857;
          background: #ecfdf5;
          padding: 0.1rem 0.4rem;
          border-radius: 4px;
        }

        .attached-pub-year {
          font-size: 0.7rem;
          font-weight: 700;
          color: #64748b;
        }

        .attached-pub-doi {
          font-size: 0.7rem;
          color: #0284c7;
          font-family: var(--font-mono, monospace);
        }

        .attached-pub-title {
          font-size: 0.92rem;
          font-weight: 700;
          color: var(--navy);
          margin: 0 0 0.25rem;
        }

        .attached-pub-authors {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          font-size: 0.78rem;
          color: #64748b;
        }

        .empty-queued-box {
          background: #f8fafc;
          border: 2px dashed #cbd5e1;
          border-radius: 10px;
          padding: 2rem;
          text-align: center;
          color: #94a3b8;
        }

        .empty-icon {
          margin: 0 auto 0.5rem;
        }

        /* Step Actions Footer */
        .step-actions-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 2rem;
          padding-top: 1.25rem;
          border-top: 1px solid #f1f5f9;
        }

        .btn-step-back {
          display: inline-flex;
          align-items: center;
          gap: 0.45rem;
          background: #f1f5f9;
          border: 1px solid #cbd5e1;
          color: #334155;
          padding: 0.6rem 1.25rem;
          border-radius: 8px;
          font-size: 0.85rem;
          font-weight: 700;
          cursor: pointer;
        }

        .btn-primary-step {
          display: inline-flex;
          align-items: center;
          gap: 0.45rem;
          background: #0284c7;
          border: 1px solid #0284c7;
          color: #ffffff;
          padding: 0.65rem 1.5rem;
          border-radius: 8px;
          font-size: 0.9rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .btn-primary-step:hover {
          background: #0369a1;
          transform: translateY(-1px);
        }

        .btn-publish-all {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: linear-gradient(135deg, #059669 0%, #047857 100%);
          border: 1px solid #047857;
          color: #ffffff;
          padding: 0.75rem 1.75rem;
          border-radius: 8px;
          font-size: 0.95rem;
          font-weight: 800;
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(5, 150, 105, 0.25);
          transition: all 0.2s ease;
        }

        .btn-publish-all:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(5, 150, 105, 0.35);
        }

        /* Standalone Cards */
        .standalone-card {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 14px;
          padding: 2rem;
          box-shadow: 0 2px 10px rgba(0,0,0,0.02);
        }

        .standalone-header-row {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          border-bottom: 1px solid #f1f5f9;
          padding-bottom: 1.25rem;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .standalone-title {
          font-size: 1.35rem;
          font-weight: 800;
          color: var(--navy);
          margin: 0 0 0.25rem;
        }

        .standalone-subtitle {
          font-size: 0.88rem;
          color: #64748b;
          margin: 0;
          max-width: 750px;
        }

        .standalone-dest-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          font-size: 0.78rem;
          font-weight: 700;
          color: #047857;
          background: #ecfdf5;
          padding: 0.35rem 0.85rem;
          border-radius: var(--radius-full);
          border: 1px solid #a7f3d0;
        }

        .standalone-dest-badge.purple {
          color: #6d28d9;
          background: #f5f3ff;
          border-color: #ddd6fe;
        }

        .standalone-footer-actions {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 1rem;
          margin-top: 2rem;
          padding-top: 1.25rem;
          border-top: 1px solid #f1f5f9;
        }

        .btn-primary-publish {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: #0284c7;
          border: 1px solid #0284c7;
          color: #ffffff;
          padding: 0.65rem 1.5rem;
          border-radius: 8px;
          font-size: 0.9rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .btn-primary-publish:hover {
          background: #0369a1;
          transform: translateY(-1px);
        }

        .btn-primary-publish.bg-purple-btn {
          background: #7c3aed;
          border-color: #6d28d9;
        }
        .btn-primary-publish.bg-purple-btn:hover {
          background: #6d28d9;
        }

        .btn-primary-publish.bg-cyan-btn {
          background: #0891b2;
          border-color: #0e7490;
        }
        .btn-primary-publish.bg-cyan-btn:hover {
          background: #0e7490;
        }

        .toast-notification {
          position: fixed;
          bottom: 24px;
          right: 24px;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: #0f172a;
          color: #ffffff;
          padding: 0.75rem 1.25rem;
          border-radius: 8px;
          box-shadow: 0 4px 16px rgba(0,0,0,0.2);
          z-index: 999;
          font-size: 0.88rem;
          font-weight: 600;
        }
      `}</style>
    </div>
  );
}
