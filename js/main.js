var canvas = document.getElementById("mainCanvas");
var ctx = canvas.getContext("2d");
var ballRadius = 10;
var x = canvas.width / 2;
var y = canvas.height - 30;
var dx = 2;
var dy = -2;
var curXVel = dx;
var curYVel = dy;
var paddleHeight = 10;
var paddleWidth = 150;
var paddleX = (canvas.width - paddleWidth) / 2;
var rightPressed = false;
var leftPressed = false;
var brickRowCount = 9;
var brickColumnCount = 2;
var brickWidth = 75;
var brickHeight = 20;
var brickPadding = 10;
var brickOffsetTop = 30;
var brickOffsetLeft = 30;
var bricksLeft = 0;
var score = 0;
var lives = 3;
var isPaused = false;
var isPlaying = false;
var isGameOver = false;
var isRoundOver = false;
var bricks = [];
var curRound = 1;
var paddleRoundCount = 5;
var ballDmg = 100;
var curBrickHealth = 100;
var brickColorIndex = 1;
var bgAudio = new Audio('/audio/bg-music-1.mp3')
const myDate = new Date().getFullYear();
const color = ["white", "red", "orange", "yellow", "green", "purple", "blue"]

createBricks()
playMusic(true)
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("mousemove", mouseMoveHandler, false);

function keyDownHandler(e) {
    if (e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = true;
    } else if (e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = true;
    } else if (e.key == "p") {
        if (!isPaused) {
            isPaused = true
        } else {
            isPaused = false

        }

    }else if (e.key == "q") {
        if (isPaused) {
            window.location.reload()
        } 

    }  else if (e.key == "s") {
        if (!isPlaying && !isGameOver) {
            isPlaying = true;
            playMusic()
            
        }
        if (isGameOver) {
            window.location.reload()
        }
        if (isRoundOver) {
            playMusic()
            nextRound()
        }

    }
}

function keyUpHandler(e) {
    if (e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = false;
    } else if (e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = false;
    }
}

function mouseMoveHandler(e) {
    var relativeX = e.clientX - canvas.offsetLeft;
    if (relativeX > 0 && relativeX < canvas.width) {
        paddleX = relativeX - paddleWidth / 2;
    }
}

function createBricks() {
    for (var c = 0; c < brickColumnCount; c++) {
        bricks[c] = [];
        for (var r = 0; r < brickRowCount; r++) {
            bricks[c][r] = {
                x: 0,
                y: 0,
                status: 1,
                color: color[1],
                health:curBrickHealth
            };
        }
    }
    bricksLeft = brickRowCount * brickColumnCount;
}

function collisionDetection() {
    for (var c = 0; c < brickColumnCount; c++) {
        for (var r = 0; r < brickRowCount; r++) {
            var b = bricks[c][r];
            if (b.status == 1) {
                if (x > b.x && x < b.x + brickWidth && y + ballRadius > b.y && y - ballRadius < b.y + brickHeight ) {
                    dy = -dy;
                    playHitSound()
                    b.health -= ballDmg;
                    if(b.health==0){
                        b.status = 0;
                        bricksLeft --;
                    }else{
                       switch(b.health){
                        case 100: 
                            b.color=color[2]
                            break;
                        case 200:
                            b.color=color[3]
                            break;
                        case 300:
                            b.color=color[4]
                            break;
                        default:
                            break;
                       }
                    }
                    score++;
                    
                    if (bricksLeft == 0) {
                        isRoundOver = true

                    }
                }
            }
        }
    }
}

function nextRound() {
    /*extend amount of bricks
      recreate Bricks
      increase ball speed
      reset ball position
      reset variables   
      change paddle size 
    */
    if(brickColumnCount<=7){
        brickColumnCount += 1
    }
    
    curBrickHealth += 100;
    createBricks()
    curXVel += 1;
    curYVel -= 1;
    resetBall()
    isPlaying = true
    isRoundOver = false
    curRound++
    
    if (curRound == paddleRoundCount) {
        if (paddleWidth > 50) {
            paddleWidth -= 25;
        }
        paddleRoundCount += 5;
    }

}

function resetBall() {
    x = canvas.width / 2;
    y = canvas.height - 30;
    dx = curXVel;
    dy = curYVel;
}

function drawBall() {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = color[0];
    ctx.fill();
    ctx.closePath();
}

function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = color[6];
    ctx.fill();
    ctx.closePath();
}

function drawBricks() {
    for (var c = 0; c < brickColumnCount; c++) {
        for (var r = 0; r < brickRowCount; r++) {
            if (bricks[c][r].status == 1) {
                var brickX = (r * (brickWidth + brickPadding)) + brickOffsetLeft;
                var brickY = (c * (brickHeight + brickPadding)) + brickOffsetTop;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                ctx.fillStyle = bricks[c][r].color;
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}

function drawScore() {
    ctx.font = "16px Arial";
    ctx.fillStyle = color[0];
    ctx.fillText("Score: " + score, 8, 20);
}

function drawLives() {
    ctx.font = "16px Arial";
    ctx.fillStyle = color[0];
    ctx.fillText("Lives: " + lives, canvas.width - 65, 20);
}

function drawRound() {
    let round = "Round: "+curRound
    ctx.font = "16px Arial";
    ctx.fillStyle = color[0];
    ctx.fillText(round,canvas.width - 400 - (round.length * 8) / 2, 20);
}

function drawGameText(text) {
     
    ctx.font = "32px Arial";
    ctx.fillStyle = color[0];
    ctx.fillText(text, canvas.width - 400 - (text.length * 16) / 2, canvas.height / 2);
}
function drawTitleText(){
    let text =  "Worzels Block Breakout"
    ctx.font = "32px Arial";
    ctx.fillStyle = color[0];
    ctx.fillText(text, canvas.width - 400 - (text.length * 16) / 2, 100);
}
function drawPauseText(){
    let text =  "Press Q To Quit"
    ctx.font = "32px Arial";
    ctx.fillStyle = color[0];
    ctx.fillText(text, canvas.width - 400 - (text.length * 16) / 2, 300);
}
function copyText() {
    
    let text = "nldevelepments.co.uk "+myDate
    ctx.font = "16px Arial";
    ctx.fillStyle = color[0];
    ctx.fillText(text,canvas.width - 400 - (text.length * 8) / 2, 400);
}
function playHitSound(){
    var audio = new Audio('/audio/ball-hit.wav');
    audio.play();
}
function playMusic(){
   
        
        
        bgAudio.loop=true
        if(!isPlaying&&!isRoundOver&&!isPaused){
            bgAudio.play()
        }else{
            bgAudio.pause()
        }
        
    
    
}
function gameIsOver() {
    isGameOver = true
    isPlaying = false

}

function mainLoop() {
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawScore();
    drawLives();
    drawRound();
    if (!isPlaying && !isGameOver) {
        drawTitleText()
        drawGameText("Press S To Start")
        copyText()
    }
    if (isGameOver) {
        drawGameText("Game Is Over S To Retry")
    }
    if (isPaused) {
        drawGameText("Press P To Continue")
        drawPauseText()
    }
    if (isRoundOver) {
        drawGameText("Well Done Round Complete S To Continue")
         
    }
    if (!isPaused && isPlaying && !isRoundOver) {
        
        drawBricks();
        drawBall();
        drawPaddle();
        collisionDetection();
        if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
            //ball direction change on x
            dx = -dx;
        }
        if (y + dy < ballRadius) {
            //ball direction change on x
            dy = -dy;
        } else if (y + dy > canvas.height - ballRadius) {
            if (x > paddleX && x < paddleX + paddleWidth) {
                playHitSound()
                dy = -dy;
            } else {
                lives--;
                if (!lives) {
                    gameIsOver()
                } else {
                    resetBall()
                    paddleX = (canvas.width - paddleWidth) / 2;
                }
            }
        }
        //paddle movement 
        if (rightPressed && paddleX < canvas.width - paddleWidth) {
            paddleX += 7;
        } else if (leftPressed && paddleX > 0) {
            paddleX -= 7;
        }

        x += dx;
        y += dy;

    }
    requestAnimationFrame(mainLoop);
}


mainLoop();