var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors')
var app = express();
app.use(cors())


let uploadFile = require('./routes/admin/fileUpload');
app.use('/upload',uploadFile);

app.io = require('socket.io')();
var socket =app.io;


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());


	// catch 404 and forward to error handler
	app.use(function(req, res, next) {
	  next(createError(404));
	});

	

  socket.on( "connection", function( socket ){
	    console.log( "A user connected" );
	    require('./routes/ContactUs')(socket);
	     require('./routes/ResearchPaper')(socket);
	});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
 	 res.status(err.status || 500);
	  res.json({
	message: err.message,
	error: err
	});
});

module.exports = app;
