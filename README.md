# SingleLineFps
A first person view that uses the ascii character '#' to represent distances.

[See it in action.](https://MalAmen666.github.com/SingleLineFps/)
WASD for movement, left and right arrow keys for rotation.

Idea from [Three Hundred Game Mechanics #171 - One Line ASCII FPS](http://www.squidi.net/three/entry.php?id=171)

## Components
This project has the following distinct parts:
* [Map](#Map)
* [Raycasting](#Raycasting)
* [Font managing](#Font-managing)
* [Collision detection](#Collision-detection)
* [Sliding](#Sliding)
* [FPS counter](#FPS-counter)

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

