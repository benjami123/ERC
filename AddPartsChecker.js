var RequestedFileExetension = '.xlsx';
var xlsx = require('xlsx');
var fs = require('fs');

module.exports={
    CheckFiles: function(files, DB, callback){
        var i = 0;
        while(files[i] != null){
            CheckOneFile(files[i], DB, callback);
            i++;
        }
    },

    AddParts: function(files, DB, callback){
        var i=0;
        while(files[i] != null){
            var arr = [];
            var Data = OpenFile(files[i], DB);
            for(var j=0; j<Data.length; j++){
                arr[j] = [];
                arr[j].push(1);
                arr[j].push(Data[j].KKS);
                arr[j].push(Data[j].PartName);
                arr[j].push(Data[j].PartDescription);
                arr[j].push(Data[j].PresureNominal);
                arr[j].push(Data[j].DiameterNominal);
            }
            i++;
            res = removeDuplicatesInsideItself(arr, null);
            console.log("arr : ");
            console.log(res.PartsArrayWithoutDuplicate);
            removeDuplicates(res.PartsArrayWithoutDuplicate, DB, function(PartsArray){
                DB.addParts(PartsArray, function(){
                    callback();
                });
            })
        }
    }
}

function CheckOneFile(f, DB, callback){
    var WebConsoleMessages = [];
    var CanBeExecuted = false;
    var FileName = f.name;
    var DotIndex = FileName.lastIndexOf(".");
    WebConsoleMessages = AddMessage(WebConsoleMessages, "Checking file : " + FileName);
    if(FileName.substring(DotIndex) !== RequestedFileExetension){
        WebConsoleMessages = AddMessage(WebConsoleMessages, "File " + f.name + " isn't in the correct format (.xlsx)", true);
        callback(WebConsoleMessages, false);
    }else{
        var json = OpenFile(f, DB);
        if(json == null){
            WebConsoleMessages = AddMessage(WebConsoleMessages, "File unreadable : " + FileName, true);
            callback(WebConsoleMessages, false);
        }else{
            WebConsoleMessages =  CheckIfPartCanBeInserted(json, WebConsoleMessages, DB, function(WebConsoleMessages){
                callback(WebConsoleMessages, true);
            });
        }
    }
    
}

function AddMessage(MessageArray, s, isError){
    if(isError !== true){
        isError = false
    }
    MessageArray.push({"Message": s, "isError": isError});
    return MessageArray;
}

function OpenFile(f, DB){
    console.log("Opening file at " + f.path);
    var PartsFile = xlsx.readFile(f.path);
    var sheet_name_list = PartsFile.SheetNames;
    SelectedSheet = PartsFile.Sheets[sheet_name_list[1]];
    if(SelectedSheet == null){
        return null;
    }
    var SheetSize =  SelectedSheet['!ref'].split(':')[1];
    console.log("File of size : " + SheetSize);
    var PartsData = xlsx.utils.sheet_to_json(SelectedSheet, {range:"Y12-" + SheetSize, header:["KKS1", "KKS2", "KKS3", "n1", "n2", "n3", "n4", "n5","n6", "PartName", "DN", "PN", "n7", "PartDescription"]});
    var Data = [];
    console.log("File opened");
    for(var i=0; i<PartsData.length; i++){
        if((PartsData[i].PartName != null) && (PartsData[i].PartDescription != null)){
            PartsData[i] = ReplaceDashesWithNull(PartsData[i]);

            var KKSNumber = PartsData[i].KKS1 + PartsData[i].KKS2 + PartsData[i].KKS3; 
            if(KKSNumber === ""){
                KKSNumber = null;
            }
            Data.push({
                PartName: PartsData[i].PartName, 
                PartDescription: PartsData[i].PartDescription,
                KKS: KKSNumber,
                DN: PartsData[i].DN,
                PN: PartsData[i].PN
            });
        }
    }
    console.log(Data);
    return Data;
}

function CheckIfPartCanBeInserted(PartsArray, WebConsoleMessages, DB, callback){
    DB.getParts(function(err, Parts){
        res = removeDuplicatesInsideItself(PartsArray, WebConsoleMessages);
        PartsArray = res.PartsArrayWithoutDuplicate;
        WebConsoleMessages = res.WebConsoleMessages;
        for(var i=0; i<PartsArray.length; i++){
            var isPartInsertable = true;
            for(var j=0; j<Parts.length; j++){
                if((PartsArray[i].PartName === Parts[j].PartName) && (PartsArray[i].PartDescription === Parts[j].PartDescription) && (PartsArray[i].PN === Parts[j].PresureNominal) && (PartsArray[i].DN === Parts[j].DiameterNominal) && (PartsArray[i].KKS === Parts[j].KKS)){
                    isPartInsertable = false;
                    break;
                }
            }
            if(isPartInsertable){
                WebConsoleMessages = AddMessage(WebConsoleMessages, "Adding part to module : " + JSON.stringify(PartsArray[i]), false);
            }else{
                WebConsoleMessages = AddMessage(WebConsoleMessages, "Can't add part (already in the module) : " + JSON.stringify(PartsArray[i]), true)
            }
        }
        callback(WebConsoleMessages);
    });
}

function removeDuplicatesInsideItself(PartsArray, WebConsoleMessages){
    var unique = [];
    var len = PartsArray.length;
    for ( var i = 0; i < len; i++ ){
        console.log(PartsArray[i]);
        var isInArray = false;
        for(var j=0; j< unique.length; j++){
            if((unique[j].KKS === PartsArray[i].KKS) && (unique[j].PartName === PartsArray[i].PartName) && (unique[j].PartDescription === PartsArray[i].PartDescription) && (unique[j].PN === PartsArray[i].PN) && (unique[j].DN === PartsArray[i].DN)){
                isInArray = true;
                break;
            }
        }
      if(!isInArray){
          unique.push(PartsArray[i]);
      }else{
        if(WebConsoleMessages != null){
            WebConsoleMessages = AddMessage(WebConsoleMessages, "Found duplicate in input file : " + JSON.stringify(PartsArray[i]), true)
        }
      }
    }
    return {PartsArrayWithoutDuplicate: unique, WebConsoleMessages: WebConsoleMessages};
}

function removeDuplicates(PartsArray, DB, callback){
    DB.getParts(function(err, Parts){
        console.log("Parts : ");
        console.log(PartsArray);
        returnedValue = removeDuplicatesInsideItself(PartsArray);
        PartsArray = returnedValue.PartsArrayWithoutDuplicate;
        var res = [];
        for(var i=0; i<PartsArray.length; i++){
            var isPartInsertable = true;
            for(var j=0; j<Parts.length; j++){
                if((PartsArray[i].PartName === Parts[j].PartName) && (PartsArray[i].PartDescription === Parts[j].PartDescription) && (PartsArray[i].PN === Parts[j].PresureNominal) && (PartsArray[i].DN === Parts[j].DiameterNominal) && (PartsArray[i].KKS === Parts[j].KKS)){
                    isPartInsertable = false;
                    break;
                }
            }
            if(isPartInsertable){
                res.push(PartsArray[i]);
            }
        }
        callback(res);
    });
}

function ReplaceDashesWithNull(json){
    json.KKS1 = ReplaceValueDashesWithNull(json.KKS1);
    json.KKS2 = ReplaceValueDashesWithNull(json.KKS2);
    json.KKS3 = ReplaceValueDashesWithNull(json.KKS3);
    json.PartName = ReplaceValueDashesWithNull(json.PartName);
    json.PartDescription = ReplaceValueDashesWithNull(json.PartDescription);
    json.PN = ReplaceValueDashesWithNull(json.PN);
    json.DN = ReplaceValueDashesWithNull(json.DN);
    return json;
}

function ReplaceValueDashesWithNull(value){
    if(value === '-'){
        return ""
    }else{
        return value;
    }
}