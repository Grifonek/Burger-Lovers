const map = L.map("map").setView([-17.713371, 178.065033], 13);

L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution:
    '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map);

const marker = L.marker([-17.713371, 178.06503351]).addTo(map);

marker.bindPopup("<b>Here we are!</b><br>Your burgers 😘").openPopup();
