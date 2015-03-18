/**
 * @param TweetGraph my
 * @param socket.io io
 * @param jQuery $
 * @return TweetGraph
 * @use jQuery flot plugin
 */
var TweetGraph = (function(my, io, $)
{
	my.socket = io;
	my.data = [];
	my.dataset =  [];
	my.options = {};
	my.hashtagsArray = {init: 0};
	my.hastagSort = [];

	/**
	 * Init graph options, construct data array, then build graph
	 * @param res
 	 * @return void
	 */
	my.buildGraph = function (res)
	{
		for (nbtweet in res.nbtweet.length) {
			my.data.push([nbtweet.hour, nbtweet.nb]);
		}

		my.options = {
		    series: {
                bars: {
                    show: true
                }
            },
            bars: {
                align: "center",
                barWidth: 0.5,
                fillColor: { colors: [{ opacity: 1 }, { opacity: 1}] }
            },
		    xaxis: {
		    	color: "black",
			    tickSize: 1,
			    tickDecimals: 0,
			    min: 0,
			    max: 23
		    },
		    yaxis: {
		    	color: "black",
		        min: 0,
		        tickSize: 5000,
		        tickDecimals: 0,
		        axisLabelUseCanvas: true
		    },
		    legend: {        
		        show: false
		    },
		    grid: {                
		        backgroundColor: "#000000",
		        tickColor: "#000000",
		        borderWidth: 0,
		        hoverable: true
		    }
		};

		//Build first graph param array
		my.dataset.push({ label: "Nombre de tweets répartient par heures", data: my.data, color: "#ffffff" });

	    $.plot($("#nb-tweets"), my.dataset, my.options);
	};

	/**
	 * Build hashtags top graph
	 * @param res
	 * @return void
	 */
	my.topHashtag = function(res){
		var total = 0;
		for (var hashtag in res.hashtags) {
		    my.hastagSort.push([hashtag.name, hashtag.nb])
		    total += hashtag.nb;
		}

		my.hastagSort.sort(function(a, b) {return b[1] - a[1]});

		var top1 = Math.round((my.hastagSort[0][1]/total)*10000);
		$('#top1-graph').css('height', top1+'px');
		$('#top1-name').text('#'+my.hastagSort[0][0]+' - '+top1);

		var top2 = Math.round((my.hastagSort[1][1]/total)*10000);
		$('#top2-graph').css('height', top2+'px');
		$('#top2-name').text('#'+my.hastagSort[1][0]+' - '+top2);

		var top3 = Math.round((my.hastagSort[2][1]/total)*10000);
		$('#top3-graph').css('height', top3+'px');
		$('#top3-name').text('#'+my.hastagSort[2][0]+' - '+top3);
	};

	/**
	 * Init TweetGraph Module
	 * @return void
	 */
	my.init = function ()
	{
		$("#button-stats-loader").css('display', "block");
		console.log('init TweetGraph Module');

		my.socket.emit('require_tweets_graph_hashtags');
		my.socket.emit('require_tweets_graph_nb');

		my.socket.removeAllListeners("response_tweets_graph_h");
		my.socket.on('response_tweets_graph_h', function(res){
			my.topHashtag(res);
		});

		my.socket.removeAllListeners("response_tweets_graph_nb");
		my.socket.on('response_tweets_graph_nb', function(res){
			my.buildGraph(res);
			$("#button-stats-loader").css('display', "none");
			$(".show-stats-button").css('display', "block");
		});

		$('#load-stats').click(function(){
			if ($('.container.stats').css('display') != 'block') {
				$('.container.stats').css('display', 'block');
			}
			var offset = $(window).height();
			options = { scrollTop: offset };
			$('html').animate(options, 1000);
		});
	};

	return my;

}(TweetGraph || {}, io || {}, jQuery));
