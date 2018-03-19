// Two player (two microbit) pong game, ball passed between boards with radio signal
interface Point {
    x: number,
    y: number
}
enum Radio {
    BALL, GAME_OVER
}
enum Direction {
    UP = 0, DOWN = 180
}

let numberOfPasses = 1
let paddlePosition = 1
let paddle = {
    leftEdge: game.createSprite(paddlePosition, 4),
    rightEdge: game.createSprite(paddlePosition + 1, 4),
}
let ball: game.LedSprite = game.createSprite(1, 3)
ball.setDirection(Direction.UP)
let ballVelocity = 1
let showScore = false
let onCourt = true

function getGameSpeed() {
    return Math.max((300 - (numberOfPasses * 20)), 50)
}

game.setLife(3)
game.pause()
radio.setGroup(1)

input.onButtonPressed(Button.A, () => {
    game.resume()
    if (paddle.leftEdge.x() > 0) {
        shiftPaddle(-1)
    }
})
input.onButtonPressed(Button.B, () => {
    game.resume()
    if (paddle.rightEdge.x() < 4) {
        shiftPaddle(1)
    }
})

function shiftPaddle(value: number) {
    paddle.leftEdge.move(value)
    paddle.rightEdge.move(value)
}

radio.onDataPacketReceived((packet) => {
    if (packet.receivedNumber === Radio.BALL) {
        onCourt = true
        ball.setY(0)
        ball.setX(Math.random(5))
        ball.setDirection(Direction.DOWN)
        ball.on()
        basic.pause(getGameSpeed())
        game.resume()
    } else if (packet.receivedNumber === Radio.GAME_OVER) {
        game.addScore(1)
        game.gameOver()
    }
})

basic.forever(() => {
    if (!game.isPaused()) {
        ball.move(ballVelocity)
        basic.pause(getGameSpeed())
        if (ball.isTouching(paddle.leftEdge) || ball.isTouching(paddle.rightEdge)) {
            ball.setDirection(Direction.UP)
        } else if (onCourt && ball.isTouchingEdge() && ball.direction() === Direction.UP) {
            radio.sendNumber(Radio.BALL)
            numberOfPasses++
            onCourt = false
            showScore = false
            ball.off()
            game.pause()
        } else if (ball.isTouchingEdge() && ball.y() == 4 && ball.direction() === Direction.DOWN) {
            if (game.life() === 0) {
                radio.sendNumber(Radio.GAME_OVER)
                game.gameOver()
            } else {
                numberOfPasses = 1
                game.removeLife(1)
                showScore = true
                ball.setDirection(Direction.UP)
                game.pause()
            }
        }
    } else {
        if (showScore) {
            basic.showNumber(game.life())
            basic.pause(500)
            resetGame()
        }
    }
})

function resetGame() {
    showScore = false
    numberOfPasses = 1
    basic.clearScreen()
}
