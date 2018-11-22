//Loading modules
var http = require('http');
var fs = require('fs');
var path = require('path');
var DB = require('./Database.js');

const express = require('express');
const app = express();
var bodyParser = require('body-parser');
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 
app.get('/*', function(req, res){
    res.sendFile(__dirname + '/HTML/index.html');
});

app.post('/',function(req,res){
    console.log("got post method");
    console.log(req.body.password);
    console.log(req.body.username);
      
});


app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
});