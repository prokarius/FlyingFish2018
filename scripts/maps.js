var INTERVAL = 500;
var TARGET_ID = 0;
var map;

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 10,
        center: {lat: 9.60, lng: 121.2}
    });

    var MPACircle = new google.maps.Circle({
        strokeColor: '#FF0000',
        strokeOpacity: 0.7,
        strokeWeight: 2,
        fillColor: '#FF0000',
        fillOpacity: 0.25,
        map: map,
        center: {lat: 9.60, lng: 121.2},
        radius: 22500,
        clickable: false
    });

    google.maps.event.addListener(map, 'click', spawnNewBad);

    for (var i=0; i<drones.length; i++){
        var marker = new google.maps.Marker({
            position: {lat:drones[i].pos.lat, lng: drones[i].pos.lng},
            map: map,
            label: drones[i].name
        });

        var rangeCircle = new google.maps.Circle({
            strokeColor: '#FF0000',
            strokeOpacity: 0.3,
            strokeWeight: 1,
            fillOpacity: 0.05,
            map: map,
            center: drones[i].pos,
            radius: drones[i].range,
            clickable: false
        });

        setInterval(updateDrones(marker, rangeCircle, i), INTERVAL);
    }
}

function spawnNewBad (event){
    badGuy = new Target ({lat: event.latLng.lat(), lng: event.latLng.lng()}, TARGET_ID, "UNKNOWN");
    targets.push(badGuy);
    move(event.latLng.lat(), event.latLng.lng(), TARGET_ID);
    var targetMarker = new google.maps.Marker({
        position: {lat:event.latLng.lat(), lng: event.latLng.lng()},
        map: map,
        label: "" + TARGET_ID
    });
    targetMarkerList[TARGET_ID] = targetMarker;
    TARGET_ID += 1;
}

function updateDrones(marker, rangeCircle, j) {
    return function(){
        updatepos(j);
        var newRadius = drones[j].range;
        var position = {lat: drones[j].pos.lat, lng: drones[j].pos.lng};
        rangeCircle.setRadius(newRadius);
        rangeCircle.setCenter(position);
        marker.setPosition(position);
    }
}

function testUpdatePos() {
    for (var i=0; i<drones.length; i++){
        drones[i].pos.lat += 0.01;
        drones[i].pos.lng -= 0.005;
    }
}
