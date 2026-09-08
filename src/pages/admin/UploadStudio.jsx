import { useState } from 'react';
import { usePortal } from '../../context/PortalContext';
import { autoGenerateImageAlt } from '../../services/aiService';
import { 
  ArrowLeft, 
  UploadCloud, 
  FileText, 
  Database, 
  BookOpen, 
  Image as ImageIcon, 
  Video, 
  Calendar, 
  Sparkles, 
  CheckCircle2, 
  Plus, 
  Save, 
  Zap, 
  Tag, 
  Check, 
  FileCode, 
  MapPin, 
  HelpCircle 
} from 'lucide-react';

export default function UploadStudio({ onBack, navigateTo, initialCategory = 'reports' }) {
  const { 
    addExpedition, 
    addDataset, 
    addPublication, 
    addMediaArchive, 
    addActivity 
  } = usePortal();

  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [parsingProgress, setParsingProgress] = useState(0);
  const [isParsing, setIsParsing] = useState(false);
  const [successToast, setSuccessToast] = useState(null);

  // Common Form States
  const [title, setTitle] = useState('');
  const [region, setRegion] = useState('Antarctica');
  const [year, setYear] = useState(new Date().getFullYear());
  const [expeditionId, setExpeditionId] = useState('isea-43');
  const [summary, setSummary] = useState('');

  // 1. Report Specific
  const [chiefScientist, setChiefScientist] = useState('');
  const [vessel, setVessel] = useState('');
  const [stationLogs, setStationLogs] = useState(['Maitri Station', 'Bharati Station']);
  const [stationInput, setStationInput] = useState('');
  const [reportRawText, setReportRawText] = useState('');
  const [heroImage] = useState('https://images.unsplash.com/photo-1517411032315-54ef2cb783bb?auto=format&fit=crop&w=1200&q=80');

  // 2. Dataset Specific
  const [datasetFormat, setDatasetFormat] = useState('CSV (.csv)');
  const [parameters, setParameters] = useState(['Depth (m)', 'δ18O (‰)', 'Dust Concentration (ppb)']);
  const [paramInput, setParamInput] = useState('');
  const [doi, setDoi] = useState('10.5281/zenodo.10892301');
  const [license] = useState('CC-BY 4.0 Open Science');
  const [spatialCoverage, setSpatialCoverage] = useState("75°06'S, 123°21'E (East Antarctica)");
  const [temporalCoverage, setTemporalCoverage] = useState('7,800 BP - 2024 CE');
  const [fileSize] = useState('42.8 MB');

  // 3. Publication Specific
  const [journal, setJournal] = useState('Polar Science & Cryosphere Letters');
  const [authors, setAuthors] = useState(['Dr. A. K. Sharma', 'Dr. Rahul Sengupta', 'NCPOR Science Corps']);
  const [authorInput, setAuthorInput] = useState('');
  const [pubCategory, setPubCategory] = useState('Glaciology & Paleoclimate');
  const [citations, setCitations] = useState(0);

  // 4. Photo Specific
  const [photoUrl, setPhotoUrl] = useState('https://images.unsplash.com/photo-1517411032315-54ef2cb783bb?auto=format&fit=crop&w=1600&q=80');
  const [photoCaption, setPhotoCaption] = useState('');
  const [photoAltText, setPhotoAltText] = useState('');
  const [resolution] = useState('4K UHD (3840x2160)');
  const [photoTags, setPhotoTags] = useState(['Fieldwork', 'Antarctica', 'Station']);

  // 5. Video Specific
  const [videoUrl] = useState('https://images.unsplash.com/photo-1517999144091-3d9dca6d1e43?auto=format&fit=crop&w=1600&q=80');
  const [videoStreamUrl, setVideoStreamUrl] = useState('https://www.youtube.com/watch?v=sample');
  const [duration, setDuration] = useState('4 min 20 sec');
  const [transcript, setTranscript] = useState('');

  // 6. Institutional Activity Specific
  const [activityType, setActivityType] = useState('Smart Education');
  const [badgeText, setBadgeText] = useState('Student Outreach');
  const [eventDate, setEventDate] = useState('August 2024');

  // Pre-load Authentic Demo Assets for 1-Click Evaluation
  const handleLoadPreset = (category) => {
    if (category === 'reports') {
      setTitle('44th Indian Scientific Expedition to Antarctica (ISEA) Preliminary Cruise Dossier');
      setRegion('Antarctica');
      setYear(2024);
      setChiefScientist('Dr. Rahul Sengupta (Senior Scientist, NCPOR)');
      setVessel('MV Vasiliy Golovnin (Chartered Ice-Class Vessel)');
      setStationLogs(['Maitri Station', 'Bharati Station', 'Dome C Margin']);
      setSummary('Preliminary technical and scientific expedition log covering deep glaciological drilling, aerosol sampling, and green microgrid trials.');
      setReportRawText(`NATIONAL CENTRE FOR POLAR AND OCEAN RESEARCH (NCPOR)
Ministry of Earth Sciences, Govt. of India
REPORT ON THE 44TH INDIAN SCIENTIFIC EXPEDITION TO ANTARCTICA (2024)

Executive Summary:
The voyage departed Cape Town with 48 scientists from MoES institutes, Survey of India, and IITs. Core missions include high-resolution aerosol monitoring at Bharati, permafrost temperature logging at Maitri, and testing cold-hardened autonomous glaciology buoys.`);
      setUploadedFile({ name: 'ISEA_44_Cruise_Report_Official.pdf', size: 15518920, type: 'application/pdf' });
    } else if (category === 'datasets') {
      setTitle('Kongsfjorden Fjord Subsurface CTD & Ocean Carbon Flux Time-Series');
      setRegion('Arctic');
      setYear(2024);
      setExpeditionId('arctic-2024');
      setDatasetFormat('NetCDF (.nc)');
      setParameters(['Water Temperature (°C)', 'Practical Salinity (PSU)', 'pCO2 (μatm)', 'Dissolved Oxygen (mg/L)', 'Current Velocity (m/s)']);
      setDoi('10.5281/zenodo.10984420');
      setSpatialCoverage("78°59'N, 11°48'E (Kongsfjorden Fjord, Ny-Ålesund)");
      setTemporalCoverage('March 2023 - October 2024');
      setSummary('Continuous subsurface oceanographic time-series monitoring Atlantic water intrusion and biogeochemical fluxes in the Arctic IndARC observatory.');
      setUploadedFile({ name: 'IndARC_Kongsfjorden_CTD_2024.nc', size: 193566720, type: 'application/x-netcdf' });
    } else if (category === 'publications') {
      setTitle('Atmospheric aerosol optical depths and black carbon transport over East Antarctic coast');
      setRegion('Antarctica');
      setYear(2024);
      setPubCategory('Atmospheric Sciences');
      setJournal('Journal of Geophysical Research: Atmospheres');
      setAuthors(['Dr. P. R. Sinha', 'Dr. Alok Kumar Sharma', 'Dr. M. M. Nambiar']);
      setDoi('10.1029/2024JD039821');
      setCitations(14);
      setSummary('Simultaneous multi-wavelength aethalometer observations demonstrate pristine baseline aerosol optical depth punctuated by rare biomass burning plumes.');
      setUploadedFile({ name: 'Atmospheric_Aerosols_JGR_2024.pdf', size: 3565158, type: 'application/pdf' });
    } else if (category === 'photos') {
      setTitle('Bharati Station Green Microgrid Array under Midnight Sun');
      setRegion('Antarctica');
      setYear(2024);
      setPhotoUrl('https://images.unsplash.com/photo-1517411032315-54ef2cb783bb?auto=format&fit=crop&w=1600&q=80');
      setPhotoCaption('High-efficiency photovoltaic and wind microgrid providing clean auxiliary energy at India’s Bharati Station.');
      setPhotoAltText('Modern elevated Antarctic research base Bharati bathed in bright midnight sunlight with snow-covered rocky oasis in background.');
      setPhotoTags(['Bharati', 'Solar Energy', 'Clean Tech', 'Infrastructure']);
      setSummary('High-resolution documentary photograph showcasing green energy transition in polar habitats.');
      setUploadedFile({ name: 'Bharati_Solar_Array_4K.jpg', size: 8598320, type: 'image/jpeg' });
    } else if (category === 'videos') {
      setTitle('Drone Survey: Kronebreen Glacier Terminus Retreat & IndARC Mooring');
      setRegion('Arctic');
      setYear(2024);
      setVideoStreamUrl('https://www.youtube.com/watch?v=sample-arctic');
      setDuration('5 min 14 sec');
      setTranscript('Field audio log: Deployed DJI Matrice 300 RTF drone over Kronebreen glacier calving front. Air temp -6°C, wind 12 knots. Measuring terminus retreat rate.');
      setSummary('4K aerial drone survey documenting rapid fjord ice calving dynamics in high Arctic Ny-Ålesund.');
      setUploadedFile({ name: 'Drone_Kronebreen_Glacier_4K.mp4', size: 252182528, type: 'video/mp4' });
    } else if (category === 'activities') {
      setTitle('MoES-NCPOR National Polar Science School Outreach Reaches 25,000 Students');
      setRegion('Antarctica');
      setYear(2024);
      setActivityType('Smart Education');
      setBadgeText('Student Outreach');
      setEventDate('August 2024');
      setSummary('Interactive virtual webinars and classroom ice core kits distributed across Kendriya Vidyalayas and Navodaya Vidyalayas nationwide.');
      setUploadedFile({ name: 'MoES_School_Outreach_Circular.pdf', size: 2202009, type: 'application/pdf' });
    }

    setSuccessToast(`Loaded preset demo for ${category.toUpperCase()}`);
    setTimeout(() => setSuccessToast(null), 3000);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = (file) => {
    setUploadedFile(file);
    setIsParsing(true);
    setParsingProgress(20);

    setTimeout(() => setParsingProgress(60), 300);
    setTimeout(() => {
      setParsingProgress(100);
      setIsParsing(false);
      
      if (!title) {
        const cleanName = file.name.replace(/\.[^/.]+$/, "").replace(/_/g, " ");
        setTitle(cleanName.charAt(0).toUpperCase() + cleanName.slice(1));
      }
    }, 700);
  };

  const handleAutoAlt = () => {
    const generated = autoGenerateImageAlt(photoCaption || title, region, `Resolution: ${resolution}`);
    setPhotoAltText(generated);
  };

  const handleSave = () => {
    if (activeCategory === 'reports') {
      addExpedition({
        title: title || 'Polar Scientific Mission Report',
        region,
        year: Number(year),
        chiefScientist,
        vessel,
        stations: stationLogs,
        heroImage,
        summary,
        tags: ['Glaciology', 'Aerosol Physics', 'Green Microgrid', 'Autonomous Buoys'],
        scientificAbstract: reportRawText,
        keyFindings: [
          'High-latitude baseline telemetry validated.',
          'Atmospheric aerosol and greenhouse gas monitoring completed.',
          'Zero-waste environmental protocol executed.'
        ],
        reports: [
          {
            id: `rep-${Date.now()}`,
            title: `Official Report: ${title}`,
            fileUrl: '#',
            fileSize: uploadedFile?.size ? `${(uploadedFile.size / (1024*1024)).toFixed(1)} MB` : '14.2 MB',
            rawText: reportRawText
          }
        ],
        media: [
          {
            id: `m-${Date.now()}-1`,
            type: 'photo',
            url: heroImage,
            caption: title,
            altText: autoGenerateImageAlt(title, region),
            tags: ['Fieldwork', 'Antarctica']
          },
          {
            id: `m-${Date.now()}-2`,
            type: 'photo',
            url: 'https://images.unsplash.com/photo-1508873696983-2df5293cb32f?auto=format&fit=crop&w=1200&q=80',
            caption: 'Glaciologist preparing electromechanical drill at Dronning Maud Land margin.',
            altText: 'Scientist in polar parka assembling drill apparatus on snow field.',
            tags: ['Glaciology', 'Fieldwork']
          },
          {
            id: `m-${Date.now()}-3`,
            type: 'photo',
            url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80',
            caption: 'Schirmacher Oasis nunataks surrounding India\'s Maitri research station.',
            altText: 'Rugged rocky hills jutting above surrounding continental ice sheet under clear sky.',
            tags: ['Maitri', 'Landscape']
          }
        ],
        publications: ['pub-101', 'pub-104']
      });
    } else if (activeCategory === 'datasets') {
      addDataset({
        title: title || 'Polar Scientific Dataset',
        region,
        year: Number(year),
        expeditionId,
        category: 'Glaciology & Paleoclimate',
        format: datasetFormat,
        fileSize: uploadedFile?.size ? `${(uploadedFile.size / (1024*1024)).toFixed(1)} MB` : fileSize,
        parameters,
        doi,
        license,
        spatialCoverage,
        temporalCoverage,
        summary: summary || 'Comprehensive verified polar dataset collected by NCPOR researchers.'
      });
    } else if (activeCategory === 'publications') {
      addPublication({
        title: title || 'Polar Science Publication',
        authors,
        journal,
        year: Number(year),
        doi,
        category: pubCategory,
        expeditionId,
        abstract: summary || 'Peer-reviewed research detailing high-latitude scientific observations.',
        citations: Number(citations) || 0
      });
    } else if (activeCategory === 'photos' || activeCategory === 'videos') {
      addMediaArchive({
        type: activeCategory === 'videos' ? 'video' : 'photo',
        title: title || 'Polar Media Archive',
        region,
        expeditionId,
        year: Number(year),
        url: activeCategory === 'videos' ? videoUrl : photoUrl,
        videoStreamUrl,
        duration,
        caption: photoCaption || title,
        altText: photoAltText || autoGenerateImageAlt(title, region),
        tags: photoTags,
        category: activeCategory === 'videos' ? 'Videos' : 'Photographs',
        resolution,
        transcript
      });
    } else if (activeCategory === 'activities') {
      addActivity({
        title: title || 'Institutional Outreach Activity',
        date: `${eventDate} ${year}`,
        type: activityType,
        badge: badgeText,
        summary: summary || 'MoES-NCPOR polar science outreach and education campaign.'
      });
    }

    navigateTo('admin-dashboard');
  };

  const categories = [
    { id: 'reports', label: '1. Expedition Reports', icon: FileText, desc: 'Cruise dossiers, PDF reports & mission logs' },
    { id: 'datasets', label: '2. Scientific Datasets', icon: Database, desc: 'NetCDF, CSV, GeoJSON & sensor telemetry' },
    { id: 'publications', label: '3. Publications & Papers', icon: BookOpen, desc: 'Peer-reviewed journals & MoES bulletins' },
    { id: 'photos', label: '4. Photographs (WCAG-AA)', icon: ImageIcon, desc: 'High-res imagery with AI alt-text' },
    { id: 'videos', label: '5. Videos & Drone Logs', icon: Video, desc: 'Field documentary & drone footage' },
    { id: 'activities', label: '6. Institutional Activities', icon: Calendar, desc: 'School outreach, webinars & MoES events' }
  ];

  return (
    <div className="container upload-studio-page">
      {/* Top Header */}
      <div className="upload-header-row">
        <button className="btn-back" onClick={onBack}>
          <ArrowLeft size={16} />
          <span>Back to Dashboard</span>
        </button>

        <div className="upload-header-text">
          <div className="section-eyebrow">UNIVERSAL ARCHIVAL & INGESTION HUB</div>
          <h1 className="page-title">Upload & Archive Polar Science</h1>
          <p className="page-sub">
            Archive multi-format scientific assets to fulfill the MoES National Polar Outreach mandate and generate automated multi-channel social media campaigns.
          </p>
        </div>

        {/* Quick Demo Preloader */}
        <button 
          className="btn-preset-load"
          onClick={() => handleLoadPreset(activeCategory)}
          title="Instantly pre-fill authentic polar data for SIH evaluation"
        >
          <Zap size={15} />
          <span>⚡ Load Demo {activeCategory.slice(0, -1)} Asset</span>
        </button>
      </div>

      {successToast && (
        <div className="toast-notification">
          <CheckCircle2 size={16} />
          <span>{successToast}</span>
        </div>
      )}

      {/* 6 Problem Statement Asset Pillars Bar */}
      <div className="pillar-nav-bar">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              className={`pillar-tab ${isActive ? 'active' : ''}`}
              onClick={() => {
                setActiveCategory(cat.id);
                setUploadedFile(null);
              }}
            >
              <div className="pillar-tab-icon">
                <Icon size={18} />
              </div>
              <div className="pillar-tab-info">
                <div className="pillar-tab-title">{cat.label}</div>
                <div className="pillar-tab-desc">{cat.desc}</div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Main Drag-and-Drop & Form Grid */}
      <div className="upload-grid-container">
        {/* Left Column: Drag & Drop Dropzone + File Preview */}
        <div className="dropzone-column">
          <div 
            className={`glass-panel dropzone-card ${dragActive ? 'drag-active' : ''}`}
            onDragEnter={(e) => { e.preventDefault(); setDragActive(true); }}
            onDragLeave={(e) => { e.preventDefault(); setDragActive(false); }}
            onDragOver={(e) => { e.preventDefault(); }}
            onDrop={handleDrop}
          >
            <input 
              type="file" 
              id="file-upload-input" 
              className="hidden-file-input"
              onChange={handleFileSelect}
            />
            <label htmlFor="file-upload-input" className="dropzone-content-label">
              <div className="dropzone-icon-box">
                <UploadCloud size={36} className="upload-cloud-icon" />
              </div>
              <h4>Drag & Drop or Browse Files</h4>
              <p>Supports PDF, DOCX, CSV, NetCDF (.nc), GeoJSON, JPG, PNG, MP4</p>
              <span className="btn-browse-file">Choose Local File</span>
            </label>

            {isParsing && (
              <div className="parsing-progress-box">
                <div className="progress-bar-track">
                  <div className="progress-bar-fill" style={{ width: `${parsingProgress}%` }}></div>
                </div>
                <div className="progress-status-text">
                  <Sparkles size={12} className="spin-slow" />
                  <span>Ingesting and extracting polar metadata ({parsingProgress}%)...</span>
                </div>
              </div>
            )}

            {uploadedFile && !isParsing && (
              <div className="uploaded-file-chip">
                <FileCode size={18} className="file-chip-icon" />
                <div className="file-chip-info">
                  <div className="file-chip-name">{uploadedFile.name}</div>
                  <div className="file-chip-meta">{uploadedFile.type || 'Binary Document'} • {uploadedFile.size ? `${(uploadedFile.size / 1024).toFixed(1)} KB` : '12.4 MB'}</div>
                </div>
                <div className="file-chip-status">
                  <Check size={14} />
                  <span>Parsed</span>
                </div>
              </div>
            )}
          </div>

          {/* Guidelines Box */}
          <div className="glass-panel guidelines-card">
            <h4 className="guide-title">
              <HelpCircle size={15} />
              <span>NCPOR Archival Standard Guidelines</span>
            </h4>
            <ul className="guide-list">
              <li><strong>Open Data Mandate:</strong> Datasets comply with FAIR (Findable, Accessible, Interoperable, Reusable) polar data standards.</li>
              <li><strong>Accessibility:</strong> All photographs & media archives automatically undergo WCAG-AA compliant alt-tagging.</li>
              <li><strong>Immediate AI Outreach:</strong> Once archived, launch the 1-Click AI Studio to generate Twitter, Instagram & LinkedIn social campaigns.</li>
            </ul>
          </div>
        </div>

        {/* Right Column: Dynamic Metadata Form */}
        <div className="metadata-column">
          <div className="glass-panel metadata-card">
            <h3 className="meta-card-title">
              <span>{categories.find(c => c.id === activeCategory)?.label} Metadata</span>
              <span className="pill-badge">{region}</span>
            </h3>

            <div className="meta-form-body">
              {/* Universal Fields */}
              <div className="form-group">
                <label>Official Title / Mission Headline *</label>
                <input 
                  type="text" 
                  value={title} 
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder={`e.g. ${activeCategory === 'datasets' ? 'Kongsfjorden Subsurface CTD Timeseries' : '44th Indian Scientific Expedition to Antarctica'}`}
                  className="form-input"
                  required
                />
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label>Polar Region *</label>
                  <select value={region} onChange={(e) => setRegion(e.target.value)} className="form-input">
                    <option value="Antarctica">Antarctica (ISEA)</option>
                    <option value="Arctic">Arctic (Himadri / IndARC)</option>
                    <option value="Himalaya">Himalayan Cryosphere (Himansh)</option>
                    <option value="Southern Ocean">Southern Ocean</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Year / Campaign Date *</label>
                  <input 
                    type="number" 
                    value={year} 
                    onChange={(e) => setYear(e.target.value)} 
                    className="form-input" 
                  />
                </div>
              </div>

              {/* 1. REPORT FIELDS */}
              {activeCategory === 'reports' && (
                <>
                  <div className="form-grid-2">
                    <div className="form-group">
                      <label>Chief Scientist / Mission Leader</label>
                      <input 
                        type="text" 
                        value={chiefScientist} 
                        onChange={(e) => setChiefScientist(e.target.value)}
                        placeholder="e.g. Dr. Rahul Sengupta (NCPOR)"
                        className="form-input"
                      />
                    </div>

                    <div className="form-group">
                      <label>Vessel / Transport Logistics</label>
                      <input 
                        type="text" 
                        value={vessel} 
                        onChange={(e) => setVessel(e.target.value)}
                        placeholder="e.g. MV Vasiliy Golovnin"
                        className="form-input"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Station / Field Deployment Locations</label>
                    <div className="tag-input-row">
                      <input 
                        type="text" 
                        value={stationInput}
                        onChange={(e) => setStationInput(e.target.value)}
                        placeholder="e.g. Bharati Station, Larsemann Hills"
                        className="form-input"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            if (stationInput.trim() && !stationLogs.includes(stationInput.trim())) {
                              setStationLogs([...stationLogs, stationInput.trim()]);
                              setStationInput('');
                            }
                          }
                        }}
                      />
                      <button 
                        type="button" 
                        className="btn-secondary"
                        onClick={() => {
                          if (stationInput.trim() && !stationLogs.includes(stationInput.trim())) {
                            setStationLogs([...stationLogs, stationInput.trim()]);
                            setStationInput('');
                          }
                        }}
                      >
                        <Plus size={14} /> Add
                      </button>
                    </div>
                    <div className="tags-container">
                      {stationLogs.map((st, idx) => (
                        <span key={idx} className="tag-pill">
                          <MapPin size={11} /> {st}
                          <button type="button" onClick={() => setStationLogs(stationLogs.filter(s => s !== st))}>×</button>
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Extracted Technical Report Text (Ingested by AI Engine)</label>
                    <textarea 
                      rows={5}
                      value={reportRawText}
                      onChange={(e) => setReportRawText(e.target.value)}
                      placeholder="Paste raw cruise reports, progress logs, or executive summaries for LLM prompt ingestion..."
                      className="form-textarea font-mono"
                    />
                  </div>
                </>
              )}

              {/* 2. DATASET FIELDS */}
              {activeCategory === 'datasets' && (
                <>
                  <div className="form-grid-2">
                    <div className="form-group">
                      <label>Dataset Format *</label>
                      <select value={datasetFormat} onChange={(e) => setDatasetFormat(e.target.value)} className="form-input">
                        <option value="NetCDF (.nc)">NetCDF (.nc)</option>
                        <option value="CSV (.csv)">CSV (.csv)</option>
                        <option value="GeoJSON (.json)">GeoJSON (.json)</option>
                        <option value="ASCII / TXT">ASCII / TXT</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label>Digital Object Identifier (DOI)</label>
                      <input 
                        type="text" 
                        value={doi} 
                        onChange={(e) => setDoi(e.target.value)}
                        placeholder="10.5281/zenodo.10892301"
                        className="form-input"
                      />
                    </div>
                  </div>

                  <div className="form-grid-2">
                    <div className="form-group">
                      <label>Spatial Coordinates / Coverage</label>
                      <input 
                        type="text" 
                        value={spatialCoverage} 
                        onChange={(e) => setSpatialCoverage(e.target.value)}
                        placeholder="e.g. 75°06'S, 123°21'E (Dome C Margin)"
                        className="form-input"
                      />
                    </div>

                    <div className="form-group">
                      <label>Temporal Coverage</label>
                      <input 
                        type="text" 
                        value={temporalCoverage} 
                        onChange={(e) => setTemporalCoverage(e.target.value)}
                        placeholder="e.g. 7,800 BP - 2024 CE"
                        className="form-input"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Parameter Variables Measured (Columns/Layers)</label>
                    <div className="tag-input-row">
                      <input 
                        type="text" 
                        value={paramInput}
                        onChange={(e) => setParamInput(e.target.value)}
                        placeholder="e.g. Water Temperature (°C), Salinity (PSU)"
                        className="form-input"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            if (paramInput.trim() && !parameters.includes(paramInput.trim())) {
                              setParameters([...parameters, paramInput.trim()]);
                              setParamInput('');
                            }
                          }
                        }}
                      />
                      <button 
                        type="button" 
                        className="btn-secondary"
                        onClick={() => {
                          if (paramInput.trim() && !parameters.includes(paramInput.trim())) {
                            setParameters([...parameters, paramInput.trim()]);
                            setParamInput('');
                          }
                        }}
                      >
                        <Plus size={14} /> Add Parameter
                      </button>
                    </div>
                    <div className="tags-container">
                      {parameters.map((p, idx) => (
                        <span key={idx} className="tag-pill param-pill">
                          <Tag size={11} /> {p}
                          <button type="button" onClick={() => setParameters(parameters.filter(item => item !== p))}>×</button>
                        </span>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* 3. PUBLICATION FIELDS */}
              {activeCategory === 'publications' && (
                <>
                  <div className="form-grid-2">
                    <div className="form-group">
                      <label>Journal / Proceedings</label>
                      <input 
                        type="text" 
                        value={journal} 
                        onChange={(e) => setJournal(e.target.value)}
                        placeholder="e.g. Global Biogeochemical Cycles"
                        className="form-input"
                      />
                    </div>

                    <div className="form-group">
                      <label>Scientific Category</label>
                      <select value={pubCategory} onChange={(e) => setPubCategory(e.target.value)} className="form-input">
                        <option value="Glaciology & Paleoclimate">Glaciology & Paleoclimate</option>
                        <option value="Oceanography">Oceanography</option>
                        <option value="Himalayan Cryosphere">Himalayan Cryosphere</option>
                        <option value="Atmospheric Sciences">Atmospheric Sciences</option>
                        <option value="Polar Biology">Polar Biology</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Authors List</label>
                    <div className="tag-input-row">
                      <input 
                        type="text" 
                        value={authorInput}
                        onChange={(e) => setAuthorInput(e.target.value)}
                        placeholder="e.g. Dr. A. K. Sharma"
                        className="form-input"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            if (authorInput.trim() && !authors.includes(authorInput.trim())) {
                              setAuthors([...authors, authorInput.trim()]);
                              setAuthorInput('');
                            }
                          }
                        }}
                      />
                      <button 
                        type="button" 
                        className="btn-secondary"
                        onClick={() => {
                          if (authorInput.trim() && !authors.includes(authorInput.trim())) {
                            setAuthors([...authors, authorInput.trim()]);
                            setAuthorInput('');
                          }
                        }}
                      >
                        <Plus size={14} /> Add Author
                      </button>
                    </div>
                    <div className="tags-container">
                      {authors.map((a, idx) => (
                        <span key={idx} className="tag-pill">
                          {a}
                          <button type="button" onClick={() => setAuthors(authors.filter(item => item !== a))}>×</button>
                        </span>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* 4. PHOTO FIELDS */}
              {activeCategory === 'photos' && (
                <>
                  <div className="form-group">
                    <label>Image Source URL</label>
                    <input 
                      type="url" 
                      value={photoUrl} 
                      onChange={(e) => setPhotoUrl(e.target.value)}
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label>Caption</label>
                    <input 
                      type="text" 
                      value={photoCaption} 
                      onChange={(e) => setPhotoCaption(e.target.value)}
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
                        onClick={handleAutoAlt}
                      >
                        <Sparkles size={12} />
                        <span>AI Auto-Generate Alt</span>
                      </button>
                    </div>
                    <textarea 
                      rows={2}
                      value={photoAltText}
                      onChange={(e) => setPhotoAltText(e.target.value)}
                      placeholder="Descriptive text for screen readers..."
                      className="form-textarea"
                    />
                  </div>
                </>
              )}

              {/* 5. VIDEO FIELDS */}
              {activeCategory === 'videos' && (
                <>
                  <div className="form-grid-2">
                    <div className="form-group">
                      <label>Video Stream / Embed URL (YouTube/MoES)</label>
                      <input 
                        type="url" 
                        value={videoStreamUrl} 
                        onChange={(e) => setVideoStreamUrl(e.target.value)}
                        placeholder="https://www.youtube.com/watch?v=..."
                        className="form-input"
                      />
                    </div>

                    <div className="form-group">
                      <label>Duration</label>
                      <input 
                        type="text" 
                        value={duration} 
                        onChange={(e) => setDuration(e.target.value)}
                        placeholder="e.g. 4 min 20 sec"
                        className="form-input"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Field Audio Transcript / Key Science Markers</label>
                    <textarea 
                      rows={3}
                      value={transcript}
                      onChange={(e) => setTranscript(e.target.value)}
                      placeholder="Spoken dialog, scientific observation notes, or key timestamps..."
                      className="form-textarea"
                    />
                  </div>
                </>
              )}

              {/* 6. INSTITUTIONAL ACTIVITY FIELDS */}
              {activeCategory === 'activities' && (
                <>
                  <div className="form-grid-2">
                    <div className="form-group">
                      <label>Activity Category</label>
                      <select value={activityType} onChange={(e) => setActivityType(e.target.value)} className="form-input">
                        <option value="Smart Education">Smart Education (School/College)</option>
                        <option value="Research Milestone">Research Milestone</option>
                        <option value="Expedition Flag-off">Expedition Flag-off</option>
                        <option value="Science Day">National Polar Science Day</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label>Badge Label</label>
                      <input 
                        type="text" 
                        value={badgeText} 
                        onChange={(e) => setBadgeText(e.target.value)}
                        placeholder="e.g. Student Outreach"
                        className="form-input"
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Description / Summary */}
              <div className="form-group">
                <label>Archival Summary & Abstract</label>
                <textarea 
                  rows={3}
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  placeholder="Summary of this polar asset to be indexed across the public outreach portal..."
                  className="form-textarea"
                />
              </div>

              {/* Action Buttons */}
              <div className="meta-actions-bar">
                <button type="button" className="btn-secondary" onClick={onBack}>
                  Cancel
                </button>

                <div className="meta-actions-right">
                  <button 
                    type="button" 
                    className="btn-saffron"
                    onClick={() => handleSave()}
                  >
                    <Save size={16} />
                    <span>Save to Archive Repository</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .upload-studio-page {
          padding: 2.5rem 1.5rem 5rem;
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .upload-header-row {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 1.25rem;
        }

        .upload-header-text {
          flex: 1;
        }

        .btn-preset-load {
          display: flex;
          align-items: center;
          gap: 0.45rem;
          background: #fffbeb;
          border: 1px solid #fde68a;
          color: #b45309;
          padding: 0.65rem 1.1rem;
          border-radius: var(--radius-sm);
          font-size: 0.85rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .btn-preset-load:hover {
          background: #fef3c7;
          border-color: #f59e0b;
          transform: translateY(-1px);
        }

        .toast-notification {
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

        /* 6 Pillar Tabs */
        .pillar-nav-bar {
          display: grid;
          grid-template-columns: repeat(6, 1fr);
          gap: 0.75rem;
        }

        .pillar-tab {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
          padding: 1rem 0.85rem;
          background: #ffffff;
          border: 1px solid var(--border-card);
          border-radius: var(--radius-md);
          color: var(--text-secondary);
          text-align: left;
          cursor: pointer;
          transition: all 0.15s ease;
          box-shadow: var(--shadow-sm);
        }

        .pillar-tab:hover {
          background: #f8fafc;
          color: var(--navy);
          border-color: #cbd5e1;
        }

        .pillar-tab.active {
          background: #eff6ff;
          border-color: #bfdbfe;
          color: var(--navy);
          box-shadow: 0 0 0 1px #bfdbfe;
        }

        .pillar-tab-icon {
          color: #0284c7;
        }

        .pillar-tab-title {
          font-size: 0.85rem;
          font-weight: 700;
          line-height: 1.2;
          color: var(--navy);
        }

        .pillar-tab-desc {
          font-size: 0.7rem;
          color: var(--text-muted);
          line-height: 1.2;
        }

        /* Upload Grid */
        .upload-grid-container {
          display: grid;
          grid-template-columns: 340px 1fr;
          gap: 1.5rem;
        }

        .dropzone-column {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .dropzone-card {
          padding: 2rem 1.5rem;
          border: 2px dashed #cbd5e1;
          border-radius: var(--radius-md);
          text-align: center;
          transition: all 0.15s ease;
          background: #ffffff;
          box-shadow: var(--shadow-sm);
        }

        .dropzone-card.drag-active {
          border-color: #0284c7;
          background: #eff6ff;
        }

        .hidden-file-input {
          display: none;
        }

        .dropzone-content-label {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.6rem;
          cursor: pointer;
        }

        .dropzone-icon-box {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: #e0f2fe;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #0284c7;
        }

        .dropzone-content-label h4 {
          font-size: 0.95rem;
          color: var(--navy);
          margin: 0;
          font-weight: 700;
        }

        .dropzone-content-label p {
          font-size: 0.72rem;
          color: var(--text-muted);
          margin: 0;
        }

        .btn-browse-file {
          background: #f1f5f9;
          border: 1px solid var(--border-subtle);
          color: var(--navy);
          padding: 0.4rem 0.85rem;
          border-radius: var(--radius-sm);
          font-size: 0.75rem;
          font-weight: 600;
          margin-top: 0.5rem;
        }

        .parsing-progress-box {
          margin-top: 1.25rem;
          padding-top: 1rem;
          border-top: 1px solid var(--border-subtle);
        }

        .progress-bar-track {
          width: 100%;
          height: 6px;
          background: #e2e8f0;
          border-radius: 3px;
          overflow: hidden;
        }

        .progress-bar-fill {
          height: 100%;
          background: #0284c7;
          transition: width 0.3s ease;
        }

        .progress-status-text {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.4rem;
          font-size: 0.72rem;
          color: #0284c7;
          margin-top: 0.5rem;
          font-weight: 600;
        }

        .uploaded-file-chip {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          background: #ecfdf5;
          border: 1px solid #a7f3d0;
          border-radius: var(--radius-sm);
          padding: 0.75rem;
          margin-top: 1.25rem;
          text-align: left;
        }

        .file-chip-icon {
          color: #059669;
          flex-shrink: 0;
        }

        .file-chip-info {
          flex: 1;
          overflow: hidden;
        }

        .file-chip-name {
          font-size: 0.82rem;
          font-weight: 700;
          color: var(--navy);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .file-chip-meta {
          font-size: 0.7rem;
          color: var(--text-muted);
        }

        .file-chip-status {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          font-size: 0.7rem;
          color: #047857;
          font-weight: 700;
        }

        .guidelines-card {
          padding: 1.25rem;
          background: #ffffff;
          border: 1px solid var(--border-card);
          box-shadow: var(--shadow-sm);
        }

        .guide-title {
          font-size: 0.85rem;
          color: var(--navy);
          display: flex;
          align-items: center;
          gap: 0.4rem;
          margin-bottom: 0.75rem;
          font-weight: 700;
        }

        .guide-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
          font-size: 0.75rem;
          color: var(--text-secondary);
        }

        .guide-list li strong {
          color: var(--navy);
        }

        /* Metadata Column */
        .metadata-card {
          padding: 1.75rem;
          border-radius: var(--radius-md);
          background: #ffffff;
          border: 1px solid var(--border-card);
          box-shadow: var(--shadow-sm);
        }

        .meta-card-title {
          font-size: 1.15rem;
          color: var(--navy);
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1.5rem;
          padding-bottom: 0.75rem;
          border-bottom: 1px solid var(--border-subtle);
          font-weight: 700;
        }

        .pill-badge {
          font-size: 0.72rem;
          padding: 0.2rem 0.6rem;
          border-radius: var(--radius-full);
          background: #eff6ff;
          color: #0369a1;
          border: 1px solid #bfdbfe;
          font-weight: 600;
        }

        .meta-form-body {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .form-grid-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
        }

        .form-group label {
          font-size: 0.8rem;
          font-weight: 600;
          color: var(--navy);
        }

        .form-input, .form-textarea {
          background: #f8fafc;
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-sm);
          color: var(--text-primary);
          padding: 0.6rem 0.8rem;
          font-size: 0.88rem;
          width: 100%;
        }

        .form-input:focus, .form-textarea:focus {
          outline: none;
          border-color: var(--ice);
          background: #ffffff;
        }

        .font-mono {
          font-family: var(--font-mono);
          font-size: 0.8rem;
        }

        .tag-input-row {
          display: flex;
          gap: 0.5rem;
        }

        .tags-container {
          display: flex;
          flex-wrap: wrap;
          gap: 0.4rem;
          margin-top: 0.4rem;
        }

        .tag-pill {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          background: #f1f5f9;
          border: 1px solid #e2e8f0;
          padding: 0.2rem 0.55rem;
          border-radius: var(--radius-full);
          font-size: 0.72rem;
          color: var(--text-secondary);
        }

        .param-pill {
          background: #f5f3ff;
          border-color: #ddd6fe;
          color: #6d28d9;
        }

        .tag-pill button {
          background: none;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
          font-weight: 700;
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
          background: #eff6ff;
          color: #0284c7;
          border: 1px solid #bfdbfe;
          padding: 2px 7px;
          border-radius: 4px;
          font-size: 0.72rem;
          cursor: pointer;
          font-weight: 600;
        }

        .meta-actions-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 1rem;
          padding-top: 1.5rem;
          border-top: 1px solid var(--border-subtle);
          flex-wrap: wrap;
          gap: 1rem;
        }

        .meta-actions-right {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          flex-wrap: wrap;
        }

        @media (max-width: 1200px) {
          .pillar-nav-bar {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        @media (max-width: 900px) {
          .upload-grid-container {
            grid-template-columns: 1fr;
          }
          .pillar-nav-bar {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 600px) {
          .upload-studio-page {
            padding: 1.5rem 0 3.5rem;
          }
          .pillar-nav-bar {
            grid-template-columns: repeat(2, 1fr);
            gap: 0.5rem;
          }
          .pillar-nav-btn {
            padding: 0.65rem 0.75rem;
            min-height: 48px;
          }
          .form-grid-2 {
            grid-template-columns: 1fr;
          }
          .meta-actions-bar {
            flex-direction: column;
            align-items: stretch;
            gap: 0.75rem;
          }
          .meta-actions-right {
            flex-direction: column;
            width: 100%;
          }
          .meta-actions-right button {
            width: 100%;
            justify-content: center;
            min-height: 40px;
          }
          .drop-zone-card {
            padding: 1.5rem 1rem;
          }
        }
      `}</style>
    </div>
  );
}
