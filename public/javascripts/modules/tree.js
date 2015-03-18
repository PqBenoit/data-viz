var Tree = (function(my){
  my.filteredTrees = [];
  my.minRanges = [0,10,100,1000,5000];
  my.maxRanges = [10,100,1000,5000,100000];

  my.init = function(){
    console.log('Init Tree module');
    $.getJSON("data/tree_data.json", function(json) {
      setupAfterJsonLoad(json);
    });
  };

  my.draw = function(){
    // Get size
    var height = $('#tree').height();
    var width = $('#tree').width();
    // Create context for writing stuff in canvas
    var c = document.getElementById("tree");
    var canvas = c.getContext("2d");

    var ellipseSize = 100;
    var strokeSize = 60;

    for(var j=0; j<my.filteredTrees.length; j++){
      // strokeWeight(strokeSize);
      var rad = 0;
      for(var i =0; i < my.filteredTrees[j].trees.length; i++){
        var element = my.filteredTrees[j].trees[i];
        var radBegin = rad;
        rad += (element.nbr/my.filteredTrees[j].rangeNbr)*(2*Math.PI);

        canvas.beginPath();
        canvas.arc(width/2,height/2,ellipseSize,radBegin,rad);
        canvas.strokeStyle = "#"+getLeaveColor();
        canvas.lineWidth = strokeSize;
        canvas.stroke();

        // stroke(element.color.red, element.color.green, element.color.blue);
        // arc(width/2, height/2, ellipseSize, ellipseSize, radBegin, rad);
      }
      ellipseSize += strokeSize+5;
      strokeSize *= 0.9;
    }
  };

  function setupAfterJsonLoad(data){
    trees = filterBySpecie(data);

    for(var i=0; i<my.minRanges.length; i++){
      var minRange = my.minRanges[i];
      var maxRange = my.maxRanges[i];
      my.filteredTrees[i] = filterByRange(trees, minRange, maxRange);
    }
    my.draw();
  }

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
        if(trees[j].name === specie){
          actualNumber = trees[j].nbr;
          actualNumber++;
          trees[j].nbr = actualNumber;
          treeExist = true;
        }
      }
      if(!treeExist){
        var newTree = {};
        newTree.name = specie;
        newTree.nbr = 1;
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
      if(data[i].nbr > minRange && data[i].nbr < maxRange){
        tempTrees.push(data[i]);
        rangeNbr += data[i].nbr;
      }
    }
    for(var i = 0; i < tempTrees.length; i++){
      tempTrees[i].color = getLeaveColor();
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