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
      console.log("Requesting PartImplementedHistory for id : " + req.body.IdPartImplemented);
      DB.getPartImplementedHistory(req.body.IdPartImplemented, function(err, Result){
        DB.getPartImplementedReviews(req.body.IdPartImplemented, function(err, Reviews){
          // console.log("Got Result : ");
          // console.log(Result);
          // console.log("got Reviews");
          // console.log(Reviews);
          var json = Lib.MergeAndOrderbyDate(Result, Reviews);
          // console.log("Sending to client : ");
          // console.log(json);
          res.end(JSON.stringify(json));
        });
      })
      break;

    case "/History":
      DB.getPlantHistoryOfferWithFiles(req.session.user.IdPlant, function(err, Result){
        DB.getPlantHistoryReview(req.session.user.IdPlant, function(err, Reviews){
          // console.log("Got Result : ");
          // console.log(Result);
          // console.log("got Reviews");
          // console.log(Reviews);
          var json = Lib.MergeAndOrderbyDate(Result, Reviews);
          console.log("Sending to client : ");
          console.log(json);
          res.end(JSON.stringify(json));
        });
      
      });
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
          res.end(JSON.stringify(Result));
        });
        break;
      
      case "/CreateReview":
        DB.createPartReview(req.body.IdPartImplemented, req.body.ReviewType, req.body.ReviewDate, function(err, Result){
        // console.log("got result : ");
        // console.log(Result);
        res.end(JSON.stringify(Result));
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
        console.log("Sending");
        console.log(Result);
        Result.forEach(r => {
          json.push(Lib.doTransformTypeAndStateToString(r));
       });
       console.log("Sending ");
       console.log(json);
       res.end(JSON.stringify(json));
      });
      break;

    case "/Offer":
      console.log(req.body);
      var form = new formidable.IncomingForm();
      form.parse(req, function (err, fields, files) {
        var IDpart_offer = 16;
        var PartName = 'PN';
        var PlantName = 'PLN';
        var PartLocation = 'Loc';
        console.log("Got file : ");
        console.log(files);
        console.log("Got fields");
        console.log(fields);
        var OfferFolderPath = __dirname + '/HTML/Orders/' + IDpart_offer + '/';
        var FileName = Lib.generateFileName( "Offer", IDpart_offer, PlantName, PartName, PartLocation, files.Offer.name) ;
        var newpath = OfferFolderPath + FileName;
        console.log("Creating folder : " + OfferFolderPath);
        Lib.mkdirSync(OfferFolderPath);
        console.log("Moving file to : " + newpath);
        fs.rename(files.Offer.path, newpath, function (err) {
          if (err) throw err;
          DB.uploadOffer(IDpart_offer, FileName, function(){
            res.write('File uploaded and moved!');
            res.end();
          });
        });
      });


      break;

  }
});

app.post('/ERC_Maintenance/*', function(req, res){
  var url = req.originalUrl.replace('/ERC_Maintenance', '');
  console.log("got post in " + req.originalUrl);
  switch(url){

  }
});

app.post('/ERC_Additiives/*', function(req, res){
  var url = req.originalUrl.replace('/ERC_Additiives', '');
  console.log("got post in " + req.originalUrl);
  switch(url){

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