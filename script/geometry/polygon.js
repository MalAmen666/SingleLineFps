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
        for (var polygonLineIndex = 0, polygonLineCount = this.lines.length; polygonLineIndex < polygonLineCount; polygonLineIndex++) {
            if (polygon.lines[polygonLineIndex].intersects(this.lines[lineIndex]))
                return true;
        }
    }
    return false;
};
