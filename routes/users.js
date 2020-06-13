var express = require('express');
var router = express.Router();

var UserSchema =require('../models/userSchema');

function checkSignIn(req, res){
    if(req.session.role != undefined){
        if(req.session.role == 1)
            next();
        else
            res.send("notAdmin");
    } else {
       res.send("login");
    }
}

router.post('/getUsers/', function(req, res){
    
    UserSchema.findAll({
        attributes: ['id', 'userName', 'lastName', 'firstName', 'street', 'number', 'ZIPcode', 'city', 'sportsClub', 'eMail', 'phone', 'role']
    }).then(users => {
        res.send(users);
    })
});

router.post('/addUser/', async function(req, res){
    
    var ttmpObj1 = new UserSchema({...req.body.userInfo,passWord:'123456'});
    ttmpObj1 = await ttmpObj1.save();

    res.send("success");
});

router.post('/updateUser/', async function(req, res){
    
    var s = await UserSchema.update(req.body.userInfo, {where:{id:req.body.userInfo.id}});
    res.send("success");

});

router.post('/deleteUser', async function(req,res) {

    var s = await UserSchema.destroy({
        where: {
          id: req.body.userId
        }
    });
    res.send("success");
});

router.post('/getUser', async function(req,res) {

    UserSchema.findOne({
        where: {
            id: req.body.userId
        },
        attributes: ['id', 'userName', 'lastName', 'firstName', 'street', 'number', 'ZIPcode', 'city', 'sportsClub', 'eMail', 'phone']
    }).then(user => {
        res.send(user);
    })
});

router.post('/updatePass', function(req,res){
    if(req.body.pass == req.body.confirm){
        UserSchema.findOne({
            where: {
                id: req.body.userId
            },
            attributes: ['passWord']
        }).then(async (user) => {
            if(user.passWord == req.body.opass)
            {
                var s = await UserSchema.update({passWord: req.body.pass}, {where:{id:req.body.userId}});
                res.send("3");
            }
            else
                res.send("2");
        })
    }
    else {
        res.send("1");
    }
});
module.exports = router;
