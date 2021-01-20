var canvas = new fabric.Canvas('c', { selection: false });
const width = window.innerWidth/2;
const height = window.innerHeight/1.5;
canvas.setWidth(width);
canvas.setHeight(height);
const maxQubits = 8;
const minQubits = 2;
const grid = 25;
const gridSize = width/grid;
const tileSize = gridSize * 0.7;
const toolboxOffset = width/5;
const tools = [
  {name: 'H', color: '#7400B8'},
  {name: 'I', color: '#6930C3'},
  {name: 'T', color: '#5E60CE'},
  {name: 'S', color: '#5390D9'},
  {name: 'Z', color: '#4EA8DE'}
]
let qubits = 2;
let originalX = 0;
let originalY = 0;
let gridGroup = new fabric.Group([ ], {
  top: toolboxOffset,
  hoverCursor: 'default',
  selectable: false
});

let drag = {
	left: 0, 
  top: 0, 
  width: tileSize, 
  height: tileSize, 
  fill: '#7400B8', 
  originX: 'left', 
  originY: 'top',
  selectable: true,
  centeredRotation: true,
  hasBorders: true,
  hasControls: false
}

let no_drag_H = {
	left: 0, 
  top: 0, 
  width: tileSize, 
  height: tileSize, 
  fill: '#7400B8', 
  originX: 'left', 
  originY: 'top',
  selectable: true,
  centeredRotation: true,
  hasBorders: false,
  selectable: false,
  hasControls: false
}

let no_drag_I = {
	left: 0, 
  top: 0, 
  width: tileSize, 
  height: tileSize, 
  fill: '#80FFDB', 
  originX: 'left', 
  originY: 'top',
  selectable: true,
  centeredRotation: true,
  hasBorders: false,
  selectable: false,
  hasControls: false
}

let textField = {
  left: tileSize/2,
  top: tileSize/2,
  fontSize: tileSize/2, 
  originX: 'center', 
  originY: 'center', 
  fill: 'white',
  fontFamily: 'helvetica',
  hasBorders: false, 
  selectable: false, 
  hasControls: false
}

DrawGrid();

tools.forEach(function(element){ // Build the toolbox
  canvas.add(new fabric.Group(
    [new fabric.Rect({
      left: 0, 
      top: 0, 
      width: tileSize, 
      height: tileSize, 
      fill: element.color, 
      originX: 'left', 
      originY: 'top',
      selectable: true,
      centeredRotation: true,
      hasBorders: false,
      selectable: false,
      hasControls: false
    }), new fabric.Text(element.name, textField)
  ], 
    {
      left: originalX, 
      top: 0,
      selectable: true,
      hasBorders: false,
      selectable: false,
      hasControls: false
    }
  ))
  originalX = originalX + tileSize + tileSize/2;
})

/*
var no_drag_rect_H = new fabric.Group(
  [new fabric.Rect(no_drag_H), new fabric.Text('H', textField)], 
  {left: 0, top: 0}
)

var no_drag_rect_I = new fabric.Group(
  [new fabric.Rect(no_drag_I), new fabric.Text('I', textField)], 
  {left: 0 + tileSize + tileSize/2, top: 0}
);
*/

//Create array to add in tiles automatically?

//   _         _______    _______    _    _______     
//  | |       |  _____|  |__   __|  |_|  | ______|     
//  | |       | |_____      | |      /   | |_____      
//  | |       |  _____|     | |          |_____  |     
//  | |_____  | |_____      | |           _____| |      
//  |_______| |_______|     |_|          |_______|     

//   _______   _         _______          _        __    _
//  |  _____| | |       |  _____|       / _ \     |  \  | |
//  | |       | |       | |_____       / /_\ \    | |\\ | |
//  | |       | |       |  _____|     / _____ \   | | \\| |
//  | |_____  | |_____  | |_____     / /     \ \  | |  \  |
//  |_______| |_______| |_______|   /_/       \_\ |_|   \_|       

//   _    _    _______
//  | |  | |  |  ___  |
//  | |  | |  | |___| |
//  | |  | |  |  _____|
//  | |__| |  | |
//  |______|  |_|                 the code now

// add objects
/*
no_drag_rect_H.on('mouseover', function(){ // Spawn new tile when mouse is over a tile in the toolbox
  canvas.add(new fabric.Group(
    [new fabric.Rect(drag), new fabric.Text('H', textField)], 
    { left: no_drag_rect_H.left, 
      top: no_drag_rect_H.top, 
      hasControls: false,
      hoverCursor: 'grab',
      moveCursor: 'grabbing',
    }
  ));
})
*/
gridGroup.on('mousedown', function(){ // Make sure grid is always at the back
  canvas.sendToBack(gridGroup);
})

canvas.on('mouse:over', function(options){
  console.log('over');
})

canvas.on('mouse:down', function(options){ // Keep track of original tile position
  try{
    if (options.target.type == 'group' && options.target.type != gridGroup) {
      originalX = options.target.left;
      originalY = options.target.top;
    }
  }
  catch(err){
    // avoid error option type null error popping up in console
  }
})

canvas.on('object:moved', function(options){
  if (options.target.type == 'group' && options.target.type != gridGroup) {
    console.log(options.target.top)
    if (options.target.left < width && (options.target.top > toolboxOffset) && (options.target.top < toolboxOffset + (gridSize * qubits))){
      console.log("placing")
      options.target.set({ // Placing in the center of the grid tiles
        left: Math.round(options.target.left / gridSize) * gridSize + (gridSize * (1 - (tileSize/gridSize)))/2,
        top: Math.round(options.target.top / gridSize) * gridSize + (gridSize * (1 - (tileSize/gridSize)))/2,
        hasControls: true
      });
      CalculateIntersection(options);
    }
    else if (options.target.top < toolboxOffset) {
      console.log("removing")
      canvas.fxRemove(options.target);
    }
    else{
      SnapToPreviousPosition(options);
    }
    canvas.renderAll();
    options.target.set('hasControls', false) // Reveal and unreveal hasControls to keep interactivity bug free please
    //options.target.set('fill', 'green');
    canvas.renderAll();
  }
  //console.log(canvas.getObjects())
});

function SnapToPreviousPosition(options){ // If tile is not placed in a permitted area, then put it back to where it came from
  console.log("back to where you belong")
  options.target.set({
    left: originalX,
    top: originalY,
    hasControls: true
  });
}

function CalculateIntersection(options){ // Determine if tile is being moved into grid with already exiting tile
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

function DrawGrid(){ // Draw lines
  for (var i = 0; i <= qubits; i++){
    gridGroup.addWithUpdate(new fabric.Line(
        [ 0, (toolboxOffset) + (gridSize * i), width,  toolboxOffset + (gridSize) * i], 
        { stroke: '#ccc', selectable: false }
      )); // x-axis
  }
  
  for (var i = 0; i < (gridSize); i++) {
    gridGroup.addWithUpdate(new fabric.Line(
      [ gridSize * i , toolboxOffset, gridSize * i, toolboxOffset + (gridSize * qubits)], 
      { stroke: '#ccc', selectable: false }
      )); // y-axis
  }
  
  canvas.add(gridGroup);
  canvas.renderAll()
}

function AddQubit(){ // Remove all grid lines then redraw them with an extra row
  if (qubits < maxQubits){
    console.log("add");
    qubits++;
    gridGroup.forEachObject(function(obj){
      gridGroup.remove(obj);
    })
    canvas.remove(gridGroup);
    DrawGrid();
  }
}

function SubtractQubit(){ // Remove all grid lines then redraw them with one less row
  if (qubits > minQubits){
    console.log("subtract");
    qubits--;
    gridGroup.forEachObject(function(obj){
      gridGroup.remove(obj);
    })
    canvas.remove(gridGroup);
    DrawGrid();
  }
  var SVG = canvas.toSVG(); 
  console.log(SVG);
}

function SaveToSVG(){ // Creates SVG representation of circuit
  console.log("Save to SVG")
  let file;
  let content = canvas.toSVG(); 
  try{
    file = new File([content], "circuit.svg", {type: 'text/plain'});
  }
  catch(e){
    file = new Blob([content], {type: 'text/plain'});
  }
  var objectURL = URL.createObjectURL(file);
  document.getElementById('link').href = objectURL;
}

