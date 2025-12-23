// static/js/compare.js

const Compare = {
  rows: [
    { key: 'property_type', label: 'Type' },
    { key: 'location', label: 'Location' },
    { key: 'price_display', label: 'Price' },
    { key: 'bedrooms_display', label: 'Bedrooms' },
    { key: 'area_display', label: 'Area' },
    { key: 'ownership', label: 'Ownership' },
    { key: 'construction', label: 'Construction' },
    { key: 'roi_display', label: 'ROI' },
    { key: 'completion', label: 'Completion' },
  ],

  async init() {
    const ids = Favorites.getAll();
    
    if (ids.length === 0) {
      document.getElementById('compareEmpty').style.display = 'block';
      document.getElementById('compareTable').style.display = 'none';
      return;
    }
    
    document.getElementById('compareEmpty').style.display = 'none';
    document.getElementById('compareTable').style.display = 'block';
    
    const properties = await this.fetchProperties(ids);
    this.render(properties);
  },

  async fetchProperties(ids) {
    const results = [];
    for (const id of ids) {
      try {
        const res = await fetch(`/api/properties/${id}/`);
        if (res.ok) results.push(await res.json());
      } catch (e) {
        console.error('Failed to load property', id);
      }
    }
    return results;
  },

  render(properties) {
    const head = document.getElementById('compareHead');
    const body = document.getElementById('compareBody');
    
    // Header row с картинками и названиями
    head.innerHTML = `
      <tr>
        <th class="compare-label"></th>
        ${properties.map(p => `
          <th class="compare-property">
            <div class="compare-card">
              <button class="compare-remove" data-id="${p.id}">&times;</button>
              <img src="${p.image || '/static/images/placeholder.jpg'}" alt="${p.title}">
              <h4>${p.title}</h4>
            </div>
          </th>
        `).join('')}
      </tr>
    `;
    
    // Body rows
    body.innerHTML = this.rows.map(row => `
      <tr>
        <td class="compare-label">${row.label}</td>
        ${properties.map(p => `
          <td class="compare-value">${p[row.key] || '—'}</td>
        `).join('')}
      </tr>
    `).join('');
    
    // Remove buttons
    head.querySelectorAll('.compare-remove').forEach(btn => {
      btn.addEventListener('click', () => {
        Favorites.remove(parseInt(btn.dataset.id));
        this.init();
      });
    });
  }
};

document.addEventListener('DOMContentLoaded', () => Compare.init());