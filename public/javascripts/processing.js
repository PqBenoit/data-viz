var trees = [];
var filteredTrees = [];

function setup(){
	createCanvas(800,800);
	background(255, 0, 0, 1);
	colorMode(RGB);

  $.getJSON("data/tree_data.json", function(json) {
    setupAfterJsonLoad(json);
  });
};
function draw(){
  background(255, 255, 255);
  noFill();
  strokeCap(SQUARE);
  smooth();

  var ellipseSize = 200;
  var strokeSize = 60;

  for(var j=0; j<filteredTrees.length; j++){
    strokeWeight(strokeSize);
    var rad = 0;
    for(var i =0; i < filteredTrees[j].trees.length; i++){
      var element = filteredTrees[j].trees[i];
      var radBegin = rad;
      rad += (element.nbr/filteredTrees[j].rangeNbr)*(2*Math.PI);
      stroke(element.color.red, element.color.green, element.color.blue);
      arc(width/2, height/2, ellipseSize, ellipseSize, radBegin, rad);
    }
    ellipseSize += (strokeSize*2);
    strokeSize *= 0.9;
  }
};

function setupAfterJsonLoad(data){
  trees = filterBySpecie(data);
  filteredTrees = [];

  var minRanges = [];
  minRanges[0] = 0;
  minRanges[1] = 10;
  minRanges[2] = 100;
  minRanges[3] = 1000;
  minRanges[4] = 5000;
  var maxRanges = [];
  maxRanges[0] = 10;
  maxRanges[1] = 100;
  maxRanges[2] = 1000;
  maxRanges[3] = 5000;
  maxRanges[4] = 100000;

  for(var i=0; i<minRanges.length; i++){
    var minRange = minRanges[i];
    var maxRange = maxRanges[i];
    filteredTrees[i] = filterByRange(trees, minRange, maxRange);
  }
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

  var red = (sd* randomGaussian()) + redMean;
  var green = (sd* randomGaussian()) + greenMean;
  var blue = (sd* randomGaussian()) + blueMean;

  var colorObject = {};
  colorObject.red = red;
  colorObject.green = green;
  colorObject.blue = blue;

  return colorObject;
}

function randomGaussian() {
    return ((Math.random() + Math.random() + Math.random() + Math.random() + Math.random() + Math.random()) - 3) / 3;
}