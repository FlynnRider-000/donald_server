var express = require('express');
var router = express.Router();

var UserSchema =require('../models/userSchema');

router.post('/', function(req, res){
    
    var username = req.body.name;
    var password = req.body.pass;
    UserSchema.findOne({
        where: {
            userName: username,
            passWord: password
        }
    }).then(user => {
        if(user != null) {

            req.session.role = user.role;

            var userInfo = {};
            userInfo.exist = 1;
            userInfo.id = user.id;
            userInfo.name = user.fullName;
            userInfo.firstName = user.firstName;
            userInfo.lastName = user.lastName;
            userInfo.role = user.role;
            res.send(userInfo);    
        }
        else {
            var userInfo = {};
            userInfo.exist = 0;
            res.send(userInfo);
        }
    })
});

module.exports = router;
