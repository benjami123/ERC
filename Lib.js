var fs = require('fs');
var OfferPath = "./../Orders/Offer/";
var OrderFromERCPath = "./../Orders/OrderFromERC/";
var OrderFromClientPath = "./../Orders/OrderFromClient/";

var RoleArray = [ {Role:1, Link:"/Plant_Admin/"}, 
                {Role:2, Link:"/ERC_Admin/"},
                {Role:3, Link:"/Plant_Operator/"},
                {Role:4, Link:"/ERC_Services/"},
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
    MergeAndOrderbyDate: function (history, review){
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
  },

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
      json.Offer = OfferPath + json.Offer;
    }
    if(json.OrderFromClient != null){
      json.OrderFromClient = OrderFromClientPath + json.OrderFromClient;
    }
    if(json.OrderFromERCPath != null){
      json.OrderFromERC = OrderFromERCPath + json.OrderFromERC;
    }
    json.OfferType = TypeToString[json.OfferType];
    json.OfferState = StateToString[json.OfferState];
  }else{
    json.DataType = "R";
    json.ReviewDate = json.ReviewDate.toString().substring(0, 15);
    json.ReviewType = TypeToString[json.ReviewType];
  }
  return json;
}