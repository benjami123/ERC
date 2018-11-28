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

    getPlantOffer: function(IDPlant, callback){
        var Query = "SELECT part_offer.IdPart_Offer, part_offer.OfferType, part_offer.OfferDateStart, part_offer.Offer, part.PartName, partimplemented.Location FROM part_offer JOIN partimplemented ON part_offer.IdPartImplemented=partimplemented.IdPartImplemented JOIN part ON partimplemented.IdPart=part.IdPart WHERE part_offer.OfferState=2 AND partimplemented.IdPlant= ? ;"
        con.query(Query, [IDPlant],function(err, rows){
            if (err) throw err;
            callback(err, rows);
        });
    },

    getPlantHistoryOfferWithFiles : function(IDPlant, callback){
        var Query = "SELECT part.PartName, partimplemented.Location, partimplemented.IdPlant,part_offer.OfferType, part_offer.OfferState, part_offer.OfferDateStart, part_offer.Offer, part_offer.OrderFromClient, part_offer.OrderFromERC FROM part_offer JOIN partimplemented ON part_offer.IdPartImplemented = partimplemented.IdPartImplemented JOIN part ON part.IdPart=partimplemented.IdPart WHERE IdPlant = ? ORDER BY part_offer.OfferDateStart DESC;";
        con.query(Query, [IDPlant],function(err, rows){
            if (err) throw err;
            callback(err, rows);
        });
    },

    getPlantHistoryReview: function(IDPlant, callback){
        var Query = "SELECT part.PartName, partimplemented.Location, partimplemented.IdPlant, review.ReviewType, review.ReviewDate FROM review JOIN partimplemented ON review.IdPartImplemented = partimplemented.IdPartImplemented JOIN part ON part.IdPart=partimplemented.IdPart WHERE IdPlant = '1' ORDER BY review.ReviewDate DESC;";
        con.query(Query, [IDPlant],function(err, rows){
            if (err) throw err;
            callback(err, rows);
        });
    },

    getOffersRequest:function(callback){
        var Query = "SELECT user.Login, user.Email, plant.Address, plant.PlantName, plant.IdPlant, partimplemented.Location, part.PartName, part_offer.OfferType ,part_offer.OfferDateStart, part_offer.IdPart_Offer FROM part_offer JOIN partimplemented ON part_offer.IdPartImplemented=partimplemented.IdPartImplemented JOIN part ON partimplemented.IdPart=part.IdPart JOIN plant ON partimplemented.IdPlant=plant.IdPlant JOIN user ON plant.IdPlant=user.IdPlant WHERE part_offer.OfferType=1 ORDER BY part_offer.OfferDateStart DESC;";
        con.query(Query, function(err, rows){
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
    },

    createPartImplemented: function(Values, callback){
        var Query = "INSERT INTO partimplemented (IdPlant, IdPart, isImplemented, Location) VALUES( ? , ? , 1 , ? );";
        con.query(Query, [Values], function(err, rows){
            if (err) throw err;
            callback(err, rows) ;
        });
    },

    createUser: function(IDPlant, Login, Password, Role, callback){
        var Query = "INSERT INTO user(IdPlant, Login, Passowrd, Role) VALUES( ? , ? , ? , ? );";
        con.query(Query, [IDPlant, Login, Password, Role], function(err, rows){
            if (err) throw err;
            callback(err, rows) ;
        });
    },

    changePassword: function(IDUser, Password, callback){
        var Query = "UPDATE user SET Password = ? WHERE IdUser = ? ;";
        con.query(Query, [Password, IDUser], function(err, rows){
            if (err) throw err;
            callback(err, rows) ;
        });
    },

    uploadOffer: function(IDPartImplemented, Offer, callback){
        var Query = "UPDATE part_offer SET Offer = ? WHERE IdPartImplemented = ? ;";
        con.query(Query, [Offer, IDPartImplemented], function(err, rows){
            if (err) throw err;
            callback(err, rows) ;
        });  
    },

    uploadOrderFromERC: function(IDPartImplemented, Order, callback){
        var Query = "UPDATE part_offer SET OrderFromERC = ? WHERE IdPartImplemented = ? ;";
        con.query(Query, [Order, IDPartImplemented], function(err, rows){
            if (err) throw err;
            callback(err, rows) ;
        });  
    },

    uploadOrderFromClient: function(IDPartImplemented, Order, callback){
        var Query = "UPDATE part_offer SET OrderFromClient = ? WHERE IdPartImplemented = ? ;";
        con.query(Query, [Order, IDPartImplemented], function(err, rows){
            if (err) throw err;
            callback(err, rows) ;
        });  
    },

    removeUser: function(IDUser, callback){
        var Query = "DELETE FROM TABLE user WHERE IdUser = ? ;";
        con.query(Query, [IDUser], function(err, rows){
            if (err) throw err;
            callback(err, rows) ;
        });
    },

    removePartImplemented: function(ArrayPartimplementedID, callback){
        var Query = "UPDATE partimplemented SET isImplemented = 0 WHERE IdPartImplemented = ? ;";
        con.query(Query, ArrayPartimplementedID, function(err, rows){
            if (err) throw err;
            callback(err, rows) ;
        });
    }
};