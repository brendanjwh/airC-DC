var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var users = require('./routes/users');
var drums = require('./routes/drums');
var piano = require('./routes/piano');
var trump = require('./routes/trump');
var scenes = require('./routes/scenes');
var bass = require('./routes/bass');
var dj1 = require('./routes/dj1');
var dj2 = require('./routes/dj2');

var app = express();

// view engine setup
app.engine('html', require('ejs').renderFile);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '/public')));
app.use('/favicon.ico', express.static('images/favicon.ico'));

app.use('/', index);
app.use('/users', users);

app.get('/drums', function(req, res) { res.render('drums')})
app.get('/team', function(req, res) { res.render('team')})
app.get('/piano', function(req, res) { res.render('piano')})
app.get('/bass', function(req, res) { res.render('bass')})
app.get('/trump', function(req, res) { res.render('trump')})
app.get('/dj1', function(req, res) { res.render('dj1')})
app.get('/dj2', function(req, res) { res.render('dj2')})
app.get('/scenes', function(req, res) { res.render('scenes')})


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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
