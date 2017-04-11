const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser');
const uuid = require('uuid');

let app = express();

app.use(bodyParser.json({limit: '50mb'}));
app.use(express.static('public'));

app.set('view engine', 'pug');

app.get('/', function (req, res) {
      res.redirect("/gestures");
});

app.get("/gestures", (req, res) => {
      let files = fs.readdirSync("data");
      res.render('gestures', {gestures:files});
});

app.get("/gestures/new", (req, res) =>{
      res.render('new_gesture');
});

app.get("/gestures/create", (req, res) =>{
      fs.mkdirSync("data/" + req.query.name);
      res.redirect("/gestures");
});

app.get("/gestures/:class/delete", (req, res) =>{
      if (req.params.class !="_deleted"){
        let srcPath = "data/" + req.params.class;
        let destPath = "data/_deleted/" + req.params.class;
        fs.renameSync(srcPath, destPath);
      }
      res.redirect("/gestures");
});

app.get("/gestures/:class", (req, res) => {
      let files = fs.readdirSync("data/" + req.params.class);
      res.render('gesture', { recorded: files, gestureClass:req.params.class});
});


app.get("/gestures/:class/new", (req, res) =>{
      res.render('recorder', {gestureClass:req.params.class});
});


app.post("/gestures/:class/new", (req, res) => {
    let destPath = "data/"+req.params.class+"/";
    destPath += String(uuid.v1())+".json"
    fs.writeFileSync(destPath, JSON.stringify(req.body));
    res.send('OK');
});

app.get("/gestures/:class/:recording/vis", (req, res) =>{
    res.render('display', { file: req.params.recording});
});


app.get("/gestures/:class/:recording", function(req, res){
    let path = "data/" + req.params.class + "/" + req.params.recording;
    let json = fs.readFileSync(path);
    res.send(json);
});


app.get("/sounds/:class", (req, res) =>{
      let soundPath = "data/" + req.params.class + "/sound.json";
      let synth = req.query.synth;
      let mapping = req.query.mapping;
      let sound = {};
      if(fs.existsSync(soundPath)){
        sound = JSON.parse(fs.readFileSync(soundPath));
      }
      if(synth){
        sound.synth = synth;
      }
      if(mapping){
        sound.mapping = mapping;

      }
      if(synth || mapping){
        fs.writeFile(soundPath, JSON.stringify(sound));
      }
      res.render('sound', {gestureClass:req.params.class, synth:sound.synth, mapping:sound.mapping});
});


var server = app.listen(3000, function () {
      var host = server.address().address;
      var port = server.address().port;
      console.log('Example app listening at http://%s:%s', host, port);
});
