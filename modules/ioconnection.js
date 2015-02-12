// var express = require('express');
// var app = express();

// var port = '3000';
// app.set('port', port);

// var http = require('http');

// var server = http.createServer(app);

// var socketConnection = {
// 	ioConnect: function(){
// 		var io = require('socket.io')(server);
// 		return io;
// 	},
// 	twitter: function(){
// 		var Twit = require('twit');
// 		var tweets = new Twit({
// 		  consumer_key: "pncTvmlzl8ARPmUcQTSHEzXez",
// 		  consumer_secret: "pPAIV4ynh3qbKNRIg5YeR6831FZIF4WJXfoJUU0RNe8esO1GJn",
// 		  access_token: "847509511-oroeKcoKDg0imxW9fIrwcVa25u3WOgVOaI6oOH4a",
// 		  access_token_secret: "CbVzjS1I1sNCWCe8N6JLNe8BZDcbcvYauqOs8udbZJgfb"
// 		});

// 		var paris = ["2.25", "48.81", "2.41", "48.9"];
// 		var stream = tweets.stream('statuses/filter', { locations: paris });
// 		return stream;
// 	}
// };

// module.exports = socketConnection;