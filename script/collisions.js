// Methods and classes related to the task of checking and applying collisions.

/**
 * Collides a speed vector with a wall, returning the new resulting speed vector.
 * 
 * @param speed {Point} A vector with x and y components that represent the speed of the object to collide.
 * @param wall {Line} A four element array to 
 * @return Point
 */
function deflection(speed, wall) {
    var angleWall = wall.getAngle();
    var angleIntersection = wall.angleTo(speed);
    return new Point(
        speed.x * Math.cos(angleIntersection) * Math.cos(angleWall + Math.PI),
        speed.y * Math.sin(angleIntersection + Math.PI/ 2) * Math.sin(angleWall)
    );
}
