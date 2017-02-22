/** 
 * Because the algorithm for line intersection cannot distinguish between front and back of a line, the line used for
 * raycasting has to be big enough for a collision with a wall to know for sure that the collided wall is in front of
 * the line.
 */
var RAYCASTING_MAX_RAY_DISTANCE = 10;

/**
 * Gets all the lines represented by the map.
 *
 * Assumes that the length of each map item is pair and at least four.
 *
 * @param {Array} map A list of lists containing pairs of x, y.
 * @return {Array} A list of lines.
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
