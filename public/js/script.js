const socket = io();

if(navigator.geolocation){
    console.log(navigator.geolocation.watchPosition(
        (position)=>{
            const {latitude,longitude}=position.coords;
            console.log(latitude,longitude);
            socket.emit("send-location",{latitude,longitude})
            
        },
        (error)=>{
            console.log(error);
            
        },
        {
        timeout:5000,
        age:0
        }
    ));
    
}

const map = L.map("map").setView([0,0],10);

L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png",{
    attribution:"geolocationdemo"
}).addTo(map)

const markers = {};

socket.on("receive-location",(data)=>{
    const{id,latitude,longitude}=data;
    console.log(data);
    map.setView([latitude,longitude],14);
    if(markers[id]){
        markers[id].setLatLng([latitude,longitude]);
    }else{
        markers[id]=L.marker([latitude,longitude]).addTo(map);
    }
})

socket.on("user-disconnect",(id)=>{
    if(markers[id]){
        map.removeLayer(markers[id]);
        delete markers[id];
    }
})