
// create the canvas

const canvas = document.createElement('canvas');
const context = canvas.getContext('2d');

let width = 500;
let height = 700;

function createCanvas() {
  canvas.id = 'canvas';
  canvas.width = width;
  canvas.height = height;
  document.body.appendChild(canvas);
}

function renderCanvas() {

  // background
  context.fillStyle = 'black';
  context.fillRect(0, 0, width, height);

  // retrieve state and render it
  instance = state.get()

  instance.boxes.forEach(function(box, index, boxes) {
    context.fillStyle = box.color;
    context.fillRect(box.x, box.y, 10, 10);
  })

  instance.circles.forEach(function(circle, index, circles) {
    context.fillStyle = 'white';
    context.fillRect(circle.x, circle.y, 10, 10);
  })

  console.log('Finished rendering canvas!')
}

createCanvas();
renderCanvas();

// - socket functionality

const socket = io('/demo');

socket.on('connect', () => {
  console.log('Connected as: ', socket.id);
})

socket.on('state', (data) => {
  console.log("Receiving state ...")
  console.log(data)
  state.set(data.boxes, data.circles)
  console.log("State processed.")
  renderCanvas()
})

socket.on('undo', (data) => {
  console.log("Receiving undo ...")
  console.log(data)

  state.undo(data)

  console.log("Undo processed.")

  renderCanvas();
})

socket.on('redo', (data) => {
  console.log("Receiving redo ...")
  console.log(data)

  state.redo(data)

  console.log("Redo processed.")

  renderCanvas();
})

socket.on('create-box', (data) => {
  console.log("Receiving box...")

  state.createBox(data)

  console.log("Box processed.")

  renderCanvas();
})

socket.on('create-circle', (data) => {
  console.log("Receiving circle...")

  state.createCircle(data)

  console.log("circle processed.")

  renderCanvas();
})

// - button functionality

function onClickUndo() {
  console.log('Sending: init-undo')
  socket.emit('init-undo')
}

function onClickRedo() {
  console.log('Sending: init-redo')
  socket.emit('init-redo')
}

function onClickCreateBox() {
  const x = 10 + Math.random() * (width - 10)
  const y = 10 + Math.random() * (height - 10)

  console.log('Sending: init-create-box')
  socket.emit('init-create-box', { 
    x, y
  })
}

function onClickCreateCircle() {
  const x = 10 + Math.random() * (width - 10)
  const y = 10 + Math.random() * (height - 10)

  console.log('Sending: init-create-circle')
  socket.emit('init-create-circle', { 
    x, y
  })
}
