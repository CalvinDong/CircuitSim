var canvas = new fabric.Canvas('c', { selection: false });
//var canvas2 = new fabric.Canvas('d', { selection: false });
let width = window.innerWidth/2
let height = window.innerHeight/1.5
var grid = 10;
var gridSize = width/grid
var qubits = 2;
console.log(`width is ${width}`)
canvas.setWidth(width);
canvas.setHeight(height);
var originalX = 0;
var originalY = 0;
var hovering_no_drag = false;
var moved = false;
var temp;
var circle1 = new fabric.Circle({
  radius: 50,
  fill: 'red',
  left: 0
});
var circle2 = new fabric.Circle({
  radius: 70,
  fill: 'green',
  left: 100
});
var circle3 = new fabric.Circle({
  radius: 50,
  fill: 'blue',
  left: 200
});

var group = new fabric.Group([ ], {
  left: 200,
  top: 100
});
group.addWithUpdate(circle2.set({
  left: group.get('left') + 300,
  top: group.get('top'),
  originX: 'center',
  originY: 'center'
}))

var gridGroup = new fabric.Group([ ], {
  top: width/5,
  selectable: false
});

canvas.add(group);
//var drag_rect;

var test = [];
// create grid

/*for (var n = 0; n < 11; n++){
  var testCirc = new fabric.Circle({ 
    left: Math.floor(Math.random() * 500) , 
    top: Math.floor(Math.random() * 500) , 
    radius: 50, 
    fill: '#9f9', 
    originX: 'left', 
    originY: 'top',
    centeredRotation: true
  })
  test.push(testCirc);
  canvas.add(test[n]);
}*/


/*for (var i = 0; i < (width / grid); i++) {
  canvas.add(new fabric.Line([ i * grid, 0, i * grid, width], { stroke: '#ccc', selectable: false })); // y-axis
  canvas.add(new fabric.Line([ 0, i * grid, width, i * grid], { stroke: '#ccc', selectable: false })); // x-axis
}*/

for (var i = 0; i < (gridSize); i++) {
  //canvas.add(new fabric.Line([ gridSize * i , (width/5), gridSize * i, width/5 + (gridSize*qubits)], { stroke: '#ccc', selectable: false })); // y-axis
  //canvas.add(new fabric.Line([ gridSize * i , (width/5), gridSize * i, width/5 + (gridSize*qubits)], { stroke: '#ccc', selectable: false })); // y-axis
  gridGroup.addWithUpdate(new fabric.Line([ gridSize * i , (width/5), gridSize * i, width/5 + (gridSize*qubits)], { stroke: '#ccc', selectable: false })); // y-axis
}

for (var i = 0; i <= qubits; i++){
  //canvas.add(new fabric.Line([ 0, (width/5) + (gridSize * i), width,  (width/5) + (gridSize) * i], { stroke: '#ccc', selectable: false })); // x-axis
  gridGroup.addWithUpdate(new fabric.Line([ 0, (width/5) + (gridSize * i), width,  (width/5) + (gridSize) * i], { stroke: '#ccc', selectable: false })); // x-axis
}
canvas.add(group);
canvas.add(gridGroup);
canvas.renderAll()
//canvas.add(new fabric.Line([100,0,0,10], { stroke: '#ccc', selectable: false }));
//canvas.add(new fabric.Line([0,width/5,height/3,width/5], { stroke: '#ccc', selectable: true }));
console.log(width/5 + (gridSize * qubits))
console.log(width/5)

drag = {
	left: 0, 
  top: 0, 
  width: gridSize, 
  height: gridSize, 
  fill: '#faa', 
  originX: 'left', 
  originY: 'top',
  selectable: true,
  centeredRotation: true,
  hasBorders: true,
  hasControls: false
}

no_drag = {
	left: 0, 
  top: 0, 
  width: gridSize, 
  height: gridSize, 
  fill: '#faa', 
  originX: 'left', 
  originY: 'top',
  selectable: true,
  centeredRotation: true,
  hasBorders: false,
  selectable: false,
  hasControls: false
}

// add objects

var no_drag_rect = new fabric.Rect(no_drag);
//var drag_rect = new fabric.Rect(drag);

canvas.add(no_drag_rect);
//canvas.add(new fabric.Triangle());

no_drag_rect.on('mouseover', function(){
  /*if (hovering_no_drag == false){
    hovering_no_drag = true;
    //drag_rect = new fabric.Rect(drag);
    canvas.add(new fabric.Rect(drag));
    canvas.renderAll();
  }*/
  canvas.add(new fabric.Rect(drag));
  console.log("mouse is over")
})

//try using pointers before doing inividual mouseover and mouseout functions

canvas.on('mouse:down', function(options){
  if (options.type != null){
    if (options.target.type == 'rect') {
      originalX = options.target.left;
      originalY = options.target.top;
      console.log(`x is ${originalX} and y is ${originalY}`)
    }
  }
})

canvas.on('object:moved', function(options){
  if (options.target.type == 'rect') {
    console.log(options.target.top)
    if (options.target.left < width && (options.target.top > (width/5)) && (options.target.top < width/5 + (gridSize * qubits))){
      console.log("placing")
      options.target.set({
        left: Math.round(options.target.left / gridSize) * gridSize,
        top: Math.round(options.target.top / gridSize) * gridSize,
        hasControls: true
      });
      CalculateIntersection(options)
    }
    else if (options.target.top < (width/5)) {
      console.log("removing")
      canvas.fxRemove(options.target);
    }
    else{
      SnapToPreviousPosition(options);
    }
    canvas.renderAll();
    options.target.set('hasControls', false) // Reveal and unreveal control to keep interactivity bug free please
    options.target.set('fill', 'green');
    console.log('selected a rectangle');
    //CalculateIntersection(options);
    canvas.renderAll();
  }
  //console.log(canvas.getObjects())
})

function SnapToPreviousPosition(options){
  console.log("back to where you belong")
  options.target.set({
    left: originalX,
    top: originalY,
    hasControls: true
  });
}

function CalculateIntersection(options){
  options.target.setCoords();
  canvas.forEachObject(function(obj) {
    //console.log(obj)
    if (obj === options.target) return;
    if (options.target.intersectsWithObject(obj) && obj != gridGroup) {
      snapped = true
      SnapToPreviousPosition(options)
    }
    //SnapToPreviousPosition(options);
  });
}

