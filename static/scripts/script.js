var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

_W = canvas.width
_H = canvas.height
var x = _W / 2;
var y = _H - 30;

var ballRadius = 10;
var batHeight = 10;
var batWidth = 80;
var batMidcoord = batWidth / 2;
var batPosition = (_W - batWidth) / 2; // bat position in the middle AT start

var rightPressed = false;
var leftPressed = false;

var brickWidth = 75;
var brickHeight = 20;
var score = 0;

var bricks = [];

var brickRowCount = 9;
var brickColumnCount = 9;
for (c = 0; c < brickColumnCount; c++) {
    bricks[c] = [];
    for (r = 0; r < brickRowCount; r++) {
        bricks[c][r] = {
            x: 0,
            y: 0,
            status: 1 // the brick status {destroyed or not}
        };
    }
}

function drawBall() {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = "#fa113d";
    ctx.fill();
    ctx.closePath();
}

function drawBat() {
    ctx.beginPath();
    ctx.rect(batPosition, _H - batHeight, batWidth, batHeight);
    ctx.fillStyle = "#fa113d";
    ctx.fill();
    ctx.closePath();
}

function drawBricks() {
    for (c = 0; c < brickColumnCount; c++) {
        for (r = 0; r < brickRowCount; r++) {
            if (bricks[c][r].status == 1) {
                var brickX = (c * (brickWidth + 5)) + 30; //brick spacing == 5
                var brickY = (r * (brickHeight + 5)) + 30;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                ctx.fillStyle = "#10aded";
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}

function countDown() {
    var gameCountdown = document.querySelector('#game-countdown');
    setTimeout(function () {
        gameCountdown.innerHTML = "3";
    }, 0100);

    setTimeout(function () {
        gameCountdown.innerHTML = "2";
    }, 1100);

    setTimeout(function () {
        gameCountdown.innerHTML = "1";
    }, 2100);

    setTimeout(function () {
        gameCountdown.innerHTML = "Go";
    }, 3100);

    setTimeout(function () {
        gameCountdown.innerHTML = "";
        draw();
    }, 4100);
}

var vx = 3;
var vy = -3;

function clearLives(myText, canvas, context) {
    // clear
    context.clearRect(0, 0, canvas.width, canvas.height);
    // !!!!!!!! redraw your background !!!!!!!!

        // then redraw your text with new opacity
    myText.fill -= .1;
    drawText(myText, context);

    // request new frame
    if (myText.fill > -.1) {
      setTimeout(function() {
        animate(myText, canvas, context);
      }, 2000 / 60);
    }
  }

function draw() {
    ctx.clearRect(0, 0, _W, _H);
    drawBall();
    drawBat();
    displayScore();
    displayLives();
    drawBricks();
    collisionDetection();

    ctx.arc(x, y, ballRadius, 0, Math.PI * 2);

    if (x + vx > _W - ballRadius || x + vx < 0) {
        vx = -vx;
    }

    if (y + vy < ballRadius) {
        vy = -vy;
    }

    else if (y + vy > _H - ballRadius) {

        if (x < batPosition + batWidth / 4 && (!(x < batPosition - 5) && !(x > (batPosition + batWidth + 5)))) {
            vx = -vy
            vy = -3
        }
        else if (x > batPosition + (batWidth - 20) && (!(x < batPosition - 5) && !(x > (batPosition + batWidth + 5)))) {
            vx = vy
            vy = -3
        }
        else if ((x > batPosition + batWidth / 4 && x < batPosition + (batWidth - 20)) && (!(x < batPosition) && !(x > (batPosition + batWidth)))) {
            vy = -5
        }
        else if ((x < batPosition || x > batPosition + batWidth) && y > 510) {
            lives--;
            if (lives == 2) {
                countDown();
                x = _W / 2;
                y = _H - 30;
                batPosition = (_W - batWidth) / 2;
                return false;
            }

            if (lives == 1) {
                countDown();
                x = _W / 2;
                y = _H - 30;
                batPosition = (_W - batWidth) / 2;
                return false;
            }

            if (lives == 0) {
                ctx.font = "18px Arial";
                ctx.fillStyle = "#f2f6ff";
                ctx.fillText("Lives: 1" + lives, _W - 65, 20);
                displayLives();
                ctx.font = "50px Courier New";
                ctx.fillStyle = "red";
                ctx.fillText("YOU LOST THE GAME", 150, 300);
                context.clearRect(0, 0, _W, _H);

            }
            else {
                x = _W / 2;
                y = _H - 30;
                batPosition = (_W - batWidth) / 2;
            }
        }
    }

    if (rightPressed && batPosition < _W - batWidth) {
        batPosition += 7;
    }
    else if (leftPressed && batPosition > 0) {
        batPosition -= 7;
    }
    x += vx;
    y += vy;

    requestAnimationFrame(draw);
}

function keyDownHandler(e) {
    if (e.keyCode == 39) {
        rightPressed = true;
    }
    else if (e.keyCode == 37) {
        leftPressed = true;
    }
}

function keyUpHandler(e) {
    if (e.keyCode == 39) {
        rightPressed = false;
    }
    else if (e.keyCode == 37) {
        leftPressed = false;
    }
}

function collisionDetection() {
    for (c = 0; c < brickColumnCount; c++) {
        for (r = 0; r < brickRowCount; r++) {
            var b = bricks[c][r];
            console.log(y);
            if (b.status == 1) {
                if (x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight) {
                    if ((x > b.x - 10) && x < b.x + (brickWidth - 10)) {
                        vy = -vy;
                    }
                    else if ((x > b.x && x < (b.x - 10)) || (x < b.x + brickWidth && x > b.x + (brickWidth - 10))) {
                        vy = -vy
                        vy = vy
                    }
                    b.status = 0;
                    score++;
                    if ((score == brickRowCount * brickColumnCount) ) {
                        ctx.font = "50px Courier New";
                        ctx.fillStyle = "green";
                        ctx.fillText("YOU WON THE GAME", 150, 300);
                        context.clearRect(0, 0, _W, _H);
                    }
                }
            }
        }
    }
}

function displayScore() {
    ctx.font = "18px Arial";
    ctx.fillStyle = "#02de25"
    ctx.fillText("Score: " + score, 15, 20);
}

var lives = 3;
function displayLives() {
    ctx.font = "18px Arial";
    ctx.fillStyle = "#02de25";
    ctx.fillText("Lives: " + lives, _W - 65, 20);
}

document.addEventListener('keydown', keyDownHandler, false);
document.addEventListener('keyup', keyUpHandler, false);
