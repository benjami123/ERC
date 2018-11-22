//Loading modules
var http = require('http');
var fs = require('fs');
var path = require('path');
var mysql = require('mysql');
var con = mysql.createConnection({
  host: "localhost",
  user: "User",
  password: "test", 
  database: "ERC"
});

const express = require('express')
const app = express();
var bodyParser = require('body-parser')
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 
app.get('/*', function(req, res){
    res.sendFile(__dirname + '/index.html');
});

app.post('/',function(req,res){
    console.log("got post method");
    console.log(req.body.password);
    console.log(req.body.username);
    console.log("");
});


app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
});

con.connect(function(err){
    if (err)throw err;
    console.log("Connected to DB");
});

        // var Myjson = JSON.parse(data)
        // console.log("got value in test " + Myjson);
        // var Query = "SELECT * FROM User WHERE Username = " + Myjson.username + " AND Password = " + Myjson.password + ";"; 
        // con.query(Query, function(err, results, fields){
        //     if(err)throw err;
        //     console.log("Got results of size " + results.lenght + " : ");
        //     console.log(results);
        //     var json = {};
        //     json.accepted = results.lenght
        //     socket.emit("login", json.accepted);
        // });