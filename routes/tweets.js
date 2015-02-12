var express = require('express');
var ee = require('event-emitter');
var router = express.Router();

var io = require('../modules/ioconnection')

/**
 * GET '/'
 */
router.get('/', function(req, res, next) {
  res.status('200').render('tweets/index');
});

module.exports = router;