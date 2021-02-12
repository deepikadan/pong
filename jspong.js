const canvas = {
    element: document.getElementById('game'),
    context: null,
    height: window.innerHeight - 100,
    width: window.innerWidth - 100,
};

const config = {
    gridSize: 15,
    paddleSpeed: 6,
    ballSpeed: 5,
};
config.paddleHeight = config.gridSize * 5; // 80
config.maxPaddleY = canvas.height - config.gridSize - config.paddleHeight;
config.minPaddleY = config.gridSize;

const objects = {
    leftPaddle: {
        x: config.gridSize * 2,
        y: canvas.height / 2 - config.paddleHeight / 2,
        width: config.gridSize,
        height: config.paddleHeight,
        dy: config.paddleSpeed,
    },
    rightPaddle: {
        x: canvas.width - config.gridSize * 3,
        y: canvas.height / 2 - config.paddleHeight / 2,
        width: config.gridSize,
        height: config.paddleHeight,
        dy: config.paddleSpeed,
    },
    ball: {
        x: canvas.width / 2,
        y: canvas.height / 2,
        width: config.gridSize,
        height: config.gridSize,
        resetting: false,
        dx: config.ballSpeed,
        dy: -1 * config.ballSpeed,
    },
};
var upPressed = false;
var downPressed = false;
var wPressed = false;
var sPressed = false;
const game = {
    config: config,
    canvas: canvas,
    objects: objects,
    collision: (ball, paddle) => {
        var pTop = paddle.y
        var pBottom = paddle.y + paddle.height
        var pLeft = paddle.x
        var pRight = paddle.x + paddle.width

        var bTop = ball.y - ball.width
        var bBottom = ball.y + ball.width
        var bLeft = ball.x - ball.width
        var bRight = ball.x + ball.width
        return bRight > pLeft && bTop < pBottom && bLeft < pRight && bBottom > pTop
    },
    keyEvents: (_) => {
        // TODO: key listener events
        document.addEventListener('keydown', keyDownHandler, false);
        document.addEventListener('keyup', keyUpHandler, false);
    },
    loop: (_) => {
        
        // clear canvas
        canvas.context = canvas.element.getContext("2d")
        canvas.context.fillStyle = 'black'
        draw();
        // TODO: implement game loop
        // reset ball if it goes past paddle (give player time to recover)
        // add a scoreboard
        // add sound everytime ball hits paddle or a wall? or they score?

        window.requestAnimationFrame(game.loop);
    },
    start: (_) => {
        window.addEventListener('load', (_) => {
            canvas.element.width = `${canvas.width}`;
            canvas.element.height = `${canvas.height}`;
            canvas.context = canvas.element.getContext('2d');
            window.requestAnimationFrame(game.loop);
            game.keyEvents();
        });
    },
};

game.start();

function drawPaddle() {
    const paddle = objects.leftPaddle
    canvas.context.fillRect(paddle.x, paddle.y, paddle.width, paddle.height, "WHITE")
    const otherPaddle = objects.rightPaddle
    canvas.context.fillRect(otherPaddle.x, otherPaddle.y, otherPaddle.width, otherPaddle.height, "WHITE")
}

function drawMiddleLine() {
    var x = canvas.width / 2 - 4
    var y = config.minPaddleY
    while(y < canvas.height - config.gridSize - 25) {
        canvas.context.fillRect(x, y, 4, 25)
        y += 30
    }
}

function drawBall() {
    const ball = objects.ball
    canvas.context.beginPath()
    canvas.context.arc(ball.x, ball.y, ball.width, 0, 2 * Math.PI, false);
    canvas.context.fill();
    canvas.context.closePath()
}

function draw() {
    canvas.context.clearRect(0, 0, canvas.width, canvas.height)
    canvas.context.fillRect(0, 0, canvas.width, canvas.height);
    canvas.context.fillStyle = 'white'
    drawPaddle()
    drawMiddleLine()
    drawBall()

    const right = objects.rightPaddle
    if (downPressed && (right.y + right.dy < config.maxPaddleY)) {
        right.y += right.dy
    }
    if (upPressed && (right.y - right.dy > config.minPaddleY)) {
        right.y -= right.dy
    }

    const left = objects.leftPaddle
    if (wPressed && (left.y - left.dy > config.minPaddleY)) {
        left.y -= left.dy
    }
    if (sPressed && (left.y + left.dy < config.maxPaddleY)) {
        left.y += left.dy
    }

    const ball = objects.ball
    if (ball.y + ball.dy < config.gridSize || ball.y + ball.dy > canvas.height) {
        ball.dy *= -1;
    }
    else if(ball.x + ball.dx < config.gridSize || ball.x + ball.dx> canvas.width) {
        ball.x = canvas.width / 2
        ball.y = canvas.height / 2
        setTimeout(drawBall(), 3000)
    }
    
    if(game.collision(ball, right) || game.collision(ball, left)) {
        ball.dx *= -1
    }

    ball.x += ball.dx
    ball.y += ball.dy
}
function keyDownHandler(e) {
    if (e.key == "Up" || e.key == "ArrowUp") {
        upPressed = true;
    }
    if (e.key == "Down" || e.key == "ArrowDown") {
        downPressed = true;
    }
    if (e.key == "W" || e.key == "w") {
        wPressed = true;
    }
    if (e.key == "S" || e.key == "s") {
        sPressed = true;
    }
}

function keyUpHandler(e) {
    if (e.key == "Up" || e.key == "ArrowUp") {
        upPressed = false;
    }
    if (e.key == "Down" || e.key == "ArrowDown") {
        downPressed = false;
    }
    if (e.key == "W" || e.key == "w") {
        wPressed = false;
    }
    if (e.key == "S" || e.key == "s") {
        sPressed = false;
    }
}