/**
 * Centralized Route & History Synchronization Utility
 * Translates between internal route identifiers and clean hash URLs (#/path).
 * Enables native browser back/forward buttons, deep linking, and bookmarking
 * without closing or exiting the web application.
 */

export function routeToHash(route, params = {}) {
  if (!route || route === 'home') return '#/';
  if (route === 'expeditions') return '#/expeditions';
  if (route === 'map') return '#/map';
  if (route === 'publications') return '#/publications';
  if (route === 'admin-login') return '#/admin/login';
  if (route === 'admin-dashboard') return '#/admin/dashboard';
  if (route === 'admin-upload') return '#/admin/upload';
  if (route === 'admin-new-expedition') return '#/admin/new-expedition';

  // Expedition Detail
  if (route === 'expedition-detail' || route.startsWith('expedition-')) {
    const id = params.expeditionId || (route.startsWith('expedition-') && route !== 'expedition-detail' ? route.replace('expedition-', '') : null);
    return id ? `#/expedition/${id}` : '#/expeditions';
  }

  // Upload category
  if (route.startsWith('admin-upload-')) {
    const category = route.replace('admin-upload-', '');
    return `#/admin/upload/${category}`;
  }

  // Admin Edit
  if (route.startsWith('admin-edit-')) {
    const id = route.replace('admin-edit-', '');
    return `#/admin/edit/${id}`;
  }

  // Verification Studio
  if (route.startsWith('admin-generate-') || route.startsWith('admin-verification-')) {
    const id = route.replace('admin-generate-', '').replace('admin-verification-', '');
    return `#/admin/verification/${id}`;
  }

  // Selective AI Studio
  if (route.startsWith('admin-selective-ai-')) {
    const id = route.replace('admin-selective-ai-', '');
    return `#/admin/selective-ai/${id}`;
  }

  if (route === 'admin-selective-ai') return '#/admin/selective-ai';

  // Fallback for custom string
  return `#/${route.replace(/^#?\/?/, '')}`;
}

export function hashToRoute(hash) {
  const cleanHash = (hash || '').replace(/^#\/?/, '').trim();
  if (!cleanHash || cleanHash === 'home') {
    return { route: 'home', params: {} };
  }

  const parts = cleanHash.split('/').filter(Boolean);
  const root = parts[0];

  if (root === 'expeditions') {
    if (parts[1]) {
      return { route: 'expedition-detail', params: { expeditionId: parts[1] } };
    }
    return { route: 'expeditions', params: {} };
  }

  if (root === 'expedition' && parts[1]) {
    return { route: 'expedition-detail', params: { expeditionId: parts[1] } };
  }

  if (root === 'map') return { route: 'map', params: {} };
  if (root === 'publications') return { route: 'publications', params: {} };

  if (root === 'admin') {
    const sub = parts[1];
    if (!sub || sub === 'dashboard') return { route: 'admin-dashboard', params: {} };
    if (sub === 'login') return { route: 'admin-login', params: {} };
    if (sub === 'new-expedition') return { route: 'admin-new-expedition', params: {} };
    if (sub === 'upload') {
      const cat = parts[2];
      return { route: cat ? `admin-upload-${cat}` : 'admin-upload', params: { category: cat || 'reports' } };
    }
    if (sub === 'edit' && parts[2]) {
      return { route: `admin-edit-${parts[2]}`, params: { expeditionId: parts[2] } };
    }
    if ((sub === 'verification' || sub === 'generate') && parts[2]) {
      return { route: `admin-generate-${parts[2]}`, params: { expeditionId: parts[2] } };
    }
    if (sub === 'selective-ai') {
      const id = parts[2];
      return { route: id ? `admin-selective-ai-${id}` : 'admin-selective-ai', params: { assetId: id } };
    }
  }

  // Handle flat legacy/direct hash strings e.g. #admin-dashboard, #admin-generate-isea-43, #expedition-isea-43
  if (cleanHash.startsWith('admin-generate-') || cleanHash.startsWith('admin-verification-')) {
    const id = cleanHash.replace('admin-generate-', '').replace('admin-verification-', '');
    return { route: `admin-generate-${id}`, params: { expeditionId: id } };
  }
  if (cleanHash.startsWith('admin-edit-')) {
    const id = cleanHash.replace('admin-edit-', '');
    return { route: `admin-edit-${id}`, params: { expeditionId: id } };
  }
  if (cleanHash.startsWith('admin-selective-ai-')) {
    const id = cleanHash.replace('admin-selective-ai-', '');
    return { route: `admin-selective-ai-${id}`, params: { assetId: id } };
  }
  if (cleanHash.startsWith('expedition-') && cleanHash !== 'expeditions') {
    const id = cleanHash.replace('expedition-', '').replace('detail-', '');
    return { route: 'expedition-detail', params: { expeditionId: id } };
  }

  const known = ['home', 'expeditions', 'map', 'publications', 'admin-login', 'admin-dashboard', 'admin-upload', 'admin-selective-ai'];
  if (known.includes(cleanHash)) {
    return { route: cleanHash, params: {} };
  }

  return { route: 'home', params: {} };
}
