var express = require('express');
var router = express.Router();

module.exports = function (io)
{
	/**
	 * GET '/'
	 */
	router.get('/', function(req, res, next) {
		
	  		var Twit = require('twit');
			var tweets = new Twit({
			consumer_key: "pncTvmlzl8ARPmUcQTSHEzXez",
			consumer_secret: "pPAIV4ynh3qbKNRIg5YeR6831FZIF4WJXfoJUU0RNe8esO1GJn",
			access_token: "847509511-oroeKcoKDg0imxW9fIrwcVa25u3WOgVOaI6oOH4a",
			access_token_secret: "CbVzjS1I1sNCWCe8N6JLNe8BZDcbcvYauqOs8udbZJgfb"
			});

			var paris = ["2.25", "48.81", "2.41", "48.9"];
			var stream = tweets.stream('statuses/filter', { locations: paris });

			io.on('connection', function(socket){
				stream.on('tweet', function (tweet){
					socket.emit('tweet', { tweet: tweet });
				});
			});

	  	res.status('200').render('tweets/index');
	});

	return router;
}