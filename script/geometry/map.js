/**
 * Represents a map.
 * A map is a collection of one or more polygons.
 * @param polygonList {Array}
 * @constructor
 */
function Map(polygonList) {
    this.polygonList = polygonList;
}

/**
 * @param a {Polygon | Line}
 * @return {boolean}
 */
Map.prototype.collidesWith = function (a) {
    for (var polygonIndex = 0, polygonCount = this.polygonList.length; polygonIndex < polygonCount; polygonIndex++) {
        if (this.polygonList[polygonIndex].collidesWith(a))
            return true;
    }
    return false;
};

/**
 * @param pos {Point}
 * @param angle {Number}
 */
Map.prototype.nearestWallDistance = function (pos, angle) {
    /** The line that will be used for testing. */
    var raycastLine = pos.toLine(
        pos.x + RAYCASTING_MAX_RAY_DISTANCE * Math.cos(angle),
        pos.y + RAYCASTING_MAX_RAY_DISTANCE * Math.sin(angle)
    );
    
    var min_distance_squared = NaN;
    
    for (var polygonIndex = 0, polygonCount = this.polygonList.length; polygonIndex < polygonCount; polygonIndex++) {
        var curPolygonLines = this.polygonList[polygonIndex].lines;
        for (var lineIndex = 0, lineCount = curPolygonLines.length; lineIndex < lineCount; lineIndex++) {
            if (curPolygonLines[lineIndex].intersects(raycastLine)) {
                var intersectionPoint = curPolygonLines[lineIndex].getIntersectionPoint(raycastLine);
                if (isNaN(min_distance_squared)) {
                    min_distance_squared = pos.squaredDistanceTo(intersectionPoint);
                } else {
                    min_distance_squared = Math.min(min_distance_squared, pos.squaredDistanceTo(intersectionPoint));
                }
            }
        }
    }
    
    return Math.sqrt(min_distance_squared);
};

Map.prototype.getWallsThatCollideWith = function(polygon) {
    var collisionWalls = [];
    for (var polygonIndex = 0, polygonCount = this.polygonList.length; polygonIndex < polygonCount; polygonIndex++) {
        collisionWalls = collisionWalls.concat(this.polygonList[polygonIndex].getLinesThatCollideWithPolygon(polygon));
    }
    return collisionWalls;
};
