var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var logger = require('morgan');
var cors = require('cors')
var app = express();
let requestParser = require('./midddleware/request-parser.js')
app.use(cors())
app.use(cookieParser());	
app.use(bodyParser.raw({type:'application/vnd.cinoid-dashboard',limit:'100mb'}));
app.use(requestParser())

let researchP = require('./routes/admin/ResearchPaper');
app.use('/research-paper',researchP);

app.io = require('socket.io')();
var socket =app.io;

 app.use(express.static(__dirname + '/static'));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

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
 	 res.status(err.status);
	  res.json({
	message: err.message,
	error: err
	});
});

module.exports = app;
