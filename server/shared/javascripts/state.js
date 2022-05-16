

// A hack to make code re-useable between the client and the backend
// https://caolan.uk/notes/2010-07-01_writing_for_node_and_the_browser.cm

(function(exports){

    // - model

    var _state = {
        boxes: [],
        circles: []
    }

    // - functionality
    
    /**
     * Retrieves a deep copy of the state.
     */ 
    function get() {
        // oof performance wise, need to find an alternative to deep copy
        return JSON.parse(JSON.stringify(_state))
    }
    
    /**
     * Sets the boxes / circles of the state.
     */ 
    function set(boxes, circles) {
        // oof performance wise, need to find an alternative to deep copy
        _state.boxes = JSON.parse(JSON.stringify(boxes))
        _state.circles = JSON.parse(JSON.stringify(circles))
    }
    
    /**
     * Undo the previous action. Adds the action to the redo array.
     */ 
    function undo(message) {
        if (message.action == 'delete'){
            _state[message.collection] = _state[message.collection].filter(entry => {
              return entry.id != message.id
            })
        }
    }
    
    /**
     * Redo a previous undo'ed action.
     */ 
    function redo(message) {
        console.log(message)
        if (message.action == 'create'){
            _state[message.collection].push(message.data)
        }
    }
    
    /**
     * Creates a box that is added to the state.
     * 
     *   const box = {
     *       x: data.x, 
     *       y: data.y, 
     *       color: colors[Math.floor(Math.random() * colors.length)],
     *       id,
     *   }
     * 
     */ 
    function createBox(data) {
        _state.boxes.push(data)
    }
    
    /**
     * Creates a circle that is added to the state.
     * 
     *   const circle = {
     *       x: data.x, 
     *       y: data.y, 
     *       color: colors[Math.floor(Math.random() * colors.length)],
     *       id,
     *   }
     * 
     */ 
    function createCircle(data) {
        _state.circles.push(data)
    }

    // - exports

    exports.createCircle = createCircle 
    exports.createBox = createBox
    exports.redo = redo
    exports.undo = undo
    exports.get = get
    exports.set = set 

})(typeof exports === 'undefined'? this['state']={}: exports);