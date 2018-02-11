function Target(pos, ID, status){
    this.pos = pos;
    this.ID = ID;
    this.status = status;
    this.destroy = false;
}

targets = []; // List of current targets left (List of target objects)
targetMarkerList = []; // Array based for the markers (Array of Marker objects)

var PERCENT_BAD = 0.30;

function updateTarget(target){
    for (var i = 0; i < targets.length; i++){
        if (targets[i].ID == target){
            if (Math.random() < PERCENT_BAD){
                targets[i].status = "BAD";
            }
            else{
                targets[i].status = "GOOD";
            }
            break;
        }
    }
}

function targetCheckDelete(pos){
    // Finds the selected target and check to see if it's deletable.
    if (targets[pos].status == "GOOD"){
        displayMode = false;
        dronePicMode = true;
    }
    else {
        displayMode = false;
        dronePicMode = true;
    }
    return;
}

function deleteTarget(ID){
    // Delete Target at TARGET_ID = ID
    targetMarkerList[ID].setMap(null);
    for (var i = 0; i < targets.length; i++){
        if (targets[i].ID == ID){
            targets.splice(i, 1);
            break;
        }
    }
}

