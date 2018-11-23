window.onload = function(){
    console.log("sending post to server");
    var json={};
    xmlRequest = new XMLHttpRequest();
    xmlRequest.open("POST", "/Plant_Operator/index", true);
    xmlRequest.setRequestHeader('Content-type', 'application/json');
    xmlRequest.send();
    xmlRequest.onreadystatechange = function(){
        console.log("Got response : ");
        console.log(xmlRequest.responseText);
    }
};