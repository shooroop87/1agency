// static/js/favorites.js

const Favorites = {
  KEY: 'oa_favorites',
  
  getAll() {
    try {
      return JSON.parse(localStorage.getItem(this.KEY)) || [];
    } catch {
      return [];
    }
  },
  
  add(propertyId) {
    const ids = this.getAll();
    if (!ids.includes(propertyId)) {
      ids.push(propertyId);
      localStorage.setItem(this.KEY, JSON.stringify(ids));
      this.updateUI();
    }
  },
  
  remove(propertyId) {
    const ids = this.getAll().filter(id => id !== propertyId);
    localStorage.setItem(this.KEY, JSON.stringify(ids));
    this.updateUI();
  },
  
  toggle(propertyId) {
    if (this.has(propertyId)) {
      this.remove(propertyId);
      return false;
    } else {
      this.add(propertyId);
      return true;
    }
  },
  
  has(propertyId) {
    return this.getAll().includes(propertyId);
  },
  
  count() {
    return this.getAll().length;
  },
  
  updateUI() {
    // Обновляем счётчик
    document.querySelectorAll('.favorites-count').forEach(el => {
      const count = this.count();
      el.textContent = count;
      el.style.display = count > 0 ? 'flex' : 'none';
    });
    
    // Обновляем состояние кнопок
    document.querySelectorAll('.favorites-btn[data-property-id]').forEach(btn => {
      const id = parseInt(btn.dataset.propertyId);
      btn.classList.toggle('is-active', this.has(id));
    });
  },
  
  init() {
    this.updateUI();
    
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('.favorites-btn[data-property-id]');
      if (btn) {
        e.preventDefault();
        e.stopPropagation();
        const id = parseInt(btn.dataset.propertyId);
        const added = this.toggle(id);
        btn.classList.toggle('is-active', added);
      }
    });
  }
};

document.addEventListener('DOMContentLoaded', () => Favorites.init());