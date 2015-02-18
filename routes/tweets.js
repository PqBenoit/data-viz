var express = require('express');
var router = express.Router();
var Twit = require('twit');

module.exports = function (server)
{
	var io = require('socket.io')(server);
	var tweets = new Twit({
		consumer_key: "pncTvmlzl8ARPmUcQTSHEzXez",
		consumer_secret: "pPAIV4ynh3qbKNRIg5YeR6831FZIF4WJXfoJUU0RNe8esO1GJn",
		access_token: "847509511-oroeKcoKDg0imxW9fIrwcVa25u3WOgVOaI6oOH4a",
		access_token_secret: "CbVzjS1I1sNCWCe8N6JLNe8BZDcbcvYauqOs8udbZJgfb"
		});
	var paris = ["2.2515444756", "48.815778999", "2.415725708", "48.9014562785"];
	var stream = tweets.stream('statuses/filter', { locations: paris });

	/**
	 * Connection socket.io event
	 * Manage disconnect event
	 * twitter request API
	 */
	io.on("connection", function(socket){
		console.log('socket io');
		stream.on('tweet', function (tweet){
			socket.emit('tweet', { tweet: tweet });
		});

	    socket.on("require_user_timeline", function (data) {
	        tweets.get('statuses/user_timeline', {screen_name: data.screen_name, count: 5, include_rts: 0 }, function(err, data, response) {
	        	socket.emit("require_user_timeline", { tweets: data });
	        });
	    });
	    socket.on('disconnect', function () {
		    console.log('socket io disconnected');
		    socket.conn.close();
		});
	});

	/**
	 * GET '/'
	 */
	router.get('/', function(req, res, next) {
	  	res.status('200').render('tweets/index');
	});

	return router;
}