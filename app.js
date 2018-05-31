var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var users = require('./routes/users');
var account = require('./routes/account');
var jobs = require('./routes/jobs');
var apply = require('./routes/apply');
var sqldb = require('./sqldb');
var message = require('./routes/message');
var config = require('./routes/config');
// var ajax = require('./routes/ajax')

var ejs = require('ejs')

var app = express();


//"start": "node ./bin/www"

// view engine setup
// app.set('views', path.join(__dirname, 'views'));
app.engine('html',ejs.__express);
app.set('view engine', 'html');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static('public'))

app.use('/', index);
app.use('/users', users);
app.use('/account',account);
app.use('/jobs',jobs);
app.use('/apply',apply);
app.use('/message',message);
app.use('/config',config);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
 // res.render('error');
});


sqldb.sequelize.sync({force: false}).then(function() {
  console.log("Server successed to start");
}).catch(function(err){
  console.log("Server failed to start due to error: %s", err);
});


module.exports = app;


//.MySQL 密码:RI_h?dpQ+8si
