var map = L.map('map');
map.setView([51.505, -0.09], 13);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);


navigator.geolocation.watchPosition(success, error);

let marker,circle,zoomed;

function success(pos) {

    const lat = pos.coords.latitude;
    const lng = pos.coords.longitude;
    const accuracy = pos.coords.accuracy;

    if(marker){
        map.removeLayer(marker);
        map.removeLayer(circle);
    }

    marker = L.marker([lat,lng]).addTo(map);
    circle= L.circle([lat,lng],{ radius: accuracy}).addTo(map);

    if (!zoomed) {
        zoomed=map.fitBounds(circle.getBounds());
    }

    map.setView([lat,lng]);
  

}

function error(err){

    if(err.code==1){
        alert('Please allow geolocation access');
    }
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