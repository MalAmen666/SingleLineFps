// https://www.sitepoint.com/quick-tip-game-loop-in-javascript/

/** Object that stores the game state variables. */
var state = {
    // in radians
	field_of_view: 100 * Math.PI / 180,
	pos: new Point(4, 1),
    // radians angle counterclockwise from right
	facing: Math.PI / 2,
    
	// Map is a list of length pair, at least 4, that contain pairs of coordinates x y.
	// First pair is the starting coordinate, then the following pairs indicate the next coordinate, the final
	// coordinate connects to the first. Works like an opengl GL_LINE_LOOP.
	map: new Map([
	    new Polygon(
        [
            1, 0,
            5, 0,
            5, 3,
            3, 3,
            3, 4,
            0, 4,
            0, 1,
            1, 1
        ]),
        new Polygon(
		[
			1, 2,
			2, 2,
			2, 3,
			1, 3
		])
	]),
    pressedKeys: {
        strafe_right:   false,
        strafe_left:    false,
        up:             false,
        down:           false,
        left:           false,
        right:          false
    },
    playerSpeed: 1,
    playerTurningSpeed: Math.PI / 2
};

/** The main canvas where the game is drawn on. */
var canvas = document.getElementById('canvas');

/** The main canvas context to use for 2d graphics. */
var ctx = canvas.getContext('2d');


// canvas.style.marginTop = Math.floor(-1 * (fontClass.font_sizes.line_height * 1) / 2) + "px";
var fontClass;

// Change font
function onFontSelectionChange() {
    var fontSelectionElement = document.getElementById("fontSelection");
    var font = fontSelectionElement.options[fontSelectionElement.selectedIndex].text;
    fontClass = new Font(ctx, font);
    canvas.style.height = Math.floor(fontClass.font_sizes.line_height * 1) + "px";
    loseFocus();
    draw();
}
onFontSelectionChange();

function onFovSliderChange() {
    var fovSliderElement = document.getElementById("fovSlider");
    var fov = fovSliderElement.value;
    document.getElementById("fovSliderFeedback").textContent = fov + "º";
    state.field_of_view = fov * Math.PI / 180;
    //loseFocus();
    draw();
}
onFovSliderChange();

function loseFocus() {
    document.activeElement.blur();
}

/** Draws the game window. */
function draw() {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "white";
    drawWalls(fontClass, state.map, state.pos, state.facing, state.field_of_view);
}

/** Class responsible for the update of the FPS counter. */
var fpsCounter = new FpsCounter(1, document.getElementById('fps_counter'));

/** Updates the game logic. Receives the delta time, returns if the draw() should be called. */
function update(progress) {
    fpsCounter.count(progress);
    
    var refresh = false;
    
    // Check player input
    if (state.pressedKeys.left) {
        state.facing -= progress / 1000 * state.playerTurningSpeed;
        refresh = true;
    }
    if (state.pressedKeys.right) {
        state.facing += progress / 1000 * state.playerTurningSpeed;
        refresh = true;
    }
    var speed;
    if (state.pressedKeys.strafe_left) {
        speed = progress / 1000 * state.playerSpeed;
        state.pos.x += Math.cos(state.facing - Math.PI / 2) * speed;
        state.pos.y += Math.sin(state.facing - Math.PI / 2) * speed;
        refresh = true;
    }
    if (state.pressedKeys.strafe_right) {
        speed = progress / 1000 * state.playerSpeed;
        state.pos.x += Math.cos(state.facing + Math.PI / 2) * speed;
        state.pos.y += Math.sin(state.facing + Math.PI / 2) * speed;
        refresh = true;
    }
    if (state.pressedKeys.up) {
        speed = progress / 1000 * state.playerSpeed;
        state.pos.x += Math.cos(state.facing) * speed;
        state.pos.y += Math.sin(state.facing) * speed;
        refresh = true;
    }
    if (state.pressedKeys.down) {
        speed = progress / 1000 * state.playerSpeed;
        state.pos.x += Math.cos(state.facing + Math.PI) * speed;
        state.pos.y += Math.sin(state.facing + Math.PI) * speed;
        refresh = true;
    }
    return refresh;
}

// GAME LOOP

var lastRender = 0;
function loop(timestamp) {
    var progress = timestamp - lastRender;
    
    if (update(progress))
        draw();
    
    lastRender = timestamp;
    window.requestAnimationFrame(loop);
}
window.requestAnimationFrame(loop);

// END GAME LOOP

// INPUT

/** Maps the possible key codes to their names. */
var keyMap = {
    68: 'strafe_right',
    65: 'strafe_left',
    87: 'up',
    83: 'down',
    37: 'left',
    39: 'right'
};
function keydown(event) {
    var rawKey = event.keyCode;
    var keyName = keyMap[rawKey];
    state.pressedKeys[keyName] = true;
    console.log("Pressed " + keyName + " " + rawKey);
}
function keyup(event) {
    var key = keyMap[event.keyCode];
    state.pressedKeys[key] = false;
    console.log("Released " + key);
}
window.addEventListener("keydown", keydown, false);
window.addEventListener("keyup", keyup, false);

function resize_canvas(){
    canvas.width  = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
	console.log("Window resized to " + window.innerWidth + "x" + window.innerHeight);
	draw();
}

// END INPUT

resize_canvas();
window.addEventListener("resize", resize_canvas);
window.addEventListener("orientationchange", resize_canvas);

// DEBUG CODE
// drawWalls(fontClass, state.map, state.pos, state.facing, state.field_of_view);
