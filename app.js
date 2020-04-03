var createError = require('http-errors');
var express = require('express');
var path = require('path');

var logger = require('morgan');


const passport = require('passport');

const config = require('./config');






var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

const campsiteRouter = require('./routes/campsiteRouter');
const promotionRouter = require('./routes/promotionRouter');
const partnerRouter = require('./routes/partnerRouter');
const uploadRouter = require('./routes/uploadRouter');


//connecting to mongoDB
const mongoose = require('mongoose');

const url = config.mongoUrl;
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

// Secure traffic only; redirecting traffic
app.all('*', (req, res, next) => { // catches every type of request (get, put, post, delete); '*' wild card used
  if (req.secure) { // secure property is set automatically as TRUE by Express when connection that is used is HTTPS
    return next();
  } else {
      console.log(`Redirecting to: https://${req.hostname}:${app.get('secPort')}${req.url}`);
      res.redirect(301, `https://${req.hostname}:${app.get('secPort')}${req.url}`);
  }
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// The below order is important

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
/* app.use(cookieParser('12345-67890-09876-54321')); */        // cookie secret key to "sign" cooke



app.use(passport.initialize());


app.use('/', indexRouter);
app.use('/users', usersRouter);

//Authentication middleware







app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

app.use('/campsites', campsiteRouter);
app.use('/promotions', promotionRouter);
app.use('/partners', partnerRouter);
app.use('/imageUpload', uploadRouter);


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
