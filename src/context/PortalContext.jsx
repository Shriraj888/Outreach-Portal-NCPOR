import { createContext, useContext, useState, useEffect } from 'react';
import { 
  initialExpeditions, 
  initialPublications, 
  initialDatasets, 
  initialMediaArchives, 
  latestActivities, 
  polarStations 
} from '../data/mockData';
import { translations } from '../data/translations';

const PortalContext = createContext();

const STORAGE_KEYS = {
  EXPEDITIONS: 'ncpor_outreach_expeditions_v2',
  PUBLICATIONS: 'ncpor_outreach_publications_v2',
  DATASETS: 'ncpor_outreach_datasets_v2',
  MEDIA: 'ncpor_outreach_media_v2',
  ACTIVITIES: 'ncpor_outreach_activities_v2',
  AUTH: 'ncpor_outreach_auth_v2',
  LANG: 'ncpor_outreach_lang_v2',
  ACCESSIBILITY: 'ncpor_outreach_a11y_v2'
};

export function PortalProvider({ children }) {
  // Expeditions state
  const [expeditions, setExpeditions] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.EXPEDITIONS);
      if (saved) {
        let parsed = JSON.parse(saved);
        const isea44Official = initialExpeditions.find(e => e.id === 'isea-44');
        
        // Find if user has a 44th expedition entry (either isea-44 or with 44th in title)
        let found44Index = parsed.findIndex(e => e.id === 'isea-44' || (e.title && e.title.includes('44th Indian Scientific')));
        if (found44Index >= 0 && isea44Official) {
          // Merge rich demo data if missing tags, media, or AI content
          parsed[found44Index] = {
            ...isea44Official,
            ...parsed[found44Index],
            tags: (parsed[found44Index].tags && parsed[found44Index].tags.length > 0) ? parsed[found44Index].tags : isea44Official.tags,
            media: (parsed[found44Index].media && parsed[found44Index].media.length > 1) ? parsed[found44Index].media : isea44Official.media,
            aiGeneratedContent: parsed[found44Index].aiGeneratedContent || isea44Official.aiGeneratedContent,
            keyFindings: (parsed[found44Index].keyFindings && parsed[found44Index].keyFindings.length > 0) ? parsed[found44Index].keyFindings : isea44Official.keyFindings,
            reports: (parsed[found44Index].reports && parsed[found44Index].reports.length > 0) ? parsed[found44Index].reports : isea44Official.reports,
            publications: (parsed[found44Index].publications && parsed[found44Index].publications.length > 0) ? parsed[found44Index].publications : isea44Official.publications
          };
        } else if (isea44Official && !parsed.some(e => e.id === 'isea-44')) {
          parsed.unshift(isea44Official);
        }
        return parsed;
      }
      return initialExpeditions;
    } catch {
      return initialExpeditions;
    }
  });

  // Publications state
  const [publications, setPublications] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PUBLICATIONS);
      return saved ? JSON.parse(saved) : initialPublications;
    } catch {
      return initialPublications;
    }
  });

  // Datasets state
  const [datasets, setDatasets] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.DATASETS);
      return saved ? JSON.parse(saved) : initialDatasets;
    } catch {
      return initialDatasets;
    }
  });

  // Media archives state (photos & videos)
  const [mediaArchives, setMediaArchives] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.MEDIA);
      return saved ? JSON.parse(saved) : initialMediaArchives;
    } catch {
      return initialMediaArchives;
    }
  });

  // Institutional Activities state
  const [activities, setActivities] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ACTIVITIES);
      return saved ? JSON.parse(saved) : latestActivities;
    } catch {
      return latestActivities;
    }
  });

  // Language state (en / hi)
  const [lang, setLang] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEYS.LANG) || 'en';
    } catch {
      return 'en';
    }
  });

  // Auth state
  const [auth, setAuth] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.AUTH);
      return saved ? JSON.parse(saved) : { isAuthenticated: true, user: { name: "Dr. Arvind Shrivastava", email: "admin@ncpor.res.in", role: "admin", department: "Science Communications & Outreach Studio" } };
    } catch {
      return { isAuthenticated: true, user: { name: "Dr. Arvind Shrivastava", email: "admin@ncpor.res.in", role: "admin", department: "Science Communications & Outreach Studio" } };
    }
  });

  // Accessibility state
  const [a11y, setA11y] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ACCESSIBILITY);
      return saved ? JSON.parse(saved) : { highContrast: false, fontSize: 'normal' };
    } catch {
      return { highContrast: false, fontSize: 'normal' };
    }
  });

  // Global filters and search
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('All');
  const [selectedYear, setSelectedYear] = useState('All');

  // Sync to localStorage
  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEYS.EXPEDITIONS, JSON.stringify(expeditions)); } catch (e) { console.warn(e); }
  }, [expeditions]);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEYS.PUBLICATIONS, JSON.stringify(publications)); } catch (e) { console.warn(e); }
  }, [publications]);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEYS.DATASETS, JSON.stringify(datasets)); } catch (e) { console.warn(e); }
  }, [datasets]);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEYS.MEDIA, JSON.stringify(mediaArchives)); } catch (e) { console.warn(e); }
  }, [mediaArchives]);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(activities)); } catch (e) { console.warn(e); }
  }, [activities]);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEYS.AUTH, JSON.stringify(auth)); } catch (e) { console.warn(e); }
  }, [auth]);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEYS.LANG, lang); } catch (e) { console.warn(e); }
  }, [lang]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ACCESSIBILITY, JSON.stringify(a11y));
      if (a11y.highContrast) {
        document.documentElement.classList.add('high-contrast');
      } else {
        document.documentElement.classList.remove('high-contrast');
      }
      document.documentElement.setAttribute('data-font-size', a11y.fontSize);
    } catch (e) {
      console.warn("A11y sync error", e);
    }
  }, [a11y]);

  const t = translations[lang] || translations.en;

  // --- Expedition Actions ---
  const addExpedition = (newExpedition) => {
    const expeditionWithMeta = {
      ...newExpedition,
      id: newExpedition.id || `exp-${Date.now()}`,
      status: newExpedition.status || 'draft',
      createdAt: new Date().toISOString()
    };
    setExpeditions(prev => [expeditionWithMeta, ...prev]);
    return expeditionWithMeta;
  };

  const updateExpedition = (id, updatedFields) => {
    setExpeditions(prev => prev.map(exp => {
      if (exp.id === id) {
        return { ...exp, ...updatedFields, updatedAt: new Date().toISOString() };
      }
      return exp;
    }));
  };

  const deleteExpedition = (id) => {
    setExpeditions(prev => prev.filter(exp => exp.id !== id));
  };

  // --- Dataset Actions ---
  const addDataset = (newDataset) => {
    const datasetWithMeta = {
      ...newDataset,
      id: newDataset.id || `ds-${Date.now()}`,
      status: newDataset.status || 'published',
      downloadsCount: newDataset.downloadsCount || 0,
      createdAt: new Date().toISOString()
    };
    setDatasets(prev => [datasetWithMeta, ...prev]);
    return datasetWithMeta;
  };

  const updateDataset = (id, updatedFields) => {
    setDatasets(prev => prev.map(ds => {
      if (ds.id === id) {
        return { ...ds, ...updatedFields, updatedAt: new Date().toISOString() };
      }
      return ds;
    }));
  };

  const deleteDataset = (id) => {
    setDatasets(prev => prev.filter(ds => ds.id !== id));
  };

  // --- Publication Actions ---
  const addPublication = (pub) => {
    const newPub = {
      ...pub,
      id: pub.id || `pub-${Date.now()}`,
      citations: pub.citations || 0,
      status: pub.status || 'published',
      createdAt: new Date().toISOString()
    };
    setPublications(prev => [newPub, ...prev]);
    return newPub;
  };

  const updatePublication = (id, updatedFields) => {
    setPublications(prev => prev.map(pub => {
      if (pub.id === id) {
        return { ...pub, ...updatedFields, updatedAt: new Date().toISOString() };
      }
      return pub;
    }));
  };

  const deletePublication = (id) => {
    setPublications(prev => prev.filter(pub => pub.id !== id));
  };

  // --- Media Archives Actions (Photos & Videos) ---
  const addMediaArchive = (item) => {
    const newItem = {
      ...item,
      id: item.id || `media-${Date.now()}`,
      status: item.status || 'published',
      createdAt: new Date().toISOString()
    };
    setMediaArchives(prev => [newItem, ...prev]);
    return newItem;
  };

  const updateMediaArchive = (id, updatedFields) => {
    setMediaArchives(prev => prev.map(item => {
      if (item.id === id) {
        return { ...item, ...updatedFields, updatedAt: new Date().toISOString() };
      }
      return item;
    }));
  };

  const deleteMediaArchive = (id) => {
    setMediaArchives(prev => prev.filter(item => item.id !== id));
  };

  // --- Institutional Activities Actions ---
  const addActivity = (act) => {
    const newAct = {
      ...act,
      id: act.id || `act-${Date.now()}`,
      status: act.status || 'published',
      createdAt: new Date().toISOString()
    };
    setActivities(prev => [newAct, ...prev]);
    return newAct;
  };

  const updateActivity = (id, updatedFields) => {
    setActivities(prev => prev.map(act => {
      if (act.id === id) {
        return { ...act, ...updatedFields, updatedAt: new Date().toISOString() };
      }
      return act;
    }));
  };

  const deleteActivity = (id) => {
    setActivities(prev => prev.filter(act => act.id !== id));
  };

  // --- Save AI Generated Outreach Package ---
  const saveGeneratedContent = (assetId, generatedContent, shouldPublish = false, assetType = 'expedition') => {
    if (assetType === 'dataset') {
      updateDataset(assetId, {
        aiGeneratedContent: { ...generatedContent, isApproved: shouldPublish },
        status: shouldPublish ? 'published' : 'draft'
      });
    } else if (assetType === 'publication') {
      updatePublication(assetId, {
        aiGeneratedContent: { ...generatedContent, isApproved: shouldPublish },
        status: shouldPublish ? 'published' : 'draft'
      });
    } else if (assetType === 'activity') {
      updateActivity(assetId, {
        aiGeneratedContent: { ...generatedContent, isApproved: shouldPublish },
        status: shouldPublish ? 'published' : 'draft'
      });
    } else {
      // Default: expedition
      setExpeditions(prev => prev.map(exp => {
        if (exp.id === assetId) {
          return {
            ...exp,
            aiGeneratedContent: {
              ...generatedContent,
              isApproved: shouldPublish
            },
            summary: generatedContent.summary || exp.summary,
            status: shouldPublish ? 'published' : exp.status,
            updatedAt: new Date().toISOString()
          };
        }
        return exp;
      }));
    }
  };

  const login = (email) => {
    const user = {
      name: email.split('@')[0] || "Dr. Arvind Shrivastava",
      email: email,
      role: "admin",
      department: "Outreach & Polar Science Communications Division",
      institute: "National Centre for Polar and Ocean Research, MoES"
    };
    setAuth({ isAuthenticated: true, user });
    return true;
  };

  const logout = () => {
    setAuth({ isAuthenticated: false, user: null });
  };

  const toggleLang = () => {
    setLang(prev => (prev === 'en' ? 'hi' : 'en'));
  };

  const toggleHighContrast = () => {
    setA11y(prev => ({ ...prev, highContrast: !prev.highContrast }));
  };

  const setFontSize = (size) => {
    setA11y(prev => ({ ...prev, fontSize: size }));
  };

  const resetToDefaultData = () => {
    setExpeditions(initialExpeditions);
    setPublications(initialPublications);
    setDatasets(initialDatasets);
    setMediaArchives(initialMediaArchives);
    setActivities(latestActivities);
    localStorage.removeItem(STORAGE_KEYS.EXPEDITIONS);
    localStorage.removeItem(STORAGE_KEYS.PUBLICATIONS);
    localStorage.removeItem(STORAGE_KEYS.DATASETS);
    localStorage.removeItem(STORAGE_KEYS.MEDIA);
    localStorage.removeItem(STORAGE_KEYS.ACTIVITIES);
  };

  return (
    <PortalContext.Provider
      value={{
        expeditions,
        publications,
        datasets,
        mediaArchives,
        activities,
        stations: polarStations,
        lang,
        t,
        auth,
        a11y,
        searchQuery,
        selectedRegion,
        selectedYear,
        setSearchQuery,
        setSelectedRegion,
        setSelectedYear,
        addExpedition,
        updateExpedition,
        deleteExpedition,
        addDataset,
        updateDataset,
        deleteDataset,
        addPublication,
        updatePublication,
        deletePublication,
        addMediaArchive,
        updateMediaArchive,
        deleteMediaArchive,
        addActivity,
        updateActivity,
        deleteActivity,
        saveGeneratedContent,
        login,
        logout,
        toggleLang,
        toggleHighContrast,
        setFontSize,
        resetToDefaultData
      }}
    >
      {children}
    </PortalContext.Provider>
  );
}

export function usePortal() {
  const context = useContext(PortalContext);
  if (!context) {
    throw new Error("usePortal must be used within a PortalProvider");
  }
  return context;
}
