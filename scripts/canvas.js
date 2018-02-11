var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
setInterval(drawClock, 500);
var rectHeight = 0.63 * (canvas.height / drones.length);
var targetsLine = 0.65 * canvas.height;
var targetsLine2 = 0.66 * canvas.height;
var TARGET_HEIGHT = 0.35 * (canvas.height / 4);
var displayMode = true;
var dronePicMode = false;
var currTargetPicture = 0;
var img1 = null;
var img2 = null;

document.getElementById('myCanvas').addEventListener('click',function(evt){
    var rect = canvas.getBoundingClientRect();
    var x = evt.clientX - rect.left;
    var y = evt.clientY - rect.top;
    
    // If we are in displayMode:
    if (displayMode){
        // If we clicked on a target:
        var targetnum = Math.abs((((y - targetsLine2)/TARGET_HEIGHT) - 0.5).toFixed(0));
        if (targetnum >= 0 & targetnum < targets.length){
            targetCheckDelete (targetnum);
            currTargetPicture = targets[targetnum].ID;
        }
        // TODO If we clicked on a drone
    }
    else {
        confirmation(currTargetPicture);
    }
},false);

function confirmation(ID){
    if (confirm("Delete This Event?")) {
        deleteTarget(ID);
    }
    displayMode = true;
    dronePicMode = false;
    img1 = null;
    img2 = null;
}

function drawClock() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawDrones();
    if (displayMode){
        drawTargets();
    }
    else if (dronePicMode){
        dronePics();
    }
}

function dronePics(){
    ctx.font="16px Arial";
    ctx.fillStyle = "black";
    ctx.fillText("Target ID: " + currTargetPicture, 15, targetsLine + 0.01*canvas.height);
    if (img1 == null){
        img1 = "assets/Sample" + (0.51 + Math.random()*4).toFixed(0) + ".jpg"
        img2 = "assets/Sample" + (0.51 + Math.random()*4).toFixed(0) + ".jpg"

        console.log(img1);
        console.log(img2);

        imga = new Image();
        imga.onload = function () {
            ctx.drawImage(imga, 30, targetsLine + 0.03*canvas.height, 180, 180);
        };
        imga.src = img1;

        imgb = new Image();
        imgb.onload = function () {
            ctx.drawImage(imgb, 250, targetsLine + 0.03*canvas.height, 180, 180);
        };
        imgb.src = img2;
    }

    ctx.drawImage(imga, 30, targetsLine + 0.03*canvas.height, 180, 180);
    ctx.drawImage(imgb, 250, targetsLine + 0.03*canvas.height, 180, 180);
}

function drawTargets(){
    ctx.beginPath();
    ctx.moveTo(0,targetsLine);
    ctx.lineTo(canvas.width,targetsLine);
    ctx.stroke();

    // So we can start to draw the targets now:
    var temp = Math.min(targets.length, 4);
    for (var i=0; i<temp; i++){
        var targetTop = targetsLine2 + i*TARGET_HEIGHT;
        ctx.beginPath();
        ctx.rect(0, targetTop, canvas.width, TARGET_HEIGHT-2);
        if (targets[i].status == "BAD"){
            ctx.fillStyle = "red";
        }
        else if (targets[i].status == "GOOD"){
            ctx.fillStyle = "green";
        }
        else if (targets[i].status == "UNKNOWN"){
            ctx.fillStyle = "blue";
        }
        else {
            ctx.fillStyle = "white";
        }
        ctx.fill();

        ctx.beginPath();
        ctx.rect(0, targetTop, canvas.width, TARGET_HEIGHT-2);
        ctx.stroke();

        // This part is for displaying the text info
        // Name of target
        var namePosy = targetTop + 20;
        var namePosx = 15;

        ctx.font="16px Arial";
        ctx.fillStyle ="black";
        ctx.fillText("Target ID: " + targets[i].ID, namePosx, namePosy);

        // Position of the target
        ctx.font="12px Arial";
        ctx.fillText("Position: (" + targets[i].pos.lat.toFixed(4) + ", " + 
                                     targets[i].pos.lng.toFixed(4) + ")" , namePosx, namePosy+20);
        
        // Whether it is in Motion (Top Right Corner of each box)
        ctx.fillText("STATUS: " + targets[i].status, namePosx + 380, namePosy);
    }
}

function drawDrones() {
    for (var i=0; i<drones.length; i++){

        // This part is for the motion of the drones
        var colour;
        var motionString;
        if (drones[i].ontask){
            colour = "#FF6666";
            motionString = "Moving to Target: " + drones[i].target;
        }
        else if (drones[i].observing){
            colour = "#6666FF";
            motionString = "Observing Target: " + drones[i].target;
        }
        else {
            colour = "#66FF66";
            motionString = "Drone on Standby!"
        }

        var rectTop = i*rectHeight;
        var rectBottom = (i+1)*rectHeight - 6;
        ctx.beginPath();
        ctx.rect(0, rectTop, canvas.width, rectHeight-6);
        ctx.fillStyle = colour;
        ctx.fill();

        ctx.beginPath();
        ctx.rect(0, rectTop, canvas.width, rectHeight-6);
        ctx.stroke();

        // This part is for displaying the text info
        // Name of Drone
        var namePosy = rectTop + 20;
        var namePosx = 15;

        ctx.font="16px Arial";
        ctx.fillStyle = "black";
        ctx.fillText("Drone ID: " + drones[i].name, namePosx, namePosy);

        // Position of the drone
        ctx.font="12px Arial";
        ctx.fillText("Current Position: (" + drones[i].pos.lat.toFixed(4) + ", " + 
                                             drones[i].pos.lng.toFixed(4) + ")" , namePosx, namePosy+20);
        

        // Whether it is in Motion (Top Right Corner of each box)
        ctx.fillText(motionString, namePosx + 380, namePosy);

        // Battery life
        ctx.beginPath();
        ctx.rect(0, rectBottom - 18, canvas.width*(drones[i].battery/100), 18);
        if (drones[i].battery < 25){
            colour = "red";
        }
        else {
            colour = "green";
        }
        ctx.fillStyle = colour;
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = "black";
        ctx.fillText("Battery Life", namePosx, rectBottom - 6);
        
    }
}
