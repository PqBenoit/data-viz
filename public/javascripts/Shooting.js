/**
 * @param Module my
 * @param Module Map
 * @param jQuery $
 * @return Module Shooting
 */
var Shooting = (function(my, Map, $)
{

	/**
	 * Websocket connection, with socket.io
	 * Listen 'tweet' socket.io event
	 * @return void
	 */
	my.setupShootingPlaces = function (data)
	{
		var circle = undefined;

		for (var i = 0, j = data.length ; i < j ; i++) {
			circle = undefined;

			if (null != data[i].shooting.fields.geo_coordinates) {
				var pos = Map.getPixelPosition(Map.rsr, data[i].shooting.fields.geo_coordinates.lng, data[i].shooting.fields.geo_coordinates.lat);

				circle = Map.rsr.circle(pos.x, pos.y, 10);
				circle.attr('fill', '#4099FF');
				circle.attr('stroke', 'none');
				
				// $(circle.node).click(function(){
				// 	Sidebar.open($(this).offset().left, $(this).offset().top, data);
				// });
			}
		}
	};

	/**
	 * Init Tweet Module
	 * return void
	 */
	my.init = function (data)
	{
		console.log('init Shooting Module');
		my.setupShootingPlaces(data);
	};


	return my;
}(Shooting || {}, Map || {}, jQuery));
