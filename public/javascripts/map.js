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
    var group_d = my.rsr.set(); group_d.attr({'parent': 'group_a','name': 'group_d'}); 
    var group_e = my.rsr.set(); group_e.attr({'parent': 'group_a','name': 'group_e'});
    var group_f = my.rsr.set(); group_f.attr({'parent': 'group_a','name': 'group_f'}); 

    var rsrGroups = [group_a,group_b,group_c,group_d,group_e,group_f];

    $.each(Config.paris.pathData, function(index, element) {
      var strokeWidth = element.strokeWidth || Config.mapDesign.borderWidth;
      var strokeOpacity = element.strokeOpacity || '0.5';
      var fillColor = element.fillColor || 'none';
      var path = my.rsr.path(element.path).attr({fill: fillColor, 'stroke-width': strokeWidth, 'stroke-linejoin': 'round', parent: element.parent, 'stroke-opacity': strokeOpacity}).data('id', 'path_'+index);
      switch (element.group) {
        case 'group_d':
          group_d.push(path);
          break;
        case 'group_e':
          group_e.push(path);
          break;
        default:
          group_f.push(path);
          break;
      }
    });

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