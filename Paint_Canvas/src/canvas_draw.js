function CanvasPainter(id_canvas) {
	this.canvas = null;
	this.context = null;
	if (arguments.length > 0) {
	    this.setCanvas(id_canvas);
    }

	this.isNowDrawing = false;
	
	this.delta = { x: 0, y: 0}; // поправки к абсолютным координатам
}

CanvasPainter.prototype.setCanvas = function(id_canvas) {
    this.canvas = document.getElementById(id_canvas);
    this.context = this.canvas.getContext("2d");

    this.canvas.addEventListener("mousedown",  this.startDraw.bind(this));
    this.canvas.addEventListener("mousemove",  this.draw.bind(this));
    this.canvas.addEventListener("mouseup",    this.stopDraw.bind(this));
    window.addEventListener("mouseup",    this.stopDraw.bind(this));
    this.canvas.addEventListener("mouseenter",    this.continueDraw.bind(this));
};

CanvasPainter.prototype.refreshCanvasPosition = function() {
    // координаты поля относительно окна
    const fieldCoords = this.canvas.getBoundingClientRect();

    // координаты левого-верхнего внутреннего угла 
    this.delta.x = fieldCoords.left + this.canvas.clientLeft;
    this.delta.y = fieldCoords.top  + this.canvas.clientTop;
};

CanvasPainter.prototype.startDraw = function(event) {
    this.refreshCanvasPosition(); //положение холста может измениться

    this.context.moveTo(event.clientX - this.delta.x, event.clientY - this.delta.y);
    this.isNowDrawing = true;
};

CanvasPainter.prototype.draw = function(event) {
    if (!this.isNowDrawing) {
        return
    }

    this.refreshCanvasPosition(); //положение холста может измениться

    this.context.lineTo(event.clientX - this.delta.x, event.clientY - this.delta.y);
    this.context.stroke();
};

CanvasPainter.prototype.stopDraw = function() {
    this.isNowDrawing = false;
};

CanvasPainter.prototype.continueDraw = function(event) {
    if (this.isNowDrawing) {
        this.refreshCanvasPosition(); //положение холста может измениться
        this.context.moveTo(event.clientX - this.delta.x, event.clientY - this.delta.y);
    }
};
