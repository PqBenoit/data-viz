var express = require('express');
var router = express.Router();

module.exports = function (server)
{
	router.get('/', function(req, res, next) {
	  	res.status('200').render('tree/index');
	});

	return router;
}