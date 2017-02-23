function Polygon(pointsArray) {
    this.lines = new Array(Math.floor(pointsArray.length / 2));
    var result_i = 0;
    for (var cur_coord_tuple = 0, cur_line_group_size = pointsArray.length; cur_coord_tuple < cur_line_group_size; cur_coord_tuple += 2) {
        if (cur_coord_tuple == cur_line_group_size - 2) {
            // is last line
            this.lines[result_i++] = new Line(
                pointsArray[cur_coord_tuple],
                pointsArray[cur_coord_tuple + 1],
                pointsArray[0],
                pointsArray[1]
            );
        } else {
            this.lines[result_i++] = new Line(
                pointsArray[cur_coord_tuple],
                pointsArray[cur_coord_tuple + 1],
                pointsArray[cur_coord_tuple + 2],
                pointsArray[cur_coord_tuple + 3]
            );
        }
    }
}

/**
 * @param o {Line | Polygon}
 * @return {boolean}
 */
Polygon.prototype.collidesWith = function (o) {
    if (o.constructor === Line) {
        return this.collidesWithLine(o);
    } else if (o.constructor === Polygon) {
        return this.collidesWithPolygon(o);
    }
};

/**
 * @param line {Line}
 * @return {boolean}
 */
Polygon.prototype.collidesWithLine = function (line) {
    for (var lineIndex = 0, lineCount = this.lines.length; lineIndex < lineCount; lineIndex++) {
        if (line.intersects(this.lines[lineIndex]))
            console.log("COLLISION: " + line + " WITH " + this.lines[lineIndex]);
            return true;
    }
    return false;
};

/**
 * @param polygon {Polygon}
 * @return {boolean}
 */
Polygon.prototype.collidesWithPolygon = function (polygon) {
    for (var lineIndex = 0, lineCount = this.lines.length; lineIndex < lineCount; lineIndex++) {
        for (var polygonLineIndex = 0, polygonLineCount = polygon.lines.length; polygonLineIndex < polygonLineCount; polygonLineIndex++) {
            if (polygon.lines[polygonLineIndex].intersects(this.lines[lineIndex]))
                return true;
        }
    }
    return false;
};

Polygon.prototype.getLinesThatCollideWithPolygon = function (polygon) {
    var result = [];
    for (var lineIndex = 0, lineCount = this.lines.length; lineIndex < lineCount; lineIndex++) {
        for (var polygonLineIndex = 0, polygonLineCount = polygon.lines.length; polygonLineIndex < polygonLineCount; polygonLineIndex++) {
            if (polygon.lines[polygonLineIndex].intersects(this.lines[lineIndex])) {
                result.push(this.lines[lineIndex]);
                break; // The wall being verified is already noted, move on to the next wall
            }
        }
    }
    return result;
};

/**
 * @param p1 {Point}
 * @param p2 {Point}
 */
Polygon.makeRectangleFromPoints = function (p1, p2) {
    return Polygon.makeRectangleFromNums(p1.x, p1.y, p2.x, p2.y);
};

Polygon.makeRectangleFromNums = function (x0, y0, x1, y1) {
    return new Polygon([
        x0, y0,
        x1, y0,
        x1, y1,
        x0, y1
    ])
};

Polygon.makeRectangleFromCenterAndWidths = function (center, horizontalWidth, verticalWidth) {
    if (verticalWidth === undefined) verticalWidth = horizontalWidth;
    return Polygon.makeRectangleFromNums(
        center.x - horizontalWidth / 2,
        center.y - verticalWidth / 2,
        center.x + horizontalWidth / 2,
        center.y + verticalWidth / 2
    )
};
