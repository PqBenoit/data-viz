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
	var counter = 0;

	/**
	 * Websocket connection, with socket.io
	 * Listen 'tweet' socket.io event
	 * @return void
	 */
	my.setupShootingPlaces = function ()
	{	
		$('.hello').css({
			paddingLeft: '150px',
		});

		downbarHeight = $(window).height() - 65 - $('#movies-container').height();
		$('.down-bar').css({
			height: downbarHeight - 10 + 'px'
		});

		$('path').css({
			opacity: 0
		});
		$('#movies-list').css({
			opacity: 0
		});

		$list = $('#movies-list').find('ul');

		my.socket.on('shootings', function(data){

			counter++;
			// console.log(data);
			var circle = undefined;

			var pos = Map.getPixelPosition(Map.rsr, data.data.fields.geo_coordinates.lng, data.data.fields.geo_coordinates.lat);

			color = ['#5EC996', '#2C9FC4', '#F7E381'];
			randColor = Math.floor((Math.random() * 3));

			circle = Map.rsr.circle(pos.x, pos.y, 10);
			circle.attr('fill', color[randColor]);
			circle.attr('stroke', 'none');

			console.log('shootings placed');

			$list.append('<li class="list-item">' + data.data.fields.titre + '</li>');

			$(circle.node).click(function(){
				my.openLi(data.data.fields.titre);
			});

			if(counter == 650){
				$('path').animate({
					opacity: 1
				}, 1500);
				setTimeout(function(){
					$('#movies-list').animate({
						opacity: 1
					}, 1500);
					$('.shooting-map').addClass('rotated');
				}, 1000)
			}
		});

		my.socket.on('shootingClicked', function(data){
			console.log(data);
			$('circle').remove();
			for (var i = 0, j = data.length ; i < j ; i++) {
				var pos = Map.getPixelPosition(Map.rsr, data[i].fields.geo_coordinates.lng, data[i].fields.geo_coordinates.lat);
				circle = Map.rsr.circle(pos.x, pos.y, 10);
				circle.attr('fill', '#2c9fc4');
				circle.attr('stroke', 'none');
				circle.attr('index', i);
			}

			$('circle').click(function(){
				console.log($(this));
			});
			console.log('new shootings placed');


		});
	};

	/**
	*  
	* 
	* 
	*/
	my.openLi = function(title, count)
	{	
		if(count){
			$('.down-bar').empty();
			var div = '<div class=\'li-click\'><h2>' + title + '</h2><p>' + count + ' lieux de tournage</p></div>'
			$('.down-bar').append(div);
			var marginTop = ($('.down-bar').height() / 2) - ($('.li-click').height()/2);
			console.log(marginTop);
			$('.li-click').css({
				marginTop: marginTop
			});
		}
		else {
			$('.down-bar').empty();
			var div = '<div class=\'li-click\'><h2>' + title + '</h2></div>'
			$('.down-bar').append(div);
			var marginTop = ($('.down-bar').height() / 2) - ($('.li-click').height()/2);
			console.log(marginTop);
			$('.li-click').css({
				marginTop: marginTop
			});	
		}

	}

	/**
	*  
	* 
	* 
	*/
	my.queryShootingListElement = function()
	{
		console.log('list ready');


		$('.list-item').click(function(){
			$('#map').removeClass('rotated');
			var title = $(this).html();
			console.log(title);
			my.socket.emit('titleClicked', {title: title});
			setTimeout(function(){
				my.openLi(title, $('circle').length);
			}, 500);
		});

	}

	my.listFilter = function(header, list) {
		var form = $("<form>").attr({"class":"filterform","action":"#"}),
		input = $("<input>").attr({"class":"filterinput","type":"text", "placeholder":"Titre..."});

		$(form).append(input).appendTo(header);

		$(input).change( function () {
			var filter = $(this).val();
			if (filter) {
				$(list).find("li:not(:contains(" + filter + "))").hide();
				$(list).find("li:contains(" + filter + ")").show();
			} else {
				$(list).find("li").show();
			}
		}).keyup( function () {
			$(this).change();
		});
	}



	/**
	 * Init Tweet Module
	 * return void
	 */
	my.init = function ()
	{
		my.listFilter($('.list-search'), $('#movies-list').find('ul'));
		console.log('init Shooting Module');
		my.socket.emit('require_shootings');
		my.setupShootingPlaces();
		setTimeout(function(){
			my.queryShootingListElement();
		}, 5000);
	};


	return my;
	
}(Shooting || {}, Map || {}, io || {}, jQuery));
