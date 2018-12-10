var fs = require('fs');
var nodemailer = require('nodemailer');

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

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'youremail@gmail.com',
    pass: 'yourpassword'
  }
});

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
  
  ComputeRAQuantityAndPrice: function(IDPlant, DB, callback){   //Compute the total price of RA missing in the plant IDPlant
    DB.getRAPricesAndLevel(IDPlant, function(err, Result){
      var TotalQuantity = 0;
      var TotalPrice = 0;
      for(var i=0; i<Result.length; i++){                       //For the number of tank in the plant
        var diff = (Result[i].TotalCapacityInL - Result[i].LevelOfRAInL); //Compute the missing volume
        TotalQuantity += diff;                                  //Update the total Quantity 
        TotalPrice += Result[i].PricePerL * diff;               //Update the total price
      }
      callback(TotalQuantity, TotalPrice);
    });
  },
  
  CreateRAOffer: function(json, files, PlantName, TotalQuantity, TotalPrice, DB, callback){
    DB.getAutoIncrementOfferValue(true, function(err, IdRA_Offer){  //Gets the value of nextline in ra_offer;
      json.IdRA_Offer = IdRA_Offer;                                 //Adds it to the json
      json.OfferDateStart = getCurrentDate();                       //get the current date
      SaveFile(json, files, PlantName, "OrderFromClient", function(FileName){ //Save the file 
        var opt = {"IdPlant" : json.IdPlant, "QuantityInL" : TotalQuantity, "Price" : TotalPrice,"FileOrderFromClientName" : FileName, "OfferState" : 2, "IdUser":json.IdUser}
        DB.createRAOffer(opt, function(err, Result){                //Insert the 
          callback();
        });
      });
    });
  },

  
  SendPartHistory: function(res, IdPartImplemented, DB){  //Gets the partHistory for partDescription
    DB.getPartImplementedHistory(IdPartImplemented, function(err, Result){    //Gets from ra_offer
      DB.getPartImplementedReviews(IdPartImplemented, function(err, Reviews){ //Gets from review
        var json = MergeAndOrderbyDate(Result, Reviews);                      //Merge
        res.end(JSON.stringify(json));
      });
    })
  },
  
  SendPlantHistory: function(res, IdPlant, DB){   //Gets the part_offer and ra_offer history for the selected plant
    DB.getPlantHistoryOffer(IdPlant, true, function(err, Result){   //Gets from ra_offer
      DB.getPlantHistoryReview(IdPlant, function(err, Reviews){     //Gets from review
        DB.getPlantHistoryRA(IdPlant, true, function(err, RAOffer){ //Gets from ra_ofefr
          var json = MergeAndOrderbyDate(Result, Reviews);          //Merge part_offer and review
          json = MergeAndOrderbyDate(json, RAOffer);                //Merge result with ra_offer
          res.end(JSON.stringify(json));          //Send result
        });
      });
    });
  },
  
  GeneratePassword: function() {      //Generate a random password when creating an account
    var pw = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    
    for (var i = 0; i < 15; i++)
    pw += possible.charAt(Math.floor(Math.random() * possible.length));
    
    return pw;
  },
  
  SendEmail: function(Login, Email, Password, callback){      //Sending mail when the password has been changed
    console.log("Sending email to " + Email + " with Login : " + Login + ", Password : " + Password);
    var ResetPassword_MailContent = {
      from: 'youremail@gmail.com',
      to: Email,
      subject: 'Your password has been reseted !',
      text: 'Your account :' + Login + '\nHere is your new Password : ' + Password
    };
    
    transporter.sendMail(ResetPassword_MailContent, function(error, info){
      if(err) console.log(err);
      callback();
    }); 
  },
  
  //Getters
  getRoleArray: function(){
    return RoleArray;
  }, 
  
  getStateToString: function(){
    return StateToString;
  },
  
  //Local function getters
  SaveFile: function(json, files, PlantName, s, callback){
    SaveFile(json, files, PlantName, s, callback);
  },

  doTransformTypeAndStateToString: function(json){
    return TransformTypeAndStateToString(json);
  }
}

function TransformTypeAndStateToString(json){           //Transform type/state/date to string
  if(json.OfferType != null){                                               //Check if we received something from part_offer
    json.DataType = "H";                                                    //DataType can be H or R, its used for the client side
    json.OfferDateStart = json.OfferDateStart.toString().substring(0, 15);  //Transforms the date to a YYYY-MM-DD
    if((json.Offer != null) && (!json.Offer.includes("/Orders/"))) {        //set the path to the file if it isn't null nor already setted
      json.Offer = PartsOfferPath + json.IdPart_Offer + '/' + json.Offer;
    }
    if((json.OrderFromClient != null) && (!json.OrderFromClient.includes("/Orders/"))){
      json.OrderFromClient = PartsOfferPath + json.IdPart_Offer + '/' + json.OrderFromClient;
    }
    if((json.OrderFromERC != null) && (!json.OrderFromERC.includes("/Orders/"))){
      json.OrderFromERC = PartsOfferPath + json.IdPart_Offer + '/' + json.OrderFromERC;
    }
    if((typeof json.OfferType === 'number') && (json.OfferType > 0 )){
      json.OfferType = TypeToString[json.OfferType];
    }
    if(typeof json.OfferState === 'number'){
      json.OfferState = StateToString[json.OfferState];
    }
  }else if(json.ReviewType != null){                                //If it's a review
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
    if((json.OrderFromClient != null) && (!json.OrderFromClient.includes("/RA/"))){
      json.OrderFromClient = RAOfferPath + json.IdRA_Offer + '/' + json.OrderFromClient;
    }
    if((json.OrderFromERC != null) && (!json.OrderFromERC.includes("/RA/"))){
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
  if(OfferDateStart.includes(' ')){
    OfferDateStart = new Date(OfferDateStart).toISOString().substring(0,10);
  }
  return '' + IDRA_Offer + '_' + PlantName + '_' + OfferDateStart + '_' + sFileType + OriginalFileName.substring(DotIndex);
}

function generateFileNameParts (IDPart_Offer, PlantName, PartName, PartLocation, OriginalFileName, sFileType){
  var DotIndex = OriginalFileName.lastIndexOf(".");
  return '' + IDPart_Offer + '_' + PlantName + '_' + PartName + '_' + PartLocation +  '_' + sFileType + OriginalFileName.substring(DotIndex);
}

function mkdirSync (dirPath) {    //MakeDirectory
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

function getCurrentDate(){  //Returns the current date as format YYYY-MM-DD
  return new Date().toISOString().substring(0,10);
}

function MergeAndOrderbyDate(history, review){      //Merge and Order by date, used for the Plant_Operator history and partDescription
  var Merged = [];
  var iIndexHistory = 0;
  var iIndexReview = 0;
  var SizeOfMergedArray = history.length + review.length;

  if((history.length == 0) && (review.length == 0)){  //If both of them are empty
    Merged = null;
  }else if(history.length == 0){                      //If one is empty
    for(var i=0; i<review.length; i++){               //Merged = The other transformed
      Merged[i] = TransformTypeAndStateToString(review[i]);
    }
  }else if(review.length == 0){                       //Same but for the other array
    for(var i=0; i<history.length; i++){
      Merged[i] = TransformTypeAndStateToString(history[i]);
    }
  }else{                                              //If both aren't empty
    for(var i=0; i<SizeOfMergedArray; i++){
      if(history[iIndexHistory].OfferDateStart > review[iIndexReview].ReviewDate){  //Compare the dates with the indexes
        Merged[i] = TransformTypeAndStateToString(history[iIndexHistory]);  //Load the transfomred json
        iIndexHistory++;                                                    //Update the index
      }else{
        Merged[i] = TransformTypeAndStateToString(review[iIndexReview]);    //Same but for the other array
        iIndexReview++;
      }
      
      if(iIndexHistory == history.length){              //If we're at then end of one array
        for(var j=iIndexReview; j<review.length; j++){  //Fill merged with other array transformed
          i++;
          Merged[i] = TransformTypeAndStateToString(review[j]);
        }
        break;                                          //Then break from the big for loop
      }
      if(iIndexReview == review.length){                //Same but for the other array
        for(var j=iIndexHistory; j<history.length; j++){
          i++;
          Merged[i] = TransformTypeAndStateToString(history[j]);
        }
        break;                                          //Then break from the big for loop
      }
    }
  }
  return Merged;
}