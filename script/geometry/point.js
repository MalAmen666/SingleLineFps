function isNumber(a) {
    return a !== undefined && a.constructor === Number;
}

function isPoint(a) {
    return a !== undefined && a.constructor === Point;
}

/** A single simple point. Can also be used as vector. */
function Point(x, y) {
    if (isNumber(x) && y === undefined) {
        //noinspection JSSuspiciousNameCombination
        this.x = this.y = x;
    } else {
        if (x === undefined)
            this.x = 0;
        else
            this.x = x;

        if (y === undefined)
            this.y = 0;
        else
            this.y = y;
    }
}

Point.prototype.getAngle = function () {
    return Math.atan2(this.y, -this.x);
};

Point.prototype.toLine = function (a, b) {
    if (undefined === a === b)
        return new Line(0, 0, this);
    else if (isPoint(a) && undefined === b)
        return new Line(this, a);
    else if (isNumber(a) && isNumber(b))
        return new Line(this, a, b);
};

/**
 * Gives the euclidean distance from this point to another.
 * @param otherPoint {Point}
 */
Point.prototype.distanceTo = function (otherPoint) {
    return Math.sqrt(this.squaredDistanceTo(otherPoint));
};

Point.prototype.squaredDistanceTo = function (otherPoint) {
    return Math.pow(this.x - otherPoint.x, 2) + Math.pow(this.y - otherPoint.y, 2);
};

Point.prototype.newAdd = function (otherPoint) {
    return new Point(this.x + otherPoint.x, this.y + otherPoint.y);
};

Point.prototype.toString = function () {
    return "Point(" + this.x + ", " + this.y + ")";
};

Point.prototype.dotProduct = function (otherPoint) {
    return this.x * otherPoint.x + this.y * otherPoint.y;
};

Point.prototype.lengthSquared = function () {
    return Math.pow(this.x, 2) + Math.pow(this.y, 2);
};

Point.prototype.length = function () {
    return Math.sqrt(this.lengthSquared());
};

Point.prototype.projectOnto = function (projectee) {
    return projectee.newMult(this.dotProduct(projectee) / projectee.lengthSquared());
};

Point.prototype.newMult = function (scalar) {
    return new Point(this.x * scalar, this.y * scalar);
};

Point.prototype.round = function (numberDigits) {
    if (numberDigits === undefined) numberDigits = 3;
    var factor = Math.pow(10, numberDigits);
    this.x = Math.round(this.x * factor) / factor;
    this.y = Math.round(this.y * factor) / factor;
    return this;
};
