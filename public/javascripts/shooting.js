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
	var downbarHeight;

	/**
	 * Init map with all shootings places
	 * @return void
	 */
	my.setupShootingPlaces = function ()
	{	


		$('.hello').css({
			paddingLeft: '150px',
		});

		downbarHeight = $(window).height() - 65 - $('#movies-container').height();
		$('.down-bar').css({
			height: downbarHeight - 10 + 'px',
			zIndex: 123
		});
		
		$('.p-padding').css({
			paddingTop: downbarHeight/2 - $('.p-padding').height() * 2 + 'px'
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
			var adresses = [];
			for (var i = 0, j = data.length ; i < j ; i++) {
				var pos = Map.getPixelPosition(Map.rsr, data[i].fields.geo_coordinates.lng, data[i].fields.geo_coordinates.lat);
				
				color = ['#5EC996', '#2C9FC4', '#F7E381'];
				randColor = Math.floor((Math.random() * 3));

				circle = Map.rsr.circle(pos.x, pos.y, 10);
				circle.attr('fill', color[randColor]);
				circle.attr('stroke', 'none');
				circle.attr('index', i);

				adresses.push(data[i].fields.lieu + ' ' + data[i].fields.adresse);
			}

			$('circle').click(function(){
				console.log($(this));
			});

			setTimeout(function(){
				my.openLi(data[0].fields.titre, $('circle').length, adresses);
			}, 500);

			console.log('new shootings placed');
		});
	};

	/**
	 * Append infos about the selected film in aside on page bottom
	 * @param title
	 * @param count
	 * @return void
	 */
	my.openLi = function(title, count, adresses)
	{
		if(count){
			$('.down-bar').empty();

			var ad = '';
			for(var i = 0; i < adresses.length; i++){
				var ad = ad + '<div class=\'adress-item\'><p>' + adresses[i] + '</p></div>';
			}
			
			var div = '<div class=\'li-click\'><h2>' + title + '</h2><p>' + count + ' lieux de tournage</p><span> + </span></div>'
			var divAdress = '<div class=\'adress-click\'>' + ad + '<div class=\'clear\'></div></div>'
			$('.down-bar').append(div);
			$('.down-bar').append(divAdress);
			
			var marginTop = ($('.down-bar').height() / 2) - ($('.li-click').height()/2);
			$('.li-click').css({
				marginTop: marginTop
			});
		}
		else {
			$('.down-bar').empty();
			
			var div = '<div class=\'li-click\'><h2>' + title + '</h2></div>'
			$('.down-bar').append(div);
			
			var marginTop = ($('.down-bar').height() / 2) - ($('.li-click').height()/2);
			$('.li-click').css({
				marginTop: marginTop
			});
		}

		$('.li-click').find('span').click(function(){
			if(!($(this).hasClass('span-active'))){
				$(this).addClass('span-active');
				setTimeout(function(){
					$('.li-click').find('span').html('-');
					$('.down-bar').css({
						height: $('.down-bar').height() + $('.adress-click').height() + 100 + 'px'
					});
				}, 200);
			} else {
				console.log($('.li-click').height());
				$(this).removeClass('span-active');
				setTimeout(function(){
					$('.li-click').find('span').html('+');
					$('.down-bar').css({
						height: downbarHeight + 'px'
					});
				}, 200);
			}
		});
	}

	/**
	 * Append all shootings places for selected (clicked) film on list
	 * @return void
	 */
	my.queryShootingListElement = function()
	{
		console.log('list ready');

		$('.list-item').click(function(){
			$('#map').removeClass('rotated');
			var title = $(this).html();
			my.socket.emit('titleClicked', {title: title});
		});

	}

	/**
	 * Filter for search
	 * @param header
	 * @param list
	 */
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
	 * Init Shooting Module
	 * @return void
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
