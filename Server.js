//Loading modules
var DB = require('./Database.js');
var session = require('express-session');
var bodyParser = require('body-parser');
var formidable = require('formidable'); 
const express = require('express');
const app = express();
var Lib = require('./Lib.js');
var fs = require('fs');
RoleArray = Lib.getRoleArray();

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
app.get('/ERC_Service/*', function(req, res){
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
});
app.get('/Orders/*', function(req, res){
  if(req.session.user.Role != null){
    var URL = __dirname + '/HTML' + req.originalUrl;
    console.log("Requesting file : " + URL);
    if(fs.existsSync(URL)){
      res.sendFile(URL);
    }else{
      console.log("Error 404");
      res.sendStatus(404);
      res.end('404 : This Page doesn\'t exist');
    }
}else{
  res.end('404');
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
          json.Redirection = "/ERC_Service/index.html"
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
      console.log("Wrong password/username")
      res.end("Wrong password/Username");
    }
  });
});

app.post('/Plant_Operator/*', function(req, res){
  var url = req.originalUrl.replace('/Plant_Operator', '');
  console.log("got post in " + req.originalUrl);
  // console.log(req.body);
  switch(url){
    case "/index":
      DB.getPlantPartPreviewInfos(req.session.user.IdPlant, function(err, Result){
        // console.log("Got result : ");
        // console.log(Result);
        res.end(JSON.stringify(Result));
      });
      break;

    case "/PartHistory":
      Lib.SendPartHistory(res, req.body.IdPartImplemented, DB);
      break;

    case "/History":
      Lib.SendPlantHistory(res, req.session.user.IdPlant, DB);
      break;

      case "/GetOffers":
        DB.getPlantOffer(req.session.user.IdPlant, function(err, Result){
          var json = [];
          Result.forEach(r => {
             json.push(Lib.doTransformTypeAndStateToString(r));
          });
          console.log("Sending ");
          console.log(json);
          res.end(JSON.stringify(json));
        });
        break;

      case "/CreateOffer":
        DB.createPartOffer(req.body.IdPartImplemented, req.body.OfferType, function(err, Result){
          // console.log("got result : ");
          // console.log(Result);
          res.end("Request sent");
        });
        break;
      
      case "/CreateReview":
        DB.createPartReview(req.body.IdPartImplemented, req.body.ReviewType, req.body.ReviewDate, function(err, Result){
          // console.log("got result : ");
          // console.log(Result);
          res.end("Request sent");
        });
        break;

      case "/Order":
        var form = new formidable.IncomingForm();
        form.parse(req, function(err, fields, files){
          var json = JSON.parse(fields.Data);
          json.IdPlant = req.session.user.IdPlant;
          Lib.SaveFile(err, res, json, files, "OrderFromClient", DB)
        });
        break;
      
      case "/CancelOffer":
        DB.changePartOfferStateToRefused(req.body.Data.IdPart_Offer ,function(err, Results){
          res.end();
        });
        break;
  }
});

app.post('/Plant_Admin/*', function(req, res){
  var url = req.originalUrl.replace('/Plant_Admin', '');
  console.log("got post in " + req.originalUrl);
  switch(url){

  }
});

app.post('/ERC_Service/*', function(req, res){
  var url = req.originalUrl.replace('/ERC_Service', '');
  console.log("got post in " + req.originalUrl);
  switch(url){
    case "/index":
      var json = [];
      DB.getOffersRequest(function(err, Result){
        Result.forEach(r => {
          json.push(Lib.doTransformTypeAndStateToString(r));
       });
       console.log("Sending ");
       console.log(json);
       res.end(JSON.stringify(json));
      });
      break;

    case "/Offer":
      var form = new formidable.IncomingForm();
      
      form.parse(req, function(err,fields, files){
        Lib.SaveFile(err, res, JSON.parse(fields.Data), files, "Offer", DB)
      });
      break;

    case"/GetOrders":
      DB.getOrdersRequest(function(err, Result){
        console.log("Sending");
        console.log(Result);        
        var json = [];
        Result.forEach(r => {
          json.push(Lib.doTransformTypeAndStateToString(r));
        });
        res.end(JSON.stringify(json));
      })
      break;

    case "/Order":
      var form = new formidable.IncomingForm();
      form.parse(req, function (err, fields, files) {
        Lib.SaveFile(err, res, JSON.parse(fields.Data), files, "OrderFromERC", DB)
      });
      break;

    case "/CancelOffer":
      DB.changePartOfferStateToRefused(req.body.IdPart_Offer ,function(err, Results){
        res.end();
      })
      break;

    case "/GetPlants":
      DB.getPlants(function(err, Result){
        res.end(JSON.stringify(Result));
      });
      break;

    case "/GetPlantHistory":
      Lib.SendPlantHistory(res, req.body.IdPlant,DB);
      break;

    case "/PartDescription":
      Lib.SendPartHistory(res, req.body.IdPartImplemented, DB);
      break;
  }
});

app.post('/ERC_Maintenance/*', function(req, res){
  var url = req.originalUrl.replace('/ERC_Maintenance', '');
  console.log("got post in " + req.originalUrl);
  switch(url){
    case "/index":
      DB.CreateReviews(Values, function(err, Result){
        res.end("Done !");
      });
      break;
  }
});

app.post('/ERC_Additiives/*', function(req, res){
  var url = req.originalUrl.replace('/ERC_Additiives', '');
  console.log("got post in " + req.originalUrl);
  switch(url){
    case "/index":
      DB.getRAOffersRequest(function(err, Result){
        console.log("Sending ");
        console.log(Result);
        res.end(JSON.stringify(Result));
      })
      break;
  }
});

app.post('/ERC_Admin/*', function(req, res){
  var url = req.originalUrl.replace('/ERC_Admin', '');
  console.log("got post in " + req.originalUrl);
  switch(url){

  }
});


app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
});