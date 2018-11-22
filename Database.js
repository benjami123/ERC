/**
 * Created by Benjamin on 22/11/2018.
 */
var mysql = require('mysql');
var con = mysql.createConnection({
    host: "localhost",
    user: "User",
    password: "test",
    database: "ERC"
});

con.connect(function(err){
    if (err)throw err;
    console.log("Connected to DB");
});

module.exports= {
    getUser: function(login, pwd, callback){
        var Query = "SELECT * FROM user WHERE Login='"+login+"' and Password='"+pwd+"';";
        con.query(Query,function(err,rows){
            console.log("Executed query : " + Query);
            callback(err, rows[0]);
        });
    }
};