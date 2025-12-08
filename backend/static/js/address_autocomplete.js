(function() {
    function initAddressAutocomplete() {
        const addressField = document.querySelector('input[name="address"]');
        const latField = document.querySelector('input[name="latitude"]');
        const lngField = document.querySelector('input[name="longitude"]');
        
        if (!addressField || !google) return;
        
        const autocomplete = new google.maps.places.Autocomplete(addressField, {
            types: ['geocode', 'establishment'],
            componentRestrictions: { country: 'id' }  // Indonesia/Bali
        });
        
        autocomplete.addListener('place_changed', function() {
            const place = autocomplete.getPlace();
            if (place.geometry) {
                latField.value = place.geometry.location.lat().toFixed(7);
                lngField.value = place.geometry.location.lng().toFixed(7);
            }
        });
    }
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initAddressAutocomplete);
    } else {
        initAddressAutocomplete();
    }
})();