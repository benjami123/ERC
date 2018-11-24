//Loading modules
var DB = require('./Database.js');
var session = require('express-session');
var bodyParser = require('body-parser');
const express = require('express');
const app = express();

var RoleArray = [ {Role:1, Link:"/HTML/Plant_Admin/index.html"}, 
                {Role:2, Link:"/HTML/ERC_Admin/index.html"},
                {Role:3, Link:"/HTML/Plant_Operator/index.html"},
                {Role:4, Link:"/HTML/ERC_Services/index.html"},
                {Role:5, Link:"/HTML/ERC_Additives/index.html"},
                {Role:6, Link:"/HTML/ERC_Maintenance/index.html"}
              ];

app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true
}));


app.get('/', function(req, res){
  res.sendFile(__dirname + '/HTML/index.html');
});

function CheckRole(req, res, RoleArray){
  var sess = req.session;
  // console.log("Session : ");
  // console.log(sess);
  if(sess.user != null && sess.user.Role == RoleArray.Role){
    res.sendFile(__dirname + RoleArray.Link);
  }else{
    res.redirect("/");
  }
}

app.get('/Plant_Admin/*', function(req, res){
  CheckRole(req, res, RoleArray[0]);
});
app.get('/ERC_Admin/*', function(req, res){
  CheckRole(req, res, RoleArray[1]);
});
app.get('/Plant_Operator/*', function(req, res){
  CheckRole(req, res, RoleArray[2]);
});
app.get('/ERC_Services/*', function(req, res){
  CheckRole(req, res, RoleArray[3]);
});
app.get('/ERC_Additives/*', function(req, res){
  CheckRole(req, res, RoleArray[4]);
});
app.get('/ERC_Maintenance/*', function(req, res){
  CheckRole(req, res, RoleArray[5]);
});

app.post('/Login',function(req,res){
  var sess = req.session;
  console.log("Username : " + req.body.username + ", Password : " + req.body.password);
  DB.getUser(req.body.username, req.body.password, function(err, user){
    if(user != undefined){
      sess.user = user;
      switch(user.Role){
        case 1 : var json = {};
          json.Redirection ="/Plant_Admin/index.html"
          res.end(JSON.stringify(json));
          break;

        case 2 : var json = {};
          json.Redirection ="/ERC_Admin/index.html"
          res.end(JSON.stringify(json));
          break;

        case 3 : var json = {};
          json.Redirection ="/Plant_Operator/index.html"
          res.end(JSON.stringify(json));
          break;

        case 4 : var json = {};
          json.Redirection = "/ERC_Services/index.html"
          res.end(JSON.stringify(json));
          break;

        case 5 : var json = {};
          json.Redirection = "/ERC_Additives/index.html"
          res.end(JSON.stringify(json));
          break;

        case 6 : var json = {};
          json.Redirection = "/ERC_Maintenance/index.html"
          res.end(JSON.stringify(json));
          break;
      }
    }else{
      res.end("Wrong password/Username");
    }
  });
});

app.post('/Plant_Operator/index', function(req, res){
  console.log("User connected : " + JSON.stringify(req.session.user));
  DB.getPlantPartPreviewInfos(req.session.user.IdPlant, function(err, Result){
    console.log("Got result : ");
    console.log(Result);
    res.end(JSON.stringify(Result));
  })
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
});