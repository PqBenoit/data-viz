/**
 * @param Module my
 * @param Module Map
 * @param socket.io io
 * @param jQuery $
 * @return Module Shooting
 */
var Shooting = (function(my, Map, io, $)
{
	my.socket = io;

	/**
	 * Websocket connection, with socket.io
	 * Listen 'tweet' socket.io event
	 * @return void
	 */
	my.setupShootingPlaces = function ()
	{
		my.socket.on('shootings', function(data){
			console.log(data);
			var circle = undefined;

			for (var i = 0, j = data.data.length ; i < j ; i++) {
				circle = undefined;

				if (null != data.data[i].fields.geo_coordinates) {
					var pos = Map.getPixelPosition(Map.rsr, data.data[i].fields.geo_coordinates.lng, data.data[i].fields.geo_coordinates.lat);

					circle = Map.rsr.circle(pos.x, pos.y, 10);
					circle.attr('fill', '#4099FF');
					circle.attr('stroke', 'none');
					
					// $(circle.node).click(function(){
					// 	Sidebar.open($(this).offset().left, $(this).offset().top, data);
					// });
				}
			}
			console.log('shootings placed');

		});
	};

	/**
	 * Init Tweet Module
	 * return void
	 */
	my.init = function ()
	{
		console.log('init Shooting Module');
		my.socket.emit('require_shootings');
		my.setupShootingPlaces();
	};


	return my;
	
}(Shooting || {}, Map || {}, io || {}, jQuery));
