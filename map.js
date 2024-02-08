var map = L.map('map');
map.setView([51.505, -0.09], 13);

// Add OpenStreetMap tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

// Initialize the Leaflet.draw control
var drawnItems = new L.FeatureGroup();
map.addLayer(drawnItems);
var drawControl = new L.Control.Draw({
    edit: {
        featureGroup: drawnItems
    }
});
map.addControl(drawControl);

var startMarker, endMarker, trail;


// on location found
function success(pos) {
    const lat = pos.coords.latitude;
    const lng = pos.coords.longitude;
    const accuracy = pos.coords.accuracy;

    // Set map view to the current location
    map.setView([lat, lng], 17);

    // Add a marker for the current location
    L.marker([lat, lng]).addTo(map);
}

// on error location found
function error(err) {
    if (err.code == 1) {
        alert('Please allow geolocation access');
    }
}

navigator.geolocation.watchPosition(success, error);

// Function to handle setting the start location
function setStartLocation() {
    map.off('click'); // Remove any existing click event listener
    map.on('click', function(e) {
        if (startMarker) {
            map.removeLayer(startMarker);
        }
        startMarker = L.marker(e.latlng).addTo(map);
    });
}

// Function to handle setting the end location
function setEndLocation() {
    map.off('click'); // Remove any existing click event listener
    map.on('click', function(e) {
        if (endMarker) {
            map.removeLayer(endMarker);
        }
        endMarker = L.marker(e.latlng).addTo(map);
    });
}


// Function to handle drawing a trail
function drawTrail() {
    map.off('draw:created'); // Remove any existing draw event listener
    map.on('draw:created', function(e) {
        var type = e.layerType;
        if (type === 'polyline') {
            if (trail) {
                map.removeLayer(trail);
            }
            trail = e.layer.addTo(map);

            // Capture the coordinates of the start and end markers
            var startCoords = startMarker.getLatLng();
            var endCoords = endMarker.getLatLng();

            // Display start and end coordinates in a div
            document.getElementById('startCoords').innerText = 'Start Coordinates: ' + startCoords.toString();
            document.getElementById('endCoords').innerText = 'End Coordinates: ' + endCoords.toString();
        }
    });
}






// Function to search for a location
function searchLocation() {
    var searchText = document.getElementById('searchInput').value;
    if (searchText.trim() === '') {
        alert('Please enter a location');
        return;
    }

    // Use a geocoding service to convert location name into coordinates
    fetch(`https://nominatim.openstreetmap.org/search?q=${searchText}&format=json`)
    .then(response => response.json())
    .then(data => {
        if (data.length > 0) {
            var lat = parseFloat(data[0].lat);
            var lon = parseFloat(data[0].lon);
            map.setView([lat, lon], 13); // Set map view to the found coordinates
        } else {
            alert('Location not found');
        }
    })
    .catch(error => {
        console.error('Error fetching location:', error);
        alert('Error fetching location. Please try again later.');
    });
}


