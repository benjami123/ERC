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

app.use( bodyParser.json());       // to support JSON-encoded bodies
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
  if(req.session.user.UserRole != null){
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
});

app.post('/Login',function(req,res){
  var sess = req.session;
  console.log("Username : " + req.body.username + ", Password : " + req.body.password);
  var opt = {"Login": req.body.username, "Password": req.body.password};
  DB.getUser(opt, function(err, user){
    if(user != undefined){
      sess.user = user;
      switch(user.UserRole){
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

app.post('/Logout', function(req, res){
  if (req.session) {
    req.session.destroy(function(err) {
      if(err) {
        return next(err);
      } else {
        return res.redirect('/');
      }
    });
  }

})

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

    case"/CreateRAOffer":
      var form = new formidable.IncomingForm();
      form.parse(req, function(err, fields, files){
        var json = JSON.parse(fields.Data);
        console.log("Got file : ");
        console.log(files);
        console.log("Got fields : ");
        console.log(json);
        json.IdPlant = req.session.user.IdPlant;
        json.CreatorLogin = req.session.user.Login;
        Lib.ComputeRAQuantityAndPrice(json.IdPlant, DB, function(TotalQuantity, TotalPrice){
          DB.getPlantName(json.IdPlant, function(PlantName){
            Lib.CreateRAOffer(json, files, PlantName, TotalQuantity, TotalPrice, DB, function(){
              res.end("Done !");
            });
          })    
        });
      });
      break;

    case "/GetRALevel":
      DB.getRAInfos(req.session.user.IdPlant, function(err, Result){
        console.log("Got result : ");
        console.log(Result);
        res.end(JSON.stringify(Result));
      });
      break;

    case "/PartHistory":
      Lib.SendPartHistory(res, req.body.IdPartImplemented, DB);
      break;

    case "/History":
      Lib.SendPlantHistory(res, req.session.user.IdPlant, false, DB);
      break;
    
    case "/RAHistory":
      DB.getPlantHistoryRA(req.session.user.IdPlant, true, function(err, Result){
          // console.log("Sending ");
          // console.log(json);
          res.end(JSON.stringify(json));
      });
      break;

      case "/GetOffers":
        DB.getPlantOffer(req.session.user.IdPlant, function(err, Result){
          var json = [];
          Result.forEach(r => {
             json.push(Lib.doTransformTypeAndStateToString(r));
          });
          // console.log("Sending ");
          // console.log(json);
          res.end(JSON.stringify(json));
        });
        break;

      case "/CreateOffer":
        var opt = {"IdPartImplemented" : req.body.IdPartImplemented, "OfferType" : req.body.OfferType, "CreatorLogin" : req.session.user.Login, };
        DB.createPartOffer(opt, function(err, Result){
          // console.log("got result : ");
          // console.log(Result);
          res.end("Request sent");
        });
        break;
      
      case "/CreateReview":
        var opt = {"IdPartImplemented" : req.body.IdPartImplemented, "ReviewType" : req.body.ReviewType, "ReviewDate" : req.body.ReviewDate, "CreatorLogin" : req.body.user.Login};
        DB.createPartReview(opt, function(err, Result){
          // console.log("got result : ");
          // console.log(Result);
          res.end("Request sent");
        });
        break;

      case "/Order":
        var form = new formidable.IncomingForm();
        form.parse(req, function(err, fields, files){
          var json = JSON.parse(fields.Data);
          console.log("Got file : ");
          console.log(files);
          console.log("Got fields : ");
          console.log(json);
          DB.getPlantName(req.session.user.IdPlant, function(PlantName){
            console.log("PlantName : " + PlantName);
            Lib.SaveFile(json, files, PlantName,"OrderFromClient", function(FileName){
              DB.uploadOrderFromClient(json.IdPart_Offer, FileName, false, function(){
                res.end("Done");
              });
            });
          });
        });
        break;
      
      case "/CancelOffer":
        DB.changePartOfferStateToRefused(req.body.Data.IdPart_Offer, false, function(err, Results){
          res.end();
        });
        break;
  }
});

app.post('/Plant_Admin/*', function(req, res){
  var url = req.originalUrl.replace('/Plant_Admin', '');
  console.log("got post in " + req.originalUrl);
  switch(url){
    case "/index":
      DB.getUserWithRole(req.session.user.IdPlant, 3, function(err, Result){ //Get all operator from current plant
        console.log("Sending ");
        console.log(Result);
        res.end(JSON.stringify(Result));
      });
      break;

    case "/RemoveUser":
      console.log("Removing user : ");
      console.log(req.body);
      DB.removeUser(req.body.IdUser, function(err, Result){
       res.end(JSON.stringify({})); 
      })
      break;

    case "/AddUser":
      var UserPassword = Lib.GeneratePassword();
      var opt = {"IdPlant" : req.session.user.IdPlant, "Login" : req.body.Login, "Email" : req.body.Email, "Password" : UserPassword, "Role" : 3};
      DB.createUser(opt, function(err, Results){
        console.log("Got results : ");
        console.log(Results);
        if(Results){
          Lib.SendEmail(UserLogin, UserEmail, UserPassword);
          res.end("User Added !");
        }else{
          res.end("User already exists !");
        }
      });
      break;

    case "/GetPlantPart":
      DB.getPlantPartPreviewInfos(req.session.user.IdPlant, function(err, PartsInfo){
        console.log("Got results : ");
        console.log(PartsInfo);
        res.end(JSON.stringify(PartsInfo));
      });
      break;

    case "/GetSupplierPart":
      DB.getSupplierPart(function(err, PartsInfo){
        console.log("Got results : ");
        console.log(PartsInfo);
        res.end(JSON.stringify(PartsInfo));
      });
      break;

    case "/AddPart":
      console.log("Adding partimplemented : ");
      console.log(req.body.Values);
      var array = [];
      for(var i=0; i< req.body.Values.length; i++){
        array[i] = [];
        array[i].push(req.session.user.IdPlant);
        array[i].push(req.body.Values[i].IdPart);
        array[i].push(1);
        array[i].push(req.body.Values[i].Location);
        console.log(array[i]);
      }
      console.log(array);
      DB.createPartImplemented(array, function(err, Result){
        res.end("Done !");
      });
      break;

    case "/RemovePart":
      console.log("Got body : ");
      console.log(req.body);
      console.log("Deleting partimplemented : ");
      console.log(req.body.ArrayIdPartImplemented);
      if(req.body.ArrayIdPartImplemented !== undefined){
        DB.removePartImplemented(req.body.ArrayIdPartImplemented, function(err, Result){
          res.end("Done !");
        });
      }else{
        res.end("Not done");
      }
      break;
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

    case"/GetOrders":
      DB.getOrdersRequest(function(err, Result){
        // console.log("Sending");
        // console.log(Result);        
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
        var json = JSON.parse(fields.Data);
        console.log("Got files : ");
        console.log(files);
        console.log("Got Data : ");
        console.log(json);
        DB.getPlantName(json.IdPlant, function(PlantName){
          Lib.SaveFile(json, files, PlantName, "OrderFromERC", function(FileName){
            DB.uploadOrderFromERC(json.IdPart_Offer, FileName, false, function(){
              res.end("Done !");
            });
          });
        });
      });
      break;
    
    case "/CreateOffer":
      var form = new formidable.IncomingForm();
        
      form.parse(req, function(err,fields, files){
        var json = JSON.parse(fields.Data);
        if(files.lenght != 0){
          DB.getLastIndexOfLastAddedLine_Offer(false, function(err, IdPart_Offer){
            json.IdPart_Offer = IdPart_Offer;
            var StateToString = Lib.getStateToString();
            json.OfferState = StateToString[1];
            Lib.SaveFile(json, files, json.PlantName, "OfferFromERC", function(FileName){
              var opt={"IdPartImplemented" : json.IdPartImplemented,"OfferType" : json.OfferType, "CreatorLogin" : req.session.Login, "Offer" : FileName};
              DB.createPartOffer(opt, function(err, Result){
                res.end("Done !");
              })
            });
          });
        }else{
          res.end("No file uploaded")
        }
      });
      break;
    
    case "/Offer":
      var form = new formidable.IncomingForm();
        
      form.parse(req, function(err,fields, files){
        var json = JSON.parse(fields.Data);
        if(files.lenght != 0){
          Lib.SaveFile(json, files, json.PlantName,"OfferFromERC", function(FileName){
            DB.uploadOffer(json.IdPart_Offer, FileName, function(){
              res.end("Done");
            });
          });
        }else{
          res.end("No file uploaded");
        }
      });
      break;

    case "/CancelOffer":
      DB.changePartOfferStateToRefused(req.body.IdPart_Offer, false, function(err, Results){
        res.end();
      })
      break;

    case "/GetPlants":
      DB.getPlants(function(err, Result){
        res.end(JSON.stringify(Result));
      });
      break;

    case "/GetPlantHistory":
      Lib.SendPlantHistory(res, req.body.IdPlant, false, DB);
      break;

    case"/GetPlantPart":
      var json = req.body;
      DB.getPlantPartPreviewInfos(json.IdPlant, function(err, Results){
        // console.log("Sending");
        // console.log(Results);        
        var json = [];
        Results.forEach(r => {
          json.push(Lib.doTransformTypeAndStateToString(r));
        });
        res.end(JSON.stringify(json));
      });
      break;

    case "/PartDescription":
      Lib.SendPartHistory(res, req.body.IdPartImplemented, DB);
      break;

    case "/PartHistory":
      Lib.SendPartHistory(res, req.body.IdPartImplemented, DB);
      break;
  }
});

app.post('/ERC_Maintenance/*', function(req, res){
  var url = req.originalUrl.replace('/ERC_Maintenance', '');
  console.log("got post in " + req.originalUrl);
  switch(url){
    case "/GetPlants":
      DB.getPlants(function(err, Result){
        res.end(JSON.stringify(Result));
      });
      break;
    
    case "/GetPlantPart":
      DB.getPlantPartPreviewInfos(req.body.IdPlant, function(err, Result){
        res.end(JSON.stringify(Result));
      });
      break;
      
    case "/GetHistory":
      console.log("Got IdPlant : " + req.body.IdPlant);
      if(req.body.IdPlant != null){
        Lib.SendPlantHistory(res, req.body.IdPlant, false, DB);
      }else{
        console.log("No IdPlant given");
        res.end("No IdPlant given");
      }
      break;
      
    case "/CreateReview":
    var json = [];
    var MyArray = req.body.Data;
    var UserLogin = req.session.user.Login;
    console.log("Creating review : ");
    for(var i=0; i<MyArray.length; i++){
      json[i] = [];
      json[i][0] = MyArray[i].ReviewType;
      json[i][1] = MyArray[i].IdPartImplemented;
      json[i][2] = UserLogin;
    }
    console.log(json);
    if(json != null){
      DB.CreateReviews(json, function(err, Result){
        console.log("Done !");
        res.end("Done !");
      });
      break;
    }else{
      console.log("No values given");
      res.end("No values given")
    }
  }
});

app.post('/ERC_Additives/*', function(req, res){
  var url = req.originalUrl.replace('/ERC_Additives', '');
  console.log("got post in " + req.originalUrl);
  switch(url){
    case "/index":
      DB.getRAOffersRequest(function(err, Result){
        console.log("Sending ");
        console.log(Result);
        var json = [];
        Result.forEach(r => {
           json.push(Lib.doTransformTypeAndStateToString(r));
        });
        res.end(JSON.stringify(json));
      })
      break;
    
    case "/GetCustomers":
      
      break;

    case"/ConfirmationOrder":
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files){
      console.log("Got files : ");
      console.log(files);
      console.log("Got fields : ");
      console.log(fields);
      var json = JSON.parse(fields.Data);
      DB.getPlantName(json.IdPlant, function(PlantName){
        Lib.SaveFile(json, files, PlantName, "OrderFromERC", function(FileName){
          DB.uploadOrderFromERC(json.IdRA_Offer, FileName, true, function(err, Result){
            res.end("Done !");
          });
        });
      });
    });
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
  console.log('listening on port 3000!');
});