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
        var Query = "SELECT * FROM user WHERE Login = ? and Password = ? ;";
        con.query(Query, [login, pwd], function(err,rows){
            if (err) throw err;
            callback(err, rows[0]);
        });
    },

    getPlantPartPreviewInfos: function(IDPlant, callback){
        var Query = "SELECT part.PartName, part.PartDescription, partimplemented.Location, partimplemented.IdPartImplemented, supplier.SupplierName FROM part JOIN partimplemented ON part.IdPart=partimplemented.IdPart JOIN supplier ON part.IdSupplier=supplier.IdSupplier WHERE partimplemented.IdPlant = ? ;";
        con.query(Query, [IDPlant], function(err,rows){
            if (err) throw err;
            callback(err, rows);
        });
    }, 

    getPartImplementedHistory: function(IDPartImplemented, callback){
        console.log("Selecting History for IDPartImplemented = " + IDPartImplemented);
        var Query = "SELECT OfferType, OfferState, OfferDateStart FROM part_offer WHERE IdPartImplemented = ? ORDER BY OfferDateStart DESC;";
        con.query(Query, [IDPartImplemented], function(err, rows){
            if (err) throw err;
            callback(err, rows);
        });
    },

    getPartImplementedReviews: function(IDPartImplemented, callback){
        var Query = "SELECT ReviewType, ReviewDate FROM review WHERE IdPartImplemented = ? ORDER BY ReviewDate DESC;";
        con.query(Query, [IDPartImplemented],function(err, rows){
            if (err) throw err;
            callback(err, rows);
        });
    },

    createPartOffer: function(IDPartImplemented, OfferType, callback){
        var Query = "INSERT INTO part_offer(IdPartImplemented, OfferDateStart, OfferType, OfferState, UserSeen) VALUES( ? , NOW() , ? , 1 , 0);";
        con.query(Query, [IDPartImplemented, OfferType], function(err, rows){
            if (err) throw err;
            callback(err, rows);
        });
    },

    createPartReview: function(IDPartImplemented, ReviewType, ReviewDate, callback){
        var Query = "INSERT INTO review(IdPartImplemented, ReviewType, ReviewDate) VALUES( ? , ? , ? );";
        con.query(Query, [IDPartImplemented, ReviewType, ReviewDate], function(err, rows){
            if (err) throw err;
            callback(err, rows) ;
        });
    }
};