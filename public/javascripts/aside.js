var Aside = 
{
	open: function (posLeft, posTop, data)
	{
		var content 		= "<h2><a href='https://twitter.com/"+data.tweet.user.screen_name+"' target='_blank'>@"+data.tweet.user.screen_name+"</a></h2><p>"+data.tweet.text+"</p>";
		var aside 			= $('.tweetSlide');
		var asideContent 	= $('.tweetSlide .tweet-content');

		asideContent.fadeToggle();

		if (aside.css('display')=='block') {
			Aside.close();
		}

		aside.animate({
			width: 'toggle'
		}, 300, function(){
			asideContent.html(content);
		});
	},
	close: function ()
	{
		var aside 			= $('.tweetSlide');
		var asideContent 	= $('.tweetSlide .tweet-content');

		asideContent.fadeToggle();

		aside.animate({
			width: 'toggle'
		}, 200);
	},
	init: function()
	{
		var aside = $('.tweetSlide');

		aside.css('visibility', 'hidden');
		Aside.close();
		setTimeout(function(){$('.tweetSlide').css('visibility', 'visible');}, 200);
	}
};