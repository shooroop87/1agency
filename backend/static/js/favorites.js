// backend/static/js/favorites.js
(function() {
  'use strict';
  
  const STORAGE_KEY = 'favorites';
  const MAX_FAVORITES = 2;
  
  function getAll() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      console.log('[Favorites] getAll raw:', data);
      if (!data || data === 'undefined' || data === 'null') return [];
      const arr = JSON.parse(data);
      const result = Array.isArray(arr) ? arr.map(String) : [];
      console.log('[Favorites] getAll parsed:', result);
      return result;
    } catch(e) {
      console.error('[Favorites] getAll error:', e);
      return [];
    }
  }
  
  function save(arr) {
    const toSave = arr.map(String);
    console.log('[Favorites] saving:', toSave);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  }
  
  function has(id) {
    const strId = String(id);
    const result = getAll().includes(strId);
    console.log('[Favorites] has', strId, '=', result);
    return result;
  }
  
  function add(id) {
    console.log('[Favorites] add called with:', id, typeof id);
    const favs = getAll();
    const strId = String(id);
    
    if (favs.includes(strId)) {
      console.log('[Favorites] already exists');
      return true;
    }
    
    if (favs.length >= MAX_FAVORITES) {
      alert('You can compare maximum 2 properties. Remove one first.');
      return false;
    }
    
    favs.push(strId);
    save(favs);
    updateUI();
    console.log('[Favorites] added successfully');
    return true;
  }
  
  function remove(id) {
    console.log('[Favorites] remove called with:', id);
    let favs = getAll();
    const strId = String(id);
    favs = favs.filter(f => f !== strId);
    save(favs);
    updateUI();
  }
  
  function toggle(id) {
    console.log('[Favorites] toggle called with:', id, typeof id);
    const strId = String(id);
    if (has(strId)) {
      remove(strId);
      return false;
    } else {
      return add(strId);
    }
  }
  
  function clear() {
    console.log('[Favorites] clear called');
    localStorage.setItem(STORAGE_KEY, '[]');
    updateUI();
  }
  
  function updateUI() {
    const favs = getAll();
    const count = favs.length;
    
    document.querySelectorAll('.favorites-count').forEach(el => {
      el.textContent = count;
      el.style.display = count > 0 ? 'flex' : 'none';
    });
    
    document.querySelectorAll('.favorites-btn[data-property-id]').forEach(btn => {
      const id = btn.getAttribute('data-property-id');
      const isActive = favs.includes(String(id));
      btn.classList.toggle('is-active', isActive);
    });
  }
  
  window.Favorites = { getAll, has, add, remove, toggle, clear, updateUI, MAX: MAX_FAVORITES };
  window.getFavorites = getAll;
  window.removeFavorite = remove;
  window.updateFavoritesCount = updateUI;
  
  document.addEventListener('DOMContentLoaded', function() {
    console.log('[Favorites] init, current:', getAll());
    updateUI();
    
    document.addEventListener('click', function(e) {
      const btn = e.target.closest('.favorites-btn[data-property-id]');
      if (btn) {
        e.preventDefault();
        e.stopPropagation();
        const id = btn.getAttribute('data-property-id');
        console.log('[Favorites] button clicked, id:', id);
        if (id && id !== 'undefined' && id !== 'null') {
          toggle(id);
        } else {
          console.warn('[Favorites] invalid id:', id);
        }
      }
    });
  });
})();