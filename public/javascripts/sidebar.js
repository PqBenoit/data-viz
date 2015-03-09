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
	my.timelieButton 	= $('.tweet-slide .timeline-button');
	my.contenTimeline 	= '';
	my.socket 			= io;

	/**
	 * Open sidebar& load user's timeline by socket io event
	 * @param float posLeft
	 * @param float posTop
	 * @param JSON data
	 * @return void
	 */
	my.open = function (posLeft, posTop, data)
	{
		var content = "<h2><img src='"+data.tweet.user.profile_image_url+"'></h2><p>"+data.tweet.text+"</p>";
		my.contenTimeline = '';

		my.socket.removeAllListeners("require_user_timeline_response");
		my.socket.emit('require_user_timeline', { screen_name: data.tweet.user.screen_name });
		my.socket.on('require_user_timeline_response', function(user_timeline){
			for (i = 0, j = user_timeline.tweets.length ; i < j ; i++) {
				my.contenTimeline += "<p>"+user_timeline.tweets[i].text+"</p>";
			}
		});

		my.sidebarContent.fadeToggle();

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
		my.sidebarTimeline.fadeOut();
		my.sidebarTimeline.html('');
		$('.tweet-slide .timeline-button').children('.fa').removeClass('fa-minus-square-o').addClass('fa-plus-square-o');

		my.sidebar.animate({
			width: 'toggle'
		}, 150);
	};

	/**
	 * Init Sidebar, set default status 'close' & add click event on timeline button plus
	 * @return void
	 */
	my.init= function()
	{
		console.log('init Sidebar Module');

		my.sidebar.css('visibility', 'hidden');

		my.close();

		my.timelieButton.click(function (){
			if($(this).children('.fa').hasClass('fa-plus-square-o')) {
				my.sidebarTimeline.hide().html(my.contenTimeline).fadeIn();
				$(this).children('.fa').removeClass('fa-plus-square-o').addClass('fa-minus-square-o');
			} else {
				my.sidebarTimeline.fadeOut();
				my.sidebarTimeline.html('');
				$(this).children('.fa').removeClass('fa-minus-square-o').addClass('fa-plus-square-o');
			}
		});

		setTimeout(function(){my.sidebar.css('visibility', 'visible');}, 200);
	}

	return my;
}(Sidebar || {}, io || {}, jQuery));