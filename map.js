var map = L.map('map');
map.setView([51.505, -0.09], 13);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

navigator.geolocation.watchPosition(success, error);

function success(pos) {

    const lat = pos.coords.latitude;
    const lng = pos.coords.longitude;
    const accuracy = pos.coords.accuracy;

    L.marker([lat,lng]).addTo(map);
    L.circle([lat,lng],{ radius: accuracy}).addTo(map);

    

}

function error(err){

    if(err.code==1){
        alert('Please allow geolocation access');
    }
    else{
        alert('Cannot get current location');
    }
}


