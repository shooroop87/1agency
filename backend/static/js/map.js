/* ===== GOOGLE MAPS BALI ===== */
let baliMap;
let markers = [];
let activeMarker = null;

function initBaliMap() {
  const mapEl = document.getElementById('gmap-bali');
  if (!mapEl) return;

  // Центр Бали
  const baliCenter = { lat: -8.4095, lng: 115.1889 };

  // Темная тема карты
  const darkStyle = [
    { elementType: "geometry", stylers: [{ color: "#212121" }] },
    { elementType: "labels.icon", stylers: [{ visibility: "off" }] },
    { elementType: "labels.text.fill", stylers: [{ color: "#757575" }] },
    { elementType: "labels.text.stroke", stylers: [{ color: "#212121" }] },
    { featureType: "administrative", elementType: "geometry", stylers: [{ color: "#757575" }] },
    { featureType: "administrative.country", elementType: "labels.text.fill", stylers: [{ color: "#9e9e9e" }] },
    { featureType: "administrative.locality", elementType: "labels.text.fill", stylers: [{ color: "#bdbdbd" }] },
    { featureType: "poi", elementType: "labels.text.fill", stylers: [{ color: "#757575" }] },
    { featureType: "poi.park", elementType: "geometry", stylers: [{ color: "#181818" }] },
    { featureType: "road", elementType: "geometry.fill", stylers: [{ color: "#2c2c2c" }] },
    { featureType: "road", elementType: "labels.text.fill", stylers: [{ color: "#8a8a8a" }] },
    { featureType: "road.arterial", elementType: "geometry", stylers: [{ color: "#373737" }] },
    { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#3c3c3c" }] },
    { featureType: "transit", elementType: "labels.text.fill", stylers: [{ color: "#757575" }] },
    { featureType: "water", elementType: "geometry", stylers: [{ color: "#000000" }] },
    { featureType: "water", elementType: "labels.text.fill", stylers: [{ color: "#3d3d3d" }] }
  ];

  baliMap = new google.maps.Map(mapEl, {
    center: baliCenter,
    zoom: 10,
    styles: darkStyle,
    disableDefaultUI: true,
    zoomControl: false,
    mapTypeControl: false,
    streetViewControl: false,
    fullscreenControl: false
  });

  // Добавляем маркеры
  if (window.MAP_PROPERTIES && window.MAP_PROPERTIES.length) {
    window.MAP_PROPERTIES.forEach(prop => {
      addMarker(prop);
    });
  }

  // Zoom кнопки
  document.querySelectorAll('.map-zoom__btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const dir = this.dataset.zoom;
      const currentZoom = baliMap.getZoom();
      baliMap.setZoom(dir === 'in' ? currentZoom + 1 : currentZoom - 1);
    });
  });

  // Закрыть popup при клике на карту
  baliMap.addListener('click', () => {
    hidePopup();
  });
}

function addMarker(prop) {
  // SVG маркер
  const markerIcon = {
    url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
      <svg width="32" height="40" viewBox="0 0 32 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M16 0C7.16 0 0 7.16 0 16c0 12 16 24 16 24s16-12 16-24c0-8.84-7.16-16-16-16z" fill="#8a8a8a"/>
        <circle cx="16" cy="16" r="6" fill="#1a1a1a"/>
        <text x="16" y="20" text-anchor="middle" fill="#fff" font-size="10" font-family="Arial">i</text>
      </svg>
    `),
    scaledSize: new google.maps.Size(32, 40),
    anchor: new google.maps.Point(16, 40)
  };

  const marker = new google.maps.Marker({
    position: { lat: prop.lat, lng: prop.lng },
    map: baliMap,
    icon: markerIcon,
    title: prop.title
  });

  marker.propData = prop;
  markers.push(marker);

  marker.addListener('click', () => {
    showPopup(prop);
    activeMarker = marker;
  });
}

function showPopup(prop) {
  const popup = document.getElementById('map-popup');
  if (!popup) return;

  popup.querySelector('.map-popup__title').textContent = prop.title || '—';
  popup.querySelector('.map-popup__place').textContent = prop.location || '—';
  popup.querySelector('.map-popup__thumb img').src = prop.image || '';
  popup.querySelector('.map-popup__status').textContent = prop.status || '—';
  popup.querySelector('.map-popup__compl').textContent = prop.completion || '—';
  popup.querySelector('.map-popup__roi').textContent = prop.roi ? prop.roi + '%' : '—';
  popup.querySelector('.map-popup__price').textContent = prop.price || '—';
  popup.querySelector('.map-popup__units').textContent = prop.units || '';

  popup.style.display = 'block';
}

function hidePopup() {
  const popup = document.getElementById('map-popup');
  if (popup) popup.style.display = 'none';
  activeMarker = null;
}

// Fallback если callback не сработал
window.initBaliMap = initBaliMap;