var fs = require('fs');

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
  
}

function TransformTypeAndStateToString(json){
  if(json.OfferType != null){
    json.DataType = "H";
    json.OfferDateStart = json.OfferDateStart.toString().substring(0, 15);
    json.OfferType = TypeToString[json.OfferType];
    json.OfferState = StateToString[json.OfferState];
  }else{
    json.DataType = "R";
    json.ReviewDate = json.ReviewDate.toString().substring(0, 15);
    json.ReviewType = TypeToString[json.ReviewType];
  }
  return json;
}