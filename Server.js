//Loading modules
var DB = require('./Database.js');
var session = require('express-session');
var bodyParser = require('body-parser');
var Lib = require('./Lib.js');
var fs = require('fs');
RoleArray = Lib.getRoleArray();
const express = require('express');
const app = express();

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

app.get('/Plant_Admin/*', function(req, res){
  Lib.CheckRole(req, res, RoleArray[0]);
});
app.get('/ERC_Admin/*', function(req, res){
  Lib.CheckRole(req, res, RoleArray[1]);
});
app.get('/Plant_Operator/*', function(req, res){
  Lib.CheckRole(req, res, RoleArray[2]);
});
app.get('/ERC_Services/*', function(req, res){
  Lib.CheckRole(req, res, RoleArray[3]);
});
app.get('/ERC_Additives/*', function(req, res){
  Lib.CheckRole(req, res, RoleArray[4]);
});
app.get('/ERC_Maintenance/*', function(req, res){
  Lib.CheckRole(req, res, RoleArray[5]);
});
app.get('/Picture/*', function(req, res){
  var URL = __dirname + '/HTML' + req.originalUrl;
  console.log("Requesting file : " + URL);
  if(fs.existsSync(URL)){
    res.sendFile(URL);
  }else{
    console.log("Error 404");
    res.sendStatus(404);
    res.end('404 : This Page doesn\'t exist');
  }
})


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

app.post('/Plant_Operator/PartHistory', function(req, res){
  // console.log("got post from history");
  // console.log(req.body);
  json = {};
  DB.getPartImplementedHistory(req.body.IdPartImplemented, function(err, Result){
    DB.getPartImplementedReviews(req.body.IdPartImplemented, function(err, Reviews){
        // console.log("Got Result : ");
        // console.log(Result);
        // console.log("got Reviews");
        // console.log(Reviews);
      if(Result == null){
        json = Reviews;
      }else if(Reviews == null){
        json = Result;
      }else{
        json = Lib.MergeAndOrderbyDate(Result, Reviews);
      }
      // console.log("Sending to client : ");
      // console.log(json);
      res.end(JSON.stringify(json));
    });
  })
});

app.post('/Plant_Operator/History', function(req, res){
    console.log("Got post in history");
    console.log(req.body);
})

app.post('/Plant_Operator/index', function(req, res){
  // console.log("User connected : " + JSON.stringify(req.session.user));
  DB.getPlantPartPreviewInfos(req.session.user.IdPlant, function(err, Result){
    // console.log("Got result : ");
    // console.log(Result);
    res.end(JSON.stringify(Result));
  })
});

app.post('/Plant_Operator/CreateOffer', function(req, res){
//   console.log("got post from create offer");
//   console.log(req.body);
  DB.createPartOffer(req.body.IdPartImplemented, req.body.OfferType, function(err, Result){
    // console.log("got result : ");
    // console.log(Result);
    res.end(JSON.stringify(Result));
  })
});

app.post('/Plant_Operator/CreateReview', function(req, res){
//   console.log("Got post from Create review");
//   console.log(req.body);
  DB.createPartReview(req.body.IdPartImplemented, req.body.ReviewType, req.body.ReviewDate, function(err, Result){
    // console.log("got result : ");
    // console.log(Result);
    res.end(JSON.stringify(Result));
  })
});

app.post('/')

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
});