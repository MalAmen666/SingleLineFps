/** 
 * Because the algorithm for line intersection cannot distinguish between front and back of a line, the line used for
 * raycasting has to be big enough for a collision with a wall to know for sure that the collided wall is in front of
 * the line.
 */
var RAYCASTING_MAX_RAY_DISTANCE = 10;

// http://jsfiddle.net/justin_c_rounds/Gd2S2/light/
function checkLineIntersection(line1StartX, line1StartY, line1EndX, line1EndY, line2StartX, line2StartY, line2EndX, line2EndY) {
    // if the lines intersect, the result contains the x and y of the intersection (treating the lines as infinite) and
    // booleans for whether line segment 1 or line segment 2 contain the point
    var denominator, a, b, numerator1, numerator2, result = {
        x: null,
        y: null,
        onLine1: false,
        onLine2: false
    };
    denominator = ((line2EndY - line2StartY) * (line1EndX - line1StartX)) - ((line2EndX - line2StartX) * (line1EndY - line1StartY));
    if (denominator == 0) {
        return result;
    }
    a = line1StartY - line2StartY;
    b = line1StartX - line2StartX;
    numerator1 = ((line2EndX - line2StartX) * a) - ((line2EndY - line2StartY) * b);
    numerator2 = ((line1EndX - line1StartX) * a) - ((line1EndY - line1StartY) * b);
    a = numerator1 / denominator;
    b = numerator2 / denominator;
    
    // if we cast these lines infinitely in both directions, they intersect here:
    result.x = line1StartX + (a * (line1EndX - line1StartX));
    result.y = line1StartY + (a * (line1EndY - line1StartY));
    /*
        // it is worth noting that this should be the same as:
        x = line2StartX + (b * (line2EndX - line2StartX));
        y = line2StartX + (b * (line2EndY - line2StartY));
    */
    
    // if line1 is a segment and line2 is infinite, they intersect if:
    if (a > 0 && a < 1) {
        result.onLine1 = true;
    }
    // if line2 is a segment and line1 is infinite, they intersect if:
    if (b > 0 && b < 1) {
        result.onLine2 = true;
    }
    // if line1 and line2 are segments, they intersect if both of the above are true
    return result;
}

/**
 * Gets all the lines represented by the map.
 *
 * Assumes that the length of each map item is pair and at least four.
 *
 * @param {Array} map A list of lists containing pairs of x, y.
 * @return {Array} A list of lines in the format [x0, y0, x1, y1].
 */
function get_map_lines(map) {
    
    /** How many items to be returned by this method. */
    var result_size = 0;
    
    /** Loop guard that specifies which group inside map is currently being taken into consideration. */
    var cur_map_line_group;
    
    for (cur_map_line_group = 0, map_line_groups = map.length; cur_map_line_group < map_line_groups; cur_map_line_group++) {
        result_size = result_size + map[cur_map_line_group].length;
    }
    
    // Create an array to fit all lines
    
    /** The array that will be returned by this method. */
    var result = new Array(Math.floor(result_size / 2));
    
    /** The result array index of where to store the next array of coordinates. */
    var result_i = 0;
    var map_line_groups;
    for (cur_map_line_group = 0, map_line_groups = map.length; cur_map_line_group < map_line_groups; cur_map_line_group++) {
        for (var cur_coord_tuple = 0, cur_line_group_size = map[cur_map_line_group].length; cur_coord_tuple < cur_line_group_size; cur_coord_tuple += 2) {
            if (cur_coord_tuple == cur_line_group_size - 2) {
                // is last line
                result[result_i++] = [
                    map[cur_map_line_group][cur_coord_tuple],
                    map[cur_map_line_group][cur_coord_tuple + 1],
                    map[cur_map_line_group][0],
                    map[cur_map_line_group][1]
                ];
            } else {
                result[result_i++] = [
                    map[cur_map_line_group][cur_coord_tuple],
                    map[cur_map_line_group][cur_coord_tuple + 1],
                    map[cur_map_line_group][cur_coord_tuple + 2],
                    map[cur_map_line_group][cur_coord_tuple + 3]
                ];
            }
        }
    }
    
    return result;
}

/**
 * 
 * @param coord The initial coordinate position.
 * @param angle In radians, starting from directly right.
 */
function coord_angle_to_line(coord, angle) {
    return [
        coord.x,
        coord.y,
        coord.x + RAYCASTING_MAX_RAY_DISTANCE * Math.cos(angle),
        coord.y + RAYCASTING_MAX_RAY_DISTANCE * Math.sin(angle)
    ];
}

/** Euclidean distance squared. */
function point_distance_squared(point1, point2) {
    return Math.pow(point1.x - point2.x, 2) + Math.pow(point1.y - point2.y, 2);
}

/**
 * Gets the shortest distance from a point to a wall in a certain direction.
 * 
 * @param map {Array} The map to check.
 * @param pos {object} The position to start the check from.
 * @param angle {Number} The angle to check the nearest wall. Starts from the right, counter clockwise.
 * @return {Number} The distance to the nearest wall, or NaN if none found.
 */
function nearest_wall_distance(map, pos, angle) {
    /** The line that will be used for testing. */
    var raycast_line = coord_angle_to_line(pos, angle);
    
    /** List of all lines that compose the map. */
    var map_wall_lines = get_map_lines(map);
    
    /** The minimum distace found yet. NaN if none found. */
    var min_distance_squared = NaN;
    
    for (var cur_wall_line = 0, wall_line_count = map_wall_lines.length;
         cur_wall_line < wall_line_count;
         cur_wall_line++) {
        var line_intersection = checkLineIntersection(
            raycast_line[0],
            raycast_line[1],
            raycast_line[2],
            raycast_line[3],
            map_wall_lines[cur_wall_line][0],
            map_wall_lines[cur_wall_line][1],
            map_wall_lines[cur_wall_line][2],
            map_wall_lines[cur_wall_line][3]
        );
        if (line_intersection.onLine1 && line_intersection.onLine2) {
            if (isNaN(min_distance_squared)) {
                min_distance_squared = point_distance_squared(pos, line_intersection);
            } else {
                min_distance_squared = Math.min(min_distance_squared, point_distance_squared(pos, line_intersection));
            }
        } // Else wall doesn't intersect raycast line.
    }
    
    // Returning the squared value will give the player walls that grow very quickly
    return Math.sqrt(min_distance_squared);
}

