// backend/static/js/properties.js
(function() {
  'use strict';

  const API_BASE = '/api/properties/';
  const FILTERS_API = '/api/filters/';
  
  let currentFilters = {
    type: [],
    area: [],
    rooms: [],
    price: [],
    status: []
  };
  let currentPage = 1;

  // Init
  document.addEventListener('DOMContentLoaded', function() {
    if (!document.querySelector('.projects-grid')) return;
    
    loadProperties();
    initFilters();
    initModal();
  });

  // Загрузка объектов
  async function loadProperties(append = false) {
    const params = new URLSearchParams();
    
    Object.entries(currentFilters).forEach(([key, values]) => {
      values.forEach(v => params.append(key, v));
    });
    params.append('page', currentPage);
    
    try {
      const res = await fetch(`${API_BASE}?${params}`);
      const data = await res.json();
      
      renderProperties(data.properties, append);
      renderPagination(data);
    } catch (err) {
      console.error('Error loading properties:', err);
    }
  }

  // Рендер карточек
  function renderProperties(properties, append = false) {
    const grid = document.querySelector('.projects-grid');
    if (!grid) return;
    
    if (!append) {
      grid.innerHTML = '';
    }
    
    if (properties.length === 0) {
      grid.innerHTML = `
        <div class="no-results">
          <p>No properties found matching your criteria</p>
        </div>
      `;
      return;
    }
    
    properties.forEach((prop, idx) => {
      const isLarge = idx % 4 === 0 || idx % 4 === 3;
      const alignEnd = idx % 4 === 1;
      
      const card = document.createElement('a');
      card.href = '#';
      card.className = `project-card project-card--${isLarge ? 'lg' : 'sm'}${alignEnd ? ' project-card--align-end' : ''}`;
      card.dataset.id = prop.id;
      
      card.innerHTML = `
        <div class="pc-img" style="--img:url('${prop.image}')">
          <div class="pc-tags">
            <span class="tag">${prop.type || 'Property'}</span>
            ${prop.price_display ? `<span class="tag">From ${prop.price_display}</span>` : ''}
          </div>
        </div>
        <div class="pc-meta">
          <h3 class="pc-title">
            <span class="dot" aria-hidden="true"></span>
            ${prop.title}
            <i class="wdt-button__icon" aria-hidden="true"></i>
          </h3>
          <div class="pc-loc">${prop.location || ''}</div>
        </div>
      `;
      
      card.addEventListener('click', (e) => {
        e.preventDefault();
        openPropertyModal(prop.id);
      });
      
      grid.appendChild(card);
    });
  }

  // Пагинация
  function renderPagination(data) {
    let paginationEl = document.querySelector('.properties-pagination');
    
    if (!paginationEl) {
      const container = document.querySelector('.projects-grid')?.parentElement;
      if (!container) return;
      paginationEl = document.createElement('div');
      paginationEl.className = 'properties-pagination mt50';
      container.appendChild(paginationEl);
    }
    
    if (data.pages <= 1) {
      paginationEl.innerHTML = '';
      return;
    }
    
    let html = '<div class="pagination-wrapper">';
    
    if (data.has_prev) {
      html += `<button class="pagination-btn" data-page="${data.current_page - 1}">←</button>`;
    }
    
    for (let i = 1; i <= data.pages; i++) {
      if (i === data.current_page) {
        html += `<span class="pagination-btn active">${i}</span>`;
      } else if (i <= 3 || i > data.pages - 2 || Math.abs(i - data.current_page) <= 1) {
        html += `<button class="pagination-btn" data-page="${i}">${i}</button>`;
      } else if (i === 4 || i === data.pages - 2) {
        html += '<span class="pagination-dots">...</span>';
      }
    }
    
    if (data.has_next) {
      html += `<button class="pagination-btn" data-page="${data.current_page + 1}">→</button>`;
    }
    
    html += '</div>';
    paginationEl.innerHTML = html;
    
    paginationEl.querySelectorAll('button[data-page]').forEach(btn => {
      btn.addEventListener('click', () => {
        currentPage = parseInt(btn.dataset.page);
        loadProperties();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    });
  }

  // Экспорт для глобального доступа
  window.PropertiesApp = { loadProperties, currentFilters };
})();

// Модалка объекта
function initModal() {
  const modal = document.getElementById('propertyModal');
  if (!modal) return;
  
  const overlay = modal.querySelector('.property-modal__overlay');
  const closeBtn = modal.querySelector('.property-modal__close');
  
  overlay?.addEventListener('click', closeModal);
  closeBtn?.addEventListener('click', closeModal);
  
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('is-active')) {
      closeModal();
    }
  });
}

async function openPropertyModal(id) {
  const modal = document.getElementById('propertyModal');
  if (!modal) return;
  
  try {
    const res = await fetch(`/api/properties/${id}/`);
    const prop = await res.json();
    
    if (prop.error) {
      console.error(prop.error);
      return;
    }
    
    // Заполняем данные
    modal.querySelector('.pm-title').textContent = prop.title;
    modal.querySelector('.pm-type').textContent = prop.type;
    modal.querySelector('.pm-location').innerHTML = `
      ${prop.location}<br>
      ${prop.view ? `View: ${prop.view}` : ''}
    `;
    modal.querySelector('.pm-image img').src = prop.image;
    
    // Construction info
    const constructionEl = modal.querySelector('.pm-info-col--left .pm-info-item:nth-child(2) .pm-info__value');
    if (constructionEl) {
      constructionEl.innerHTML = `
        ${prop.completion ? `Completion: ${prop.completion}` : ''}
        ${prop.status_display ? `<br>Status: ${prop.status_display}` : ''}
      `;
    }
    
    // ROI
    const roiEl = modal.querySelector('.pm-info-col--left .pm-info-item:nth-child(3) .pm-info__value');
    if (roiEl) {
      roiEl.textContent = prop.roi ? `Projected ROI: ${prop.roi}%` : 'Contact for details';
    }
    
    // Total area
    const areaEl = modal.querySelector('.pm-info-col--right .pm-info-item:nth-child(1) .pm-info__value');
    if (areaEl) {
      areaEl.textContent = prop.total_area ? `${prop.total_area}` : '-';
    }
    
    // Views/Features
    const viewsEl = modal.querySelector('.pm-info-col--right .pm-info-item:nth-child(2) .pm-info__value');
    if (viewsEl) {
      viewsEl.innerHTML = prop.facilities || prop.view || '-';
    }
    
    // Units section - можно скрыть если нет данных
    const unitsSection = modal.querySelector('.pm-units')?.closest('.pm-wrapper');
    if (unitsSection) {
      unitsSection.style.display = prop.price ? 'block' : 'none';
    }
    
    // Единственный unit с ценой
    const unitsGrid = modal.querySelector('.pm-units');
    if (unitsGrid && prop.price) {
      unitsGrid.innerHTML = `
        <div class="pm-unit">
          <div class="pm-unit__type">${prop.type || 'Unit'}</div>
          <div class="pm-unit__details">
            ${prop.total_area ? `${prop.total_area} m²` : ''}
            ${prop.living_area ? `<br>${prop.living_area} m² living` : ''}
          </div>
          <div class="pm-unit__price">${prop.price_display}</div>
        </div>
      `;
    }
    
    // Показываем
    modal.classList.add('is-active');
    document.body.classList.add('modal-open');
    document.body.style.overflow = 'hidden';
    
  } catch (err) {
    console.error('Error loading property:', err);
  }
}

function closeModal() {
  const modal = document.getElementById('propertyModal');
  if (!modal) return;
  
  modal.classList.remove('is-active');
  document.body.classList.remove('modal-open');
  document.body.style.overflow = '';
}

// Экспорт
window.openPropertyModal = openPropertyModal;
window.closeModal = closeModal;