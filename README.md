# SingleLineFps
A first person view that uses the ascii character '#' to represent distances.

[See it in action.](https://MalAmen666.github.com/SingleLineFps/)
WASD for movement, left and right arrow keys for rotation.

Idea from [Three Hundred Game Mechanics #171 - One Line ASCII FPS](http://www.squidi.net/three/entry.php?id=171)

Files:

Path | Description
---- | -----------
[README.md](README.md) | This file.
[UNLICENSE.txt](UNLICENSE.txt) | The license. As permissive as it gets.
[index.htm](index.htm) | The only html page that loads the javascript libraries and defines the elements used for debugging (like font selection and FPS counter).
[map_preview.png](map_preview.png) | A untidy representation of the map in use, usefull for figuring manually where a set of coordinates is supposed to be located.
[style.css](style.css) | The style used to center the canvas vertically. Other trivial styles embedded directly on the HTML.
[script/onload.js](script/onload.js) | The main script that uses all the other methods and classes to produce the final result. This is where the [game's variables](script/onload.js#L4), [game loop](script/onload.js#L195) and [input processing](script/onload.js#L211) is implemented.
[script/geometry/line.js](script/geometry/line.js) | The class that represents a line.
[script/geometry/map.js](script/geometry/map.js) | The class that represents a map.
[script/geometry/point.js](script/geometry/point.js) | The class that represents a point / vector.
[script/geometry/polygon.js](script/geometry/polygon.js) | The class that represents a polygon.
[script/graphics/fpscounter.js](script/graphics/fpscounter.js) | The class responsible for updating the FPS counter on the top right corner of the HTML page.
[script/graphics/screenport.js](script/graphics/screenport.js) | Methods responsible for drawing the scene.
[script/graphics/font/font.js](script/graphics/font/font.js) | Class that manages the interaction between the canvas and fonts.
[script/graphics/font/fontsizes.js](script/graphics/font/fontsizes.js) | Class responsible for managing the selected font's sizes.

## Components
This project has the following distinct parts:
* [Map](#map)
* [Raycasting](#raycasting)
* [Font managing](#font-managing)
* [Collision detection](#collision-detection)
* [Sliding](#sliding)
* [FPS counter](#fps-counter)

### Map
The map used is represented by a list of polygons, which allowed for easy line collision detection by looping through the polygon's lines.

* [Map class](script/geometry/map.js) (It's essentially a collection of [polygons](script/geometry/polygon.js), which are a collection of [lines](script/geometry/line.js))
* [Map instanced on the game state variable](script/onload.js#L23)
* [Representation of the instanced map](map_preview.png)

### Raycasting
Emitting a ray and check if it collides with something, and if it does know the distance.

The distance is calculated by emmiting a ray, collecting all points of intersection between the ray and the map, and then getting the distance of the closest point of collision.
The distance is then used by the font manager to get the font size for representing that distance. Font color also depends on distance.

* [Map's nearestWallDistance method](script/geometry/map.js#L27)

### Font managing
Used for translating distances into font sizes.

Due to the nature of fonts it's impossible to know beforehand what font size will have the required width, so the class [FontSizes](script/graphics/font/fontsizes.js) calculates the width of the font in use for a range of font sizes, and then the FontSize's method [get_closest](script/graphics/font/fontsizes.js#L37) provides a font size that more closely fits the requested width.

The class [Font](script/graphics/font/font.js) provides methods to apply [font size](script/graphics/font/font.js#L16) and [colour](script/graphics/font/font.js#L24) associated with a distance.
Before being used it requires a call to [FontSize's set_distances](script/graphics/font/fontsizes.js#L42) to establish the expected minimum and maximum distances.

### Collision detection
The implemented types of collisions are the following:
* [Line and line](script/geometry/line.js#L53)
* [Polygon and line](script/geometry/polygon.js#L40)
* [Polygon and polygon](script/geometry/polygon.js#L53)
* [Map and polygon or line](script/geometry/map.js#L15)

### Sliding
This is the efect of sliding against a wall when colliding with it.

Currently contains a bug when colliding with the corners of the column's north wall, on other corners the player can slide out of the wall as expected but on that particular wall there's a collision that shouldn't be happening with the wall that shares that corner. I think it's caused by javascript's floating point precision errors.

* [Implemented inside the game loop's update method](script/onload.js#L164)

### FPS counter
A simple class that tracks the number of times it was called in a second.
It writes its output directly onto the html element reserved for it.

* [FPS counter class](script/graphics/fpscounter.js)
* [Game loop's use of the class](script/onload.js#L101)

