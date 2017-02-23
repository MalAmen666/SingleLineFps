/**
 * Constructor. Can take four numbers, two points, two numbers and a point, a point and two number.
 */
function Line(a, b, c, d) {
    if (isPoint(a)) {
        this.x0 = a.x;
        this.y0 = a.y;
        if (isPoint(b)) {
            this.x1 = b.x;
            this.y1 = b.y;
        } else if (isNumber(b) && isNumber(c)) {
            this.x1 = b;
            this.y1 = c;
        } else {
            this.x1 = 0;
            this.y1 = 0;
        }
    } else if (isNumber(a) && isNumber(b)) {
        this.x0 = a;
        this.y0 = b;
        if (isNumber(c) && isNumber(d)) {
            this.x1 = c;
            this.y1 = d;
        } else if (isPoint(c)) {
            this.x1 = c.x;
            this.y1 = c.y;
        }
    } else {
        this.x0 = this.y0 = this.x1 = this.y1 = 0;
    }
}

Line.prototype.getAngle = function () {
    return Math.atan2(this.y1 - this.y0, this.x0 - this.x1);
};

/**
 * Gets the angle between this line and the given line / point.
 *
 * new Line(0, 0, 1, 0).angleTo(new Line(0, 0, 0, 1)) * 180 / Math.PI;
 * => 90
 * new Line(0, 0, 1, 0).angleTo(new Line(0, 0, -1, 0)) * 180 / Math.PI;
 * => 180
 *
 * @param otherLine {Line | Point} The line that is used to mark the angle.
 * @return {number} Angle between this line and the other.
 */
Line.prototype.angleTo = function (otherLine) {
    return this.getAngle() - otherLine.getAngle();
};

// http://jsfiddle.net/justin_c_rounds/Gd2S2/light/
Line.prototype.getIntersectionPoint = function (otherLine) {
    // if the lines intersect, the result contains the x and y of the intersection (treating the lines as infinite) and
    // booleans for whether line segment 1 or line segment 2 contain the point
    var denominator, a, b, numerator1, numerator2;
    denominator = ((otherLine.y1 - otherLine.y0) * (this.x1 - this.x0)) - ((otherLine.x1 - otherLine.x0) * (this.y1 - this.y0));
    if (denominator == 0) {
        return undefined;
    }
    a = this.y0 - otherLine.y0;
    b = this.x0 - otherLine.x0;
    numerator1 = ((otherLine.x1 - otherLine.x0) * a) - ((otherLine.y1 - otherLine.y0) * b);
    numerator2 = ((this.x1 - this.x0) * a) - ((this.y1 - this.y0) * b);
    a = numerator1 / denominator;

    // if line1 and line2 are segments, they intersect if both of the above are true
    return new Point(
        this.x0 + (a * (this.x1 - this.x0)),
        this.y0 + (a * (this.y1 - this.y0)));
};

// http://jsfiddle.net/justin_c_rounds/Gd2S2/light/
Line.prototype.intersects = function (otherLine) {
    // if the lines intersect, the result contains the x and y of the intersection (treating the lines as infinite) and
    // booleans for whether line segment 1 or line segment 2 contain the point
    var denominator, a, b, numerator1, numerator2;
    denominator = ((otherLine.y1 - otherLine.y0) * (this.x1 - this.x0)) - ((otherLine.x1 - otherLine.x0) * (this.y1 - this.y0));
    if (denominator == 0) {
        return undefined;
    }
    a = this.y0 - otherLine.y0;
    b = this.x0 - otherLine.x0;
    numerator1 = ((otherLine.x1 - otherLine.x0) * a) - ((otherLine.y1 - otherLine.y0) * b);
    numerator2 = ((this.x1 - this.x0) * a) - ((this.y1 - this.y0) * b);
    a = numerator1 / denominator;
    b = numerator2 / denominator;

    return (a > 0 && a < 1) && (b > 0 && b < 1);
};

Line.prototype.toString = function () {
    return "Line(" + this.x0 + ", " + this.y0 + ", " + this.x1 + ", " + this.y1 + ")";
};

Line.prototype.toPoint = function () {
    return new Point(this.x1 - this.x0, this.y1 - this.y0);
};

Line.prototype.equals = function (other) {
    return this.x0 == other.x0 && this.y0 == other.y0 && this.x1 == other.x1 && this.y1 == other.y1;
};

