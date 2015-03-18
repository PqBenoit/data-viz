var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var app = express();

var http = require('http');

/**
 * Get port from environment and store in Express app.
 * @use ./bin/www
 */
app.port = normalizePort(process.env.PORT || '3000');

/**
* Create HTTP server and store in Express app.
* @use ./bin/wwww
*/
app.server = http.createServer(app);

/**
 * MONGOLAB Connection
 */
var mongoose = require('mongoose');
// var mongolabStringConnexion = 'localhost:27017';
var mongolabStringConnexion = 'mongodb://root:root-kikeriki@ds039231.mongolab.com:39231/kikeriki';
mongoose.connect(mongolabStringConnexion);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error'));
db.once('open', function callback(){
    console.log('Connection establish to: mongolab');
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

/**
 * Routes
 * @see ./routes/
 */
var routes = require('./routes/index');
var viz = require('./routes/viz')();
app.use('/', routes);
app.use('/', viz);

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


module.exports = app;

/**
* Normalize a port into a number, string, or false.
*/
function normalizePort(val) {
  var port = parseInt(val, 10);
  if (isNaN(port)) {
    // named pipe
    return val;
  }
  if (port >= 0) {
    // port number
    return port;
  }
  return false;
}