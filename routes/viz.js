var express = require('express');
var router 	= express.Router();
var Twit 	= require('twit');

var localTweet 	= require('../model/tweet');
var Hashtag 	= require('../model/hashtag');
var Nbtweet 	= require('../model/nbtweet');
var Shooting 	= require('../model/shooting');
var time 		= require('time');

var limit 			= 500000;
var currentCount 	= 0;

var titles = [];

/**
 * Routes for data viz
 * @param server, to init socket.io
 *
 * @return router
 */
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

		/**
		 * Get hashtag data for tweets graph viz
		 * Send data via socket.io
		 */
		socket.removeAllListeners('require_tweets_graph_hashtags');
		socket.on("require_tweets_graph_hashtags", function () {
			Hashtag.find({}, function(err, res){
				socket.emit('response_tweets_graph_h', {hashtags: res});
			});
	    });

	    /**
		 * Get timestamp data for tweets graph viz
		 * Send data via socket.io
		 */
		socket.removeAllListeners("require_tweets_graph_nb");
		socket.on("require_tweets_graph_nb", function () {
			Nbtweet.find({}, function(err, res){
				socket.emit('response_tweets_graph_nb', {nbtweet: res});
			});
	    });

		/**
		 * Get data for shootings viz
		 * Send data via socket.io
		 */
	    socket.on("require_shootings", function () {
	    	console.log('require shootings db for map');

	    	Shooting.distinct("fields.titre", function(err, data){
	    		if(!err)
	    			titles = data;
	    		for(var i = 0; i < titles.length; i++){
	    			Shooting.findOne({"fields.titre": data[i]}, function(err, data){
	    				socket.emit('shootings', {data: data});
	    			});
	    		}
	    	});
	    	
	    });

	    localTweet.count({}, function(err, c){
	    	console.log('count tweets db');
			currentCount = c;
		});

	    /**
		 * Stream twitter
		 * Save each tweet in db with max entries as 500 000 tweets
		 * Send data via socket.io
		 */
		stream.on('tweet', function (tweet){
			socket.emit('tweet', { tweet: tweet });

			//Nb tweets in db
			currentCount++;

			if(currentCount == limit){
				localTweet.findOne({}, {}, {sort:{'created_at': 1}}, function(err, result){
					// Remove from stat
					result.remove();
				});			
				currentCount = limit - 1;
			}

			//Set new tweet entry to save
			var lTweet = new localTweet();
			lTweet.timestamp = tweet.timestamp_ms;
			lTweet.hashtag = [];

			var m = new time.Date();
			m.setTimezone("France/Paris");
			m.setMilliseconds(tweet.timestamp_ms);
			tHour = new Date(m).getHours();
			console.log(tHour);
			Nbtweet.findOne({hour: tHour}, function(err, res){
				if (res) {
					res.nb++;
					res.save();
				} else {
					var nbtweet = new Nbtweet();
					nbtweet.hour = tHour;
					nbtweet.nb = 1;
					nbtweet.save();
				}
			})

			for(var i = 0; i < tweet.entities.hashtags.length; i++){
				var hName = tweet.entities.hashtags[i].text;
				Hashtag.findOne({name: hName}, function(err, res){
					if (res) {
						res.nb++;
						res.save();
					} else {
						var hashtag = new Hashtag();
						hashtag.name = hName;
						hashtag.nb = 1;
						hashtag.save();
					}
				});

				lTweet.hashtag.push(hName);
			}

			lTweet.save(function(err, result){
				// if(!err)
				// 	console.log(currentCount);
			});
		});

		/**
		 * Get last five tweets of a specific user to show a preview of his timeline
		 * Envent emited on tweet circle click from map
		 * Send data via socket.io
		 */
	    socket.on("require_user_timeline", function (data) {
	    	console.log('require tweets for user');
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
	 * GET '/tweets'
	 */
	router.get('/tweets', function(req, res, next) {
		//Set new stat entry to save
		Hashtag.find({}, function(err, res){
			console.log(res);
		});
		Nbtweet.find({}, function(err, res){
			console.log(res);
		});
	  	res.status('200').render('tweets/index');
	});

	/**
	 * GET '/shootings'
	 */
	router.get('/shootings', function(req, res, next) {
		res.status('200').render('shootings/index');
	});

	return router;
}