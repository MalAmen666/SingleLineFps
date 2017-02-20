/** Class that tracks font size and provides a way to transform distances to a font size. */
function FontSizes(canvas_context, font, min_font_size, max_font_size) {
    if (typeof(min_font_size)==='undefined') min_font_size = 4;
    if (typeof(max_font_size)==='undefined') max_font_size = 300;

    // The minimum and maximum pixel sizes, for use in distance-fontsize translations.
    this.min_pixel_width = undefined;
    this.max_pixel_width = undefined;

    /** Associates a pixel size with the biggest font pt that corresponds to that pixel size. */
    this.font_size_association = {};

    for (var font_size = min_font_size; font_size <= max_font_size; font_size++) {
        canvas_context.font = font_size + "px " + font;
        var font_width = canvas_context.measureText("#").width;
        this.font_size_association[Math.floor(font_width)] = font_size;

        if (this.min_pixel_width == undefined) {
            this.min_pixel_width = font_width;
            this.max_pixel_width = font_width;
        } else {
            this.min_pixel_width = Math.min(this.min_pixel_width, font_width);
            this.max_pixel_width = Math.max(this.max_pixel_width, font_width);
        }
    }

    // Since there's no way to get text height the next best thing is to assume it is the same as the width of 'M'.
    //noinspection JSSuspiciousNameCombination
    this.line_height = canvas_context.measureText("M").width;

    this.set_distances();
}

/**
 * Tries to get the font px that more closely reaches the given pixels.
 */
FontSizes.prototype.get_closest = function (pixel_size) {
    return this.font_size_association[Math.floor(pixel_size)];
};

/** Defines the maximum and minimum distances for the get_pixelwidth_for_distance method to use. */
FontSizes.prototype.set_distances = function (min_distance, max_distance) {
    if (typeof(min_distance)==='undefined')
        this.min_distance = 0.5;
    else
        this.min_distance = min_distance;

    if (typeof(max_distance)==='undefined')
        this.max_distance = 5;
    else
        this.max_distance = max_distance;
};

/** Given a distance will return the pixelwidth associated with that distance. */
FontSizes.prototype.get_pixelwidth_for_distance = function (distance) {
    if (distance <= this.min_distance)
        return this.max_pixel_width;
    if (distance >= this.max_distance)
        return this.min_pixel_width;
    var choice = this.max_pixel_width + (distance - this.min_distance) * (this.min_pixel_width - this.max_pixel_width) / (this.max_distance - this.min_distance);
    var weightedChoice = (choice - this.min_pixel_width) / (this.max_pixel_width - this.min_pixel_width);
    weightedChoice *= weightedChoice;
    weightedChoice = (weightedChoice * (this.max_pixel_width - this.min_pixel_width) + this.min_pixel_width);
    return Math.round(weightedChoice);
};

/** Translates distance to fontsize. 
FontSizes.prototype.get_fontsize_for_distance = function (distance) {
    return this.get_closest(this.get_pixelwidth_for_distance(distance));
};
*/
