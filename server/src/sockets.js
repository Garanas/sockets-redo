
// - importing

var state = require('../shared/javascripts/state')

// - model 

var identifier = 0

var actions = {
    redo: [],
    undo: []
}

var colors = [
      '#E1CC4F'
    , '#025669'
    , '#474A51'
    , '#C35831'
    , '#734222'
    , '#1F3A3D'
    , '#6A5F31'
    , '#6A5D4D'
    , '#8A9597'
    , '#D95030'
    , '#8673A1'
    , '#1E1E1E'
    , '#C7B446'
    , '#464531'
    , '#999950'
    , '#2F4538'
    , '#686C5E'
    , '#641C34'
    , '#A2231D'
    , '#E6D690'
]

// - functionality

function listen(io) {

    const room = 1
    const sockets = io.of('/demo');
    sockets.on('connection', (socket) => {
        console.log('a user connected', socket.id);

        // send current state to the socket
        const instance = state.get()
        socket.emit('state', {
            boxes: instance.boxes, circles: instance.circles
        })

        socket.on('init-undo', () => {
            console.log('init-undo!')

            if (actions.undo.length > 0){

                // finalize data
                const action = actions.undo.pop()
                actions.redo.push(action)
                
                // adjust state
                state.undo(action.undo)

                // tell clients to adjust state
                sockets.emit('undo', action.undo)
            } else {
                console.log('Nothing to undo!')
            }
        })

        socket.on('init-redo', () => {
            console.log('init-redo!')

            if (actions.redo.length > 0){

                // finalize data
                const action = actions.redo.pop()
                actions.undo.push(action)

                // adjust state
                state.redo(action.redo)

                // tell clients to adjust state
                sockets.emit('redo', action.redo)
            } else {
                console.log('Nothing to redo!')
            }
        })

        socket.on('init-create-box', (data) => {
            console.log('init-create-box!')

            // finalize data
            const id = identifier 
            identifier++

            const box = {
                x: data.x, 
                y: data.y, 
                color: colors[Math.floor(Math.random() * colors.length)],
                id,
            }

            // adjust state
            state.createBox(box)

            actions.redo = [ ]
            actions.undo.push({
                redo: {
                    action: 'create', 
                    collection: 'boxes', 
                    data: box 
                },
                undo: {
                    action: 'delete',
                    collection: 'boxes',
                    id
                }
            })


            // tell clients to adjust state
            sockets.emit('create-box', box)
        })

        socket.on('init-create-circle', (data) => {
            console.log('init-create-circle!')

            // finalize data
            const id = identifier 
            identifier++

            const circle = {
                x: data.x, 
                y: data.y, 
                color: colors[Math.floor(Math.random() * colors.length)],
                id,
            }

            // adjust state
            state.createCircle(circle)

            actions.redo = [ ]
            actions.undo.push({
                redo: {
                    action: 'create', 
                    collection: 'circles', 
                    data: circle 
                },
                undo: {
                    action: 'delete',
                    collection: 'circles',
                    id
                }
            })

            // tell clients to adjust state
            sockets.emit('create-circle', circle)
        })
    })
}

// - exporting

module.exports = {
    listen
}