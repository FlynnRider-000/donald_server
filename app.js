var http = require('http');
var express = require('express');
var app = express();
var session = require('express-session')

var bodyParser = require('body-parser');
var cors = require('cors');

app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true })); 
app.use(cors());
app.use(session({ secret: 'secret', cookie: { maxAge: 3600 }}))

var signInRouter = require('./routes/signin.js');
var userRouter = require('./routes/users.js');
var serviceRouter = require('./routes/services.js');

app.use('/signin',signInRouter);
app.use('/user',userRouter);
app.use('/service', serviceRouter);

app.listen('3100');
