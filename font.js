// Requires fontsizes.js

/** Class that manages font and font related actions. */
function Font(canvas_context, font, min_font_size, max_font_size) {
    this.font = font;
    this.font_sizes = new FontSizes(canvas_context, font, min_font_size, max_font_size);
    this.context = canvas_context;
}

/** Sets the fontsize (in px) of the associated context. */
Font.prototype.setFontSize = function (size) {
    this.context.font = size + "px " + this.font;
};

/** Sets the apropriate fontsize for the given distance and returns the width of the fontsize. */
Font.prototype.setFontSizeForDistance = function (distance) {
    var fontWidthAtDistance = this.font_sizes.get_pixelwidth_for_distance(distance);
    var fontSize = this.font_sizes.get_closest(fontWidthAtDistance);
    this.setFontSize(fontSize);
    return fontWidthAtDistance;
};
