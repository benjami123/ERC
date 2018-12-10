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
    getUser: function(opt, callback){
        var Query = "SELECT * FROM user WHERE Login = ? and Password = ? LIMIT 1;";
        con.query(Query, [opt.Login, opt.Password], function(err,rows){
            if (err) throw err;
            callback(err, rows[0]);
        });
    },
    
    //change password
    changePassword: function(opt, callback){
        var Query = "UPDATE user SET Password = ? WHERE IdUser = ? ;";
        con.query(Query, [opt.Password, opt.IdUser], function(err, rows){
            if (err) throw err;
            callback(err, rows) ;
        });
    },
    
    /*  Plant_Operator    */ 

    //Plant_Operator : index partPreview
    getPlantPartPreviewInfos: function(IDPlant, callback){
        var Query = "SELECT part.PartName, part.PartDescription, partimplemented.Location, partimplemented.IdPartImplemented, supplier.SupplierName "
                +   "FROM part "
                +   "JOIN partimplemented ON part.IdPart=partimplemented.IdPart "
                +   "JOIN supplier ON part.IdSupplier=supplier.IdSupplier "
                +   "WHERE partimplemented.IdPlant = ? ;";
        con.query(Query, [IDPlant], function(err,rows){
            if (err) throw err;
            callback(err, rows);
        });
    },

    //Plant_Operator : index Get ReductionAgent Level and tank capacity
    getRAInfos: function(IDPlant, callback){
        var Query = "SELECT IdReductionAgent, LevelOfRAInL, TotalCapacityInL, TankName FROM reductionagent WHERE IdPlant = ? ;";
        con.query(Query, [IDPlant],function(err, rows){
            if (err) throw err;
            callback(err, rows);
        });
    },

    //Plant_Operator : index 
    getRAPricesAndLevel: function(IDPlant, callback){
        var Query = "SELECT PricePerL, LevelOfRAInL, TotalCapacityInL FROM reductionagent WHERE IdPlant= ? ;";
        con.query(Query, [IDPlant],function(err, rows){
            if (err) throw err;
            callback(err, rows);
        });
    },

    //Plant_Operator : index Create ReductionAgent offer
    createRAOffer: function(opt, callback){
        var Query = "INSERT INTO ra_offer (IdPlant, OfferDateStart, QuantityInL, Price, UserSeen, OrderFromClient, OfferState, IdUser) VALUES ( ? , NOW(),  ? , ? , 0, ? , ? , ?);";
        con.query(Query, [opt.IdPlant, opt.QuantityInL, opt.Price, opt.FileOrderFromClientName, opt.OfferState, opt.IdUser], function(err, rows){
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
    createPartOffer: function(opt, callback){
        if(opt.Offer != null){
            var Query = "INSERT INTO part_offer (IdPart_Implemented, OfferDateStart, OfferType, IdUser, OfferState, UserSeen, Offer) VALUES ( ? , NOW() , ?  , ? , 2 , 0 , ? );";
            con.query(Query, [opt.IdPartImplemented, opt.OfferType, opt.IdUser, opt.Offer], function(err, rows){
                if (err) throw err;
                callback(err, rows);
            });
        }else{
            var Query = "INSERT INTO part_offer(IdPartImplemented, OfferDateStart, OfferType, IdUser, OfferState, UserSeen) VALUES( ? , NOW() , ? , ? , 1 , 0);";
            con.query(Query, [opt.IdPartImplemented, opt.OfferType, opt.IdUser], function(err, rows){
                if (err) throw err;
                callback(err, rows);
            });
        }
    },

    //Plant_Operator : PartDescription CreateReview
    createPartReview: function(opt, callback){
        var Query = "INSERT INTO review(IdPartImplemented, ReviewType, ReviewDate) VALUES( ? , ? , ? );";
        con.query(Query, [opt.IdPartImplemented, opt.ReviewType, opt.ReviewDate], function(err, rows){
            if (err) throw err;
            callback(err, rows) ;
        });
    },
    
    //Plant_Operator : Offer GetOffers
    getPlantOffer: function(IDPlant, callback){
        var Query = "SELECT part_offer.IdPart_Offer, part_offer.OfferType, part_offer.OfferState, part_offer.OfferDateStart, part_offer.Offer, part.PartName, partimplemented.Location "
                +   "FROM part_offer "
                +   "JOIN partimplemented ON part_offer.IdPartImplemented=partimplemented.IdPartImplemented "
                +   "JOIN part ON partimplemented.IdPart=part.IdPart "
                +   "WHERE part_offer.OfferState=2 AND partimplemented.IdPlant= ? ;"
        con.query(Query, [IDPlant],function(err, rows){
            if (err) throw err;
            callback(err, rows);
        });
    },
    
    //Plant_Operator : Offer AddOrder to part_offer
    uploadOrderFromClient: function(IDOffer, Order, isRA, callback){
        if(isRA){
            var Query = "UPDATE ra_offer SET OrderFromClient = ? , OfferState = 3 WHERE IdRA_Offer = ? ;";
        }else{
            var Query = "UPDATE part_offer SET OrderFromClient = ? , OfferState = 3 WHERE IdPart_Offer = ? ;";
        }
        con.query(Query, [Order, IDOffer], function(err, rows){
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

    //Plant_Operator : History get PartOffers
    getPlantHistoryOffer: function(IDPlant, WithFiles, callback){
        var s = "";
        if(WithFiles){
            s = "part_offer.Offer, part_offer.OrderFromClient, part_offer.OrderFromERC ";
        }
        var Query = "SELECT part.PartName, user.Login, partimplemented.Location, partimplemented.IdPlant, part_offer.IdPart_Offer, part_offer.OfferType, part_offer.OfferState, part_offer.OfferDateStart, " + s 
                +   "FROM part_offer "
                +   "JOIN partimplemented ON part_offer.IdPartImplemented=partimplemented.IdPartImplemented "
                +   "JOIN part ON part.IdPart=partimplemented.IdPart "
                +   "JOIN user ON part_offer.IdUser=user.IdUser "
                +   "WHERE partimplemented.IdPlant = ? "
                +   "ORDER BY part_offer.OfferDateStart DESC;";
        con.query(Query, [IDPlant],function(err, rows){
            if (err) throw err;
            callback(err, rows);
        });
    },

    //Plant_Operator : History get Reviews
    getPlantHistoryReview: function(IDPlant, callback){
        var Query = "SELECT part.PartName, user.Login, partimplemented.Location, partimplemented.IdPlant, review.ReviewType, review.ReviewDate "
                +   "FROM review "
                +   "JOIN partimplemented ON review.IdPartImplemented=partimplemented.IdPartImplemented "
                +   "JOIN part ON part.IdPart=partimplemented.IdPart "
                +   "JOIN user ON review.IdUser=user.IdUser "
                +   "WHERE partimplemented.IdPlant = ? "
                +   "ORDER BY review.ReviewDate DESC;";
        con.query(Query, [IDPlant],function(err, rows){
            if (err) throw err;
            callback(err, rows);
        });
    },

    //Plant_Operator : History get ReductionAgent Offers
    getPlantHistoryRA: function(IDPlant, WithFiles,callback){
        var s = "";
        if(WithFiles){
            s = ", ra_offer.OrderFromClient, ra_offer.OrderFromERC ";
        }
        var Query = "SELECT plant.IdPlant, PlantName, user.Login, ra_offer.IdRA_Offer, ra_offer.QuantityInL, ra_offer.OfferDateStart, ra_offer.OfferState" + s 
                +   "FROM ra_offer "
                +   "JOIN plant ON ra_offer.IdPlant=plant.IdPlant "
                +   "JOIN user ON ra_offer.IdUser=user.IdUser "
                +   "WHERE ra_offer.IdPlant = ? "
                +   "ORDER BY ra_offer.OfferDateStart DESC;";
        con.query(Query, [IDPlant],function(err, rows){
            if (err) throw err;
            callback(err, rows);
        });
    },

    /*  ERC_Service     */

    //ERC_Service : index
    getOffersRequest: function(callback){
        var Query = "SELECT user.Login, user.UserRole, plant.Address, plant.PlantName, plant.IdPlant, partimplemented.Location, part.PartName, part_offer.IdPart_Offer, part_offer.OfferType, part_offer.OfferDateStart, part_offer.OfferState "
                +   "FROM part_offer "
                +   "JOIN partimplemented ON part_offer.IdPartImplemented=partimplemented.IdPartImplemented "
                +   "JOIN part ON partimplemented.IdPart=part.IdPart "
                +   "JOIN plant ON partimplemented.IdPlant=plant.IdPlant "
                +   "JOIN user ON part_offer.IdUser=user.IdUser "
                +   "WHERE part_offer.OfferState=1 "
                +   "ORDER BY part_offer.OfferDateStart DESC;";
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
    uploadOrderFromERC: function(IDOffer, Order, isRA, callback){
        if(isRA){
            var Query = "UPDATE ra_offer SET OrderFromERC = ? , OfferState = 4 WHERE IdRA_Offer = ? ;";
        }else{
            var Query = "UPDATE part_offer SET OrderFromERC = ? , OfferState = 4 WHERE IdPart_Offer = ? ;";
        }
        con.query(Query, [Order, IDOffer], function(err, rows){
            if (err) throw err;
            callback(err, rows) ;
        });  
    },

    //ERC_Service : Orders Refuse part_offer -> see Plant_Operator RefusePartOffer()
    
    //ERC_Service : Orders getOrders
    getOrdersRequest: function(callback){
        var Query = "SELECT user.Login, user.UserRole, plant.Address, plant.PlantName, plant.IdPlant, partimplemented.Location, part.PartName, part_offer.IdPart_Offer, part_offer.OfferType, part_offer.OfferDateStart, part_offer.OfferState, part_offer.Offer, part_offer.OrderFromClient "
                +   "FROM part_offer "
                +   "JOIN partimplemented ON part_offer.IdPartImplemented=partimplemented.IdPartImplemented "
                +   "JOIN part ON partimplemented.IdPart=part.IdPart "
                +   "JOIN plant ON partimplemented.IdPlant=plant.IdPlant "
                +   "JOIN user ON part_offer.IdUser=user.IdUser "
                +   "WHERE part_offer.OfferState=3 "
                +   "ORDER BY part_offer.OfferDateStart DESC;";
        con.query(Query, function(err, rows){
            if (err) throw err;
            callback(err, rows) ;
        });  
    },

    //ERC_Service : Customers GetPlants
    getPlants: function(callback){
        var Query = "SELECT IdPlant, PlantName FROM plant;";
        con.query(Query, function(err, rows){
            if (err) throw err;
            callback(err, rows) ;
        });  
    },

    //ERC_Service : Customers GetPlant ReviewHistory -> see Plant_Operator getPlantHistoryReview() 
    
    //ERC_Service : Customers GetPlant PartOfferHistory -> see Plant_Operator getPlantHistoryOffer()
    
    //ERC_Service : Customers GetPlantsPart -> see Plant_Operator getPlantPartPreviewInfos()

    //ERC_Service : PartDescription Upload offer -> see Plant_Operator createPartOffer()

    /*  ERC_Maintenance */

    //ERC_Maintenance : index GetPlants -> see ERC_Service getPlants()

    //ERC_Maintenance : index CreateReviews
    CreateReviews: function(Values, callback){
        var Query = "INSERT INTO review (IdPartImplemented, ReviewDate, ReviewType) VALUES( ? , NOW(), ? );";
        con.query(Query, Values, function(err, rows){
            if (err) throw err;
            callback(err, rows) ;
        });
    },

    /*  ERC_Additives   */

    //ERC_Additive : index
    getRAOffersRequest: function(callback){
        var Query = "SELECT ra_offer.IdRA_Offer, ra_offer.OrderFromClient, ra_offer.QuantityInL, ra_offer.Price, ra_offer.OfferDateStart ,plant.PlantName, plant.IdPlant, plant.Address, user.Login "
                +   "FROM ra_offer "
                +   "JOIN plant ON ra_offer.IdPlant=plant.IdPlant "
                +   "JOIN user ON ra_offer.IdUser=user.IdUser "
                +   "WHERE ra_offer.OfferState=2 "
                +   "ORDER BY ra_offer.OfferDateStart DESC;";
        con.query(Query, function(err, rows){
            if (err) throw err;
            callback(err, rows);
        });
    },

    //ERC_Additive : Customer GetCustomers
    getPlantsRAInfo: function(callback){
        var Query = "SELECT PlantName, PlantEmail, Address FROM plant;";
        con.query(Query, function(err, rows){
            if (err) throw err;
            callback(err, rows) ;
        });
    },

    //ERC_ADditive : Customer GetCustomer's tank value
    getPlantsTank: function(IDPlant, callback){
        var Query = "SELECT TankName, LevelOfRA, TotalCapacityInL FROM reductionagent WHERE IdPlant = ? ;";
        con.query(Query, [IDPlant], function(err, rows){
            if (err) throw err;
            callback(err, rows) ;
        });
    },

    //ERC_ADditive : Customer GetCustomer's tank value
    getLastRAOrder: function(IDPlant, callback){
        var Query = "SELECT OfferDateStart FROM ra_offer WHERE IdPlant = ? ORDER BY OfferDateStart DESC LIMIT 1;";
        con.query(Query, [IDPlant], function(err, rows){
            if (err) throw err;
            callback(err, rows);
            
        });
    },

    /*      Admin       */

    //*_Admin : RemoveUser
    removeUser: function(IDUser, callback){
        var Query = "DELETE FROM user WHERE IdUser = ? ;";
        con.query(Query, [IDUser], function(err, rows){
            if (err) throw err;
            callback(err, rows) ;
        });
    },
    
    //*_Admin : AddUser with role
    createUser: function(opt, callback){
        console.log("Creating user : " + opt.IdPlant + ", " + opt.Login + ", " + opt.Password + ", " + opt.Role);
        var Query = "INSERT INTO user(IdPlant, Login, Email, Password, UserRole) VALUES( ? , ? , ? , ? , ? );";
        con.query(Query, [opt.IdPlant, opt.Login, opt.Email, opt.Password, opt.Role], function(err, rows){
            if (err) {
                if(err.code === "ER_DUP_ENTRY"){
                    console.log("Got Login duplicate");
                    callback(err, false);
                }else{
                    throw err;
                }
            }else{
                callback(err, rows) ;
            }
        });
    },

    //Plant_Admin : index Get users from plant
    getUserWithRole: function(IDPlant, Role, callback){
        var Query = "SELECT IdUser, Login,  Email FROM user WHERE IdPlant = ? AND UserRole = ? ;";
        con.query(Query, [IDPlant, Role], function(err, rows){
            if (err) throw err;
            callback(err, rows) ;
        });
    },

    //Plant_Admin Parts Get PartImplemented from plant -> see Plant_Operator getPlantPartPreviewInfos()

    //Plant_Admin Parts GetSupplierParts
    getSupplierPart: function(callback){
        var Query = "SELECT part.IdPart, part.PartName, part.PartDescription, supplier.SupplierName "
                +   "FROM part "
                +   "JOIN supplier ON supplier.IdSupplier=part.IdSupplier "
                +   "ORDER BY supplier.SupplierName;";
        con.query(Query, function(err, rows){
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
    removePartImplemented: function(ArrayPartImplementedID, callback){
        var Query = "UPDATE partimplemented SET isImplemented = 0 WHERE IdPartImplemented = ? ;";
        con.query(Query, ArrayPartImplementedID, function(err, rows){
            if (err) throw err;
            callback(err, rows) ;
        });
    },



    getPlantName: function(IDPlant, callback){
        var Query = "SELECT PlantName FROM plant WHERE IdPlant = ? ;";
        con.query(Query, [IDPlant], function(err, rows){
            if (err) throw err;
            console.log("Results from DB : ")
            console.log(rows[0]);
            callback(rows[0].PlantName) ;
        });
    },

    changePartOfferStateToRefused: function(IDOffer, isRA, callback){
        if(isRA){
            var Query = "UPDATE ra_offer SET OfferState = 6 WHERE IdRA_Offer = ? ;";
        }else{
            var Query = "UPDATE part_offer SET OfferState = 6 WHERE IdPart_Offer = ? ;";
        }
        con.query(Query, [IDOffer], function(err, rows){
            if (err) throw err;
            // console.log("Results from DB : ")
            // console.log(rows);
            callback(err, rows[0]) ;
        });
    },

    getAutoIncrementOfferValue: function(isRA, callback){
        if(isRA){
            var Query = "SELECT AUTO_INCREMENT FROM information_schema.TABLES WHERE TABLE_SCHEMA = 'ERC' AND TABLE_NAME = 'ra_offer'";
        }else{
            var Query = "SELECT AUTO_INCREMENT FROM information_schema.TABLES WHERE TABLE_SCHEMA = 'ERC' AND TABLE_NAME = 'part_offer';";
        }
        con.query(Query, function(err, rows){
            if (err) throw err;
            if(rows.length > 0){
                callback(err, rows[0].AUTO_INCREMENT);
            }else{
                callback(err, null);
            }
        });
    }
};