var express = require('express');
var router 	= express.Router();

/**
 * Routes for data viz
 *
 * @return router
 */
module.exports = function ()
{
	/**
	 * GET '/tweets'
	 */
	router.get('/tweets', function(req, res, next) {
		//Set new stat entry to save
	  	res.status('200').render('tweets/index');
	});

	/**
	 * GET '/shootings'
	 */
	router.get('/shootings', function(req, res, next) {
		res.status('200').render('shootings/index');
	});

	/**
	 * GET '/tree'
	 */
	router.get('/tree', function(req, res, next) {
	  	res.status('200').render('tree/index');
	});

	return router;
}