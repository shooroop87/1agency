// Google Maps initialization for Bali properties
let map;
let markers = [];
let activeMarker = null;

function initBaliMap() {
    const mapEl = document.getElementById('gmap-bali');
    if (!mapEl || !window.MAP_PROPERTIES || window.MAP_PROPERTIES.length === 0) return;

    // Центр Бали
    const baliCenter = { lat: -8.4095, lng: 115.1889 };
    
    map = new google.maps.Map(mapEl, {
        center: baliCenter,
        zoom: 10,
        styles: getMapStyles(),
        disableDefaultUI: true,
        zoomControl: false,
    });

    // Создаём маркеры
    window.MAP_PROPERTIES.forEach(prop => {
        const marker = new google.maps.Marker({
            position: { lat: prop.lat, lng: prop.lng },
            map: map,
            icon: {
                url: '/static/images/map-marker.svg',
                scaledSize: new google.maps.Size(40, 40),
            },
            title: prop.title,
        });
        
        marker.propertyData = prop;
        markers.push(marker);
        
        marker.addListener('click', () => showPopup(marker));
    });

    // Zoom buttons
    document.querySelectorAll('.map-zoom__btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const zoom = map.getZoom();
            map.setZoom(btn.dataset.zoom === 'in' ? zoom + 1 : zoom - 1);
        });
    });

    // Close popup
    const popup = document.getElementById('map-popup');
    const closeBtn = popup.querySelector('.map-popup__close');
    if (closeBtn) {
        closeBtn.addEventListener('click', hidePopup);
    }
    
    // Click outside popup
    map.addListener('click', hidePopup);
}

function showPopup(marker) {
    const prop = marker.propertyData;
    const popup = document.getElementById('map-popup');
    
    popup.querySelector('.map-popup__thumb img').src = prop.image;
    popup.querySelector('.map-popup__title').textContent = prop.title;
    popup.querySelector('.map-popup__location').textContent = prop.location;
    popup.querySelector('.map-popup__type').textContent = prop.type;
    popup.querySelector('.map-popup__status').textContent = prop.status;
    popup.querySelector('.map-popup__compl').textContent = prop.completion || '—';
    popup.querySelector('.map-popup__roi').textContent = prop.roi || '—';
    popup.querySelector('.map-popup__area').textContent = prop.area || '—';
    popup.querySelector('.map-popup__bedrooms').textContent = prop.bedrooms || '—';
    popup.querySelector('.map-popup__price').textContent = prop.price || '—';
    popup.querySelector('.map-popup__link').href = `/projects/?id=${prop.id}`;
    
    popup.style.display = 'block';
    activeMarker = marker;
    
    // Центрируем карту на маркере
    map.panTo(marker.getPosition());
}

function hidePopup() {
    document.getElementById('map-popup').style.display = 'none';
    activeMarker = null;
}

function getMapStyles() {
    return [
        { featureType: "water", elementType: "geometry", stylers: [{ color: "#a2daf2" }] },
        { featureType: "landscape", elementType: "geometry", stylers: [{ color: "#f5f5f5" }] },
        { featureType: "road", elementType: "geometry", stylers: [{ color: "#ffffff" }] },
        { featureType: "poi", elementType: "labels", stylers: [{ visibility: "off" }] },
        { featureType: "transit", stylers: [{ visibility: "off" }] },
    ];
}

// Expose globally
window.initBaliMap = initBaliMap;