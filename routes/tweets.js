var express = require('express');
var router = express.Router();
var Twit = require('twit');

var localTweet = require('../model/tweet');

var limit = 500000;
var currentCount = 0;

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
		console.log('connection socket io');

		socket.on("require_tweets_graph", function () {
			localTweet.find({}, function(err, res){
				socket.emit('lTweetHashtags', {lTweetGraph: res});
			});
	    });

		stream.on('tweet', function (tweet){
			socket.emit('tweet', { tweet: tweet });

			currentCount++;


			if(currentCount == limit){
				localTweet.findOne({}, {}, {sort:{'created_at': 1}}, function(err, result){
					result.remove();
				});			
				currentCount = limit - 1;
			}

			var lTweet = new localTweet();

			lTweet.timestamp = tweet.timestamp_ms;
			lTweet.hashtag = [];

			for(var i = 0; i < tweet.entities.hashtags.length; i++){
				lTweet.hashtag.push(tweet.entities.hashtags[i].text);
			}

			lTweet.save(function(err, result){
				if(!err)
					console.log(currentCount);
			});
		});

	    socket.on("require_user_timeline", function (data) {
	        tweets.get('statuses/user_timeline', {screen_name: data.screen_name, count: 5, include_rts: 0 }, function(err, data, response) {
	        	socket.emit("require_user_timeline_response", { tweets: data });
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