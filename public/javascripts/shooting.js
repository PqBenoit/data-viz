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
		$list = $('#movies-list').find('ul');

		my.socket.on('shootings', function(data){
			// console.log(data);
			var circle = undefined;

			var pos = Map.getPixelPosition(Map.rsr, data.data.fields.geo_coordinates.lng, data.data.fields.geo_coordinates.lat);

			circle = Map.rsr.circle(pos.x, pos.y, 10);
			circle.attr('fill', '#4099FF');
			circle.attr('stroke', 'none');

			console.log('shootings placed');

			$list.append('<li class="list-item">' + data.data.fields.titre + '</li>');
		});

		my.socket.on('shootingClicked', function(data){
			console.log(data);
			$('circle').remove();
			for (var i = 0, j = data.length ; i < j ; i++) {
				var pos = Map.getPixelPosition(Map.rsr, data[i].fields.geo_coordinates.lng, data[i].fields.geo_coordinates.lat);
				circle = Map.rsr.circle(pos.x, pos.y, 10);
				circle.attr('fill', '#000000');
				circle.attr('stroke', 'none');
			}
			console.log('new shootings placed');
		});
	};

	/**
	*  
	* 
	* 
	*/
	my.queryShootingListElement = function()
	{
		console.log('list ready');
		$('.list-item').click(function(){
			$('#movies-list').animate({
				left: '-100%'
			}, 500);
			$('#list-button').animate({
				opacity: '1'
			}, 1000);
			var title = $(this).html();
			console.log(title);
			my.socket.emit('titleClicked', {title: title});
		});
	}

	/**
	 * Init Tweet Module
	 * return void
	 */
	my.init = function ()
	{
		console.log('init Shooting Module');
		my.socket.emit('require_shootings');
		my.setupShootingPlaces();
		setTimeout(function(){
			my.queryShootingListElement();
		}, 5000);
	};


	return my;
	
}(Shooting || {}, Map || {}, io || {}, jQuery));
