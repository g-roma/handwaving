let environment = flock.init();
let mappings={};
let synth;
let playing = false;
function stop(){
  environment.stop();
  playing = false;
}

function play(){
  environment = flock.init();
  let synthDef = JSON.parse(document.getElementById("synth").value);
  let mappingExpressions = document.getElementById("mapping").value.split(";");

  if(document.getElementById("mapping").value.trim()){
    for (let m in mappingExpressions){
      let expression = mappingExpressions[m].split("=");
      mappings[expression[0]] = expression[1];
    }
  }
  environment.start();
  synth = flock.synth({
    synthDef: synthDef,
    addToEnvironment: true
  });
  playing = true;
  return false;
}

window.ondevicemotion = function(e) {
    let x = e.accelerationIncludingGravity.x;
    let y = e.accelerationIncludingGravity.y;
    let z = e.accelerationIncludingGravity.z;
    if(playing){
      for (let m in mappings){
        synth.set(m,eval(mappings[m]));
      }
    }

};
