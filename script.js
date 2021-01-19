var canvas = new fabric.Canvas('c', { selection: false });
const width = window.innerWidth/2;
const height = window.innerHeight/1.5;
canvas.setWidth(width);
canvas.setHeight(height);
const maxQubits = 8;
const minQubits = 2;
const grid = 10;
const gridSize = width/grid;
const tileSize = gridSize * 0.7;
const toolboxOffset = width/5;
let qubits = 2;
let originalX = 0;
let originalY = 0;
let gridGroup = new fabric.Group([ ], {
  top: toolboxOffset,
  selectable: false
});

drag = {
	left: 0, 
  top: 0, 
  width: tileSize, 
  height: tileSize, 
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
  width: tileSize, 
  height: tileSize, 
  fill: '#faa', 
  originX: 'left', 
  originY: 'top',
  selectable: true,
  centeredRotation: true,
  hasBorders: false,
  selectable: false,
  hasControls: false
}

var no_drag_rect = new fabric.Rect(no_drag);

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

DrawGrid();
canvas.add(no_drag_rect);

no_drag_rect.on('mouseover', function(){
  canvas.add(new fabric.Rect(drag));
  console.log("mouse is over")
})

canvas.on('mouse:down', function(options){ // Keep track of original tile position
  console.log("mouse is down")
  try{
    if (options.target.type == 'rect') {
      originalX = options.target.left;
      originalY = options.target.top;
      console.log(`x is ${originalX} and y is ${originalY}`)
    }
  }
  catch(err){
    // avoid error option type null error popping up in console
  }
})

canvas.on('object:moved', function(options){
  if (options.target.type == 'rect') {
    console.log(options.target.top)
    if (options.target.left < width && (options.target.top > toolboxOffset) && (options.target.top < toolboxOffset + (gridSize * qubits))){
      console.log("placing")
      options.target.set({ // Placing in the center of the grid tiles
        left: Math.round(options.target.left / gridSize) * gridSize + (gridSize * (1 - (tileSize/gridSize)))/2,
        top: Math.round(options.target.top / gridSize) * gridSize + (gridSize * (1 - (tileSize/gridSize)))/2,
        hasControls: true
      });
      CalculateIntersection(options)
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
    options.target.set('fill', 'green');
    console.log('selected a rectangle');
    canvas.renderAll();
  }
  //console.log(canvas.getObjects())
})

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
      [ gridSize * i , toolboxOffset, gridSize * i, toolboxOffset + (gridSize*qubits)], 
      { stroke: '#ccc', selectable: false }
      )); // y-axis
  }
  
  canvas.add(gridGroup);
  canvas.renderAll()
}

function AddQubit(){
  if (qubits < maxQubits){
    console.log("add");
    qubits++;
    gridGroup.forEachObject(function(obj){
      gridGroup.remove(obj)
    })
    canvas.remove(gridGroup)
    DrawGrid();
    console.log(qubits)
  }
}

function SubtractQubit(){
  if (qubits > minQubits){
    console.log("subtract");
    qubits--;
    gridGroup.forEachObject(function(obj){
      gridGroup.remove(obj)
    })
    canvas.remove(gridGroup)
    DrawGrid();
    console.log(qubits)
  }
}

