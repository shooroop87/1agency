// compare.js - Страница сравнения
document.addEventListener('DOMContentLoaded', function() {
  const compareEmpty = document.getElementById('compareEmpty');
  const compareTable = document.getElementById('compareTable');
  const compareHead = document.getElementById('compareHead');
  const compareBody = document.getElementById('compareBody');
  const clearBtn = document.getElementById('clearCompare');
  
  if (!compareEmpty || !compareTable) return;
  
  loadCompare();
  
  // Кнопка сброса
  if (clearBtn) {
    clearBtn.addEventListener('click', function() {
      if (confirm('Clear all favorites?')) {
        localStorage.removeItem('favorites');
        loadCompare();
        updateFavoritesCount();
      }
    });
  }
  
  function loadCompare() {
    const favorites = getFavorites();
    
    if (!favorites.length) {
      compareEmpty.style.display = 'block';
      compareTable.style.display = 'none';
      if (clearBtn) clearBtn.style.display = 'none';
      return;
    }
    
    compareEmpty.style.display = 'none';
    compareTable.style.display = 'block';
    if (clearBtn) clearBtn.style.display = 'inline-flex';
    
    // Загружаем данные
    const ids = favorites.join(',');
    fetch(`/api/properties/?ids=${ids}`)
      .then(r => r.json())
      .then(data => renderCompare(data.results || []))
      .catch(err => console.error('Compare load error:', err));
  }
  
  function renderCompare(properties) {
    if (!properties.length) {
      compareEmpty.style.display = 'block';
      compareTable.style.display = 'none';
      return;
    }
    
    // Заголовки (картинки + названия)
    compareHead.innerHTML = `
      <tr>
        <th></th>
        ${properties.map(p => `
          <th>
            <div class="compare-property">
              <img src="${p.image || '/static/images/placeholder.jpg'}" alt="${p.title}">
              <h4>${p.title}</h4>
              <button class="compare-remove" data-id="${p.id}">×</button>
            </div>
          </th>
        `).join('')}
      </tr>
    `;
    
    // Строки сравнения
    const rows = [
      { label: 'Type', key: 'property_type' },
      { label: 'Location', key: 'location' },
      { label: 'Price', key: 'price_display' },
      { label: 'Bedrooms', key: 'bedrooms_display' },
      { label: 'Area', key: 'area_display' },
      { label: 'Ownership', key: 'ownership_type' },
      { label: 'Construction', key: 'construction_status' },
      { label: 'ROI', key: 'roi_display' },
      { label: 'Completion', key: 'completion_date' }
    ];
    
    compareBody.innerHTML = rows.map(row => `
      <tr>
        <td class="compare-label">${row.label}</td>
        ${properties.map(p => `<td>${p[row.key] || '—'}</td>`).join('')}
      </tr>
    `).join('');
    
    // Удаление из сравнения
    document.querySelectorAll('.compare-remove').forEach(btn => {
      btn.addEventListener('click', function() {
        const id = parseInt(this.dataset.id);
        removeFavorite(id);
        loadCompare();
        updateFavoritesCount();
      });
    });
  }
});