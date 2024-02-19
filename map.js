var map = L.map('map');
map.setView([51.505, -0.09], 13);

// Add OpenStreetMap tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

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

navigator.geolocation.getCurrentPosition(success, error);


// Function to handle key press event
function handleKeyPress(event) {
    if (event.key === 'Enter') {
        searchLocation();
    }
}

// Function to search for a location
function searchLocation() {
    var searchText = document.getElementById('searchInput').value;
    if (searchText.trim() === '') {
        alert('Please enter a location');
        return;
    }

     // Show the searchedLocation div and hide the currentLocation div
     document.querySelector('.SearchResults').classList.remove('hidden');
     document.querySelector('.currentLocation').classList.add('hidden');
     document.querySelector('.locationHeader').classList.add('hidden');
    

    // Use a geocoding service to convert location name into coordinates
    fetch(`https://nominatim.openstreetmap.org/search?q=${searchText}&format=json`)
    .then(response => response.json())
    .then(data => {
        if (data.length > 0) {
            var lat = parseFloat(data[0].lat);
            var lon = parseFloat(data[0].lon);
            map.setView([lat, lon], 13); // Set map view to the found coordinates

        // Call displaySearchedLocation to update the searchedLocation div
        displaySearchedLocation(lat, lon);
        } else {
            alert('Location not found');
        }
    })
    .catch(error => {
        console.error('Error fetching location:', error);
        alert('Error fetching location. Please try again later.');
    });
}


// Function to get current location and update the div content
function getCurrentLocation() {
    navigator.geolocation.getCurrentPosition(function (position) {
        var latitude = position.coords.latitude;
        var longitude = position.coords.longitude;
        var currentLocationDiv = document.querySelector('.currentLocation');

        // Fetching address information using OpenStreetMap Nominatim API
        fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`)
            .then(response => response.json())
            .then(data => {
                var city = data.address.city || '';
                var province = data.address.state || '';
                var country = data.address.country || '';
                currentLocationDiv.textContent = `${city}, ${province}, ${country}`;
            })
            .catch(error => {
                console.error('Error fetching location:', error);
                currentLocationDiv.textContent = 'Error fetching location';
            });
    });
}

getCurrentLocation();




// Get reference to the .coords div
const coordsDiv = document.querySelector('.coords');

// Get reference to the #mapMessage span
const mapMessageSpan = document.getElementById('mapMessage');

// Function to check if .coords div is empty and hide the #mapMessage span if it's not
function checkCoordsDiv() {
    if (coordsDiv.innerHTML.trim() !== '') {
        // Hide the #mapMessage span
        mapMessageSpan.style.display = 'none';
    }
}

// Call checkCoordsDiv function initially
checkCoordsDiv();

// Function to display coordinates of clicked location
function displayCoords(e) {
    var coordsDiv = document.querySelector('.coords');
    coordsDiv.textContent = `(${e.latlng.lat.toFixed(6)},${e.latlng.lng.toFixed(6)})`;
    
    // Check if .coords div is not empty and hide the #mapMessage span
    checkCoordsDiv();
}

map.on('click', displayCoords);


// Function to display the searched location
function displaySearchedLocation(latitude, longitude) {
    var searchedLocationDiv = document.querySelector('.searchedLocation');

    // Fetching address information using OpenStreetMap Nominatim API
    fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`)
        .then(response => response.json())
        .then(data => {
            var city = data.address.city || '';
            var province = data.address.state || '';
            var country = data.address.country || '';
            searchedLocationDiv.textContent = `${city}, ${province}, ${country}`;
        })
        .catch(error => {
            console.error('Error fetching location:', error);
            searchedLocationDiv.textContent = 'Error fetching location';
        });
}

// Example usage:


