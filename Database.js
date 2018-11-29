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
    //Login
    getUser: function(login, pwd, callback){
        var Query = "SELECT * FROM user WHERE Login = ? and Password = ? ;";
        con.query(Query, [login, pwd], function(err,rows){
            if (err) throw err;
            callback(err, rows[0]);
        });
    },
    
    //change password
    changePassword: function(IDUser, Password, callback){
        var Query = "UPDATE user SET Password = ? WHERE IdUser = ? ;";
        con.query(Query, [Password, IDUser], function(err, rows){
            if (err) throw err;
            callback(err, rows) ;
        });
    },
    
    //Plant_Operator : index ReductionAgent
    createRAOffer: function(IdReductionAgent, QuantityInL, Price, FileOrderFromClientName){
        var Query = "INSERT INTO ra_offer (IdReductionAgent, DateStart, QuantityInL, Price, UserSeen, OrderFromClient) VALUES ( ? , NOW(),  ? , ? , 0, ? );";
        con.query(Query, [IdReductionAgent, QuantityInL, Price, FileOrderFromClientName], function(err, rows){
            if (err) throw err;
            callback(err, rows);
        });
    },

    //Plant_Operator : index partPreview
    getPlantPartPreviewInfos: function(IDPlant, callback){
        var Query = "SELECT part.PartName, part.PartDescription, partimplemented.Location, partimplemented.IdPartImplemented, supplier.SupplierName FROM part JOIN partimplemented ON part.IdPart=partimplemented.IdPart JOIN supplier ON part.IdSupplier=supplier.IdSupplier WHERE partimplemented.IdPlant = ? ;";
        con.query(Query, [IDPlant], function(err,rows){
            if (err) throw err;
            callback(err, rows);
        });
    }, 
    
    //Plant_Operator : PartDescription History(Part_Offer)
    getPartImplementedHistory: function(IDPartImplemented, callback){
        var Query = "SELECT IdPart_Offer, OfferType, OfferState, OfferDateStart FROM part_offer WHERE IdPartImplemented = ? ORDER BY OfferDateStart DESC;";
        con.query(Query, [IDPartImplemented], function(err, rows){
            if (err) throw err;
            callback(err, rows);
        });
    },
    
    //Plant_Operator : PartDescription History(Reviews)
    getPartImplementedReviews: function(IDPartImplemented, callback){
        var Query = "SELECT ReviewType, ReviewDate FROM review WHERE IdPartImplemented = ? ORDER BY ReviewDate DESC;";
        con.query(Query, [IDPartImplemented],function(err, rows){
            if (err) throw err;
            callback(err, rows);
        });
    },

    //Plant_Operator : PartDescription CreateOffer
    createPartOffer: function(IDPartImplemented, OfferType, callback){
        var Query = "INSERT INTO part_offer(IdPartImplemented, OfferDateStart, OfferType, OfferState, UserSeen) VALUES( ? , NOW() , ? , 1 , 0);";
        con.query(Query, [IDPartImplemented, OfferType], function(err, rows){
            if (err) throw err;
            callback(err, rows);
        });
    },

    //Plant_Operator : PartDescription CreateReview
    createPartReview: function(IDPartImplemented, ReviewType, ReviewDate, callback){
        var Query = "INSERT INTO review(IdPartImplemented, ReviewType, ReviewDate) VALUES( ? , ? , ? );";
        con.query(Query, [IDPartImplemented, ReviewType, ReviewDate], function(err, rows){
            if (err) throw err;
            callback(err, rows) ;
        });
    },
    
    //Plant_Operator : Offer AddOrder to part_offer
    uploadOrderFromClient: function(IDPart_Offer, Order, callback){
        var Query = "UPDATE part_offer SET OrderFromClient = ? , OfferState = 4 WHERE IdPart_Offer = ? ;";
        con.query(Query, [Order, IDPart_Offer], function(err, rows){
            if (err) throw err;
            callback(err, rows) ;
        });  
    },

    //Plant_Operator : Offer Refuse part_offer
    RefusePartOffer: function(IDPart_Offer, callback){
        var Query = "UPDATE part_offer SET OfferState = 6 WHERE IdPart_Offer = ? ;"
        con.query(Query, [IDPart_Offer],function(err, rows){
            if (err) throw err;
            callback(err, rows);
        });
    },

    //Plant_Operator : Offer GetOffers
    getPlantOffer: function(IDPlant, callback){
        var Query = "SELECT part_offer.IdPart_Offer, part_offer.OfferType, part_offer.OfferDateStart, part_offer.Offer, part.PartName, partimplemented.Location FROM part_offer JOIN partimplemented ON part_offer.IdPartImplemented=partimplemented.IdPartImplemented JOIN part ON partimplemented.IdPart=part.IdPart WHERE part_offer.OfferState=2 AND partimplemented.IdPlant= ? ;"
        con.query(Query, [IDPlant],function(err, rows){
            if (err) throw err;
            callback(err, rows);
        });
    },

    //Plant_Operator : History
    getPlantHistoryOfferWithFiles: function(IDPlant, callback){
        var Query = "SELECT part.PartName, partimplemented.Location, partimplemented.IdPlant, part_offer.IdPart_Offer, part_offer.OfferType, part_offer.OfferState, part_offer.OfferDateStart, part_offer.Offer, part_offer.OrderFromClient, part_offer.OrderFromERC FROM part_offer JOIN partimplemented ON part_offer.IdPartImplemented = partimplemented.IdPartImplemented JOIN part ON part.IdPart=partimplemented.IdPart WHERE IdPlant = ? ORDER BY part_offer.OfferDateStart DESC;";
        con.query(Query, [IDPlant],function(err, rows){
            if (err) throw err;
            callback(err, rows);
        });
    },

    //Plant_Operator : History
    getPlantHistoryReview: function(IDPlant, callback){
        var Query = "SELECT part.PartName, partimplemented.Location, partimplemented.IdPlant, review.ReviewType, review.ReviewDate FROM review JOIN partimplemented ON review.IdPartImplemented = partimplemented.IdPartImplemented JOIN part ON part.IdPart=partimplemented.IdPart WHERE IdPlant = '1' ORDER BY review.ReviewDate DESC;";
        con.query(Query, [IDPlant],function(err, rows){
            if (err) throw err;
            callback(err, rows);
        });
    },

    //ERC_Service : index
    getOffersRequest: function(callback){
        var Query = "SELECT user.Login, user.Email, plant.Address, plant.PlantName, plant.IdPlant, partimplemented.Location, part.PartName, part_offer.IdPart_Offer, part_offer.OfferType, part_offer.OfferDateStart FROM part_offer JOIN partimplemented ON part_offer.IdPartImplemented=partimplemented.IdPartImplemented JOIN part ON partimplemented.IdPart=part.IdPart JOIN plant ON partimplemented.IdPlant=plant.IdPlant JOIN user ON plant.IdPlant=user.IdPlant WHERE part_offer.OfferState=1 ORDER BY part_offer.OfferDateStart DESC;";
        con.query(Query, function(err, rows){
            if (err) throw err;
            callback(err, rows);
        });
    },
    
    //ERC_Service : index AddOffer to part_offer
    uploadOffer: function(IDPartOffer, FileOfferName, callback){
        var Query = "UPDATE part_offer SET Offer = ? , OfferState = 2 WHERE IdPart_Offer = ? ;";
        con.query(Query, [FileOfferName, IDPartOffer], function(err, rows){
            if (err) throw err;
            callback(err, rows) ;
        });  
    },
    
    //ERC_Service : Orders AddOrder to part_offer
    uploadOrderFromERC: function(IDPartImplemented, Order, callback){
        var Query = "UPDATE part_offer SET OrderFromERC = ? , OfferState = 3 WHERE IdPartImplemented = ? ;";
        con.query(Query, [Order, IDPartImplemented], function(err, rows){
            if (err) throw err;
            callback(err, rows) ;
        });  
    },

    //ERC_Additive : index
    getRAOffersRequest: function(callback){
        var Query = "SELECT ra_offer.IdReductionAgent, ra_offer.OrderFromClient, ra_offer.QuantityInL, ra_offer.Price, ra_offer.OfferDateStart ,plant.PlantName, reductionagent.LevelOfRAInL, reductionagent.TotalCapacityInL, reductionagent.AverageConsumption, plant.Address, user.Login FROM ra_offer JOIN reductionagent ON ra_offer.IdReductionAgent=reductionagent.IdReductionAgent JOIN plant ON reductionagent.IdPlant=plant.IdPlant JOIN user ON plant.IdPlant=user.IdPlant WHERE ra_offer.OfferState=1 ORDER BY ra_offer.OfferDateStart DESC;";
        con.query(Query, [IDPartImplemented, OfferType], function(err, rows){
            if (err) throw err;
            callback(err, rows);
        });
    },



    //*_Admin : RemoveUser
    removeUser: function(IDUser, callback){
        var Query = "DELETE FROM TABLE user WHERE IdUser = ? ;";
        con.query(Query, [IDUser], function(err, rows){
            if (err) throw err;
            callback(err, rows) ;
        });
    },
    
    //*_Admin : AddUser with role
    createUser: function(IDPlant, Login, Password, Role, callback){
        var Query = "INSERT INTO user(IdPlant, Login, Passowrd, Role) VALUES( ? , ? , ? , ? );";
        con.query(Query, [IDPlant, Login, Password, Role], function(err, rows){
            if (err) throw err;
            callback(err, rows) ;
        });
    },
    
    //Plant_Admin : Parts Adding partsImplemented to plant
    createPartImplemented: function(Values, callback){
        var Query = "INSERT INTO partimplemented (IdPlant, IdPart, isImplemented, Location) VALUES( ? , ? , 1 , ? );";
        con.query(Query, [Values], function(err, rows){
            if (err) throw err;
            callback(err, rows) ;
        });
    },
    
    //Plant_Admin : Parts removing partimplemented from plant
    removePartImplemented: function(ArrayPartimplementedID, callback){
        var Query = "UPDATE partimplemented SET isImplemented = 0 WHERE IdPartImplemented = ? ;";
        con.query(Query, ArrayPartimplementedID, function(err, rows){
            if (err) throw err;
            callback(err, rows) ;
        });
    },

    getPlant: function(IDPlant, callback){
        var Query = "UPDATE partimplemented SET isImplemented = 0 WHERE IdPartImplemented = ? ;";
        con.query(Query, ArrayPartimplementedID, function(err, rows){
            if (err) throw err;
            callback(err, rows) ;
        });
    }
};