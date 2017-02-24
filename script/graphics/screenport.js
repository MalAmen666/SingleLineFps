/** Translate pixels to angle. */
function pixelsToAngle(pixels, viewport_width, fov) {
    return -1 * fov / 2 + pixels * (fov / 2 - (-1 * fov / 2)) / (viewport_width);
}

/**
 * @param font {Font}
 * @param map {Map}
 * @param pos {Point}
 * @param angle {Number}
 * @param fov {Number}
 */
function drawWalls(font, map, pos, angle, fov) {
    var spacing = 5;
    
    var width = ctx.canvas.width;
    var height = ctx.canvas.height;
    font.context.textBaseline="middle";
    
    // Draw center wall
    var distance = map.nearestWallDistance(pos, angle);
    var initialCharWidth = font.setFontSizeForDistance(distance);
    font.setFontColorForDistance(distance);
    font.context.fillText("#", width / 2 - initialCharWidth / 2, height / 2);
    var deltaAngle, charWidth;
    
    // Draw to the right
    var rightPosition = width / 2 + initialCharWidth / 2 + spacing;
    while (rightPosition < width) {
        deltaAngle = pixelsToAngle(rightPosition, width, fov);
        distance = map.nearestWallDistance(pos, angle + deltaAngle);
        charWidth = font.setFontSizeForDistance(distance);
        font.setFontColorForDistance(distance);
        font.context.fillText("#", rightPosition, height / 2);
        rightPosition += charWidth + spacing;
    }
    
    // Draw to the left
    var leftPosition = width / 2 - initialCharWidth / 2;
    while (leftPosition >= 0) {
        deltaAngle = pixelsToAngle(leftPosition, width, fov);
        distance = map.nearestWallDistance(pos, angle + deltaAngle);
        charWidth = font.setFontSizeForDistance(distance);
        font.setFontColorForDistance(distance);
        font.context.fillText("#", leftPosition - charWidth - spacing, height / 2);
        leftPosition -= charWidth + spacing;
    }
}
