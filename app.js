var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var ApplicationError = require('./utils/applicationError.js');

var routes = require('./routes/index');

var users     = require('./routes/rt_users');
var foods     = require('./routes/rt_foods');
var foodTypes = require('./routes/rt_foodTypes');
var meals     = require('./routes/rt_meals');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
//app.use(express.session({secret: '557C486AE8374CC48EE6E802394ADF54'}));
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: '557C486AE8374CC48EE6E802394ADF54',
  resave: false,
  saveUninitialized: true
}));


app.use('/', routes);
app.use('/users', users);
app.use('/foods', foods);
app.use('/foodTypes', foodTypes);
app.use('/meals', meals);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// custom error handlers
app.use(function(appErr, req, res, next) {
  if (res.headersSent) {
    return next(err);
  }

  if (appErr instanceof ApplicationError) {
    console.error(appErr.message);
    res.status(500).json(appErr);
  }
  else {
    return next(appErr);
  }
});



// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
if (app.get('env') != 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: {}
    });
  });
}

//var connectionString = 'mongodb://localhost/hungry4zone';
//var connectionString = 'mongodb://h4zTemplate:hXfvyP46YPRH79yuPVi54okRyKs8VWO9eivlTlGZ8xY-@ds062797.mongolab.com:62797/h4zTemplate';
var connectionString = process.env.CUSTOMCONNSTR_MONGOLAB_URI;
global.H4ZURL = "hungry4zone.azurewebsites.net";

if (typeof connectionString === "undefined")
{
  connectionString = 'mongodb://localhost/hungry4zone';
  global.H4ZURL = "localhost:3000";
  console.log("Development environment, connecting to local DB");
}

var mongoose = require('mongoose');
mongoose.connect(connectionString, function(err) {
    if(err) {
        console.log('connection error', err);
    } else {
        console.log('successfully connected');
    }
});

module.exports = app;
