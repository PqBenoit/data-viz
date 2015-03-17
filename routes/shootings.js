var express = require('express');
var router = express.Router();
var Shooting = require('../model/shooting');

module.exports = function ()
{
	/**
	 * GET '/'
	 */
	router.get('/', function(req, res, next) {
		Shooting.find({}, '-_id -__v -recordid -datasetid -date_debut_evenement', function(err, data){
			if(!err) {
				console.log(data);
				res.status('200').render('shootings/index', {data: data});
			}
		});
	});

	return router;
};