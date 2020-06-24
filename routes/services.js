var express = require('express');
var router = express.Router();

const {sequelizeOp} = require('../models/sequelize');
var ServiceRequestSchema = require('../models/serviceRequestSchema');
var CustomerSchema = require('../models/customerSchema');
var RacketSchema = require('../models/racketSchema');
var StringSchema = require('../models/stringSchema');
var UserSchema = require('../models/userSchema');
var mailTrans = require('../service/mail');

ServiceRequestSchema.hasOne(CustomerSchema,{
    foreignKey: 'id',
    sourceKey: 'customerId'    
});
ServiceRequestSchema.hasOne(RacketSchema,{
    foreignKey: 'id',
    sourceKey: 'racketId'    
});
ServiceRequestSchema.hasOne(StringSchema,{
    foreignKey: 'id',
    sourceKey: 'stringId'    
});
ServiceRequestSchema.hasOne(UserSchema,{
    foreignKey: 'id',
    sourceKey: 'agentId'    
});


function getDateFormat(m_date) {
    var temp = new Date(m_date);
    var res = "";
    res += (temp.getDate() < 10 ? "0" + temp.getDate() : temp.getDate());
    res += "/"
    res += ((temp.getMonth() + 1) < 10 ? "0" + (temp.getMonth() + 1) : (temp.getMonth() + 1));
    res += "/"
    res += temp.getFullYear();
    return res;
}

function getTimeFormat(m_date) {
    var temp = new Date(m_date);
    var res = "";
    res += (temp.getHours() < 10 ? "0" + temp.getHours() : temp.getHours());
    res += ":"
    res += (temp.getMinutes() < 10 ? "0" + temp.getMinutes() : temp.getMinutes());
    return res;
}

router.post('/sendMail', async function(req,res){
    var data = JSON.parse(req.body.data);

    var temp = await UserSchema.findOne({
        where: {
            id: data.from
        },
        attributes: ["eMail"]
    });

    var temp1;
    if(data.type === 0){
        temp1 = await CustomerSchema.findOne({
            where: {
                id: data.to
            },
            attributes: ["eMail"]
        })
    }
    else{
        temp1 = await UserSchema.findOne({
            where: {
                id: data.to
            },
            attributes: ["eMail"]
        })
    }

    if(temp1 !== null){
        var mailData = {
            from:'"Donald Schulz Sport – Besaitungsservice" ' + temp.eMail,
            to: temp1.eMail,
            subject:data.subject,
            text:data.text
        };
        mailTrans.sendMail(mailData,function(error,info){
            if(error){
                res.send("Failed");
                console.log(error);
            }
            else{
                res.send("okay");
            }
        });
        
       res.send("okay");
    }
    else
        res.send("Failed");
});

router.post('/getRequests', function(req, res){
    
    if(req.body.userRole === 0)
    {
        ServiceRequestSchema.findAll({
            include: [{
                model: UserSchema,
                attributes: ['id', 'firstName', 'lastName']
            },{
                model: RacketSchema,
                attributes: ['id', 'sportType', 'Brand', 'Name', 'Grip']
            },{
                model: StringSchema,
                attributes: ['id', 'Brand', 'Name', 'Thickness', 'Color', 'Hardness']
            },{
                model: CustomerSchema,
                attributes: ['id', 'firstName', 'lastName', 'sportsClub']
            }]
        }).then(requests => {
            res.send(requests);
        })
    }
    else {
        ServiceRequestSchema.findAll({
            where:{
                agentId: req.body.userId
            },
            include: [{
                model: UserSchema,
                attributes: ['id', 'firstName', 'lastName']
            },{
                model: RacketSchema,
                attributes: ['id', 'sportType', 'Brand', 'Name', 'Grip']
            },{
                model: StringSchema,
                attributes: ['id', 'Brand', 'Name', 'Thickness', 'Color', 'Hardness']
            },{
                model: CustomerSchema,
                attributes: ['id', 'firstName', 'lastName', 'sportsClub']
            }]
        }).then(requests => {
            res.send(requests);
        })
    }
});
router.post('/deleteServiceRequest', async function(req,res) {
    await ServiceRequestSchema.destroy({
        where: {
          id: req.body.serviceId
        },
    });
    res.send("success");
});
router.post('/addRequest', async function(req, res){
    
    var data = JSON.parse(req.body.data);
    var customerId = -1, stringId = -1, racketId = -1;
    if(data.Customer){
        await CustomerSchema.create(data.Customer);
        customerId = await CustomerSchema.findOne({where:data.Customer,attributes:['id']});
    }
    if(data.String){
        await StringSchema.create(data.String);
        stringId = await StringSchema.findOne({where:data.String,attributes: ['id']});
        console.log(stringId);
    }
    if(data.Racket){
        await RacketSchema.create(data.Racket);
        racketId = await RacketSchema.findOne({where:data.Racket, attributes: ['id']});
        console.log(racketId);
    }
    if(customerId != -1)
        data.realdata.customerId = customerId.id;
    if(stringId != -1)
        data.realdata.stringId = stringId.id;
    if(racketId != -1)
        data.realdata.racketId = racketId.id;
    
    const adminList = await UserSchema.findAll({
        attributes: ['eMail', 'role'],
        where: {
            role: 0
        }
    });
    
    var toEmailList = "";
    for(var i = 0 ; i < adminList.length ; i ++){
        toEmailList = toEmailList + adminList[i].eMail;
        if(i != adminList.length - 1)
            toEmailList += ", ";
    }

    var tmep;
    if(data.realdata.agentId !== -1){
        temp = await UserSchema.findOne({
            where: {
                id: data.realdata.agentId
            },
            attributes: ["firstName","lastName","id"]
        });
    }
    else{
        temp = {firstName:'Gast',lastName:''};
    }

    var temp1 = await CustomerSchema.findOne({
        where: {
            id: data.realdata.customerId
        },
        attributes: ["firstName","lastName","id"]
    })
    
    var temp2 = await RacketSchema.findOne({
        where: {
            id: data.realdata.racketId
        },
        attributes: ["Brand","Name","Grip","id"]
    })

    var temp3 = await StringSchema.findOne({
        where: {
            id: data.realdata.stringId
        },
        attributes: ["Brand","Name","Thickness","Color","Hardness","id"]
    })

    temp4 = new Date(data.realdata.reqPickTime);
    var mailText = "";
    mailText += ("Besaitungsauftrag von " + temp.firstName + " " + temp.lastName + "\n");
    mailText += ("Name: " + temp1.lastName + ", " + temp1.firstName + "\n");
    mailText += ("Schläger: " + temp2.Brand + " " + temp2.Name + " " + temp2.Grip + "\n");
    mailText += ("Besaitung: " + temp3.Brand + " " + temp3.Name + " " + temp3.Thickness + " " + temp3.Color + " " + temp3.Hardness + "\n");
    mailText += ("Fällig bis: " + getDateFormat(temp4) + " " + getTimeFormat(temp4) + "\n");
    mailText += ("Ort: " + data.realdata.location);

    var mailData = {
        from:'"Donald Schulz Sport – Besaitungsservice" ' + 'besaitungen@ds-enterprise.de',
        to: toEmailList,
        subject:"Neuer Besaitungsauftrag",
        text:mailText
    };
    
    console.log(mailData);
    try {
        await mailTrans.sendMail(mailData);
    }
    catch(err) {
        console.log(err);
    }

    ServiceRequestSchema.create(data.realdata).then(requests => {
        res.send("success");
    });
});
router.post('/updateRequest', async function(req, res){
    
    var data = JSON.parse(req.body.data);
    var customerId = -1, stringId = -1, racketId = -1;
    if(data.Customer){
        await CustomerSchema.create(data.Customer);
        customerId = await CustomerSchema.findOne({where:data.Customer,attributes:['id']});
    }
    if(data.String){
        await StringSchema.create(data.String);
        stringId = await StringSchema.findOne({where:data.String,attributes: ['id']});
    }
    if(data.Racket){
        await RacketSchema.create(data.Racket);
        racketId = await RacketSchema.findOne({where:data.Racket, attributes: ['id']});
    }
    if(customerId != -1)
        data.realdata.customerId = customerId.id;
    if(stringId != -1)
        data.realdata.stringId = stringId.id;
    if(racketId != -1)
        data.realdata.racketId = racketId.id;
    console.log(data.realdata);
    
    ServiceRequestSchema.update(data.realdata,{
        where:{
            id: data.realdata.id
    }}).then(requests => {
        res.send("success");
    })
});
router.post('/getData', function(req,res){
    if(req.body.userRole === 0) {
        RacketSchema.findAll().then(rackets => {
            StringSchema.findAll().then(strings => {
                CustomerSchema.findAll({
                    attributes: ['id','firstName','lastName','sportsClub']
                }).then(customers => {
                    UserSchema.findAll({
                        attributes: ['id','firstName', 'lastName']
                    }).then(users => {
                        res.send({rackets,strings,customers,users});
                    })
                })
            })
        })
    }
    else {
        RacketSchema.findAll().then(rackets => {
            StringSchema.findAll().then(strings => {
                ServiceRequestSchema.findAll({
                    where:{
                        agentId: req.body.userId
                    },
                    attributes: ["agentId","customerId"]
                }).then(ids => {
                    var customerIds = [];
                    for(var i = 0 ; i < ids.length; i++)
                        customerIds.push(ids[i].customerId);
                    CustomerSchema.findAll({
                        where: {
                            id:{
                                [sequelizeOp.in]: customerIds
                            }
                        }
                    }).then(customers => {
                        UserSchema.findAll({
                        attributes: ['id','firstName', 'lastName']
                    }).then(users => {
                        res.send({rackets,strings,customers,users});
                    })
                    })  
                })
            })
        })
    }
});

router.post('/updateCustomer/', async function(req, res){
    
    var s = await CustomerSchema.update(req.body.customerInfo, {where:{id:req.body.customerInfo.id}});
    res.send("success");

});

router.post('/deleteCustomer', async function(req,res) {

    await CustomerSchema.destroy({
        where: {
          id: req.body.customerId
        },
    });
    ServiceRequestSchema.findAll({
        where:{
            customerId: req.body.customerId
        },
        attributes: ["racketId","stringId"]
    }).then(async (ids) => {
        var racketIds = [];
        for(var i = 0 ; i < ids.length; i++)
            racketIds.push(ids[i].racketId);
        var stringIds = [];
            for(var i = 0 ; i < ids.length; i++)
                stringIds.push(ids[i].stringId);
        await RacketSchema.destroy({
            where: {
                id:{
                    [sequelizeOp.in]: racketIds
                }
            }
        });
        await StringSchema.destroy({
            where: {
                id:{
                    [sequelizeOp.in]: stringIds
                }
            }
        });
        res.send("success");  
    })
    
});

router.post('/getCustomers', async function(req,res) {

    if(req.body.userRole === 0){
        CustomerSchema.findAll().then(customer => {
            res.send(customer);
        })    
    }
    else{
        ServiceRequestSchema.findAll({
            where:{
                agentId: req.body.userId
            },
            attributes: ["agentId","customerId"]
        }).then(ids => {
            var customerIds = [];
            for(var i = 0 ; i < ids.length; i++)
                customerIds.push(ids[i].customerId);
            CustomerSchema.findAll({
                where: {
                    id:{
                        [sequelizeOp.in]: customerIds
                    }
                }
            }).then(customer => {
                res.send(customer);
            })  
        })
    }
});

router.post('/getRackets', async function(req,res) {

    if(req.body.userRole === 0){
        ServiceRequestSchema.findAll({
            attributes: ["racketId","customerId"],
            group: ["racketId"],
            include: [{
                model: RacketSchema,
                attributes: ['id', 'sportType', 'Brand', 'Name', 'Grip']
            },{
                model: CustomerSchema,
                attributes: ['firstName', 'lastName', 'sportsClub']
            }]
        }).then(ids => {
            res.send(ids);
        });
    }
    else{
        ServiceRequestSchema.findAll({
            where: {
                agentId: req.body.userId
            },
            group: ["racketId"],
            attributes: ["racketId","customerId"],
            include: [{
                model: RacketSchema,
                attributes: ['id', 'sportType', 'Brand', 'Name', 'Grip']
            },{
                model: CustomerSchema,
                attributes: ['firstName', 'lastName', 'sportsClub']
            }]
        }).then(ids => {
            res.send(ids);
        });
    }
});

router.post('/updateRacket/', async function(req, res){
    
    var s = await RacketSchema.update(req.body.racketInfo, {where:{id:req.body.racketInfo.id}});
    res.send("success");

});

router.post('/deleteRacket', async function(req,res) {

    await RacketSchema.destroy({
        where: {
          id: req.body.racketId
        },
    });
    ServiceRequestSchema.findAll({
        where:{
            racketId: req.body.racketId
        },
        attributes: ["stringId"]
    }).then(async (ids) => {
        var stringIds = [];
            for(var i = 0 ; i < ids.length; i++)
                stringIds.push(ids[i].stringId);
        await StringSchema.destroy({
            where: {
                id:{
                    [sequelizeOp.in]: stringIds
                }
            }
        });
        res.send("success");  
    })
    
});

router.post('/getStrings', async function(req,res) {

    if(req.body.userRole === 0){
        ServiceRequestSchema.findAll({
            attributes: ["racketId","customerId","stringId"],
            group: ["stringId"],
            include: [{
                model: RacketSchema,
                attributes: ['sportType', 'Brand', 'Name', 'Grip']
            },{
                model: CustomerSchema,
                attributes: ['firstName', 'lastName', 'sportsClub']
            },{
                model: StringSchema,
            }]
        }).then(ids => {
            res.send(ids);
        });
    }
    else{
        ServiceRequestSchema.findAll({
            attributes: ["racketId","customerId","stringId"],
            group: ["stringId"],
            where: {
                agentId: req.body.userId
            },
            include: [{
                model: RacketSchema,
                attributes: ['sportType', 'Brand', 'Name', 'Grip']
            },{
                model: CustomerSchema,
                attributes: ['firstName', 'lastName', 'sportsClub']
            },{
                model: StringSchema,
            }]
        }).then(ids => {
            res.send(ids);
        });
    }
});

router.post('/updateString/', async function(req, res){
    
    var s = await StringSchema.update(req.body.stringInfo, {where:{id:req.body.stringInfo.id}});
    res.send("success");

});

router.post('/deleteString', async function(req,res) {

    await StringSchema.destroy({
        where: {
          id: req.body.stringId
        },
    });    
    res.send("success");
});

router.post('/getDropdownList', async function(req,res) {
    RacketSchema.findAll({
        order: ["Brand"],
        attributes: ["Brand","Name"]
    }).then(rackets => {
        StringSchema.findAll({
            order: ["Brand"],
            attributes: ["Brand","Name"]
        }).then(strings => {
            res.send({rackets, strings});
        })
    });
});
module.exports = router;
