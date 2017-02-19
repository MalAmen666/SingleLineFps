// https://www.sitepoint.com/quick-tip-game-loop-in-javascript/

/** Object that stores the game state variables. */
var state = {
	field_of_view: 80,
	pos: {x: 4.5, y: 1},
	facing: Math.PI * 0 / 2,
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
	]/*,
	map2: [
		[0, 0, 0, 0, 0, 0],
		[0, 1, 1, 0, 1, 0],
		[0, 0, 1, 1, 1, 0],
		[0, 1, 1, 1, 0, 0],
		[0, 0, 0, 0, 0, 0]
	]*/
};

/** The main canvas where the game is drawn on. */
var canvas = document.getElementById('canvas');

/** The main canvas context to use for 2d graphics. */
var ctx = canvas.getContext('2d');

function draw() {
	ctx.fillStyle = "red";
	ctx.fillRect(10, 10, 30, 30);
	ctx.fillRect(ctx.canvas.clientWidth - 40, ctx.canvas.clientHeight - 40, 30, 30);
}

function resize_canvas(){
    canvas.width  = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
	console.log("Window resized to " + window.innerWidth + "x" + window.innerHeight);
	draw();
}

var font = "Arial";
var fontsizes = new FontSizes(ctx, font);
canvas.style.height = (fontsizes.line_height * 2) + "px";

resize_canvas();
window.addEventListener("resize", resize_canvas);
window.addEventListener("orientationchange", resize_canvas);


// DEBUG CODE
ctx.textBaseline="middle";
var fontsize = fontsizes.get_fontsize_for_distance(nearest_wall_distance(state.map, state.pos, state.facing));
ctx.font = fontsize + "px " + font;

ctx.fillText("#", 0, canvas.height / 2);
