var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

const campsiteRouter = require('./routes/campsiteRouter');
const promotionRouter = require('./routes/promotionRouter');
const partnerRouter = require('./routes/partnerRouter');

//connecting to mongoDB
const mongoose = require('mongoose');

const url = 'mongodb://localhost:27017/nucampsite';
const connect = mongoose.connect(url, {
    useCreateIndex: true,
    useFindAndModify: false,
    useNewUrlParser: true, 
    useUnifiedTopology: true
});

connect.then(() => console.log('Connected correctly to server'), // connect method is a promise object
    err => console.log(err) // the way to handle an error as a second argument
);

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// The below order is important

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser('12345-67890-09876-54321')); // cookie secret key to "sign" cooke


//Authentication middleware

function auth(req, res, next) {
    if (!req.signedCookies.user) { // signedCookies property of the request object is provided by cookie parser; signed cookie is parsed; property USER will be added to cookie
        console.log(req.headers);
        const authHeader = req.headers.authorization;
        if (!authHeader) { //checks if authorization header is empty
            const err = new Error('You are not authenticated!');
            res.setHeader('WWW-Authenticate', 'Basic'); //requesting authentication with the type Basic
            err.status = 401;
            return next(err); //Express deales with the error and also challenges the client to provide correct credentilas (to create authorization header)
        }
      //authorization header is provided
        const auth = Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':'); //Buffer parses the authorization header into a 2 item array (from base 64 encoded stream format)
        const user = auth[0];
        const pass = auth[1];
        if (user === 'admin' && pass === 'password') {
            res.cookie('user', 'admin', {signed: true}); // new cookie created; cookie's property USER is added;  {signed: true} lets know to use the secret key to SIGN cookie
            return next(); // authorized
        } else {
            const err = new Error('You are not authenticated!');
            res.setHeader('WWW-Authenticate', 'Basic');      
            err.status = 401;
            return next(err);
        }

  } else {
    if (req.signedCookies.user === 'admin') {  
        return next();  //access granted from the server
    } else {
        const err = new Error('You are not authenticated!');
        err.status = 401;
        return next(err);
    }
  }
}

app.use(auth);





app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

app.use('/campsites', campsiteRouter);
app.use('/promotions', promotionRouter);
app.use('/partners', partnerRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
