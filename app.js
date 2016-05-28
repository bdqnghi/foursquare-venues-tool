var express = require('express');
var log4js = require('log4js');
var logger = log4js.getLogger();
var bodyParser = require('body-parser');
var Server = require('http').Server;
var foursquare = require('./routes/foursquare');

var app = express();
var http = Server(app);

app.use(bodyParser.json());

// Default routes message
app.get('/', function (req, res) {
	return res.status(200).json({message: 'Welcome to We Trip API'});
});

app.use('/foursquare', foursquare);

http.listen(3000, () => {
	logger.setLevel(process.env.LOG_LEVEL || 'DEBUG');

	logger.info('Server run on 3000');
});
