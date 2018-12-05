var fs = require('fs');
var PartsOfferPath = "./../Orders/Parts/";
var RAOfferPath = "./../Orders/RA/";

var RoleArray = [ {Role:1, Link:"/Plant_Admin/"}, 
                {Role:2, Link:"/ERC_Admin/"},
                {Role:3, Link:"/Plant_Operator/"},
                {Role:4, Link:"/ERC_Service/"},
                {Role:5, Link:"/ERC_Additives/"},
                {Role:6, Link:"/ERC_Maintenance/"}
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
    if(sess.user != null && sess.user.Role == RoleArray.Role){
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

  SaveFile: function(err, res, json, files, s, DB){ 
    var isRA = false; 
    var OfferFolderPath, FileName;
    if(json.PartName !== undefined){
      isRA = true;
    }
    console.log("Got file : ");
    console.log(files);
    console.log("Got fields : ");
    console.log(json);
    DB.getPlantName(json.IdPlant, function(err ,Result){
      console.log("Got results : ");
      console.log(Result);
      if(isRA){
        OfferFolderPath = __dirname + '/HTML/Orders/RA/' + json.IdRA_Offer + '/';
        FileName = generateFileNameRA(s, json.IdRA_Offer, Result.PlantName, json.OfferDateStart, files[s].name) ;        
      }else{
        OfferFolderPath = __dirname + '/HTML/Orders/Parts/' + json.IdPart_Offer + '/';
        FileName = generateFileNameParts(s, json.IdPart_Offer, Result.PlantName, json.PartName, json.Location, files[s].name) ;
      }

      var newpath = OfferFolderPath + FileName;
      console.log("Creating folder : " + OfferFolderPath);
      mkdirSync(OfferFolderPath);
      console.log("Moving file to : " + newpath);
      fs.rename(files[s].path, newpath, function (err) {
        if (err) throw err; 
        console.log("Json.OfferState : " + json.OfferState);
        if(json.OfferState === StateToString[1]){
          DB.uploadOffer(json.IdPart_Offer, FileName, function(){
            res.write('File uploaded and moved!');
            res.end("Done");
          });
        }else if(json.OfferState === StateToString[2]){
          DB.uploadOrderFromClient(json.IdPart_Offer, FileName, isRA, function(){
            res.write('File uploaded and moved!');
            res.end("Done");
          });
        }else if(json.OfferState === StateToString[3]){
          console.log("Hi from Somewhere");
          DB.uploadOrderFromERC(json.IdPart_Offer, FileName, isRA, function(){
            res.write('File uploaded and moved!');
            res.end("Done");
          });
        }else{
          console.log("no good");
        }
      });
      // }else{
      //   var FileName = generateFileNameRA(s, json.IdRA_Offer, Result.PlantName, json.OfferDateStart, files[s].name) ;
      //   var newpath = OfferFolderPath + FileName;
      //   console.log("Creating folder : " + OfferFolderPath);
      //   mkdirSync(OfferFolderPath);
      //   console.log("Moving file to : " + newpath);
      //   fs.rename(files[s].path, newpath, function (err) {
      //     if (err) throw err; 
      //     console.log("Json.OfferState : " + json.OfferState);
      //     if(json.OfferState === StateToString[2]){
      //       DB.uploadOrderFromClient(json.IdPart_Offer, FileName, true, function(){
      //         res.write('File uploaded and moved!');
      //         res.end("Done");
      //       });
      //     }else if(json.OfferState === StateToString[3]){
      //       console.log("Hi from Somewhere");
      //       DB.uploadOrderFromERC(json.IdPart_Offer, FileName, true, function(){
      //         res.write('File uploaded and moved!');
      //         res.end("Done");
      //       });
      //     }else{
      //       console.log("no good");
      //     }
      //   });
      // }
    });
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
        // console.log("Got Result : ");
        // console.log(Result);
        // console.log("got Reviews");
        // console.log(Reviews);
        var json = MergeAndOrderbyDate(Result, Reviews);
        // console.log("Sending to client : ");
        // console.log(json);
        res.end(JSON.stringify(json));
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
  
  doTransformTypeAndStateToString: function(json){
    return TransformTypeAndStateToString(json);
  }
}

function TransformTypeAndStateToString(json){
  if(json.OfferType != null){
    json.DataType = "H";
    json.OfferDateStart = json.OfferDateStart.toString().substring(0, 15);
    if(json.Offer != null){
      json.Offer = PartsOfferPath + json.IdPart_Offer + '/' + json.Offer;
    }
    if(json.OrderFromClient != null){
      json.OrderFromClient = PartsOfferPath + json.IdPart_Offer + '/' + json.OrderFromClient;
    }
    if(json.OrderFromERC != null){
      json.OrderFromERC = PartsOfferPath + json.IdPart_Offer + '/' + json.OrderFromERC;
    }
    json.OfferType = TypeToString[json.OfferType];
    if(json.OfferState != null){
      json.OfferState = StateToString[json.OfferState];
    }
  }else if(json.ReviewType != null){
    json.DataType = "R";
    if(json.ReviewDate != null){
      json.ReviewDate = json.ReviewDate.toString().substring(0, 15);
    }
    if(json.ReviewType != null){
      json.ReviewType = TypeToString[json.ReviewType];
    }
  }
  return json;
}

function generateFileNameParts (sFileType, IDPart_Offer, PlantName, PartName, PartLocation, OriginalFileName){
  var DotIndex = OriginalFileName.lastIndexOf(".");
  return '' + IDPart_Offer + '_' + PlantName + '_' + PartName + '_' + PartLocation +  '_' + sFileType + OriginalFileName.substring(DotIndex);
}

function generateFileNameRA(sFileType, IDRA_Offer, PlantName, OfferDateStart, OriginalFileName){
  var DotIndex = OriginalFileName.lastIndexOf(".");
  return '' + IDRA_Offer + '_' + PlantName + '_' + OfferDateStart + '_' + sFileType + OriginalFileName.substring(DotIndex);
}

function mkdirSync (dirPath) {
  try {
    fs.mkdirSync(dirPath)
  } catch (err) {
    if (err.code !== 'EEXIST') throw err
  }
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