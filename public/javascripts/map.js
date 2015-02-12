// ValeurConteneurCherchée = ( MaxConteneur * (ValeurRéelleDonnée - MinRéel) )  /  (MaxRéel - MinRéel)

var Map = (function(my, Config, $){
  my.$mapContainer = $('#map');
  my.rsr = undefined;
  /**
   * Set map size from window size
   * @return void
   */
  my.setSize = function (){
    var wWidth = ($(window).width()-15);
    var wHeight = ($(window).height()-15);

    my.$mapContainer.css('width', wWidth+'px');
    my.$mapContainer.css('height', wHeight+'px');
  };
  /**
   * Calc position x and y from lon and lat
   *
   * @param Raphael my.rsr
   * @param float lon
   * @param float lat
   *
   * @return Object
   */
  my.getPixelPosition = function(rsr, lon, lat){
    var paths = $('path');

    var maxLeft = 0;
    var minLeft = 10000000;
    var maxHeight = 0;
    var minHeight = 10000000;

    for (i=0, j=paths.length; i<j; i++) {
      if (maxLeft < ($(paths[i]).offset().left+paths[i].getBoundingClientRect().width)) {
        maxLeft = ($(paths[i]).offset().left+paths[i].getBoundingClientRect().width);
      }
      if (minLeft > $(paths[i]).offset().left) {
        minLeft = $(paths[i]).offset().left;
      }
      if (maxHeight < ($(paths[i]).offset().top+paths[i].getBoundingClientRect().height)) {
        maxHeight = ($(paths[i]).offset().top+paths[i].getBoundingClientRect().height);
      }
      if (minHeight > $(paths[i]).offset().top) {
        minHeight = $(paths[i]).offset().top;
      }
    }

    var widthSvg = (maxLeft - minLeft);
    var ratio = (widthSvg/Config.svgSize.width);

    var posLon = ( ( (maxLeft - minLeft) * (lon - Config.paris.mapCoordonate.minLon) / (Config.paris.mapCoordonate.maxLon - Config.paris.mapCoordonate.minLon) )/ratio );
    var posLat = ( ( (maxHeight-minHeight)-((maxHeight - minHeight) * (lat - Config.paris.mapCoordonate.minLat) /  (Config.paris.mapCoordonate.maxLat - Config.paris.mapCoordonate.minLat)))/ratio );

    return {x:posLon,y:posLat};
  };
  /**
  * Resize event for map module
  * @return void
  */
  my.resizeEvent = function(){
    $(window).resize(function(){
      my.setSize();
    });
  };
  // TODO: Put the magic value in config, and optimise :)
  my.initRaphael = function(){
    my.rsr = Raphael('map', '100%', '100%');
    var group_a = my.rsr.set(); group_a.attr({'name': 'group_a'}); 
    var group_b = my.rsr.set(); group_b.attr({'parent': 'group_a','name': 'group_b'}); 
    var group_c = my.rsr.set(); group_c.attr({'parent': 'group_a','name': 'group_c'}); 

    var group_d = my.rsr.set(); 
    var path_g = my.rsr.path(Config.paris.pathData.g).attr({fill: '#FFFFFF',stroke: '#d8d8d8',"stroke-width": '1.5',parent: 'group_a','stroke-opacity': '1'}).data('id', 'path_g'); 
    var path_h = my.rsr.path(Config.paris.pathData.h).attr({fill: '#FFFFFF',stroke: '#d8d8d8',"stroke-width": '1.5',"stroke-linejoin": 'round',parent: 'group_a','stroke-opacity': '1'}).data('id', 'path_h'); 
    group_d.attr({'parent': 'group_a','name': 'group_d'}); 
    
    var group_e = my.rsr.set(); 
    var path_i = my.rsr.path(Config.paris.pathData.i).attr({fill: '#E4F1FE',parent: 'group_a','stroke-width': '0','stroke-opacity': '1'}).data('id', 'path_i'); 
    group_e.attr({'parent': 'group_a','name': 'group_e'});

    var group_f = my.rsr.set(); 
    var path_j = my.rsr.path(Config.paris.pathData.j).attr({fill: 'none',stroke: '#d8d8d8',"stroke-width": '3',"stroke-linejoin": 'round',parent: 'group_a','stroke-opacity': '1'}).data('id', 'path_j'); 
    var path_k = my.rsr.path(Config.paris.pathData.k).attr({fill: 'none',stroke: '#d8d8d8',"stroke-width": '3',"stroke-linejoin": 'round',parent: 'group_a','stroke-opacity': '1'}).data('id', 'path_k'); 
    var path_l = my.rsr.path(Config.paris.pathData.l).attr({fill: 'none',stroke: '#d8d8d8',"stroke-width": '3',"stroke-linejoin": 'round',parent: 'group_a','stroke-opacity': '1'}).data('id', 'path_l'); 
    var path_m = my.rsr.path(Config.paris.pathData.m).attr({fill: 'none',stroke: '#d8d8d8',"stroke-width": '3',"stroke-linejoin": 'round',parent: 'group_a','stroke-opacity': '1'}).data('id', 'path_m'); 
    var path_n = my.rsr.path(Config.paris.pathData.n).attr({fill: 'none',stroke: '#d8d8d8',"stroke-width": '3',"stroke-linejoin": 'round',parent: 'group_a','stroke-opacity': '1'}).data('id', 'path_n'); 
    var path_o = my.rsr.path(Config.paris.pathData.o).attr({fill: 'none',stroke: '#d8d8d8',"stroke-width": '3',"stroke-linejoin": 'round',parent: 'group_a','stroke-opacity': '1'}).data('id', 'path_o'); 
    var path_p = my.rsr.path(Config.paris.pathData.p).attr({fill: 'none',stroke: '#d8d8d8',"stroke-width": '3',"stroke-linejoin": 'round',parent: 'group_a','stroke-opacity': '1'}).data('id', 'path_p'); 
    var path_q = my.rsr.path(Config.paris.pathData.q).attr({fill: 'none',stroke: '#d8d8d8',"stroke-width": '3',"stroke-linejoin": 'round',parent: 'group_a','stroke-opacity': '1'}).data('id', 'path_q'); 
    var path_r = my.rsr.path(Config.paris.pathData.r).attr({fill: 'none',stroke: '#d8d8d8',"stroke-width": '3',"stroke-linejoin": 'round',parent: 'group_a','stroke-opacity': '1'}).data('id', 'path_r'); 
    var path_s = my.rsr.path(Config.paris.pathData.s).attr({fill: 'none',stroke: '#d8d8d8',"stroke-width": '3',"stroke-linejoin": 'round',parent: 'group_a','stroke-opacity': '1'}).data('id', 'path_s'); 
    var path_t = my.rsr.path(Config.paris.pathData.t).attr({fill: 'none',stroke: '#d8d8d8',"stroke-width": '3',"stroke-linejoin": 'round',parent: 'group_a','stroke-opacity': '1'}).data('id', 'path_t'); 
    var path_u = my.rsr.path(Config.paris.pathData.u).attr({fill: 'none',stroke: '#d8d8d8',"stroke-width": '3',"stroke-linejoin": 'round',parent: 'group_a','stroke-opacity': '1'}).data('id', 'path_u'); 
    var path_v = my.rsr.path(Config.paris.pathData.v).attr({fill: 'none',stroke: '#d8d8d8',"stroke-width": '3',"stroke-linejoin": 'round',parent: 'group_a','stroke-opacity': '1'}).data('id', 'path_v'); 
    var path_w = my.rsr.path(Config.paris.pathData.w).attr({fill: 'none',stroke: '#d8d8d8',"stroke-width": '3',"stroke-linejoin": 'round',parent: 'group_a','stroke-opacity': '1'}).data('id', 'path_w'); 
    var path_x = my.rsr.path(Config.paris.pathData.x).attr({fill: 'none',stroke: '#d8d8d8',"stroke-width": '3',"stroke-linejoin": 'round',parent: 'group_a','stroke-opacity': '1'}).data('id', 'path_x'); 
    var path_y = my.rsr.path(Config.paris.pathData.y).attr({fill: 'none',stroke: '#d8d8d8',"stroke-width": '3',"stroke-linejoin": 'round',parent: 'group_a','stroke-opacity': '1'}).data('id', 'path_y'); 
    var path_z = my.rsr.path(Config.paris.pathData.z).attr({fill: 'none',stroke: '#d8d8d8',"stroke-width": '3',"stroke-linejoin": 'round',parent: 'group_a','stroke-opacity': '1'}).data('id', 'path_z'); 
    var path_aa = my.rsr.path(Config.paris.pathData.aa).attr({fill: 'none',stroke: '#d8d8d8',"stroke-width": '3',"stroke-linejoin": 'round',parent: 'group_a','stroke-opacity': '1'}).data('id', 'path_aa'); 
    var path_ab = my.rsr.path(Config.paris.pathData.ab).attr({fill: 'none',stroke: '#d8d8d8',"stroke-width": '3',"stroke-linejoin": 'round',parent: 'group_a','stroke-opacity': '1'}).data('id', 'path_ab'); 
    var path_ac = my.rsr.path(Config.paris.pathData.ac).attr({fill: 'none',stroke: '#d8d8d8',"stroke-width": '3',"stroke-linejoin": 'round',parent: 'group_a','stroke-opacity': '1'}).data('id', 'path_ac'); 
    group_f.attr({'parent': 'group_a','name': 'group_f'}); 

    var rsrGroups = [group_a,group_b,group_c,group_d,group_e,group_f];

    group_a.push( ); 
    group_b.push( ); 
    group_c.push( ); 
    group_d.push( path_g , path_h ); 
    group_e.push( path_i ); 
    group_f.push( path_j , path_k , path_l , path_m , path_n , path_o , path_p , path_q , path_r , path_s , path_t , path_u , path_v , path_w , path_x , path_y , path_z , path_aa , path_ab , path_ac ); 
          
    my.rsr.setViewBox(0, 0, Config.svgSize.width, Config.svgSize.height );
    my.rsr.canvas.setAttribute('preserveAspectRatio', 'xMidYMid meet');
  };
  my.init = function(){
    $(document).ready(function() {
      console.log('init Map Module');
      my.setSize();
      my.resizeEvent();
      my.initRaphael();

      // Some magic happend down there :) TODO: Remove
      var pos = my.getPixelPosition(my.rsr, 2.3476886, 48.8545851);
      var circle = my.rsr.circle(pos.x, pos.y, 3);
      circle.attr('fill', '#4099FF');
      circle.attr('stroke', 'none');
    });
  };


  return my;
}(Map || {}, Config || {}, jQuery));