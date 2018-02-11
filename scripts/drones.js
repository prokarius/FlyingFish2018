function Drone(name, pos, motion, target, ontask, observing, battery){
    this.name = name;
    this.pos = pos;
    this.motion = motion;
    this.target = target;
    this.ontask = ontask;
    this.battery = battery;
    this.range = 3 * this.battery / DRONEMAXSPEED;
}

var DRONEMAXSPEED = 0.01;
var OBSERVATION_TIME = 5;

drones = [new Drone("A", {lat: 9.74,  lng: 121.12}, {dlat: 0, dlng: 0, time: 0}, null, false, false, 72),
          new Drone("B", {lat: 9.45,  lng: 121.35}, {dlat: 0, dlng: 0, time: 0}, null, false, false, 84),
          new Drone("C", {lat: 9.36,  lng: 121.08}, {dlat: 0, dlng: 0, time: 0}, null, false, false, 43),
          new Drone("D", {lat: 9.70,  lng: 121.37}, {dlat: 0, dlng: 0, time: 0}, null, false, false, 15)]


function updatepos(j){
    // If the drone is going to be moving to a new location
    if (drones[j].ontask){
        // Move him, and check if he has reached (when time = 0)
        if (drones[j].battery >= 3){
            drones[j].battery -= 3;
            drones[j].pos.lat += drones[j].motion.dlat;
            drones[j].pos.lng += drones[j].motion.dlng;
            drones[j].motion.time -= 1;
            // If he has reached, stop moving him and make him observe
            if (drones[j].motion.time == 0){
                drones[j].ontask = false;
                drones[j].observing = true;
                drones[j].motion.time = OBSERVATION_TIME;
            }
        }
        else {
            drones[j].battery += 1;
        }
    }
    else if (drones[j].observing){
        drones[j].motion.time -= 1;
        // If he is done observing, set target to null.
        if (drones[j].motion.time == 0){
            drones[j].observing = false;
            updateTarget(drones[j].target);
            drones[j].target = null;
        }
    }
/*    else if (// use functional programming here {
        // TODO CHECK IF THERE ARE ANY UNFINISHED POIS
        // MOVE TO THAT POI 
    } */
    else {
        drones[j].battery += 1;
        if (drones[j].battery >= 100){
            drones[j].battery = 100;
        }
    }

    // Update the range
    drones[j].range = 3 * drones[j].battery / DRONEMAXSPEED;
}

function move(newlat, newlng){
    // So there will be a few steps.
    // First we loop through all the drones and find the one that is closest to the event
    var best = -1;
    var bestd = 99999;  
    for (var i=0; i<drones.length; i++){
        if (!drones[i].ontask & !drones[i].observing){
            // Yes the code is sloppy. Sorry
            var droned = (drones[i].pos.lat - newlat)*(drones[i].pos.lat - newlat) +
                         (drones[i].pos.lng - newlng)*(drones[i].pos.lng - newlng);
            if (droned < bestd){
                best = i;
                bestd = droned;
            }
        }
    }

    // So now that the drone has been selected, we calculate its movement attributes
    bestd = Math.sqrt(bestd)/DRONEMAXSPEED;
    var movementTime = bestd.toFixed(0);
    drones[best].motion.time = movementTime;
    drones[best].motion.dlat = (newlat - drones[best].pos.lat)/movementTime;
    drones[best].motion.dlng = (newlng - drones[best].pos.lng)/movementTime;
    drones[best].ontask = true;
    drones[best].target = TARGET_ID;
}
