var Tree = (function(my){
  my.filteredTrees = [];
  my.minRanges = [0,10,100,1000,5000];
  my.maxRanges = [10,100,1000,5000,100000];
  my.canvasRatio = [3.4, 5, 6.4, 7.65, 8.65];
  my.changeIndex = true;

  my.init = function(){
    console.log('Init Tree module');

    $('canvas').each(function(index, el) {
      var maxHeightCanvas = $(window).height()*0.85;
      var index = $(el).data('index');
      var newSize = (my.canvasRatio[index-1] * maxHeightCanvas) / my.canvasRatio[4];
      $(el).attr('height', newSize);
      $(el).attr('width', newSize);
    });

    $('canvas').each(function(index, el) {
      var margin = {
        top: ($(window).height() - $(el).height())/2,
        left: ($(window).width() - $(el).width())/2,
      };
      $(el).css({
        top: margin.top+'px',
        left: margin.left+'px'
      });
    });

    $.getJSON("data/tree_data.json", function(data) {
      trees = filterBySpecie(data);
      for(var i=0; i<my.minRanges.length; i++){
        var minRange = my.minRanges[i];
        var maxRange = my.maxRanges[i];
        my.filteredTrees[i] = filterByRange(trees, minRange, maxRange);
      }
      $('.loader').addClass('fadeOutUp');
      setTimeout(function(){
        my.draw();
      }, 300);
    });
    my.initRangeInput();
  };

  my.initRangeInput = function(){
    $('#rangeSelector').on('change mousemove', function(event) {
      var value = $(this).val();
      $('canvas').removeClass('show');

      if(value==0){
        $('.screen').addClass('showAll');
        $('#message').removeClass('black');
        $('#message').text('Toute la forêt parisienne');
      } else {
        $('#message').addClass('black');
        $('.screen').removeClass('showAll');
        $('#myChart'+value).addClass('show');
      }

      if(value == 1){
        $('#message').text('Moins de 10 représentants');
      } else if(value==2){
        $('#message').text('Moins de 100 représentants');
      } else if(value==3){
        $('#message').text('Moins de 1000 représentants');
      } else if(value==4){
        $('#message').text('Moins de 5000 représentants');
      } else if(value==5){
        $('#message').text('Plus de 5000 représentants');
      }
    });
  };

  my.draw = function(){
    // Get size
    var height = $('#tree').height();
    var width = $('#tree').width();

    var ellipseSize = 100;
    var strokeSize = 60;

    for(var j=0; j<my.filteredTrees.length; j++){     
      var ctx = document.getElementById("myChart"+(j+1)).getContext("2d");
      var percentToShow = [50,70,80,85,90];
      var options = {
        segmentShowStroke : false,
        percentageInnerCutout : percentToShow[j],
      }
      var myDoughnutChart = new Chart(ctx).Doughnut(my.filteredTrees[j].trees, options);
    }
  };

  function filterBySpecie(data){
    var trees = [];
    for (var i = 0; i < data.length; i++) {
      if(!data[i].fields.espece){
        continue;
      }

      var specie = data[i].fields.espece.split(" ", 2)[0];
      var treeExist = false;
      var actualNumber;

      for(var j = 0; j < trees.length; j++){
        if(trees[j].label === specie){
          actualNumber = trees[j].value;
          actualNumber++;
          trees[j].value = actualNumber;
          treeExist = true;
        }
      }
      if(!treeExist){
        var newTree = {};
        newTree.label = specie;
        newTree.value = 1;
        newTree.color = '#'+getLeaveColor();
        trees.push(newTree);
      }
    }
    return trees;
  }
  function filterByRange(data, minRange, maxRange){
    var trees = {};
    var tempTrees = [];
    var rangeNbr = 0;
    for(var i = 0; i < data.length; i++){
      if(data[i].value > minRange && data[i].value < maxRange){
        tempTrees.push(data[i]);
        rangeNbr += data[i].value;
      }
    }
    trees.rangeNbr = rangeNbr;
    trees.trees = tempTrees;
    return trees;
  }

  function getLeaveColor(){
    var sd = 20;
    var redMean = 85;
    var greenMean = 105;
    var blueMean = 16;

    var red = Math.randomGaussian(redMean, sd);
    var green = Math.randomGaussian(greenMean, sd);
    var blue = Math.randomGaussian(blueMean, sd);

    return rgbToHex(red, green, blue);
  }

  // Tree Helpers

  function rgbToHex(R,G,B) {return toHex(R)+toHex(G)+toHex(B)}
  function toHex(n) {
   n = parseInt(n,10);
   if (isNaN(n)) return "00";
   n = Math.max(0,Math.min(n,255));
   return "0123456789ABCDEF".charAt((n-n%16)/16)
        + "0123456789ABCDEF".charAt(n%16);
  }

  function randomGaussian() {
      return (Math.random()+Math.random()+Math.random())/2;
  }

	return my;
}(Tree || {}));