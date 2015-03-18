var express = require('express');
var router 	= express.Router();
var Twit 	= require('twit');

var localTweet 	= require('../model/tweet');
var Hashtag 	= require('../model/hashtag');
var Nbtweet 	= require('../model/nbtweet');
var Shooting 	= require('../model/shooting');
var time 		= require('time');

var limit 			= 500000;
var currentCountNbTweet 	= 0;
var currentCountNbHashtags 	= 0;

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
		consumer_key: "VfKB7AIYyvjrmXuWZMvWGyIhX",
		consumer_secret: "eVlJ0mV5BCoZcjPzGlmxZNQLikVOkgs1E4IyxHaJK9s9AhspZG",
		access_token: "864791401-QQIH1qisfhZW5XTNObS49JeX0D2WmmdgjXRCUITV",
		access_token_secret: "sijGOG3JJLxKgoe5qqtCMxTgmsEbHWRrzoPZ3j8Bj4B2X"
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

		localTweet.count({}, function(err, c){
	    	if(!err) {
	    		console.log('count tweets db : '+c);
				currentCountNbTweet = c;
	    	}
		});

		Hashtag.count({}, function(err, c){
	    	if(!err) {
	    		console.log('count hashtags db : '+c);
				currentCountNbHashtags = c;
	    	}
		});

		/**
		 * Get hashtag data for tweets graph viz
		 * Send data via socket.io
		 */
		socket.removeAllListeners('require_tweets_graph_hashtags');
		socket.on("require_tweets_graph_hashtags", function () {
			Hashtag.find({}, function(err, res){
				var counts = {};
				for(var i = 0, j = res.length; i < j; i++) {
				    var name = res[i].name;
				    counts[name] = counts[name] ? counts[name]+1 : 1;
				}
				socket.emit('response_tweets_graph_h', {hashtags: counts, nbhashtag: currentCountNbHashtags});
			});
	    });

	    /**
		 * Get timestamp data for tweets graph viz
		 * Send data via socket.io
		 */
		socket.removeAllListeners("require_tweets_graph_nb");
		socket.on("require_tweets_graph_nb", function () {
			Nbtweet.find({}, function(err, res){
				var counts = {};
				for(var i = 0, j = res.length; i < j; i++) {
				    var hour = res[i].hour;
				    counts[hour] = counts[hour] ? counts[hour]+1 : 1;
				}
				socket.emit('response_tweets_graph_nb', {nbtweet: counts, nb: currentCountNbTweet});
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

		socket.on('titleClicked', function(request){
			Shooting.find({"fields.titre": request.title}, function(err, data){
				socket.emit('shootingClicked', data);
			});
		});

	    /**
		 * Stream twitter
		 * Save each tweet in db with max entries as 500 000 tweets
		 * Send data via socket.io
		 */
		stream.on('tweet', function (tweet){
			socket.emit('tweet', { tweet: tweet });

			//Nb tweets in db
			currentCountNbTweet++;
			currentCountNbHashtags++;

			if(currentCountNbTweet == limit){
				localTweet.findOne({}, {}, {$sort:{'created_at': 1}}).exec(function(err, doc){
					doc.remove();
				});
				Nbtweet.findOne({}, {}, {$sort:{'created_at': 1}}).exec(function(err, doc){
					doc.remove();
				});
				
				currentCountNbTweet = limit - 1;
			}

			if (currentCountNbHashtags == limit) {
				Hashtag.findOne({}, {}, {$sort:{'created_at': 1}}).exec(function(err, doc){
					doc.remove();
				});
				currentCountNbHashtags = limit - 1;
			}

			//Set new tweet entry to save
			var lTweet = new localTweet();
			var hashtag = new Hashtag();
			var nbtweet = new Nbtweet();

			lTweet.timestamp = tweet.timestamp_ms;
			lTweet.hashtag = [];

			var m = new time.Date();
			m.setTimezone("France/Paris");
			m.setTime(tweet.timestamp_ms);
			var tHour = new Date(m).getHours();

			nbtweet.hour = tHour;


			for(var i = 0; i < tweet.entities.hashtags.length; i++){
				var hName = tweet.entities.hashtags[i].text;
				if(hName && hName != null && hName !='' && hName != undefined && hName != 'undefined') {
					hashtag.name = hName;
					lTweet.hashtag.push(hName);
				}
			}

			nbtweet.save();
			if (hashtag.name) {
				hashtag.save();
			}
			lTweet.save();
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