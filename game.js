

var cvs = document.getElementById("canvas");
cvs.width = document.documentElement.clientWidth;
cvs.height = document.documentElement.clientHeight -100;
var ctx = cvs.getContext("2d");


var windowW = document.documentElement.clientWidth;
var windowH = document.documentElement.clientHeight - 50;

function drawLine(){
    ctx.beginPath();
    ctx.moveTo(0, windowH / 2);
    ctx.lineTo(windowW, windowH / 2);
    ctx.stroke();
}

function drawBlocks(){
    for (var i = 0; i < windowW; i += 25){
        ctx.fillRect(i, windowH / 2, 3,8);
    }
}


// images

function imgProperties(source, x, y, width, height){
    this.source = source;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
}

var bgProp = new imgProperties("img/bg.png", 0,0,
document.documentElement.clientWidth, 
document.documentElement.clientHeight);


var bgProp1 = new imgProperties("img/bg1.jpg", 0,0,
document.documentElement.clientWidth, 
document.documentElement.clientHeight - 100);

var carProp = new imgProperties("img/car.png", 225, 150);


var car = new Image();
var bg = new Image();
var bg1 = new Image();

car.src = carProp.source;
bg.src = bgProp.source;
bg1.src = bgProp1.source;


// Движение марсохода
// curPoint - перемещение марсохода (сумма геометрической прогрессии)
// n - кол-во перемещений
// block - позиция на числовой прямой
var Position = {
    block: 0,
    prevPoint : 0,
    curPoint : 0,
    n : 1,
    direction : 1,
    Move : function() {
        this.prevPoint = this.curPoint;
        this.curPoint = this.direction * ( (1 - Math.pow(2,this.n)) / (1 - 2));
        this.block += (this.curPoint - this.prevPoint);
    },
    Speed : function(){
        return this.direction * Math.pow(2, (this.n - 1));
    }
}


// При нажатии на какую-либо кнопку
//document.addEventListener("keydown", A);
//document.addEventListener("keydown", R);


function A() {


    Position.Move();
    Position.n++;
    var start = Date.now();
        
    var timer = setInterval(function() {

        var timePassed = Date.now() - start;
        
        if (Position.direction > 0) {
            carProp.x += 1;
            if (timePassed > 20 * Position.curPoint) {
                clearInterval(timer);
            }

        }
        if (Position.direction < 0) {
            carProp.x -= 1;
            if (timePassed > 20 * Math.abs(Position.curPoint)) {
                clearInterval(timer);
            }

        }
    });
}

function R(){
    Position.direction *= -1;
    Position.n = 1;
    Position.prevPoint = 0;
    Position.curPoint = 0;
    
}

function LocationLimit(){
    if (carProp.x >= bgProp.width) carProp.x = 0;
    if (carProp.x < -1) carProp.x = bgProp.width;
}


function draw() {
    LocationLimit();
    
    //ctx.drawImage(bg1, bgProp.x, bgProp.y, bgProp.width, bgProp.height);
    ctx.drawImage(bg, bgProp.x, bgProp.y, bgProp.width, bgProp.height);
    ctx.drawImage(car, carProp.x, carProp.y);
    
    drawLine();
    drawBlocks();

    ctx.fillStyle = "#fff";
    ctx.font = "24px Verdana";

    ctx.fillText("Previus point:" + Position.prevPoint, 950, cvs.height - 130);
    ctx.fillText("Current point:" + Position.curPoint, 950, cvs.height - 100);
    ctx.fillText("OY:" + carProp.y, 950, cvs.height - 40);
    ctx.fillText("OX:" + carProp.x, 950, cvs.height - 70);

    ctx.fillText("Speed:" + Position.Speed(), 40, cvs.height - 40);
    ctx.fillText("Block:" + Position.block, 40, cvs.height - 70);
 
    requestAnimationFrame(draw);
}

car.onload = draw;
