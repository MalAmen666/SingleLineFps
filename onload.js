// https://www.sitepoint.com/quick-tip-game-loop-in-javascript/

/** Object that stores the game state variables. */
var state = {
    // in radians
	field_of_view: 80 * Math.PI / 180,
	pos: {x: 4, y: 1},
    // radians angle counterclockwise from right
	facing: Math.PI * 2 / 2,
    
	// Map is a list of length pair, at least 4, that contain pairs of coordinates x y.
	// First pair is the starting coordinate, then the following pairs indicate the next coordinate, the final
	// coordinate connects to the first. Works like an opengl GL_LINE_LOOP.
	map: [
		[
			1, 0,
			5, 0,
			5, 3,
			3, 3,
			3, 4,
			0, 4,
			0, 1,
			1, 1
		],
		[
			1, 2,
			2, 2,
			2, 3,
			1, 3
		]
	],
    pressedKeys: {},
    playerSpeed: 1,
    playerTurningSpeed: Math.PI / 2
};

/** The main canvas where the game is drawn on. */
var canvas = document.getElementById('canvas');

/** The main canvas context to use for 2d graphics. */
var ctx = canvas.getContext('2d');

var font = "Arial";
var fontClass = new Font(ctx, font);
canvas.style.height = (fontClass.font_sizes.line_height * 2) + "px";

/** Draws the game window. */
function draw() {
	ctx.fillStyle = "red";
	ctx.fillRect(10, 10, 30, 30);
	ctx.fillRect(ctx.canvas.clientWidth - 40, ctx.canvas.clientHeight - 40, 30, 30);

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "black";
    drawWalls(fontClass, state.map, state.pos, state.facing, state.field_of_view);
}

var fps_count_yet = 0;
var fps_time_left = 1000;
console.log("Console logging on.");
/** Updates the game logic. Receives the delta time, returns if the draw() should be called. */
function update(progress) {
    if (fps_time_left < 0) {
        document.getElementById('fps_counter').textContent = "" + fps_count_yet;
        fps_count_yet = 0;
        fps_time_left = 1000;
    } else {
        fps_count_yet += 1;
        fps_time_left -= progress;
    }
    
    var refresh = false;
    
    // Check player input
    if (state.pressedKeys.left) {
        state.facing -= progress / 1000 * state.playerTurningSpeed;
        console.log("facing: " + state.facing);
        refresh = true;
    }
    if (state.pressedKeys.right) {
        state.facing += progress / 1000 * state.playerTurningSpeed;
        console.log("state.facing: " + state.facing);
        refresh = true;
    }
    if (state.pressedKeys.strafe_left) {
        var speed = progress / 1000 * state.playerSpeed;
        state.pos.x += Math.cos(state.facing - Math.PI / 2) * speed;
        state.pos.y += Math.sin(state.facing - Math.PI / 2) * speed;
        console.log("x, y: " + state.pos.x + ", " + state.pos.y);
        refresh = true;
    }
    if (state.pressedKeys.strafe_right) {
        var speed = progress / 1000 * state.playerSpeed;
        state.pos.x += Math.cos(state.facing + Math.PI / 2) * speed;
        state.pos.y += Math.sin(state.facing + Math.PI / 2) * speed;
        console.log("x, y: " + state.pos.x + ", " + state.pos.y);
        refresh = true;
    }
    if (state.pressedKeys.up) {
        var speed = progress / 1000 * state.playerSpeed;
        state.pos.x += Math.cos(state.facing) * speed;
        state.pos.y += Math.sin(state.facing) * speed;
        console.log("x, y: " + state.pos.x + ", " + state.pos.y);
        refresh = true;
    }
    if (state.pressedKeys.down) {
        var speed = progress / 1000 * state.playerSpeed;
        state.pos.x += Math.cos(state.facing + Math.PI) * speed;
        state.pos.y += Math.sin(state.facing + Math.PI) * speed;
        console.log("x, y: " + state.pos.x + ", " + state.pos.y);
        refresh = true;
    }
    return refresh;
}

var lastRender = 0;
function loop(timestamp) {
    var progress = timestamp - lastRender;

    if (update(progress))
        draw();

    lastRender = timestamp;
    window.requestAnimationFrame(loop);
}
window.requestAnimationFrame(loop);

var keyMap = {
    68: 'strafe_right',
    65: 'strafe_left',
    87: 'up',
    83: 'down',
    37: 'left',
    39: 'right'
}
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

resize_canvas();
window.addEventListener("resize", resize_canvas);
window.addEventListener("orientationchange", resize_canvas);

// DEBUG CODE
// drawWalls(fontClass, state.map, state.pos, state.facing, state.field_of_view);
