var Recorder = function(){
    this.recording = false;
    this.recorded = [];
    this.button = $("#red_dot")[0];
    this.gestureClass = $("#gesture_class")[0].value;
    console.log(this.gestureClass);
};

Recorder.prototype = {
    init: function(){
        var obj = this;
        window.ondevicemotion = function(e) {
            var record = [
                e.accelerationIncludingGravity.x,
                e.accelerationIncludingGravity.y,
                e.accelerationIncludingGravity.z
            ];
            if(obj.recording){
                obj.recorded.push(record);
            }
        }
    },
    start: function(){
        this.button.classList.add("recording");
        $("#display").text("")
        this.recording = true;
    },
    stop: function(){
        console.log("recorded:", this.gestureClass);
        this.post();
        this.recorded = [];
        this.button.classList.remove("recording");
        this.recording = false;
    },
    post: function(){
        var obj = JSON.stringify({
            gesture: this.gestureClass,
            data: this.recorded
        });
        var postURL = "/gestures/"+this.gestureClass+"/new";
        $.ajax({
            url: postURL,
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({gesture:this.gestureClass, data:this.recorded}),
            success: function(){$("#display").text("saved")}
        });
    }
}

$(function(){
    var recorder = new Recorder();
    recorder.init();
    $("#recbutton").click(function(){
        if (recorder.recording){
            recorder.stop();
        }
        else{
            recorder.start();
        }
    });
});
