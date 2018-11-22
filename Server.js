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
app.get('/', function(req, res){
  res.sendFile(__dirname + '/HTML/index.html');
});
app.get('/HTML/Plant_Operator/*', function(req, res){
  res.sendFile(__dirname + "/HTML/Plant_Operator/index.html")
})

app.post('/*',function(req,res){
  console.log("got post method");
  console.log(req.params[0]);
  req = JSON.parse(req.params[0]);
  console.log("Username : " + req.username + ", Password : " + req.password);
  DB.getUser(req.username, req.password, function(err, rows){
    console.log(rows);
    if(rows != undefined){
      switch(rows.Role){
        case 1 : var json = {};
          json.Redirection = __dirname + "/HTML/Plant_Operator/index.html"
          res.end(JSON.stringify(json));
          break;

        case 2 : var json = {};
          json.Redirection = __dirname + "/HTML/ERC_Services/index.html"
          res.end(JSON.stringify(json));
          break;

        case 3 : var json = {};
          json.Redirection = __dirname + "/HTML/ERC_Additives/index.html"
          res.end(JSON.stringify(json));
          break;

        case 4 : var json = {};
          json.Redirection = __dirname + "/HTML/ERC_Maintenance/index.html"
          res.end(JSON.stringify(json));
          break;

        default:
          res.end(JSON.stringify(rows));
          break;
      }
    }else{
      res.end("Wrong password/Username");
    }
  });
});


app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
});