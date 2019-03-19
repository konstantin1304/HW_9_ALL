const CLOCK_COLOR = "black";

const BORDER_WITH = 2; //ширина обода циферблата (px)
const HOUR_DASH_WITH = 5; //ширина часового штриха (px)
const HOUR_DASH_LENGTH = 12; //длина часового штриха(px)
const MINUTE_DASH_WITH = 3; //ширина минутного штриха (px)
const MINUTE_DASH_LENGTH = 3; //длина минутного штриха(px)

const HOUR_ARROW_PER_RADIUS = 50; //длина часовой стрелки (% от радиуса циферблата)
const HOUR_ARROW_WITH = 5;  //толщина часовой стрелки (px)
const HOUR_ARROW_COLOR = CLOCK_COLOR; //

const MINUTE_ARROW_PER_RADIUS = 70; //длина минутной стрелки (% от радиуса циферблата)
const MINUTE_ARROW_WITH = 3; //толщина минутной стрелки (px)
const MINUTE_ARROW_COLOR = CLOCK_COLOR; //

const SECOND_ARROW_PER_RADIUS = 80; //длина секундной стрелки (% от радиуса циферблата)
const SECOND_ARROW_WITH = 1; //толщина секундной стрелки (px)
const SECOND_ARROW_COLOR = "red"; //

function ClockOnCanvas(id_canvas) {
    this.center = {x: 0, y: 0};
    this.radius = 0;

    this.sin = [];
    this.cos = [];
    for (let i = 0; i < 360; ++i) {
        this.sin[i] = Math.sin(i * 2 * Math.PI / 360.0);
        this.cos[i] = Math.cos(i * 2 * Math.PI / 360.0);
    }

    this.canvas = null;
    this.context = null;

    this.interval = null;

    if (arguments.length > 0) {
        this.setCanvas(id_canvas);
    }
}

ClockOnCanvas.prototype.start = function () {
    if (this.canvas) {
        this.interval = setInterval(this.drawClock.bind(this), 1000);
    } else {
        this.interval = null;
    }

    return this.interval;
};

ClockOnCanvas.prototype.setCanvas = function (id_canvas) {
    this.canvas = document.getElementById(id_canvas);
    this.context = this.canvas.getContext("2d");

    this.drawClock();

    this.start();
};

ClockOnCanvas.prototype.refreshCanvasSize = function () {
    const fieldCoords = this.canvas.getBoundingClientRect();

    this.center.x = (fieldCoords.width - 1) / 2;
    this.center.y = (fieldCoords.height - 1) / 2;

    if (fieldCoords.width < fieldCoords.height) {
        this.radius = (fieldCoords.width - BORDER_WITH - 1) / 2;
    } else {
        this.radius = (fieldCoords.height - BORDER_WITH - 1) / 2;
    }
};

ClockOnCanvas.prototype.drawArrow = function (arAngle, arWith, arPerRadius, arColor) {
    this.context.beginPath();
    this.context.lineWidth = arWith;
    this.context.strokeStyle = arColor;
    this.context.moveTo(this.center.x, this.center.y);
    this.context.lineTo(this.center.x + this.radius * arPerRadius / 100 * this.cos[arAngle],
        this.center.y + this.radius * arPerRadius / 100 * this.sin[arAngle]);
    this.context.stroke();
};

ClockOnCanvas.prototype.drawClockFace = function () {
    this.context.beginPath();
    this.context.lineWidth = BORDER_WITH;
    this.context.strokeStyle = CLOCK_COLOR;
    this.context.arc(this.center.x, this.center.y, this.radius, 0, 2 * Math.PI, true);
    this.context.stroke();
};

ClockOnCanvas.prototype.drawDash = function (dashCount, dashWith, dashLength) {
    this.context.beginPath();
    this.context.lineWidth = dashWith;
    this.context.strokeStyle = CLOCK_COLOR;
    const step = (360 / dashCount);
    for (let i = 0; i < 360; i += step) {
        this.context.moveTo(this.center.x + this.radius * this.cos[i],
            this.center.y + this.radius * this.sin[i]);
        this.context.lineTo(this.center.x + (this.radius - dashLength) * this.cos[i],
            this.center.y + (this.radius - dashLength) * this.sin[i]);
    }
    this.context.stroke();
};

ClockOnCanvas.prototype.drawClock = function () {
    this.refreshCanvasSize();
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

    //циферблат
    this.drawClockFace();

    //насечки для минут
    this.drawDash(60, MINUTE_DASH_WITH, MINUTE_DASH_LENGTH);

    //насечки для часов
    this.drawDash(12, HOUR_DASH_WITH, HOUR_DASH_LENGTH);

    const now = new Date();

    //часовая стрелка
    const angHour = (now.getHours() % 12 * 30 + 270) % 360;
    this.drawArrow(angHour, HOUR_ARROW_WITH, HOUR_ARROW_PER_RADIUS, HOUR_ARROW_COLOR);

    //минутная стрелка
    const angMin = (now.getMinutes() * 6 + 270) % 360;
    this.drawArrow(angMin, MINUTE_ARROW_WITH, MINUTE_ARROW_PER_RADIUS, MINUTE_ARROW_COLOR);

    //секундная стрелка
    const angSec = (now.getSeconds() * 6 + 270) % 360;
    this.drawArrow(angSec, SECOND_ARROW_WITH, SECOND_ARROW_PER_RADIUS, SECOND_ARROW_COLOR);
};
