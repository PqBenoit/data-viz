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
	my.hourNow = new Date().getHours();
	my.minutesNow = new Date().getMinutes();

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
	 * Init TweetGraph Module
	 * @return void
	 */
	my.init = function ()
	{
		console.log('init TweetGraph Module');

		var date = new Date();
		var month = (date.getMonth()+1)<10?"0"+(date.getMonth()+1):(date.getMonth()+1);
		var today = date.getFullYear()+"-"+month+"-"+(date.getDate()-1);

		my.socket.emit('require_tweets_graph', { today: today });

		my.buildGraph();
	};


	return my;

}(TweetGraph || {}, io || {}, jQuery));
