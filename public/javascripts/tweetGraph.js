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
	my.nbTweetHours = [];
	my.data = [];
	my.dataset =  [];
	my.options = {};
	my.hashtagsArray = {init: 0};

	/**
	 * Init graph options, construct data array, then build graph
 	 * @return void
	 */
	my.buildGraph = function ()
	{
		var tweetHour;
		my.nbTweetHours[my.hourNow] = 0;
		my.options = {
		    series: {
                bars: {
                    show: true
                }
            },
            bars: {
                align: "center",
                barWidth: 0.5,
                vertical: true,
                fillColor: { colors: [{ opacity: 0.5 }, { opacity: 1}] },
                lineWidth: 1
            },
		    xaxis: {
		    	color: "black",
			    tickSize: 1,
			    tickDecimals: 0,
			    min: 1,
			    max: 24
		    },
		    yaxis: {
		    	color: "black",
		        min: 0,
		        tickSize: 10,
		        tickDecimals: 0,
		        axisLabelUseCanvas: true
		    },
		    legend: {        
		        labelBoxBorderColor: "#ffffff"
		    },
		    grid: {                
		        backgroundColor: "#ffffff",
		        tickColor: "#aaaaaa"
		    }
		};

		//Init graph data array
		my.data.push([my.hourNow, my.nbTweetHours[my.hourNow]]);

		//Build first graph param array
		my.dataset.push({ label: "Nombre de tweets répartient par heure", data: my.data, color: "#333333" });

	    $.plot($("#flot-placeholder1"), my.dataset, my.options);
	};

	/**
	 * Update graph data for current hour
	 * @see Tweet.startStream()
	 * @param JSON data
	 */
	my.update = function (data)
	{
		console.log("update graph with stream");
		my.dataset[0] = { label: "Nombre de tweets par heure", data: my.data, color: "#333333" };

		$.plot($("#flot-placeholder1"), my.dataset, my.options);
	};

	/**
	 * Build hashtags graph, top 3 hashtags
	 * @return void
	 */
	my.hashtag = function(){
		var h1, h2, h3 = 0;

		my.socket.removeAllListeners("lTweetHashtags");
		my.socket.on('lTweetHashtags', function(res){

			for (var i = 0, j = res.lTweetGraph.length ; i < j ; i++) {
				var hashtags = res.lTweetGraph[i].hashtag;
				var hashtagsLength = hashtags.length;

				if (hashtagsLength > 1) {
					for (var ii = 0, jj = hashtagsLength ; ii < jj ; ii++) {
						my.buildHashtagsArray(hashtags[ii]);
					}
				} else if (hashtags.length == 1) {
					my.buildHashtagsArray(hashtags[0]);
				}
			}

			console.log(my.hashtagsArray);

		});
	};

	my.compareNombres = function (a, b) {
	  return b - a;
	}

	/**
	 * Increment my.hashtagsArray entry
	 * @param string hashtag
	 * @return void
	 */
	my.buildHashtagsArray = function (hashtag)
	{
		for (var i = 0, j = Object.keys(my.hashtagsArray).length ; i < j ; i++) {
			if (my.hashtagsArray[hashtag]) {
				my.hashtagsArray[hashtag]++;
			} else {
				my.hashtagsArray[hashtag] = 1;
			}
		}
	}


	/**
	 * Init TweetGraph Module
	 * @return void
	 */
	my.init = function ()
	{
		console.log('init TweetGraph Module');

		my.socket.emit('require_tweets_graph');

		my.hashtag();
	};




	return my;

}(TweetGraph || {}, io || {}, jQuery));
