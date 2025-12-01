// backend/static/js/properties.js
(function() {
  'use strict';

  const API_BASE = '/api/properties/';
  
  let currentFilters = {
    type: [],
    area: [],
    rooms: [],
    price: [],
    status: []
  };
  let currentPage = 1;
  let isLoading = false;

  // ========== INIT ==========
  document.addEventListener('DOMContentLoaded', function() {
    const grid = document.getElementById('propertiesGrid');
    if (!grid) return;
    
    initFilters();
    initModal();
    initCardClicks();
    
    // Кнопка поиска
    document.getElementById('applyFilters')?.addEventListener('click', function(e) {
      e.preventDefault();
      currentPage = 1;
      loadProperties();
    });
  });

  // ========== ЗАГРУЗКА ОБЪЕКТОВ ==========
  async function loadProperties(append = false) {
    if (isLoading) return;
    isLoading = true;
    
    const grid = document.getElementById('propertiesGrid');
    grid?.classList.add('is-loading');
    
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
      updateCount(data.total);
      
    } catch (err) {
      console.error('Error loading properties:', err);
    } finally {
      isLoading = false;
      grid?.classList.remove('is-loading');
    }
  }

  // ========== РЕНДЕР КАРТОЧЕК ==========
  function renderProperties(properties, append = false) {
    const grid = document.getElementById('propertiesGrid');
    if (!grid) return;
    
    if (!append) {
      grid.innerHTML = '';
    }
    
    if (properties.length === 0) {
      grid.innerHTML = `
        <div class="no-results">
          <p>No properties found matching your criteria</p>
          <button class="reset-filters-btn" onclick="window.PropertiesApp.resetFilters()">Reset filters</button>
        </div>
      `;
      return;
    }
    
    properties.forEach((prop, idx) => {
      const pattern = idx % 4;
      const isLarge = pattern === 0 || pattern === 3;
      const alignEnd = pattern === 1;
      
      const card = document.createElement('a');
      card.href = '#';
      card.className = `project-card project-card--${isLarge ? 'lg' : 'sm'}${alignEnd ? ' project-card--align-end' : ''}`;
      card.dataset.id = prop.id;
      
      const priceDisplay = prop.price_display ? `<span class="tag">From ${prop.price_display}</span>` : '';
      
      card.innerHTML = `
        <div class="pc-img" style="--img:url('${prop.image}')">
          <div class="pc-tags">
            <span class="tag">${prop.type || 'Property'}</span>
            ${priceDisplay}
          </div>
        </div>
        <div class="pc-meta">
          <h3 class="pc-title">
            <span class="dot" aria-hidden="true"></span>
            ${prop.title}
            <i class="wdt-button__icon" aria-hidden="true"></i>
          </h3>
          <div class="pc-loc">${prop.location || 'Bali'}</div>
        </div>
      `;
      
      card.addEventListener('click', function(e) {
        e.preventDefault();
        openPropertyModal(prop.id);
      });
      
      grid.appendChild(card);
    });
  }

  // ========== ПАГИНАЦИЯ ==========
  function renderPagination(data) {
    const paginationEl = document.getElementById('propertiesPagination');
    if (!paginationEl) return;
    
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
      } else if (i <= 2 || i > data.pages - 1 || Math.abs(i - data.current_page) <= 1) {
        html += `<button class="pagination-btn" data-page="${i}">${i}</button>`;
      } else if (i === 3 && data.current_page > 4) {
        html += '<span class="pagination-dots">...</span>';
      } else if (i === data.pages - 1 && data.current_page < data.pages - 3) {
        html += '<span class="pagination-dots">...</span>';
      }
    }
    
    if (data.has_next) {
      html += `<button class="pagination-btn" data-page="${data.current_page + 1}">→</button>`;
    }
    
    html += '</div>';
    paginationEl.innerHTML = html;
    
    paginationEl.querySelectorAll('button[data-page]').forEach(btn => {
      btn.addEventListener('click', function() {
        currentPage = parseInt(this.dataset.page);
        loadProperties();
        document.querySelector('.filters-section')?.scrollIntoView({ behavior: 'smooth' });
      });
    });
  }

  function updateCount(total) {
    const countEl = document.querySelector('.projects-count');
    if (countEl) {
      countEl.textContent = `${total} properties`;
    }
  }

  // ========== ФИЛЬТРЫ ==========
  function initFilters() {
    initDesktopFilters();
    initMobileFilters();
  }

  function initDesktopFilters() {
    const columns = document.querySelectorAll('.filters-desktop .filter-column[data-filter]');
    
    columns.forEach(column => {
      const filterType = column.dataset.filter;
      const checkboxes = column.querySelectorAll('input[type="checkbox"]');
      
      checkboxes.forEach(cb => {
        cb.addEventListener('change', function() {
          const value = this.value;
          
          if (value === 'all') {
            if (this.checked) {
              // Снять все остальные
              column.querySelectorAll('input:not([value="all"])').forEach(c => c.checked = false);
              currentFilters[filterType] = [];
            }
          } else {
            // Снять "All"
            const allCb = column.querySelector('input[value="all"]');
            if (allCb) allCb.checked = false;
            
            if (this.checked) {
              if (!currentFilters[filterType].includes(value)) {
                currentFilters[filterType].push(value);
              }
            } else {
              currentFilters[filterType] = currentFilters[filterType].filter(v => v !== value);
            }
            
            // Если ничего не выбрано - включить "All"
            if (currentFilters[filterType].length === 0 && allCb) {
              allCb.checked = true;
            }
          }
        });
      });
    });
  }

  function initMobileFilters() {
    const filterItems = document.querySelectorAll('.filters-mobile .mobile-filter-item');
    
    filterItems.forEach(item => {
      const select = item.querySelector('.mobile-filter-select');
      if (!select) return;
      
      select.addEventListener('click', function() {
        openMobileFilterModal(item);
      });
    });
  }

  function openMobileFilterModal(filterItem) {
    const filterType = filterItem.dataset.filter;
    const filterName = filterItem.querySelector('h6')?.textContent || filterType;
    
    // Получить опции из desktop версии
    const desktopColumn = document.querySelector(`.filters-desktop .filter-column[data-filter="${filterType}"]`);
    const options = [];
    
    if (desktopColumn) {
      desktopColumn.querySelectorAll('.filter-checkbox').forEach(label => {
        const input = label.querySelector('input');
        const text = label.querySelector('.label-text')?.textContent;
        if (input && text) {
          options.push({
            value: input.value,
            label: text,
            checked: currentFilters[filterType].includes(input.value)
          });
        }
      });
    }
    
    // Модалка
    let modal = document.getElementById('filterModal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'filterModal';
      modal.className = 'filter-modal';
      document.body.appendChild(modal);
    }
    
    modal.innerHTML = `
      <div class="filter-modal__overlay"></div>
      <div class="filter-modal__content">
        <div class="filter-modal__header">
          <h3>${filterName}</h3>
          <button class="filter-modal__close">×</button>
        </div>
        <div class="filter-modal__options">
          ${options.map(opt => `
            <label class="filter-checkbox">
              <input type="checkbox" value="${opt.value}" ${opt.checked ? 'checked' : ''}>
              <span class="checkmark"></span>
              <span class="label-text">${opt.label}</span>
            </label>
          `).join('')}
        </div>
        <button class="filter-modal__apply wdt-button button-cta">Apply</button>
      </div>
    `;
    
    modal.classList.add('is-active');
    document.body.style.overflow = 'hidden';
    
    // Events
    modal.querySelector('.filter-modal__close').addEventListener('click', closeMobileFilter);
    modal.querySelector('.filter-modal__overlay').addEventListener('click', closeMobileFilter);
    
    modal.querySelector('.filter-modal__apply').addEventListener('click', function() {
      const checked = modal.querySelectorAll('input:checked');
      const values = Array.from(checked).map(c => c.value).filter(v => v !== 'all');
      currentFilters[filterType] = values;
      
      // Update select text
      const selectSpan = filterItem.querySelector('.mobile-filter-select span');
      if (selectSpan) {
        selectSpan.textContent = values.length 
          ? `${values.length} selected`
          : `All ${filterName.toLowerCase()}`;
      }
      
      closeMobileFilter();
      currentPage = 1;
      loadProperties();
    });
  }

  function closeMobileFilter() {
    const modal = document.getElementById('filterModal');
    if (modal) {
      modal.classList.remove('is-active');
      document.body.style.overflow = '';
    }
  }

  function resetFilters() {
    currentFilters = { type: [], area: [], rooms: [], price: [], status: [] };
    currentPage = 1;
    
    // Reset checkboxes
    document.querySelectorAll('.filter-checkbox input').forEach(cb => {
      cb.checked = cb.value === 'all';
    });
    
    // Reset mobile selects
    document.querySelectorAll('.mobile-filter-select span').forEach(span => {
      const item = span.closest('.mobile-filter-item');
      const name = item?.querySelector('h6')?.textContent || '';
      span.textContent = `All ${name.toLowerCase()}`;
    });
    
    loadProperties();
  }

// ========== МОДАЛКА ==========
  function initModal() {
    const modal = document.getElementById('propertyModal');
    if (!modal) return;
    
    modal.querySelector('.property-modal__overlay')?.addEventListener('click', closeModal);
    modal.querySelector('.property-modal__close')?.addEventListener('click', closeModal);
    
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && modal.classList.contains('is-active')) {
        closeModal();
      }
    });
  }

  function initCardClicks() {
    // Для SSR карточек
    document.querySelectorAll('.project-card[data-id]').forEach(card => {
      card.addEventListener('click', function(e) {
        e.preventDefault();
        const id = this.dataset.id;
        if (id) openPropertyModal(id);
      });
    });
  }

  async function openPropertyModal(id) {
    const modal = document.getElementById('propertyModal');
    if (!modal) return;
    
    try {
      const res = await fetch(`${API_BASE}${id}/`);
      const prop = await res.json();
      
      if (prop.error) {
        console.error(prop.error);
        return;
      }
      
      // Заполняем
      modal.querySelector('.pm-title').textContent = prop.title || '';
      modal.querySelector('.pm-type').textContent = prop.type || '';
      modal.querySelector('.pm-developer').textContent = prop.developer ? `by ${prop.developer}` : '';
      modal.querySelector('.pm-image img').src = prop.image || '';
      
      // Location
      modal.querySelector('.pm-location').innerHTML = prop.location || 'Bali';
      
      // Construction
      const construction = [];
      if (prop.completion) construction.push(`Completion: ${prop.completion}`);
      if (prop.status_display) construction.push(`Status: ${prop.status_display}`);
      modal.querySelector('.pm-construction').innerHTML = construction.join('<br>') || '-';
      
      // ROI
      modal.querySelector('.pm-roi').textContent = prop.roi ? `${prop.roi}% projected` : 'Contact for details';
      
      // Area
      const areas = [];
      if (prop.total_area) areas.push(`Total: ${prop.total_area} m²`);
      if (prop.living_area) areas.push(`Living: ${prop.living_area} m²`);
      if (prop.plot_area) areas.push(`Plot: ${prop.plot_area} m²`);
      modal.querySelector('.pm-area').innerHTML = areas.join('<br>') || '-';
      
      // Leasehold
      modal.querySelector('.pm-leasehold').textContent = prop.leasehold ? `${prop.leasehold} years` : '-';
      
      // View
      modal.querySelector('.pm-view').textContent = prop.view || '-';
      
      // Price section
      const priceSection = modal.querySelector('.pm-price-section');
      if (prop.price) {
        priceSection.style.display = 'block';
        modal.querySelector('.pm-unit__type').textContent = prop.type || 'Unit';
        modal.querySelector('.pm-unit__details').innerHTML = areas.slice(0, 2).join('<br>') || '';
        modal.querySelector('.pm-unit__price').textContent = prop.price_display || '';
      } else {
        priceSection.style.display = 'none';
      }
      
      // Show
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

  // ========== EXPORT ==========
  window.PropertiesApp = {
    loadProperties,
    resetFilters,
    openPropertyModal,
    closeModal
  };

})();