/**
 * @param Sidebar my
 * @param socket.io io
 * @param jQuery $
 * @return Sidebar
 */
var Sidebar = (function(my, io, $){
	my.sidebar 			= $('.tweet-slide');
	my.sidebarContent 	= $('.tweet-slide .tweet-content');
	my.sidebarTimeline 	= $('.tweet-slide .tweet-timeline');
	my.socket 			= io;

	/**
	 * Open sidebar
	 * @param float posLeft
	 * @param float posTop
	 * @param JSON data
	 * @return void
	 */
	my.open = function (posLeft, posTop, data)
	{
		var content = "<h2>Posté par <a href='https://twitter.com/"+data.tweet.user.screen_name+"' target='_blank'>@"+data.tweet.user.screen_name+"</a></h2><p>\""+data.tweet.text+"\"</p>";
		var contenTimeline = '';

		my.socket.emit('require_user_timeline', { screen_name: data.tweet.user.screen_name });
		my.socket.on('require_user_timeline', function(user_timeline){
			for (i = 0, j = user_timeline.tweets.length ; i < j ; i++) {
				contenTimeline += "<h2><a href='https://twitter.com/"+data.tweet.user.screen_name+"' target='_blank'>@"+data.tweet.user.screen_name+"</a></h2><p>"+user_timeline.tweets[i].text+"</p>";
			}
			my.sidebarTimeline.hide().html(contenTimeline).fadeIn();
		});

		my.sidebarContent.fadeToggle();
		my.sidebarTimeline.fadeToggle();

		if (my.sidebar.css('display')=='block') {
			my.close();
		}

		my.sidebar.animate({
			width: 'toggle'
		}, 300, function(){
			my.sidebarContent.html(content);
		});
	};

	/**
	 * Close sidebar
	 * @return void
	 */
	my.close = function ()
	{
		my.sidebarContent.fadeToggle();
		my.sidebarTimeline.fadeToggle();

		my.sidebar.animate({
			width: 'toggle'
		}, 200);
	};

	/**
	 * Init Sidebar, set default status 'close'
	 * @return void
	 */
	my.init= function()
	{
		console.log('init Sidebar Module');
		my.sidebar.css('visibility', 'hidden');
		my.close();
		setTimeout(function(){my.sidebar.css('visibility', 'visible');}, 200);
	}

	return my;
}(Sidebar || {}, socket || {}, jQuery));