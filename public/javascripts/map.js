// ValeurConteneurCherchée = ( MaxConteneur * (ValeurRéelleDonnée - MinRéel) )  /  (MaxRéel - MinRéel)

$(document).ready(function(){

  /**
   * Set map size from window size
   * @return void
   */
  var setSize = function ()
  {
    var wWidth = ($(window).width()-15);
    var wHeight = ($(window).height()-15);

    $('#map').css('width', wWidth+'px');
    $('#map').css('height', wHeight+'px');
  };

  /**
   * Calc position x and y from lon and lat
   *
   * @param Raphael rsr
   * @param float lon
   * @param float lat
   *
   * @return Object
   */
  var getPixelPosition = function(rsr, lon, lat) 
  {
    var paths = $('path');

    var maxLeft = 0;
    var minLeft = 10000000;
    var maxHeight = 0;
    var minHeight = 10000000;

    var minLat = 48.815778999;
    var maxLat = 48.9014562785;
    var minLon = 2.2515444756;
    var maxLon = 2.415725708;

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
    var ratio = (widthSvg/2037.566);

    var posLon = ( ( (maxLeft - minLeft) * (lon - minLon) / (maxLon - minLon) )/ratio );
    var posLat = ( ( (maxHeight-minHeight)-((maxHeight - minHeight) * (lat - minLat) /  (maxLat - minLat)))/ratio );

    return {x:posLon,y:posLat};
  };

  setSize();

  var rsr = Raphael('map', '100%', '100%');
  var group_a = rsr.set(); group_a.attr({'name': 'group_a'}); 
  var group_b = rsr.set(); group_b.attr({'parent': 'group_a','name': 'group_b'}); 
  var group_c = rsr.set(); group_c.attr({'parent': 'group_a','name': 'group_c'}); 

  var group_d = rsr.set(); 
  var path_g = rsr.path("M2013.566,1279 1973.566,1271.5 1946.816,1257.5 1888.566,1309.5 1833.816,1338.5 1852.066,1356 1864.566,1350.5 1882.565,1360.5 1899.566,1375 ").attr({fill: '#FFFFFF',stroke: '#000',"stroke-width": '1.5',parent: 'group_a','stroke-opacity': '1'}).data('id', 'path_g'); 
  var path_h = rsr.path("M0.066,1054 21.816,1054.75 58.566,1056.5 61.566,1054.25 67.316,1031.25 177.066,762.5 238.316,638.25 309.066,514.5 350.066,456.75 328.566,452.5 307.566,448.5 ").attr({fill: '#FFFFFF',stroke: '#000',"stroke-width": '1.5',"stroke-linejoin": 'round',parent: 'group_a','stroke-opacity': '1'}).data('id', 'path_h'); 
  group_d.attr({'parent': 'group_a','name': 'group_d'}); 
  
  var group_e = rsr.set(); 
  var path_i = rsr.path("M144.289,1303l23.777-35.5l60-88l17-29l21.5-39.5l43.5-67.5l2,1l2.5-4l21-23l37-38.5l59-64.5l31-33l5-6.5 l10.5-35.5l3.5-7.5l5.5-7l54.5-57.5l13.5-12l20-11.5l19-7l18.5-3.5l121-4l91-2.5l95,41l28,14l18.5,12.5l51,20l34,9l26,8 l29.5,25.5l22.5,28.5l21,16l31,12.5l18.5,13.5l17,9l22,11l13,4l27.5,13l49,24.5l36.5,34.5l41.5,52.5l12,13l1.5-1l89.5,100 l-1.5,1.5l8.5,11l26.5,39l109.5,131.5l11,18l40,44.5l3.5,0.5l19.609,20.5l17.388-13.846l-19.997-20.154l0.5-3l-114.5-135.5 l-71.5-86l1-2.5l-23.5-33.5l-11-12l-98-112.5l-44.5-47.5l-5-11l-2.5-10l-0.5-24l-4.5-7l-4.5-2.5l-33-17.5l-58.5-35l-47-28 l-24-10.5l-56.5-23.5l-32.5-9l-43.5-8.5l-59-18l-126-62l-32-16l-208.5,7.5l-23.5,3.5l-34.5,11.5l-29.5,13.5l-7.5,6l-30,36 l-61.5,74.5l-88.5,98.5l-32,35l-123.5,192l-8,7.5l-52.5,78.5l-12.5,20.513L144.289,1303z M1216.566,930.5l-34-21.5l-27-14.5 l-21-14l-25.5-35l-23-18.5l27,9.5l45.5,11.5l18.5,9l36.5,15l18,10.5l8.5,10l6.5,13.5l2.5,19l4,18L1216.566,930.5z M1332.066,973 l-39.5-20.5l-24-9l-6.5-12.5l-2.5-15l-1.5-12.5l12,5l63.5,31l8,6.5l3.5,7l-1,14l4.5,17L1332.066,973z").attr({fill: '#D9DADB',parent: 'group_a','stroke-width': '0','stroke-opacity': '1'}).data('id', 'path_i'); 
  group_e.attr({'parent': 'group_a','name': 'group_e'}); 

  var group_f = rsr.set(); 
  var path_j = rsr.path("M860.566,730.5 865.066,721.5 891.566,670.5 895.066,666 916.566,620.5 914.566,611 923.566,608.5 949.066,602.5 977.066,632.5 1019.066,648 1045.566,657 1111.566,680.5 1179.066,704.5 1231.566,723.5 1222.066,750 1198.066,815 1188.566,839 1182.566,842.5 1177.066,857 1170.066,872.5 1155.566,894.5 1152.566,897.5 1150.066,901.5 1130.066,965 1129.566,966.5 1107.566,1022.5 1065.066,1138.5 1056.066,1152 1056.066,1166 1093.566,1180.5 1122.066,1190.5 1183.066,1209 1207.066,1214 1240.566,1219.5 1243.066,1218.5 1365.566,1160 1406.066,1076 1413.066,1062.5 ").attr({fill: 'none',stroke: '#707173',"stroke-width": '3',"stroke-linejoin": 'round',parent: 'group_a','stroke-opacity': '1'}).data('id', 'path_j'); 
  var path_k = rsr.path("M1231.566,723.5 1239.066,704 1272.566,613 1193.566,588 1135.066,573.5 1098.066,564 1061.566,573.5 1059.566,574 949.066,602.5 ").attr({fill: 'none',stroke: '#707173',"stroke-width": '3',"stroke-linejoin": 'round',parent: 'group_a','stroke-opacity': '1'}).data('id', 'path_k'); 
  var path_l = rsr.path("M1222.066,750 1242.066,756 1263.066,764 1305.066,785.5 1330.066,813 1365.566,838.5 1396.066,853 1447.566,866 1444.066,843.5 1432.066,769 1428.066,740 1426.066,729 1395.066,651 1390.066,646.5 1385.066,642 1300.566,622.5 1272.566,613 ").attr({fill: 'none',stroke: '#707173',"stroke-width": '3',"stroke-linejoin": 'round',parent: 'group_a','stroke-opacity': '1'}).data('id', 'path_l'); 
  var path_m = rsr.path("M1056.066,1166 908.566,1091.5 841.066,1056.5 809.066,1032.5 844.566,1012.5 858.066,1002 891.566,975.5 935.566,947.5 934.566,943 953.566,939.5 965.566,924 979.066,890.5 983.066,876.5 1017.066,814.5 1022.066,804.5 ").attr({fill: 'none',stroke: '#707173',"stroke-width": '3',"stroke-linejoin": 'round',parent: 'group_a','stroke-opacity': '1'}).data('id', 'path_m'); 
  var path_n = rsr.path("M809.066,1032.5 774.066,1048.5 735.566,1011 695.566,1026 652.566,984.5 618.566,951 617.066,952.5 487.066,825 481.066,819 ").attr({fill: 'none',stroke: '#707173',"stroke-width": '3',"stroke-linejoin": 'round',parent: 'group_a','stroke-opacity': '1'}).data('id', 'path_n'); var path_o = rsr.path("M923.566,608.5 933.566,546 938.066,533.5 932.566,497 935.566,497.5 940.066,351 808.066,390.5 717.566,406.5 713.566,408.5 644.066,431 617.566,440 583.566,450 544.566,531 574.066,582.5 592.066,628.5 605.066,692.5 624.066,703 624.566,713 ").attr({fill: 'none',stroke: '#707173',"stroke-width": '3',"stroke-linejoin": 'round',parent: 'group_a','stroke-opacity': '1'}).data('id', 'path_o'); 
  var path_p = rsr.path("M1193.566,588 1193.566,526.5 1198.566,488.5 1203.066,476.5 1208.566,464 1210.566,435.5 1217.066,406 1217.566,402 1214.066,345 1182.066,351 1092.566,376.5 1070.566,371.5 1064.566,370 1006.566,344.5 967.566,329.5 947.566,347.5 942.566,350 940.066,351 ").attr({fill: 'none',stroke: '#707173',"stroke-width": '3',"stroke-linejoin": 'round',parent: 'group_a','stroke-opacity': '1'}).data('id', 'path_p'); 
  var path_q = rsr.path("M1390.066,646.5 1419.566,629.5 1433.066,623.5 1457.566,610 1468.566,604.5 1501.066,589.5 1551.066,561.5 1469.566,451 1469.066,366.5 1467.566,362.5 1456.066,353 1450.066,340 1448.566,337 1401.066,333 1334.566,331.5 1214.066,345 ").attr({fill: 'none',stroke: '#707173',"stroke-width": '3',"stroke-linejoin": 'round',parent: 'group_a','stroke-opacity': '1'}).data('id', 'path_q'); 
  var path_r = rsr.path("M1454.566,913 1468.566,910.5 1485.066,925.5 1512.566,937.5 1565.566,957.5 1582.066,962.5 1628.566,966.5 1642.066,968.5 1646.066,970.5 1784.566,1002 1823.066,1007 1825.066,992 1815.066,947 1766.066,849.5 1739.066,828.5 1707.066,814 1679.566,732.5 1630.566,664.5 1628.066,654.5 1576.066,594.5 1551.066,561.5 ").attr({fill: 'none',stroke: '#707173',"stroke-width": '3',"stroke-linejoin": 'round',parent: 'group_a','stroke-opacity': '1'}).data('id', 'path_r'); 
  var path_s = rsr.path("M1122.066,1190.5 1117.566,1244.5 1111.066,1297.5 1111.066,1312.5 1113.066,1351.5 1116.066,1368.5 1116.566,1400.5 1118.066,1411.5 1114.066,1464.5 1119.066,1487.5 1128.066,1506 1142.066,1523 1153.066,1541 1141.066,1608 1152.566,1614 1152.066,1605 1180.566,1609 1250.066,1558.5 1292.066,1607 1384.066,1605.5 1429.066,1585 1598.566,1499 1607.066,1485.5 1703.066,1433.5 1714.068,1425.5 1724.066,1417.5 1764.066,1391.5 1825.566,1368 1852.066,1356 1864.566,1350.5 1882.566,1360.5 1899.566,1375 ").attr({fill: 'none',stroke: '#707173',"stroke-width": '3',"stroke-linejoin": 'round',parent: 'group_a','stroke-opacity': '1'}).data('id', 'path_s'); 
  var path_t = rsr.path("M908.566,1091.5 883.566,1123 874.066,1118.5 866.066,1128.5 807.566,1198.5 762.066,1255 618.066,1435.5 779.066,1490 963.566,1552 1002.566,1565 995.566,1586.5 1018.066,1591.5 1126.566,1601 1141.066,1608 ").attr({fill: 'none',stroke: '#707173',"stroke-width": '3',"stroke-linejoin": 'round',parent: 'group_a','stroke-opacity': '1'}).data('id', 'path_t'); 
  var path_u = rsr.path("M 975.566,23 893.066,25 856.066,28.5 834.066,48 722.566,103.5 695.066,120 612.566,179 544.566,231 504.066,238 428.566,293 370.066,363 358.566,439.5 401.066,461 544.566,531 583.566,450 617.566,440 644.066,431 713.566,408.5 717.566,406.5 808.066,390.5 940.066,351 942.566,350 920.566,275 953.066,123 z").attr({fill: 'none',stroke: '#707173',"stroke-width": '3',"stroke-linejoin": 'round',parent: 'group_a','stroke-opacity': '1'}).data('id', 'path_u'); 
  var path_v = rsr.path("M 1471.566,106 1467.566,7.5 1330.066,11.5 1244.566,14.5 1148.566,17 975.566,23 953.066,123 920.566,275 942.566,350 947.566,347.5 967.566,329.5 1006.566,344.5 1064.566,370 1070.566,371.5 1092.566,376.5 1182.066,351 1214.066,345 1334.566,331.5 1401.066,333 1427.566,289.5 1439.566,252.5 1444.066,233 1466.066,154 1471.566,144 1487.566,128 z").attr({fill: 'none',stroke: '#707173',"stroke-width": '3',"stroke-linejoin": 'round',parent: 'group_a','stroke-opacity': '1'}).data('id', 'path_v'); 
  var path_w = rsr.path("M 1950.566,408.5 1891.066,390 1851.566,364 1836.066,342 1825.066,312.5 1825.566,263 1820.566,222 1808.066,142 1796.566,114 1779.066,74.5 1723.066,24.5 1645.066,1.5 1467.566,7.5 1471.566,106 1487.566,128 1471.566,144 1466.066,154 1444.066,233 1439.566,252.5 1427.566,289.5 1401.066,333 1448.566,337 1450.066,340 1456.066,353 1467.566,362.5 1469.066,366.5 1469.566,451 1551.066,561.5 1589.066,546 1623.066,535.5 1648.066,531 1661.066,521.5 1674.066,513.5 1680.566,513 1693.066,512 1705.066,501.5 1722.566,498 1771.066,501 1776.066,500.5 1808.566,498 1820.066,498 1865.566,488 1917.066,465 1967.566,441 z").attr({fill: 'none',stroke: '#707173',"stroke-width": '3',"stroke-linejoin": 'round',parent: 'group_a','stroke-opacity': '1'}).data('id', 'path_w'); 
  var path_x = rsr.path("M 2029.566,936.5 2010.566,758.5 2005.066,715.5 2005.066,690 2006.066,622 2005.066,595 2002.066,554 1988.066,479 1967.566,441 1917.066,465 1865.566,488 1820.066,498 1808.566,498 1776.066,500.5 1771.066,501 1722.566,498 1705.066,501.5 1693.066,512 1680.566,513 1674.066,513.5 1661.066,521.5 1648.066,531 1623.066,535.5 1589.066,546 1551.066,561.5 1576.066,594.5 1628.066,654.5 1630.566,664.5 1679.566,732.5 1707.066,814 1739.066,828.5 1766.066,849.5 1815.066,947 1825.066,992 1823.066,1007 2031.066,1035 2036.066,1000 2036.066,986.5 z").attr({fill: 'none',stroke: '#707173',"stroke-width": '3',"stroke-linejoin": 'round',parent: 'group_a','stroke-opacity': '1'}).data('id', 'path_x'); 
  var path_y = rsr.path("M0.066,1054 22.566,1055 5.566,1103.5 10.066,1179.5 54.066,1255 133.566,1269.5 150.566,1269 168.066,1267.5 208.566,1258 235.066,1288.5 203.566,1316.5 208.566,1384 270.566,1383.5 303.566,1354 347.066,1300 365.566,1309.5 399.066,1328 511.066,1398.5 618.066,1435.5 ").attr({fill: 'none',stroke: '#707173',"stroke-width": '3',"stroke-linejoin": 'round',parent: 'group_a','stroke-opacity': '1'}).data('id', 'path_y'); 
  var path_z = rsr.path("M1714.068,1425.5 1549.566,1228 1510.066,1171.5 1413.066,1062.5 1396.566,1043.5 1372.066,1014.5 1332.066,982.5 1289.566,960 1238.566,943 1216.566,933.5 1202.566,925.5 1182.566,912 1152.566,897.5 1131.066,882.5 1107.566,850.5 1065.566,816.5 1022.066,804.5 988.066,792.5 860.566,730.5 829.066,716 624.566,722.5 604.066,724.5 573.566,734 545.066,749 538.566,754 481.066,819 323.066,1000.5 150.566,1269 ").attr({fill: 'none',stroke: '#707173',"stroke-width": '3',"stroke-linejoin": 'round',parent: 'group_a','stroke-opacity': '1'}).data('id', 'path_z'); 
  var path_aa = rsr.path("M307.566,448.5 328.566,452.5 331.566,451.5 358.566,439.5 401.066,461 544.566,531 574.066,582.5 592.066,628.5 605.066,692.5 624.066,703 624.566,713 624.566,722.5 ").attr({fill: 'none',stroke: '#707173',"stroke-width": '3',"stroke-linejoin": 'round',parent: 'group_a','stroke-opacity': '1'}).data('id', 'path_aa'); 
  var path_ab = rsr.path("M2013.566,1279 1974.066,1271.5 1986.566,1259 2003.066,1185 2031.066,1035 1823.066,1007 ").attr({fill: 'none',stroke: '#707173',"stroke-width": '3',"stroke-linejoin": 'round',parent: 'group_a','stroke-opacity': '1'}).data('id', 'path_ab'); 
  var path_ac = rsr.path("M1447.566,866 1454.566,913 1441.066,952 1427.566,996 1421.066,1022.5 1406.566,1035.5 1396.566,1043.5 ").attr({fill: 'none',stroke: '#707173',"stroke-width": '3',"stroke-linejoin": 'round',parent: 'group_a','stroke-opacity': '1'}).data('id', 'path_ac'); 
  group_f.attr({'parent': 'group_a','name': 'group_f'}); 

  var rsrGroups = [group_a,group_b,group_c,group_d,group_e,group_f];

  group_a.push( ); 
  group_b.push( ); 
  group_c.push( ); 
  group_d.push( path_g , path_h ); 
  group_e.push( path_i ); 
  group_f.push( path_j , path_k , path_l , path_m , path_n , path_o , path_p , path_q , path_r , path_s , path_t , path_u , path_v , path_w , path_x , path_y , path_z , path_aa , path_ab , path_ac ); 
      	
  rsr.setViewBox(0, 0, '2037.566', '1615.5' );
	rsr.canvas.setAttribute('preserveAspectRatio', 'xMidYMid meet');

  var pos = getPixelPosition(rsr, 2.3476886, 48.8545851);

  var circle = rsr.circle(pos.x, pos.y, 10);
  circle.attr('fill', '#000');

  $(window).resize(function(){
    setSize();
  });
});