// backend/static/js/compare.js
(function() {
  'use strict';
  
  document.addEventListener('DOMContentLoaded', function() {
    const compareEmpty = document.getElementById('compareEmpty');
    const compareTable = document.getElementById('compareTable');
    const compareHead = document.getElementById('compareHead');
    const compareBody = document.getElementById('compareBody');
    const clearBtn = document.getElementById('clearCompare');
    
    if (!compareTable) return;
    
    function loadCompare() {
      const ids = window.Favorites ? window.Favorites.getAll() : [];
      
      if (!ids.length) {
        compareEmpty.style.display = 'block';
        compareTable.style.display = 'none';
        if (clearBtn) clearBtn.style.display = 'none';
        return;
      }
      
      compareEmpty.style.display = 'none';
      compareTable.style.display = 'block';
      if (clearBtn) clearBtn.style.display = 'inline-flex';
      
      Promise.all(ids.map(id => 
        fetch(`/api/properties/${id}/`).then(r => r.json()).catch(() => null)
      )).then(properties => {
        properties = properties.filter(p => p && !p.error);
        renderTable(properties);
      });
    }
    
    function renderTable(properties) {
      if (!properties.length) {
        compareEmpty.style.display = 'block';
        compareTable.style.display = 'none';
        return;
      }
      
      // Header с фото и названиями
      let headHtml = '<tr><th class="compare-label-cell"></th>';
      properties.forEach(p => {
        headHtml += `
          <th class="compare-item-cell">
            <div class="compare-card">
              <div class="compare-card__img">
                <img src="${p.image || '/static/images/placeholder.jpg'}" alt="${p.title}">
                <button class="compare-card__remove" data-id="${p.id}">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M1 1L11 11M11 1L1 11" stroke="currentColor" stroke-width="1.5"/>
                  </svg>
                </button>
              </div>
              <div class="compare-card__title">${p.title}</div>
              <div class="compare-card__type">${p.property_type || ''}</div>
            </div>
          </th>
        `;
      });
      headHtml += '</tr>';
      compareHead.innerHTML = headHtml;
      
      // Rows сравнения
      const rows = [
        { label: 'Location', key: 'location' },
        { label: 'Price', key: 'price_display' },
        { label: 'Bedrooms', key: 'bedrooms_display' },
        { label: 'Area', key: 'area_display' },
        { label: 'ROI', key: 'roi_display' },
        { label: 'Construction', key: 'construction' },
        { label: 'Ownership', key: 'ownership' },
        { label: 'Completion', key: 'completion' },
      ];
      
      let bodyHtml = '';
      rows.forEach(row => {
        bodyHtml += `<tr><td class="compare-label-cell">${row.label}</td>`;
        properties.forEach(p => {
          let val = p[row.key] || '—';
          if (typeof val === 'string') val = val.replace(/<[^>]*>/g, '');
          bodyHtml += `<td class="compare-value-cell">${val}</td>`;
        });
        bodyHtml += '</tr>';
      });
      compareBody.innerHTML = bodyHtml;
      
      // Remove handlers
      document.querySelectorAll('.compare-card__remove').forEach(btn => {
        btn.addEventListener('click', function(e) {
          e.preventDefault();
          const id = this.getAttribute('data-id');
          if (window.Favorites) {
            window.Favorites.remove(id);
            loadCompare();
          }
        });
      });
    }
    
    if (clearBtn) {
      clearBtn.addEventListener('click', function() {
        if (window.Favorites) {
          window.Favorites.clear();
          loadCompare();
        }
      });
    }
    
    loadCompare();
  });
})();