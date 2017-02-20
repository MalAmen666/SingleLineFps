// Methods and variables responsible for producing a working FPS counter
function FpsCounter(updatesPerSecond, domElement) {
    /** The time (in milliseconds) between each update to the visual counter. */
    this.maxTime = 1 / updatesPerSecond * 1000;
    
    /** This value has to be saved in order to scale the fpsCountYet. */
    this.updatesPerSecond = updatesPerSecond;
    
    /** How many milliseconds until next update. */
    this.timeLeft = this.maxTime;
    
    /** How many frames counted yet. */
    this.fpsCountYet = 0;
    
    /** The element that will receive the FPS count as its text content. */
    this.domElement = domElement;
}

/** Tells the counter to count a frame. */
FpsCounter.prototype.count = function (milliseconds) {
    this.timeLeft -= milliseconds;
    if (this.timeLeft < 0) {
        // Update visual counter
        this.domElement.textContent = Math.floor(this.fpsCountYet * this.updatesPerSecond);
        this.timeLeft += this.maxTime;
        this.fpsCountYet = 0;
    } else {
        this.fpsCountYet++;
    }
};
