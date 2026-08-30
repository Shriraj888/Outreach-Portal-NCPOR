import React, { createContext, useContext, useState, useEffect } from 'react';
import { initialExpeditions, initialPublications, latestActivities, polarStations, educationalModules } from '../data/mockData';
import { translations } from '../data/translations';

const PortalContext = createContext();

const STORAGE_KEYS = {
  EXPEDITIONS: 'ncpor_outreach_expeditions_v1',
  PUBLICATIONS: 'ncpor_outreach_publications_v1',
  AUTH: 'ncpor_outreach_auth_v1',
  LANG: 'ncpor_outreach_lang_v1',
  ACCESSIBILITY: 'ncpor_outreach_a11y_v1'
};

export function PortalProvider({ children }) {
  // Expeditions state with localStorage persistence
  const [expeditions, setExpeditions] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.EXPEDITIONS);
      return saved ? JSON.parse(saved) : initialExpeditions;
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
      return saved ? JSON.parse(saved) : { isAuthenticated: false, user: null };
    } catch {
      return { isAuthenticated: false, user: null };
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
    try {
      localStorage.setItem(STORAGE_KEYS.EXPEDITIONS, JSON.stringify(expeditions));
    } catch (e) {
      console.warn("Storage quota or error saving expeditions", e);
    }
  }, [expeditions]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PUBLICATIONS, JSON.stringify(publications));
    } catch (e) {
      console.warn("Storage error", e);
    }
  }, [publications]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.AUTH, JSON.stringify(auth));
    } catch (e) {
      console.warn("Auth sync error", e);
    }
  }, [auth]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.LANG, lang);
    } catch (e) {
      console.warn("Lang sync error", e);
    }
  }, [lang]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ACCESSIBILITY, JSON.stringify(a11y));
      // Apply root attributes
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

  // Translation helper
  const t = translations[lang] || translations.en;

  // Actions
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

  const saveGeneratedContent = (expeditionId, generatedContent, shouldPublish = false) => {
    setExpeditions(prev => prev.map(exp => {
      if (exp.id === expeditionId) {
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
  };

  const addPublication = (pub) => {
    const newPub = {
      ...pub,
      id: pub.id || `pub-${Date.now()}`,
      citations: pub.citations || 0
    };
    setPublications(prev => [newPub, ...prev]);
    return newPub;
  };

  const login = (email, password) => {
    // Demo authentication for hackathon evaluation
    const user = {
      name: email.split('@')[0] || "NCPOR Admin",
      email: email,
      role: "admin",
      department: "Outreach & Polar Science Division",
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
    localStorage.removeItem(STORAGE_KEYS.EXPEDITIONS);
    localStorage.removeItem(STORAGE_KEYS.PUBLICATIONS);
  };

  return (
    <PortalContext.Provider
      value={{
        expeditions,
        publications,
        activities: latestActivities,
        stations: polarStations,
        educationalModules,
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
        saveGeneratedContent,
        addPublication,
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
