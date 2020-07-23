const HandWaving = require("./handwaving.js");

const windowSize = 128;
const sampleRate = 60;

const gestures = [
  "left / right",
  "up / down",
  "tilt",
  "circles",
  "forward / backwards",
  "concave",
  "convex"];

const handWaving = new HandWaving(windowSize, windowSize / 2, true, gestures.length);
window.loaded = false;

function loadNN(){
    $.getJSON("nnet.json", function( data ) {
        handWaving.loadNet(data)
        $("#display").text("");
        loaded = true;
    })
}

function showGesture(gesture){
      $("#display").text(gestures[gesture]);
      $("body").css("background-color", "hsl(" +(gesture * 50)+",100%, 50%)");
  }

$(function(){
    var buf = [];
    $("#display").text("loading, please wait..");
    loadNN();
    window.ondevicemotion = function(e) {
        if (!window.loaded) return;
        var x = e.accelerationIncludingGravity.x;
        var y = e.accelerationIncludingGravity.y;
        var z = e.accelerationIncludingGravity.z;
        buf.push([x, y, z]);
        if(buf.length > windowSize){
                buf.shift();
                let features = handWaving.extractFeatures(buf, 1, 1);
                let gesture = handWaving.predict(features[0]);
                showGesture(parseInt(gesture));
        } else {
            $("#display").text(windowSize - buf.length);
        }
    }
});
