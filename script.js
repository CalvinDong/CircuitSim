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
  canvas.add(new fabric.Line([ gridSize * i , (width/5), gridSize * i, width/5 + (gridSize*qubits)], { stroke: '#ccc', selectable: false })); // y-axis
  //canvas.add(new fabric.Line([ 0, (width/grid) * i, width, (width/grid) * i], { stroke: '#ccc', selectable: false })); // x-axis
}

for (var i = 0; i <= qubits; i++){
  canvas.add(new fabric.Line([ 0, (width/5) + (gridSize * i), width,  (width/5) + (gridSize) * i], { stroke: '#ccc', selectable: false })); // x-axis
  //console.log((width/5) + (gridSize) * i)
}

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
  //canvas.add(new fabric.Rect(drag));
  testOriginX = new fabric.Point(0,gridSize)
  testOriginY = new fabric.Point(gridSize,gridSize)
  console.log(no_drag_rect.intersectsWithRect(testOriginX, testOriginY));
  console.log("mouse is over")
})

//try using pointers before doing inividual mouseover and mouseout functions

/*no_drag_rect.on('mouseout', function(){
  if (hovering_no_drag == true && moved == true){
    hovering_no_drag == false;
    canvas.remove(drag_rect);
  }
  console.log("mouse is out")
  //canvas.renderAll();
})

// snap to grid
drag_rect.on('mousedown', function(){
  originalX = drag_rect.left;
  originalY = drag_rect.top;
  console.log(`x is ${originalX} and y is ${originalY}`)
})

drag_rect.on('moved', function() {
  if (drag_rect.left < width && (drag_rect.top > (width/5)) && (drag_rect.top < width/5 + (gridSize * qubits))){
    drag_rect.set({
      left: Math.round(drag_rect.left / gridSize) * gridSize,
      top: Math.round(drag_rect.top / gridSize) * gridSize,
      hasControls: true
    });
  }
  else{
    drag_rect.set({
      left: originalX,
      top: originalY,
      hasControls: true
    });
  }
  canvas.renderAll();
  drag_rect.set('hasControls', false) // Reveal and unreveal control to keep interactivity bug free please
  console.log('selected a rectangle');
  drag_rect.set('fill', 'green');
  canvas.renderAll();
});*/

canvas.on('mouse:down', function(options){
  if (options.target.type == 'rect') {
    originalX = options.target.left;
    originalY = options.target.top;
    console.log(`x is ${originalX} and y is ${originalY}`)
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
    }
    else if (options.target.top < (width/5)) {
      console.log("removing")
      canvas.fxRemove(options.target);
    }
    else{
      console.log("back to where you belong")
      options.target.set({
        left: originalX,
        top: originalY,
        hasControls: true
      });
    }
    canvas.renderAll();
    options.target.set('hasControls', false) // Reveal and unreveal control to keep interactivity bug free please
    options.target.set('fill', 'green');
    console.log('selected a rectangle');
    canvas.renderAll();
  }
  //console.log(canvas.getObjects())
})

function CalculateIntersection(){

}

