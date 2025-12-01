// Продолжение или отдельный файл properties-filters.js

function initFilters() {
  const filtersDesktop = document.querySelector('.filters-desktop');
  const filtersMobile = document.querySelector('.filters-mobile');
  
  if (filtersDesktop) initDesktopFilters(filtersDesktop);
  if (filtersMobile) initMobileFilters(filtersMobile);
  
  // Кнопка поиска
  document.querySelector('.filter-button-wrapper a')?.addEventListener('click', (e) => {
    e.preventDefault();
    currentPage = 1;
    loadProperties();
  });
}

function initDesktopFilters(container) {
  const checkboxes = container.querySelectorAll('.filter-checkbox input');
  
  checkboxes.forEach(cb => {
    cb.addEventListener('change', function() {
      const column = this.closest('.filter-column');
      const filterType = getFilterType(column);
      const value = getFilterValue(this);
      
      // "All" checkbox logic
      if (value === 'all') {
        if (this.checked) {
          column.querySelectorAll('input:not([value="all"])').forEach(c => c.checked = false);
          currentFilters[filterType] = [];
        }
      } else {
        // Uncheck "All" when specific selected
        const allCheckbox = column.querySelector('input[value="all"], input:first-of-type');
        if (allCheckbox && allCheckbox !== this) {
          allCheckbox.checked = false;
        }
        
        if (this.checked) {
          if (!currentFilters[filterType].includes(value)) {
            currentFilters[filterType].push(value);
          }
        } else {
          currentFilters[filterType] = currentFilters[filterType].filter(v => v !== value);
        }
        
        // If nothing selected, check "All"
        if (currentFilters[filterType].length === 0 && allCheckbox) {
          allCheckbox.checked = true;
        }
      }
    });
  });
}

function initMobileFilters(container) {
  const filterItems = container.querySelectorAll('.mobile-filter-item');
  
  filterItems.forEach(item => {
    const select = item.querySelector('.mobile-filter-select');
    if (!select) return;
    
    select.addEventListener('click', () => {
      openMobileFilterModal(item);
    });
  });
}

function openMobileFilterModal(filterItem) {
  const filterType = filterItem.querySelector('h6')?.textContent.toLowerCase().trim();
  const filterKey = mapFilterName(filterType);
  
  // Создаём модалку
  let modal = document.getElementById('filterModal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'filterModal';
    modal.className = 'filter-modal';
    document.body.appendChild(modal);
  }
  
  const options = getFilterOptions(filterKey);
  
  modal.innerHTML = `
    <div class="filter-modal__overlay"></div>
    <div class="filter-modal__content">
      <div class="filter-modal__header">
        <h3>${filterType}</h3>
        <button class="filter-modal__close">×</button>
      </div>
      <div class="filter-modal__options">
        ${options.map(opt => `
          <label class="filter-checkbox">
            <input type="checkbox" value="${opt.value}" 
              ${currentFilters[filterKey].includes(opt.value) ? 'checked' : ''}>
            <span class="checkmark"></span>
            <span class="label-text">${opt.label}</span>
          </label>
        `).join('')}
      </div>
      <button class="filter-modal__apply wdt-button button-cta">Apply</button>
    </div>
  `;
  
  modal.classList.add('is-active');
  
  // Events
  modal.querySelector('.filter-modal__close').addEventListener('click', () => {
    modal.classList.remove('is-active');
  });
  
  modal.querySelector('.filter-modal__overlay').addEventListener('click', () => {
    modal.classList.remove('is-active');
  });
  
  modal.querySelector('.filter-modal__apply').addEventListener('click', () => {
    const checked = modal.querySelectorAll('input:checked');
    currentFilters[filterKey] = Array.from(checked).map(c => c.value);
    
    // Update select text
    const select = filterItem.querySelector('.mobile-filter-select span');
    if (select) {
      select.textContent = currentFilters[filterKey].length 
        ? `${currentFilters[filterKey].length} selected`
        : `All ${filterType}`;
    }
    
    modal.classList.remove('is-active');
    currentPage = 1;
    loadProperties();
  });
}

function getFilterType(column) {
  const header = column.querySelector('h6')?.textContent.toLowerCase().trim();
  return mapFilterName(header);
}

function mapFilterName(name) {
  const map = {
    'type': 'type',
    'area': 'area',
    'rooms': 'rooms',
    'price': 'price',
    'status': 'status'
  };
  return map[name] || name;
}

function getFilterValue(checkbox) {
  const label = checkbox.closest('label')?.querySelector('.label-text')?.textContent.trim();
  if (!label) return 'all';
  
  // Convert label to value
  if (label.toLowerCase().includes('all')) return 'all';
  
  // Price ranges
  if (label.includes('$')) {
    if (label.includes('Up to')) return 'up_to_100k';
    if (label.includes('100,000-150')) return '100k_150k';
    if (label.includes('150,000-200')) return '150k_200k';
    if (label.includes('200,000-300')) return '200k_300k';
    if (label.includes('300,000-500')) return '300k_500k';
    if (label.includes('500,000-700')) return '500k_700k';
    if (label.includes('700,000-1')) return '700k_1m';
    if (label.includes('From $1')) return 'over_1m';
  }
  
  // Rooms
  if (label.match(/^\d+BD$/i)) return label.replace('BD', '').trim();
  if (label.toLowerCase() === 'studio') return 'studio';
  
  // Status
  if (label.toLowerCase() === 'off-plan') return 'off_plan';
  if (label.toLowerCase().includes('construction')) return 'construction';
  if (label.toLowerCase() === 'ready') return 'ready';
  
  // Default: slugify
  return label.toLowerCase().replace(/\s+/g, '-');
}

function getFilterOptions(filterKey) {
  // Можно загружать динамически из API, пока хардкод
  const options = {
    type: [
      { value: 'apartment-1bd', label: 'Apartment 1BD' },
      { value: 'apartment-2bd', label: 'Apartment 2BD' },
      { value: 'villa-2bd', label: 'Villa 2BD' },
      { value: 'villa-3bd', label: 'Villa 3BD' },
      { value: 'villa-4bd', label: 'Villa 4BD' },
    ],
    area: [
      { value: 'canggu', label: 'Canggu' },
      { value: 'bukit', label: 'Bukit' },
      { value: 'ubud', label: 'Ubud' },
      { value: 'uluwatu', label: 'Uluwatu' },
      { value: 'seminyak', label: 'Seminyak' },
    ],
    // ... остальные
  };
  return options[filterKey] || [];
}