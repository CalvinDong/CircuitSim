// Make everything easier to edit by making text offset for those clicky text things on the left (especially for calc functions)

const canvas = new fabric.Canvas('c', { selection: false });
const width = Math.round(window.innerWidth/2);
const height = Math.round(window.innerHeight/1.5);
canvas.setWidth(width);
canvas.setHeight(height);
const maxQubits = 8;
const minQubits = 2;
const grid = 25;
const gridSize = Math.round(width/grid);
const tileSize = Math.round(gridSize * 0.7);
const toolboxOffset = Math.round(width/8);
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
  moveCursor: 'grabbing',
}

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
  new fabric.Circle(     
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

const ccnot = [
  new fabric.Circle(              
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

const swapSym = [
  new fabric.Line([ 0, -tileSize/6, 0, tileSize/6], {
    originX: 'center',
    originY: 'center',
    top: -tileSize/4,
    stroke: 'GREY',
    angle: 45
  }),
  new fabric.Line([-tileSize/6, 0, tileSize/6, 0], {
    originX: 'center',
    originY: 'center',
    top: -tileSize/4,
    stroke: 'GREY',
    angle: 45
  }),
  new fabric.Line([ 0, -tileSize/6, 0, tileSize/6], {
    originX: 'center',
    originY: 'center',
    top: tileSize/4,
    stroke: 'GREY',
    angle: 45
  }),
  new fabric.Line([-tileSize/6, 0, tileSize/6, 0], {
    originX: 'center',
    originY: 'center',
    top: tileSize/4,
    stroke: 'GREY',
    angle: 45
  }),
  new fabric.Line([0, tileSize/6, 0, -tileSize/6], {
    originX: 'center',
    originY: 'center',
    stroke: 'GREY',
  })
]

const CNOT = 
{
  hasControls: false,
  selectable: true,
  name: 'CNOT',
  child: null,
  line: null,
  hoverCursor: 'grab',
  moveCursor: 'grabbing',
  gateType: 'multi_tile_2',
  tof: false
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

const CCNOT = {
  ...CNOT,
  gateType: 'multi_tile_3',
  name: 'CCNOT',
  line2: null
}

const cross = [
  new fabric.Line([0, Math.floor(tileSize/3), 0, -Math.floor(tileSize/3)],
    {
      originX: 'center',
      originY: 'center',
      stroke: 'GREY',
      strokeWidth: Math.round(tileSize/12),
      angle: 45
    }),
  new fabric.Line([0, Math.floor(tileSize/3), 0, -Math.floor(tileSize/3)],
    {
      originX: 'center',
      originY: 'center',
      stroke: 'GREY',
      strokeWidth: Math.round(tileSize/12),
      angle: -45
    })
]

const swapCross = {
  hasControls: false,
  selectable: true,
  name: 'SWAP',
  parent: null,
  child: null,
  line: null,
  hoverCursor: 'grab',
  moveCursor: 'grabbing',
  gateType: 'multi_tile_2',
}

const swapCrossChild = {
  ...swapCross,
  gateType: 'multi_tile',
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
  {name: 'X', color: '#72EFDD', gateType: 'single', symbol: null},
  {name: 'cnot', color: '#80FFDB', gateType: 's_multi_tile_2', symbol: cnot}, // s_multi_tile for the tile representations of the gates
  {name: 'ccnot', color: '#80FFAE', gateType: 's_multi_tile_3', symbol: ccnot},
  {name: 'swap', color: '#80FF9F', gateType: 's_multi_tile_2', symbol: swapSym}

]

let qubits = 2;
let originalX = gridSize;
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

let qArray = [{value: '|0〉', ref: null}, {value: '|0〉', ref: null}];
let gateModel = [];

DrawGrid();
DrawQubit();

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
  if (options.target && options.target != gridGroup && !options.target.selectable && options.target.gateType !== 'qubitTell'){
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
      canvas.add(new fabric.Group(
        [
          new fabric.Rect(drag_rect), 
          new fabric.Text(options.target._objects[1].text, textField)
        ], 
        drag_group
      ));
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
  if (options.target && options.target.gateType != 'single'){ // create symbols for multi qubit gates on the gates
    let temp = options.target
    if (options.target.gateType == 's_multi_tile_2'){
      temp = options.target;
      options.target = TwoQuGate(options, options.target.name);
      canvas.remove(temp)
    }
    if (options.target.gateType == 's_multi_tile_3'){
      temp = options.target;
      options.target = ThreeQuGate(options, options.target.name);
      canvas.remove(temp)
    }
  }

  if (options.target.selectable && options.target.type != gridGroup) {
    if (options.target.left < width && (options.target.top > toolboxOffset) && (options.target.top < toolboxOffset + (gridSize * qubits))){
      options.target.set({ // Placing in the center of the grid tiles
        left: (Math.round(options.target.left/gridSize) * gridSize) + Math.round((gridSize/2 - options.target.width/2)),
        top: (Math.floor((options.target.top - toolboxOffset)/gridSize)) * gridSize + toolboxOffset + Math.round(gridSize/2 - options.target.width/2),
      });
      options.target.setCoords()
      CalculateIntersection(options); // Bug occurs here where placing cnot gate in certain situations will register CNOT and snotDot as intersecting
    }
    else if (options.target.top < toolboxOffset) {
      console.log("removing")
      RemoveTile(options.target);
    }
    else{
      SnapToPreviousPosition(options);
    }
    canvas.renderAll();
  }
});

canvas.on('object:moving', function(options){ // Makes multi gates behave when dragged, 
  // SHOULD REALLY LOOK AT MAKING ORIGINS AROUND X TO AVOID CALCULATIONS
  if (options.target && options.target.parent){
    CdotReset(options)
  }
  if (options.target && options.target.child){
    CnotReset(options);
  }
});

canvas.on('object:moved', function(options){
  if (options.target && options.target.parent){
    CdotReset(options);
  }
  if (options.target && options.target.child){
    CnotReset(options);
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
    /*if (obj.type == 'path' && obj.parent.name == 'CNOT'){
      if (obj.parent.tof){
        if (obj.parent != options.target && (options.target.parent != obj.parent)){
          if (options.target.intersectsWithVertPath(obj)){
            console.log("getting vert broi")
            SnapToPreviousPosition(options)
            return;
          }
        }
      }
      else{
        if (obj.parent != options.target && obj.child != options.target){ // Only execute on objects not part of same multi gate
          if (options.target.intersectsWithVertPath(obj)){
            SnapToPreviousPosition(options)
            return;
          }
        }
      }
    }*/

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
  return (this.intersectsWithRect(topLeft, bottomRight))
}

function DrawGrid(){ // Draw lines
  for (var i = 0; i < qubits; i++){
    gridGroup.addWithUpdate(new fabric.Line(
        [ gridSize, (toolboxOffset) + (gridSize * i) + gridSize/2, width,  toolboxOffset + (gridSize * i) + gridSize/2], 
        { stroke: '#ccc', selectable: false }
      )); // x-axis
  }

  /*
  for (var i = 0; i <= qubits; i++){ // For seeing the actial grid the tiles fit in
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
  canvas.sendToBack(gridGroup);
  canvas.renderAll();
}

function DrawQubit(){ // Draw qubits and add to the model of the data
  let text = {
    ...textField,
    fill: 'black',
    originX: 'left', 
    left: 0,
    gateType: 'qubitTell',
    hoverCursor: 'pointer'
  }
  qArray.forEach(function(qu, i){
    if (qu.ref == null){
      qu.ref = new fabric.Text('|0〉', {...text, top: (toolboxOffset) + (gridSize * i) + gridSize/2,});
      canvas.add(qu.ref);
    }
  })
}

canvas.on('mouse:down', function(options){ // Change the state if the qubit
  let pressed = true;
  if (options.target && options.target.gateType == 'qubitTell'){
    if (options.target.text == '|0〉' && pressed){
      let obj = qArray.find(qu => qu.ref == options.target);
      obj.value = '|1〉';
      options.target.text = '|1〉';
      pressed = false;
    }
    if (options.target.text == '|1〉' && pressed){
      let obj = qArray.find(qu => qu.ref == options.target);
      obj.value = '|0〉';
      options.target.text = '|0〉';;
      pressed = false;
    }
  }
})

function AddQubit(){ // Remove all grid lines then redraw them with an extra row
  if (qubits < maxQubits){
    console.log("add");
    qubits++;
    qArray.push({value: '|0〉', ref: null});
    gridGroup.forEachObject(function(obj){
      gridGroup.remove(obj);
    })
    canvas.remove(gridGroup);
    DrawGrid();
    DrawQubit();
  }
}

function SubtractQubit(){ // Remove all grid lines then redraw them with one less row
  if (qubits > minQubits){
    console.log("subtract");
    qubits--;
    canvas.remove(qArray[qArray.length - 1].ref);
    qArray.pop();
    removeTilesFromLine();
    gridGroup.forEachObject(function(obj){
      gridGroup.remove(obj);
    })
    canvas.remove(gridGroup);
    DrawGrid();
    DrawQubit();
  }
}

function removeTilesFromLine(){ // Looks for objects on the line to be removed and removes them
  canvas.forEachObject(function(obj){
    if (obj == gridGroup) return;
    if (obj.top > toolboxOffset + (gridSize * (qubits))){
      RemoveTile(obj)
    }
  })
}

function RemoveTile(obj){ // Removes objects from line being removed
  if (obj.gateType == 'single'){
    canvas.remove(obj)
    return;
  }
  else{
    if (obj.gateType == 'multi_tile_2'){
      canvas.remove(obj.line);
      canvas.remove(obj.child);
      canvas.remove(obj);
      return;
    }
    if (obj.gateType == 'multi_tile_3'){
      canvas.remove(obj.line);
      canvas.remove(obj.child);
      canvas.remove(obj.line2);
      canvas.remove(obj.child2);
      canvas.remove(obj);
      return;
    }
  }
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
  let obj = tools.find(o => o.name === name)
  return obj.symbol;
}

function TwoQuGate(options, name){
  if (name == 'cnot'){
    canvas.add(new fabric.Group(
      circleCross,
      {...CNOT, left: options.target.left, top: options.target.top}
    ))
    
    let canvasObjects = canvas.getObjects();
  
    canvas.add(new fabric.Circle(
      {
        ...cnotDot, 
        left: canvasObjects[canvasObjects.length -1].left + ((canvasObjects[canvasObjects.length -1].width/2) - dotRadius ),
        top: canvasObjects[canvasObjects.length -1].top + gridSize/1.5
      })
    )
  }

  if (name == 'swap'){
    canvas.add(new fabric.Group(cross, {...swapCross, left: options.target.left, top: options.target.top}))
    let canvasObjects = canvas.getObjects();
    canvas.add(new fabric.Group(
      [
        new fabric.Line([0, Math.floor(tileSize/3), 0, -Math.floor(tileSize/3)], // Has to be put in full otherwise it just spawns on top of the first cross group???
          {
            originX: 'center',
            originY: 'center',
            stroke: 'BLACK',
            strokeWidth: Math.round(tileSize/12),
            angle: 45
          }),
        new fabric.Line([0, Math.floor(tileSize/3), 0, -Math.floor(tileSize/3)],
          {
            originX: 'center',
            originY: 'center',
            stroke: 'BLACK',
            strokeWidth: Math.round(tileSize/12),
            angle: -45
          })
      ],
      {...swapCrossChild, left: options.target.left, top: canvasObjects[canvasObjects.length -1].top + gridSize}
    ))
  }

  canvas.add(new fabric.Path('M 0 0 L 0 0', {stroke: 'grey', strokeWidth: lineStrokeWidth, objectCaching: false, parent: null, child: null}))
  let tempPARENT;
  let tempCHILD;
  let tempLine;
  let tempCenter;
  canvasObjects = canvas.getObjects();
  tempPARENT = canvasObjects[canvasObjects.length - 3];
  tempCHILD = canvasObjects[canvasObjects.length - 2];
  tempLine = canvasObjects[canvasObjects.length - 1];
  tempPARENT.child = tempCHILD;
  tempCHILD.parent = tempPARENT;
  tempPARENT.line = tempLine;
  tempCHILD.line = tempLine;
  tempLine.parent = tempPARENT;
  tempLine.child = tempCHILD;
  tempCenter = tempPARENT.getCenterPoint()
  tempLine.path[0][1] = tempCenter.x;
  tempLine.path[0][2] = tempCenter.y;
  tempLine.path[1][1] = 100;
  tempLine.path[1][2] = tempCHILD.top;
  tempLine.sendToBack()
  return tempPARENT;
}

function ThreeQuGate(options, name){
  if (name == 'ccnot'){
    canvas.add(new fabric.Group(
      circleCross,
      {...CCNOT, left: options.target.left, top: options.target.top}
    ))
    
    let canvasObjects = canvas.getObjects();
    
    canvas.add(new fabric.Circle(
      {
        ...cnotDot, 
        left: canvasObjects[canvasObjects.length -1].left + ((canvasObjects[canvasObjects.length -1].width/2) - dotRadius ),
        top: canvasObjects[canvasObjects.length -1].top + gridSize/2 + cnotDot.radius
      })
    )
    
    canvas.add(new fabric.Circle(
      {
        ...cnotDot, 
        left: canvasObjects[canvasObjects.length -1].left + ((canvasObjects[canvasObjects.length -1].width/2) - dotRadius ),
        top: canvasObjects[canvasObjects.length -1].top + gridSize
      })
    )
  }
  
  canvas.add(new fabric.Path('M 0 0 L 0 0', {stroke: 'grey', strokeWidth: lineStrokeWidth, objectCaching: false, parent: null, child: null}))
  canvas.add(new fabric.Path('M 0 0 L 0 0', {stroke: 'grey', strokeWidth: lineStrokeWidth, objectCaching: false, parent: null, child: null}))
  let tempPARENT;
  let tempCHILD;
  let tempCHILD2;
  let tempLine;
  let tempLine2;
  let tempCenter;
  canvasObjects = canvas.getObjects();
  tempPARENT = canvasObjects[canvasObjects.length - 5];
  tempCHILD = canvasObjects[canvasObjects.length - 4];
  tempCHILD2 = canvasObjects[canvasObjects.length - 3];
  tempLine = canvasObjects[canvasObjects.length - 2];
  tempLine2 = canvasObjects[canvasObjects.length - 1];
  tempPARENT.child = tempCHILD;
  tempPARENT.child2 = tempCHILD2;
  tempCHILD.parent = tempPARENT;
  tempCHILD2.parent = tempPARENT;
  tempPARENT.line = tempLine;
  tempPARENT.line2 = tempLine2;
  tempCHILD.line = tempLine;
  tempCHILD2.line = tempLine2;
  tempLine.parent = tempPARENT;
  tempLine.child = tempCHILD;
  tempLine2.parent = tempPARENT;
  tempLine2.child = tempCHILD2;
  tempCenter = tempPARENT.getCenterPoint()
  tempLine.path[0][1] = tempCenter.x;
  tempLine.path[0][2] = tempCenter.y;
  tempLine.path[1][1] = tempCenter.x;
  tempLine.path[1][2] = tempCHILD.top;
  tempLine.sendToBack();
  tempLine2.path[0][1] = tempCenter.x;
  tempLine2.path[0][2] = tempCenter.y;
  tempLine2.path[1][1] = tempCenter.x;
  tempLine2.path[1][2] = tempCHILD2.top;
  tempLine2.sendToBack();
  return tempPARENT;
}


function CnotReset(options){ // Make cnot gate behave when being dragged
  options.target.child.set(
    {
      left: options.target.left + options.target.width/2 - options.target.child.width/2, 
      top: options.target.top + gridSize/1.5
    }
  );
  options.target.child.setCoords();
  center = options.target.getCenterPoint();
  centerChild = options.target.child.getCenterPoint();
  options.target.line.path[0][1] = center.x;
  options.target.line.path[0][2] = center.y;
  options.target.line.path[1][1] = centerChild.x;
  options.target.line.path[1][2] = centerChild.y;
  
  if (options.target.child2){ // For three qubit gates
    options.target.child.set('top',options.target.top + gridSize/2 + options.target.child.width/2);
    options.target.child2.set(
      {
        left: options.target.left + options.target.width/2 - options.target.child2.width/2, 
        top: options.target.top + gridSize
      }
    )
    options.target.child2.setCoords();
    options.target.line2.path[0][1] = options.target.left + options.target.width/2;
    options.target.line2.path[0][2] = options.target.top + options.target.width/2;
    options.target.line2.path[1][1] = options.target.child2.left + options.target.child2.width/2;
    options.target.line2.path[1][2] = options.target.child2.top;
  }
}

function CdotReset(options){ // make the cnotDot behave when being dragged around by CNOT
  let center = options.target.getCenterPoint()
  let centerParent = options.target.parent.getCenterPoint()
  options.target.set({left: centerParent.x - options.target.width/2})
  options.target.line.path[1][1] = options.target.left + options.target.width/2; // don't use center here because function keeps repeating as it moves
  options.target.line.path[1][2] = center.y;
}

function Calculate(){ // Use the tile positions on the ui to calculate 
  let file;
  let content;
  let temp;
  let qPosition;
  let gatePosition;
  let objLen;
  let gatePosLen;
  let max = 0; // Gate Position of last gate 
  let childTemp;
  let childQPos;
  let childTemp2;
  let childQPos2;

  gateModel = []; // Reset the gate model

  for (i = 0; i < qubits; i++){ // Initialise each line representation in gateModel array
    gateModel.push([])
  } 
  
  canvas.forEachObject(function(obj){
    if (obj == gridGroup || obj.top < toolboxOffset) return;
    temp = obj.getCenterPoint();
    if (obj.type == 'text'){
      qPosition = Math.round((temp.y - (toolboxOffset + gridSize/2))/gridSize);
      if (obj.text == '|0〉'){
        gateModel[qPosition][0] = 0;
      }
      else if (obj.text == '|1〉'){
        gateModel[qPosition][0] = 1;
      }
      return;
    }
    else{
      qPosition = Math.round((temp.y - (toolboxOffset + gridSize/2))/gridSize); // Note there's a small difference in the calculations requiring some rounding. Could lead to errors on certain resolutions?
      gatePosition = Math.round(((temp.x - (gridSize + gridSize/2))/gridSize));
      objLen = gateModel[qPosition].length;
      gatePosLen = gatePosition + 1;

      if (objLen < gatePosLen){ // Make sure the array holding gates for a qubit is long enough
        for (i = objLen - 1; i < gatePosLen - 1; i++){
          gateModel[qPosition].push(null);
        }
      }

      if (gatePosLen > max){ // Check max for putting into cirq
        max = gatePosLen;
      }
      
      if (obj.parent) return;
      if (obj.gateType == 'multi_tile_2'){
        childTemp = obj.child.getCenterPoint();
        childQPos = Math.round((childTemp.y - (toolboxOffset + gridSize/2))/gridSize);
        gateModel[qPosition][gatePosition + 1] = {name: obj.name, multi: [childQPos]};
      }
      else if (obj.gateType == 'multi_tile_3'){
        childTemp = obj.child.getCenterPoint();
        childTemp2 = obj.child2.getCenterPoint();
        childQPos = Math.round((childTemp.y - (toolboxOffset + gridSize/2))/gridSize);
        childQPos2 = Math.round((childTemp2.y - (toolboxOffset + gridSize/2))/gridSize);
        gateModel[qPosition][gatePosition + 1] = {name: obj.name, multi: [childQPos, childQPos2]};
      }
      else{
        gateModel[qPosition][gatePosition + 1] = {name: obj.name, multi: null};
      }
    }
  })
  
  console.log(gateModel)
  content = PyOutput(max)
  console.log("Save to Python")
  try{
    file = new File([content], "output.py", {type: 'text/plain'});
  }
  catch(e){
    file = new Blob([content], {type: 'text/plain'});
  }
  var objectURL = URL.createObjectURL(file);
  document.getElementById('linkPy').href = objectURL;
}

function PyOutput(max){
  let content;
  content = "def build_circuit():\n "
  content = content + "from cirq import GridQubit, Circuit\n ";
  content = content + "from cirq.circuits import InsertStrategy as strategy\n ";
  content = content + "from cirq.ops import X, Y, Z, H, I, T, S, CNOT, CCNOT, SWAP\n ";
  content = content + "moments = []\n circuit = Circuit()\n ";

  // Create gridQubits
  gateModel.forEach(function(line, lineIndex){
    content = content + `q${lineIndex} `
    content = content + "= "
    content = content + `GridQubit(${lineIndex}, 0)\n `
  })

  for (i = 1; i < max + 1; i++){ // Start at 1 since first position in array is dedicated to 0 or 1 state of qubit
    content = content + "moments.append(["
    gateModel.forEach(function(line, lineIndex){
      if (line.length < i) return;
      if (line[i] == null) return;
      if (line[i].gateType == 'multi_tile') return;

      if (line[i].multi && line[i].multi.length == 1){
        content = content + `${line[i].name}(q${line[i].multi}, q${lineIndex}), `;
      }
      else if (line[i].multi && line[i].multi.length == 2){
        content = content + `${line[i].name}(q${line[i].multi[0]}, q${line[i].multi[1]}, q${lineIndex}), `;
      }
      else{
        content = content + `${line[i].name}(q${lineIndex}), `;
      }
    })
    content = content + "])\n "
  }

  content = content + "for moment in moments:\n    circuit.append(moment, strategy.NEW_THEN_INLINE)\n ";
  content = content + "return circuit\n ";


  content = content + "\nif __name__ == '__main__':\n ";
  content = content + "circuit = build_circuit()\n ";
  content = content + "print(circuit)\n ";
  content = content + "import os\n os.system('pause')\n ";
  console.log(content)
  return content;
}

