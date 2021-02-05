const canvas = new fabric.Canvas('c', { selection: false });
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
const distMulti = gridSize;
const lineStrokeWidth = 1;
const dotRadius = 5;

const no_drag_rect = 
  {
    top: 0,
    selectable: true,
    hasBorders: false,
    selectable: false,
    hoverCursor: 'default',
    hasControls: false,
  }

const drag_rec = {
  selectable: true,
  hasControls: false,
  hoverCursor: 'grab',
  moveCursor: 'grabbing',}

const not = [
  new fabric.Circle(
  {
    radius: tileSize/4,
    originX: 'center', 
    originY: 'center',
    fill: 'transparent',
    strokeWidth: tileSize/12,
    stroke: 'grey'
  }),
  new fabric.Line([ 0, -tileSize/4, 0, tileSize/4], {
    originX: 'center',
    originY: 'center',
    stroke: 'grey',
  }),
  new fabric.Line([-tileSize/4, 0, tileSize/4, 0], {
    originX: 'center',
    originY: 'center',
    stroke: 'grey'
  })
]

const cnot = [
  new fabric.Circle(                    /// FIX THE MOVING SHAPES WHILE HOVERING ISSUE
  {
    radius: tileSize/6,
    originX: 'center', 
    originY: 'center',
    top: -tileSize/4,
    fill: 'transparent',
    strokeWidth: tileSize/12,
    stroke: 'GREY'
  }),
  new fabric.Line([ 0, -tileSize/6, 0, tileSize/6], {
    originX: 'center',
    originY: 'center',
    top: -tileSize/4,
    stroke: 'GREY'
  }),
  new fabric.Line([-tileSize/6, 0, tileSize/6, 0], {
    originX: 'center',
    originY: 'center',
    top: -tileSize/4,
    stroke: 'GREY'
  }),
  new fabric.Line([0,-tileSize/5, 0, tileSize/2.5], {
    originX: 'center',
    originY: 'center',
    stroke: 'GREY'
  }),
  new fabric.Circle(
    {
      originX: 'center',
      originY: 'center',
      fill: 'black',
      radius: tileSize/12,
      top: tileSize/3
    }
  )
]

const toffoli = [
  new fabric.Circle(                    /// FIX THE MOVING SHAPES WHILE HOVERING ISSUE
  {
    radius: tileSize/6,
    originX: 'center', 
    originY: 'center',
    top: -tileSize/4,
    fill: 'transparent',
    strokeWidth: tileSize/12,
    stroke: 'GREY'
  }),
  new fabric.Line([ 0, -tileSize/6, 0, tileSize/6], {
    originX: 'center',
    originY: 'center',
    top: -tileSize/4,
    stroke: 'GREY'
  }),
  new fabric.Line([-tileSize/6, 0, tileSize/6, 0], {
    originX: 'center',
    originY: 'center',
    top: -tileSize/4,
    stroke: 'GREY'
  }),
  new fabric.Line([0,-tileSize/5, 0, tileSize/3], {
    originX: 'center',
    originY: 'center',
    stroke: 'GREY'
  }),
  new fabric.Circle(
    {
      originX: 'center',
      originY: 'center',
      fill: 'black',
      radius: tileSize/12,
      top: tileSize/8
    }
  ),
  new fabric.Circle(
    {
      originX: 'center',
      originY: 'center',
      fill: 'black',
      radius: tileSize/12,
      top: tileSize/3
    }
  )
]

const circleCross = [
  new fabric.Circle(                  
  {
    radius: Math.round(tileSize/3),
    originX: 'center', 
    originY: 'center',
    top: tileSize/4,
    fill: 'transparent',
    strokeWidth: Math.round(tileSize/12),
    stroke: 'GREY',
    name: 'circleCross'
  }),
  new fabric.Line([ 0, -tileSize/3, 0, tileSize/3], {
    originX: 'center',
    originY: 'center',
    top: tileSize/4,
    stroke: 'GREY'
  }),
  new fabric.Line([-tileSize/3, 0, tileSize/3, 0], {
    originX: 'center',
    originY: 'center',
    top: tileSize/4,
    stroke: 'GREY'
  }),
]

const cnotCross = 
{
  hasControls: false,
  selectable: true,
  name: 'cnotCross',
  child: null,
  line: null,
  hoverCursor: 'grab',
  moveCursor: 'grabbing',
  gateType: 'multi_tile'
}

const cnotDot = {
  dist: gridSize,
  radius: dotRadius,
  hasControls: false,
  hoverCursor: 'grab',
  moveCursor: 'grabbing',
  name: 'cnotDot',
  parent: null,
  line: null,
  xAxis: null,
  gateType: 'multi_tile'
}

const tools = [
  {name: 'H', color: '#7400B8', gateType: 'single', symbol: null},
  {name: 'I', color: '#6930C3', gateType: 'single', symbol: null},
  {name: 'T', color: '#5E60CE', gateType: 'single', symbol: null},
  {name: 'S', color: '#5390D9', gateType: 'single', symbol: null},
  {name: 'Z', color: '#4EA8DE', gateType: 'single', symbol: null},
  {name: 'P', color: '#48BFE3', gateType: 'single', symbol: null},
  {name: 'Y', color: '#56CFE1', gateType: 'single', symbol: null},
  {name: 'U', color: '#64DFDF', gateType: 'single', symbol: null},
  {name: 'not', color: '#72EFDD', gateType: 'multi', symbol: not},
  {name: 'cnot', color: '#80FFDB', gateType: 'multi_tile', symbol: cnot},
  {name: 'toffoli', color: '#80FFAE', gateType: 'multi_tile', symbol: toffoli}

]

let qubits = 2;
let originalX = 0;
let originalY = 0;
let gridGroup = new fabric.Group([ ], {
  top: toolboxOffset,
  hoverCursor: 'default',
  selectable: false
});

let textField = {
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
  if (element.gateType == 'single'){
    canvas.add(new fabric.Group(
      [new fabric.Rect({
        width: tileSize, 
        height: tileSize, 
        fill: element.color, 
        originX: 'center', 
        originY: 'center',
        selectable: true,
        centeredRotation: true,
        hasBorders: false,
        selectable: false,
      }), new fabric.Text(element.name, textField)
    ], 
      {
        ...no_drag_rect,
        left: originalX, 
        name: element.name,
        gateType: element.gateType
      }
    ))
  }
  else{
    canvas.add(new fabric.Group(
      [new fabric.Rect({
        left: 0, 
        top: 0, 
        width: tileSize, 
        height: tileSize, 
        fill: element.color, 
        originX: 'center', 
        originY: 'center',
        selectable: true,
        centeredRotation: true,
        hasBorders: false,
        selectable: false,
        hasControls: false
      }), new fabric.Group(element.symbol)
    ], 
      {
        ...no_drag_rect,
        left: originalX, 
        name: element.name,
        gateType: element.gateType
      }
    ))
    //canvas.forEachObject(obj => console.log(obj))
  }
  originalX = originalX + tileSize + tileSize/2;
})
originalX = 0; // variable re used to keep track of original tile poisitons later
//canvas.forEachObject(obj => console.log(obj))
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

gridGroup.on('mousedown', function(){ // Make sure grid is always at the back
  canvas.sendToBack(gridGroup);
})

canvas.on('mouse:over', function(options){ // Spawn new draggable instance of gate when hovering over said gate tile in toolbox
  if (options.target && options.target != gridGroup && !options.target.selectable){
    let drag_rect = 
    {
      width: tileSize, 
      height: tileSize, 
      fill: options.target._objects[0].fill, 
      originX: 'center', 
      originY: 'center',
    }
    let drag_group =  
    { 
      left: options.target.left, 
      top: options.target.top, 
      name: options.target.name, 
      gateType: options.target.gateType,
      hasControls: false,
      hoverCursor: 'grab',
      moveCursor: 'grabbing',
    }

    if (options.target._objects[1].type == 'text'){
      /*canvas.add(new fabric.Group(
        [
          new fabric.Rect(drag_rect), 
          new fabric.Text(options.target._objects[1].text, textField)
        ], 
        drag_group
      ));*/
      options.target.clone(function(clone){
        clone.set(drag_group);
        canvas.add(clone);
        console.log(canvas.getObjects())
      });
    }
    else{
      canvas.add(new fabric.Group(
        [
          new fabric.Rect(drag_rect), 
          new fabric.Group(SearchToolSymbol(options.target.name), {
            originX: 'center',
            originY: 'center',
          })
        ], 
        drag_group
      ));
    }
  }
})

canvas.on('mouse:down', function(options){ // Keep track of original tile position
  if (options.target && options.target != gridGroup) {
    originalX = options.target.left;
    originalY = options.target.top;
  }
})

canvas.on('object:moved', function(options){
  if (options.target && options.target.gateType == 'multi_tile'){
    let temp = options.target
    if (options.target.name == 'cnot'){
      temp = options.target;
      options.target = CreateCnot(options);
      canvas.remove(temp)
    }
  }
  if (options.target.selectable && options.target.type != gridGroup) {
    if (options.target.left < width && (options.target.top > toolboxOffset) && (options.target.top < toolboxOffset + (gridSize * qubits))){
      options.target.set({ // Placing in the center of the grid tiles
        left: (Math.floor(options.target.left/gridSize) * gridSize) + Math.round((gridSize/2 - options.target.width/2)),
        top: (Math.floor((options.target.top - toolboxOffset)/gridSize)) * gridSize + toolboxOffset + Math.round(gridSize/2 - options.target.width/2),
      });
      CalculateIntersection(options);
    }
    else if (options.target.top < toolboxOffset) {
      console.log("removing")
      if (options.target.gateType == 'multi_tile'){
        canvas.remove(options.target.child);
        canvas.remove(options.target.line);
      }
      canvas.remove(options.target);
    }
    else{
      SnapToPreviousPosition(options);
    }
    options.target.setCoords();
    canvas.renderAll();
  }
});

canvas.on('object:moving', function(options){ // Makes multi gates behave when dragged, 
  // SHOULD REALLY LOOK AT MAKING ORIGINS AROUND X TO AVOID CALCULATIONS
if (options.target && options.target.name == 'cnotDot'){
    CdotReset(options)
  }
  if (options.target && options.target.name == 'cnotCross'){
    CnotReset(options);
  }
});

canvas.on('object:moved', function(options){
  if (options.target && options.target.name == 'cnotCross'){
    CnotReset(options);
  }
  if (options.target && options.target.name == 'cnotDot'){
    CdotReset(options);
  }
});



function SnapToPreviousPosition(options){ // If tile is not placed in a permitted area, then put it back to where it came from
  console.log("back to where you belong")
  options.target.set({
    left: originalX,
    top: originalY,
  });
  options.target.setCoords()
}

function CalculateIntersection(options){ // Determine if tile is being moved into grid with already exiting tile
  canvas.forEachObject(function(obj) {
    if (obj === options.target) {
      return;
    }
    if (((obj.type == 'path' && obj.parent != options.target) && (obj.type == 'path' && obj.child != options.target))){
      if (options.target.intersectsWithVertPath(obj)){
        SnapToPreviousPosition(options)
        return;
      }
    }
    if (options.target.intersectsWithObject(obj) && obj != gridGroup) {
      SnapToPreviousPosition(options)
      return;
    }
  });
}

fabric.Object.prototype.intersectsWithVertPath = function(obj) { //checks if object intersects with vertical path from multi line gates 
  let topLeft;
  let bottomRight;
  if (obj.path[0][2] > obj.path[1][2]){
    topLeft = new fabric.Point(obj.path[0][1] - lineStrokeWidth/2, obj.path[0][2])
    bottomRight = new fabric.Point(obj.path[1][1] + lineStrokeWidth/2, obj.path[1][2])
  }
  if (obj.path[0][2] < obj.path[1][2]){
    topLeft = new fabric.Point(obj.path[1][1] - lineStrokeWidth/2, obj.path[1][2])
    bottomRight = new fabric.Point(obj.path[0][1] + lineStrokeWidth/2, obj.path[0][2])
  }
  if (obj.path[0][2] == obj.path[1][2]){
    return false;
  }
  console.log(topLeft)
  console.log(bottomRight)
  return (this.intersectsWithRect(topLeft, bottomRight))
}

function DrawGrid(){ // Draw lines
  for (var i = 0; i < qubits; i++){
    gridGroup.addWithUpdate(new fabric.Line(
        [ 0, (toolboxOffset) + (gridSize * i) + gridSize/2, width,  toolboxOffset + (gridSize * i) + gridSize/2], 
        { stroke: '#ccc', selectable: false }
      )); // x-axis
  }

  /*
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
  */

  canvas.add(gridGroup);
  canvas.sendToBack(gridGroup)
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

function SearchToolSymbol(name){
  console.log("going")
  let obj = tools.find(o => o.name === name)
  return obj.symbol;
}

function CnotReset(options){
  options.target.child.set(
    {
      left: options.target.left + options.target.width/2 - options.target.child.width/2, 
      top: options.target.top + gridSize/1.5
    }
  );
  options.target.child.setCoords();
  options.target.line.path[0][1] = options.target.left + options.target.width/2;
  options.target.line.path[0][2] = options.target.top + options.target.width/2;
  options.target.line.path[1][1] = options.target.child.left + options.target.child.radius;
  options.target.line.path[1][2] = options.target.child.top;
}

function CdotReset(options){
  options.target.set({left: options.target.parent.left + options.target.parent.width/2 - options.target.radius})
  options.target.line.path[1][1] = options.target.left + options.target.radius;
  options.target.line.path[1][2] = options.target.top;
}

function CreateCnot(options){
  canvas.add(new fabric.Group(
    circleCross,
    {...cnotCross, left: options.target.left, top: options.target.top}
  ))
  
  let canvasObjects = canvas.getObjects();

  canvas.add(new fabric.Circle(
    {
      ...cnotDot, 
      left: canvasObjects[canvasObjects.length -1].left + ((canvasObjects[canvasObjects.length -1].width/2) - dotRadius ),
      top: canvasObjects[canvasObjects.length -1].top + gridSize/1.5
    })
  )

  canvas.add(new fabric.Path('M 0 0 L 0 0', {stroke: 'grey', strokeWidth: lineStrokeWidth, objectCaching: false, parent: null, child: null}))
  let tempCnotCross;
  let tempDot;
  let tempLine;
  let tempCenter;
  canvasObjects = canvas.getObjects();
  tempCnotCross = canvasObjects[canvasObjects.length - 3];
  tempDot = canvasObjects[canvasObjects.length - 2];
  tempLine = canvasObjects[canvasObjects.length - 1];
  tempCnotCross.child = tempDot;
  tempDot.parent = tempCnotCross;
  tempCnotCross.line = tempLine;
  tempDot.line = tempLine;
  tempLine.parent = tempCnotCross;
  tempLine.child = tempDot;
  tempCenter = tempCnotCross.getCenterPoint()
  tempLine.path[0][1] = tempCenter.x;
  tempLine.path[0][2] = tempCenter.y;
  tempLine.path[1][1] = tempCenter.x;
  tempLine.path[1][2] = tempDot.top;
  tempLine.sendToBack()
  return tempCnotCross;
}

function CreateToffoli(options){
  options.target.child.set(
    {
      left: options.target.left + options.target.width/2 - options.target.child.width/2, 
      top: options.target.top + gridSize/1.5
    }
  );
  options.target.child.setCoords();
  options.target.line.path[0][1] = options.target.left + options.target.width/2;
  options.target.line.path[0][2] = options.target.top + options.target.width/2;
  options.target.line.path[1][1] = options.target.child.left + options.target.child.radius;
  options.target.line.path[1][2] = options.target.child.top;
}

function CdotReset(options){
  options.target.set({left: options.target.parent.left + options.target.parent.width/2 - options.target.radius})
  options.target.line.path[1][1] = options.target.left + options.target.radius;
  options.target.line.path[1][2] = options.target.top;
}

/*function CreateCnot(options){
  canvas.add(new fabric.Group(
    circleCross,
    {...cnotCross, left: options.target.left, top: options.target.top}
  ))
  
  let canvasObjects = canvas.getObjects();

  canvas.add(new fabric.Circle(
    {
      ...cnotDot, 
      left: canvasObjects[canvasObjects.length -1].left + ((canvasObjects[canvasObjects.length -1].width/2) - dotRadius ),
      top: canvasObjects[canvasObjects.length -1].top + gridSize/1.5
    })
  )

  canvas.add(new fabric.Circle(
    {
      ...cnotDot, 
      left: canvasObjects[canvasObjects.length -1].left + ((canvasObjects[canvasObjects.length -1].width/2) - dotRadius ),
      top: canvasObjects[canvasObjects.length -1].top + gridSize/1.25
    })
  )

  canvas.add(new fabric.Path('M 0 0 L 0 0', {stroke: 'grey', strokeWidth: lineStrokeWidth, objectCaching: false, parent: null, child: null}))
  let tempCnotCross;
  let tempDot;
  let tempDot2;
  let tempLine;
  let tempCenter;
  canvasObjects = canvas.getObjects();
  tempCnotCross = canvasObjects[canvasObjects.length - 4];
  tempDot1 = canvasObjects[canvasObjects.length - 3];
  tempDot2 = canvasObjects[canvasObjects.length - 2];
  tempLine = canvasObjects[canvasObjects.length - 1];
  tempCnotCross.child = tempDot;
  tempCnotCross.child2 = tempDot2;
  tempDot1.parent = tempCnotCross;
  tempDot2.parent = tempCnotCross;
  tempCnotCross.line = tempLine;
  tempDot.line = tempLine;
  tempDot2.line = tempLine;
  tempLine.parent = tempCnotCross;
  tempLine.child = tempDot;
  tempCenter = tempCnotCross.getCenterPoint()
  tempLine.path[0][1] = tempCenter.x;
  tempLine.path[0][2] = tempCenter.y;
  tempLine.path[1][1] = tempCenter.x;
  tempLine.path[1][2] = tempDot.top;
  tempLine.sendToBack()
  return tempCnotCross;
}*/

canvas.add(new fabric.Group(
  circleCross,
  {...cnotCross, left: 500, top: 500}
))

let canvasObjects = canvas.getObjects();

canvas.add(new fabric.Circle(
  {
    ...cnotDot, 
    left: canvasObjects[canvasObjects.length -1].left + ((canvasObjects[canvasObjects.length -1].width/2) - dotRadius ),
    top: canvasObjects[canvasObjects.length -1].top + gridSize
  })
)

canvas.add(new fabric.Circle(
  {
    ...cnotDot, 
    left: canvasObjects[canvasObjects.length -1].left + ((canvasObjects[canvasObjects.length -1].width/2) - dotRadius ),
    top: canvasObjects[canvasObjects.length -1].top + gridSize + gridSize/1.5
  })
)

canvas.add(new fabric.Path('M 0 0 L 0 0', {stroke: 'grey', strokeWidth: lineStrokeWidth, objectCaching: false, parent: null, child: null}))
let tempCnotCross;
let tempDot;
let tempDot2;
let tempLine;
let tempCenter;
canvasObjects = canvas.getObjects();
console.log(canvasObjects = canvas.getObjects())
tempCnotCross = canvasObjects[canvasObjects.length - 4];
tempDot = canvasObjects[canvasObjects.length - 3];
tempDot2 = canvasObjects[canvasObjects.length - 2];
tempLine = canvasObjects[canvasObjects.length - 1];
tempCnotCross.child = tempDot;
tempCnotCross.child2 = tempDot2;
tempDot.parent = tempCnotCross;
tempDot2.parent = tempCnotCross;
tempCnotCross.line = tempLine;
tempDot.line = tempLine;
tempDot2.line = tempLine;
tempLine.parent = tempCnotCross;
tempLine.child = tempDot2;
tempCenter = tempCnotCross.getCenterPoint()
tempLine.path[0][1] = tempCenter.x;
tempLine.path[0][2] = tempCenter.y;
tempLine.path[1][1] = tempCenter.x;
tempLine.path[1][2] = tempDot2.top;
tempLine.sendToBack()