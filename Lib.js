var fs = require('fs');
var PartsOfferPath = "./../Orders/Parts/";
var RAOfferPath = "./../Orders/RA/";

var RoleArray = [ {UserRole:1, Link:"/Plant_Admin/"}, 
                {UserRole:2, Link:"/ERC_Admin/"},
                {UserRole:3, Link:"/Plant_Operator/"},
                {UserRole:4, Link:"/ERC_Service/"},
                {UserRole:5, Link:"/ERC_Additives/"},
                {UserRole:6, Link:"/ERC_Maintenance/"}
              ];

var StateToString = [
  "",
  "Waiting for offer from ERC",
  "Waiting for order from Customer",
  "Waiting for order from ERC", 
  "Accepted",
  "Delivered", 
  "Refused" 
];

var TypeToString = [
  "",
  "Replace with service",
  "Replace without service",
  "Check",
  "Repair"
];

module.exports={
  CheckRole: function(req, res, RoleArray){
    var URL = req.originalUrl;
    URL = URL.replace(RoleArray.Link, '');
    console.log("Request from : " + URL);
    var sess = req.session;
    if(sess.user != null && sess.user.UserRole == RoleArray.UserRole){
      URL = __dirname + '/HTML'+RoleArray.Link + URL;
      console.log("Requesting file : " + URL);
      if(fs.existsSync(URL)){
        res.sendFile(URL);
      }else{
        console.log("Error 404");
        res.sendStatus(404);
        res.end('404 : This Page doesn\'t exist');
      }
    }else{
      res.redirect("/");
    }
  },
  
  ComputeRAQuantityAndPrice: function(IDPlant, DB, callback){
    DB.getRAPricesAndLevel(IDPlant, function(err, Result){
      var TotalQuantity = 0;
      var TotalPrice = 0;
      for(var i=0; i<Result.length; i++){
        var diff = (Result[i].TotalCapacityInL - Result[i].LevelOfRAInL);
        TotalQuantity += diff;
        TotalPrice += Result[i].PricePerL * diff;
      }
      callback(TotalQuantity, TotalPrice);
    });
  },
  
  CreateRAOffer: function(json, files, PlantName, TotalQuantity, TotalPrice, DB, callback){
    DB.getLastIndexOfLastAddedLine_Offer(true, function(err, IdRA_Offer){
      json.IdRA_Offer = IdRA_Offer + 1;
      json.OfferDateStart = getCurrentDate();
      console.log("Got files : ");
      console.log(files);
      SaveFile(json, files, PlantName, "OrderFromClient", function(FileName){
        var opt = {"IdPlant" : json.IdPlant, "QuantityInL" : TotalQuantity, "Price" : TotalPrice,"FileOrderFromClientName" : FileName, "OfferState" : 2, "IdUser":json.IdUser}
        DB.createRAOffer(opt, function(err, Result){
          callback();
        });
      });
    });
  },

  SaveFile: function(json, files, PlantName, s, callback){
    SaveFile(json, files, PlantName, s, callback);
  },

  SendPartHistory: function(res, IdPartImplemented, DB){
    // console.log("Requesting PartImplementedHistory for id : " + IdPartImplemented);
    DB.getPartImplementedHistory(IdPartImplemented, function(err, Result){
      DB.getPartImplementedReviews(IdPartImplemented, function(err, Reviews){
        // console.log("Got Result : ");
        // console.log(Result);
        // console.log("got Reviews");
        // console.log(Reviews);
        var json = MergeAndOrderbyDate(Result, Reviews);
        // console.log("Sending to client : ");
        // console.log(json);
        res.end(JSON.stringify(json));
      });
    })
  },

  SendPlantHistory: function(res, IdPlant, DB){
    DB.getPlantHistoryOffer(IdPlant, true, function(err, Result){
      DB.getPlantHistoryReview(IdPlant, function(err, Reviews){
        DB.getPlantHistoryRA(IdPlant, true, function(err, RAOffer){
          console.log("Got Result : ");
          console.log(Result);
          console.log("got Reviews");
          console.log(Reviews);
          console.log("Got RAOffer : ");
          console.log(RAOffer);
          var json = MergeAndOrderbyDate(Result, Reviews);
          json = MergeAndOrderbyDate(json, RAOffer);
          console.log("Sending to client : ");
          console.log(json);
          res.end(JSON.stringify(json));
        })
      });
    
    });
  },

  GeneratePassword: function() {
    var pw = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  
    for (var i = 0; i < 5; i++)
      pw += possible.charAt(Math.floor(Math.random() * possible.length));
  
    return pw;
  },

  SendEmail: function(Login, Email, Password){
    console.log("Sending email to " + Email + " with Login : " + Login + ", Password : " + Password);
  },

  getRoleArray: function(){
      return RoleArray;
  }, 

  getStateToString: function(){
    return StateToString;
  },
  
  doTransformTypeAndStateToString: function(json){
    return TransformTypeAndStateToString(json);
  }
}

function TransformTypeAndStateToString(json){
  if(json.OfferType != null){
    json.DataType = "H";
    json.OfferDateStart = json.OfferDateStart.toString().substring(0, 15);
    if((json.Offer != null) && (!json.Offer.includes("/Orders/"))) {
      json.Offer = PartsOfferPath + json.IdPart_Offer + '/' + json.Offer;
    }
    if((json.OrderFromClient != null) && (!json.OrderFromClient.includes("/Orders/"))){
      json.OrderFromClient = PartsOfferPath + json.IdPart_Offer + '/' + json.OrderFromClient;
    }
    if((json.OrderFromERC != null) && (!json.OrderFromERC.includes("/Orders/"))){
      json.OrderFromERC = PartsOfferPath + json.IdPart_Offer + '/' + json.OrderFromERC;
    }
    if(typeof json.OfferType === 'number'){
      json.OfferType = TypeToString[json.OfferType];
    }
    if(typeof json.OfferState === 'number'){
      json.OfferState = StateToString[json.OfferState];
    }
  }else if(json.ReviewType != null){
    json.DataType = "R";
    if(json.ReviewDate != null){
      json.ReviewDate = json.ReviewDate.toString().substring(0, 15);
    }
    if(typeof json.ReviewType === 'number'){
      json.ReviewType = TypeToString[json.ReviewType];
    }
  }else if(json.QuantityInL != null){
    json.DataType = "A";
    json.OfferDateStart = json.OfferDateStart.toString().substring(0, 15);
    if(json.OfferState ==='number'){
      json.OfferState = StateToString[json.OfferState];
    }
    if((json.OrderFromClient != null) && (!json.OrderFromClient.includes("/Orders/"))){
      json.OrderFromClient = RAOfferPath + json.IdRA_Offer + '/' + json.OrderFromClient;
    }
    if((json.OrderFromERC != null) && (!json.OrderFromERC.includes("/Orders/"))){
      json.OrderFromERC = RAOfferPath + json.IdRA_Offer + '/' + json.OrderFromERC;
    }
  }
  return json;
}

function generateFileName(json, PlantName, OriginalFileName, s,  callback){
  var FileNameUpdated, OfferFolderPath;
  if((json.IdRA_Offer != null) && (json.OfferDateStart != null)){
    OfferFolderPath = __dirname + '/HTML/Orders/RA/' + json.IdRA_Offer + '/';
    FileNameUpdated = generateFileNameRA(json.IdRA_Offer, PlantName, json.OfferDateStart, OriginalFileName, s) ;    
  }else if((json.IdPart_Offer != null) && (json.PartName != null) && (json.Location != null)){
    OfferFolderPath = __dirname + '/HTML/Orders/Parts/' + json.IdPart_Offer + '/';
    FileNameUpdated = generateFileNameParts(json.IdPart_Offer, PlantName, json.PartName, json.Location, OriginalFileName, s) ;
  }
  callback(FileNameUpdated, OfferFolderPath);
}

function generateFileNameRA(IDRA_Offer, PlantName, OfferDateStart, OriginalFileName, sFileType){
  var DotIndex = OriginalFileName.lastIndexOf(".");
  return '' + IDRA_Offer + '_' + PlantName + '_' + OfferDateStart + '_' + sFileType + OriginalFileName.substring(DotIndex);
}

function generateFileNameParts (IDPart_Offer, PlantName, PartName, PartLocation, OriginalFileName, sFileType){
  var DotIndex = OriginalFileName.lastIndexOf(".");
  return '' + IDPart_Offer + '_' + PlantName + '_' + PartName + '_' + PartLocation +  '_' + sFileType + OriginalFileName.substring(DotIndex);
}

function mkdirSync (dirPath) {
  try {
    if(!fs.existsSync(dirPath)){
      fs.mkdirSync(dirPath)
    }
  } catch (err) {
    if (err.code !== 'EEXIST') throw err
  }
}

function SaveFile(json, files, PlantName, s, callback){
  generateFileName(json, PlantName, files[s].name, s, function(FileName, OfferFolderPath){
    var newpath = OfferFolderPath + FileName;
    console.log("Creating folder : " + OfferFolderPath);
    mkdirSync(OfferFolderPath);
    console.log("Moving file to : " + newpath);
    fs.rename(files[s].path, newpath, function (err) {
      if (err) throw err;
      callback(FileName);
    });
  });
}

function getCurrentDate(){
  return new Date().toISOString().substring(0,10);
}

function MergeAndOrderbyDate(history, review){
  var Merged = [];
  var iIndexHistory = 0;
  var iIndexReview = 0;
  var SizeOfMergedArray = history.length + review.length;
  if((history.length == 0) && (review.length == 0)){
    Merged = null;
  }else if(history.length == 0){
    for(var i=0; i<review.length; i++){
      Merged[i] = TransformTypeAndStateToString(review[i]);
    }
  }else if(review.length == 0){
    for(var i=0; i<history.length; i++){
      Merged[i] = TransformTypeAndStateToString(history[i]);
    }
  }else{
    for(var i=0; i<SizeOfMergedArray; i++){
      if(history[iIndexHistory].OfferDateStart > review[iIndexReview].ReviewDate){
        Merged[i] = TransformTypeAndStateToString(history[iIndexHistory]);
        iIndexHistory++;
      }else{
        Merged[i] = TransformTypeAndStateToString(review[iIndexReview]);
        iIndexReview++;
      }
      
      if(iIndexHistory == history.length){
        for(var j=iIndexReview; j<review.length; j++){
          i++;
          Merged[i] = TransformTypeAndStateToString(review[j]);
        }
        break;
      }
      if(iIndexReview == review.length){
        for(var j=iIndexHistory; j<history.length; j++){
          i++;
          Merged[i] = TransformTypeAndStateToString(history[j]);
        }
        break;
      }
    }
  }
  return Merged;
}