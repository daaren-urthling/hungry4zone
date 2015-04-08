var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');

var users     = require('./routes/rt_users');
var foods     = require('./routes/rt_food');
var foodTypes = require('./routes/rt_foodTypes');

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
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);
app.use('/foods', foods);
app.use('/foodTypes', foodTypes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

//var connectionString = 'mongodb://localhost/hungry4zone';
//var connectionString = 'mongodb://h4zTemplate:hXfvyP46YPRH79yuPVi54okRyKs8VWO9eivlTlGZ8xY-@ds062797.mongolab.com:62797/h4zTemplate';
var connectionString = process.env.CUSTOMCONNSTR_MONGOLAB_URI;

if (typeof connectionString === "undefined")
{
  connectionString = 'mongodb://localhost/hungry4zone';
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
