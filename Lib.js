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
    console.log("From merg function");
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
  getRoleArray(){
      return RoleArray;
  }
}

function TransformTypeAndStateToString(json){
    if(json.OfferType != null){
      json.DataType = "H"
      json.OfferType = TypeToString[json.OfferType];
      json.OfferState = StateToString[json.OfferState];
    }else{
      json.DataType = "R";
      json.ReviewType = TypeToString[json.ReviewType];
    }
    return json;
  }