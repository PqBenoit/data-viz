/**
 * @param TweetGraph my
 * @param socket.io io
 * @param Helpers helpers
 * @param jQuery $
 * @return TweetGraph
 * @use jQuery flot plugin
 */
var TweetGraph = (function(my, io, helpers, $)
{
	my.socket = io;
	my.data = [];
	my.dataset =  [];
	my.options = {};
	my.hashtagsArray = {init: 0};
	my.hashtagSort = [];

	/**
	 * Init graph options, construct data array, then build graph
	 * @param res
 	 * @return void
	 */
	my.buildGraph = function (res)
	{
		for (nbtweet in res.nbtweet) {
			my.data.push([nbtweet, res.nbtweet[nbtweet]]);
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
		    	color: 'rgba(255,255,255,0.2)',
			    tickSize: 1,
			    tickDecimals: 0,
			    tickFormatter: function(val) {
			    	return val+"h";
			    },
			    min: 0,
			    max: 23
		    },
		    yaxis: {
		    	color: 'rgba(255,255,255,0.2)',
		        min: 0,
		        tickSize: 5000,
		        tickDecimals: 0,
		        axisLabelUseCanvas: true
		    },
		    legend: {        
		        show: false
		    },
		    grid: {              
		        backgroundColor: 'rgba(255,255,255,0)',
		        tickColor: '',
		        borderWidth: 0,
		        hoverable: true
		    }
		};

		//Build first graph param array
		my.dataset.push({ label: "Nombre de tweets répartient par heures", data: my.data, color: "#ffffff" });

	    $.plot($("#nb-tweets"), my.dataset, my.options);
	    $('#nbtweet').html(res.nb);
	};

	/**
	 * Build hashtags top graph
	 * @param res
	 * @return void
	 */
	my.topHashtag = function(res){
		var total = 0;
		for (hashtag in res.hashtags) {
		    total += res.hashtags[hashtag];
		}
		my.hashtagSort = helpers.sortObject(res.hashtags);

		var top1 = my.hashtagSort[0].value;
		$('#top1-graph').css('height', (Math.round((top1/total)*2000))+'px');
		$('#top1-name').text('#'+my.hashtagSort[0].key+' - '+top1);

		var top2 = my.hashtagSort[1].value;
		$('#top2-graph').css('height', (Math.round((top2/total)*2000))+'px');
		$('#top2-name').text('#'+my.hashtagSort[1].key+' - '+top2);

		var top3 = my.hashtagSort[2].value;
		$('#top3-graph').css('height', (Math.round((top3/total)*2000))+'px');
		$('#top3-name').text('#'+my.hashtagSort[2].key+' - '+top3);

		$('#nbhashtag').html(res.nbhashtag);
	};

	/**
	 * Manage stats displaying
	 * @return void
	 */
	my.showStats = function()
	{
		var offset = $(window).height();
		$(".show-stats-button").css('display', "block");
		$('#load-stats').click(function(){
			if ($('.container.stats').css('display') != 'block') {
				$(".show-stats-button").css('display', "none");
				$("#button-stats-loader").css('display', "block");

				my.socket.emit('require_tweets_graph_hashtags');
				my.socket.emit('require_tweets_graph_nb');

				my.socket.removeAllListeners("response_tweets_graph_nb");
				my.socket.on('response_tweets_graph_nb', function(res){
					console.log('stats response');
					my.buildGraph(res);
					my.socket.removeAllListeners("response_tweets_graph_h");
					my.socket.on('response_tweets_graph_h', function(res){
						my.topHashtag(res);
						$("#button-stats-loader").css('display', "none");
						$(".show-stats-button").css('display', "block");
						$('.container.stats').css('display', 'block');
					});
					options = { scrollTop: offset };
					$('html').animate(options, 2000);
				});
			} else {
				options = { scrollTop: offset };
				$('html').animate(options, 2000);
			}
		});
	}

	/**
	 * Init TweetGraph Module
	 * @return void
	 */
	my.init = function ()
	{
		console.log('init TweetGraph Module');
		my.showStats();
	};

	return my;

}(TweetGraph || {}, io || {}, Helpers || {}, jQuery));
