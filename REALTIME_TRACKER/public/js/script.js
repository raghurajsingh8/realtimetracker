const socket = io();

if (navigator.geolocation) {
  navigator.geolocation.watchPosition(
    (position) => {
      const { latitude, longitude } = position.coords;
      socket.emit("send-location", { latitude, longitude });
    },
    (error) => {
      console.error(error);
    },
    {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0,
    }
  );
} else {
  console.log("Geolocation not supported");
}

const map=L.map("map").setView([0, 0], 16);
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{
    attribute:"Sheriyans Coding School"


} ).addTo(map)


const markers = {};

socket.on("receive-location",(location)=>{
  const{id , latitude, longitude} = location;
  map.setView([latitude,longitude]);

  if(!markers[id]){
    markers[id] = L.marker([latitude,longitude]).addTo(map);
  }else{
    markers[id].setLatLng([latitude,longitude]);
  }

})

socket.on("user-disconnected",(id)=>{
  if(markers[id]){
    markers[id].remove();
    delete markers[id];
  }
})
