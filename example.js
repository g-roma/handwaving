var wSize = 128;
var sr = 60;
var fft = new FFT(wSize, sr);
var net;
var currentGesture = 0;
var currentTimer;
var currentPlayer;
var playing = false;
var phase = 1;
var playerId = 0;

let environment = flock.init();
let synth;



let sounds = ["up_down", "left_right", "tilt"];
let synths = new Array(3);
let mappings = new Array(3);

function argmax(arr){
    maxVal = 0;
    maxIdx = null;
    for(var i in arr){
        if (arr[i] > maxVal){
            maxIdx = i;
            maxVal = arr[i]
        }
    }
    return maxIdx;
}
function xl2color(val){return parseInt(127*(1+(val/20)))}

function getPrediction(data){
    var point = Array();
    var x = Array();
    var y = Array();
    var z = Array();

    for (var i = 0;i < data.length; i ++){
            var accelPoint = data[i];
            x.push(accelPoint[0]);
            y.push(accelPoint[1]);
            z.push(accelPoint[2]);
    }

    fft.forward(x);
    point = point.concat(Array.prototype.slice.call(fft.spectrum));
    fft.forward(y);
    point = point.concat(Array.prototype.slice.call(fft.spectrum));
    fft.forward(z);
    point = point.concat(Array.prototype.slice.call(fft.spectrum));

    var vol = new convnetjs.Vol(point);
    var result = net.forward(vol, false);
    var pred = argmax(result.w);
    return [pred, result.w[pred]]
}

function getSound(id, doneFunc){
  $.getJSON(sounds[id]+"_sound.json", function(data){
      //let sound = JSON.parse(data);
      console.log(synths[id]);
      synths[id] = eval(data.synth);
      mappings[id] = data.mapping;
      console.log(id,"OK");
      doneFunc();
  });
}


function getNN(){
    $.getJSON("nnet.json", function( data ) {
        net = new convnetjs.Net();
        net.fromJSON(data);
        $("#display").text("Touch screen to start...");
        document.addEventListener('touchstart', function(e) {
            if(playing)return;

            environment.start();
            currentPlayer = synths[0];
            currentPlayer.play();
            playing = true;
        });
    })
}

function isFlat(x,y,z){
    var th = 0.1;
    return
        Math.abs(x) < th && Math.abs(y) < th && Math.abs(10-z) < th;
}


$(function(){
    //if (!phoneOK()) return;
    var accelWin = [];
    $("#display").text("loading, please wait...");
    getSound(0,()=>{getSound(1,()=>{getSound(2, getNN)})});

    //getNN();
    var k = 0;
    var prevX =0, prevY=0, prevZ=0;

    window.ondevicemotion = function(e) {
        if (net==null || !playing) return;
        var x = e.accelerationIncludingGravity.x;
        var y = e.accelerationIncludingGravity.y;
        var z = e.accelerationIncludingGravity.z;
        accelWin.push([x, y, z]);

        if(accelWin.length > wSize){
            accelWin.shift();
            pred = getPrediction(accelWin);
                if (pred[1] <0.8) gesture = 0;
                else gesture = pred[0];
                if (gesture != currentGesture && pred[1] > 0.5) {
                    currentPlayer.pause();
                    currentPlayer = synths[gesture];
                    currentPlayer.play();
                    currentGesture = gesture;
                }
                $("#display").text(currentGesture);
        } else {
            //$("#display").text(wSize - accelWin.length);
        }
        prevX = x;
        prevY = y;
        prevZ = z;
    }
});
