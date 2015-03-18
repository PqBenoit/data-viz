/**
 * @param Module my
 * @param Module Map
 * @param socket.io io
 * @param Module TweetGraph
 * @param jQuery $
 * @return Module Tweet
 */
var Tweet = (function(my, Map, io, Sidebar, TweetGraph, $)
{
	my.socket = io;

	/**
	 * Websocket connection, with socket.io
	 * Listen 'tweet' socket.io event
	 * @return void
	 */
	my.startStream = function ()
	{
		my.socket.on('tweet', function(data){
			my.setTweetPosition(data);
		});
	};

	/**
	 * Set tweet position on map
	 * @see raphael.js
	 * @param JSON data
	 * @return void
	 */
	my.setTweetPosition = function (data)
	{
		var circle = undefined;

		if (null != data.tweet.coordinates) {
			var pos = Map.getPixelPosition(Map.rsr, data.tweet.coordinates.coordinates[0], data.tweet.coordinates.coordinates[1]);

			circle = Map.rsr.circle(pos.x, pos.y, 10);
			circle.attr('fill', '#2c9fc4');
			circle.attr('stroke', 'none');
			
			$(circle.node).click(function(){
				Sidebar.open($(this).offset().left, $(this).offset().top, data);
			});
		}
	};

	/**
	 * Init Tweet Module
	 * return void
	 */
	my.init = function ()
	{
		console.log('init Tweet Module');
		my.startStream();

		$('.fa-close').click(function(){
			Sidebar.close();
		});

		$('svg').on('DOMNodeInserted', function(){

		});
	};


	return my;
}(Tweet || {}, Map || {}, io || {}, Sidebar || {}, TweetGraph || {}, jQuery));
