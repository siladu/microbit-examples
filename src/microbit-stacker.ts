// press A to start stacking LEDs, you win if you get a complete line
// press B to reset at any time
let gameSpeed = 6
let maxLevels = 4

interface Point {
    x: number,
    y: number
}
let gameHasEnded = false
let endGameMusicPlayed = false
let winner = true
let myStack: Point[] = []
let currentLevel: number = 0
let currentPosition: number = 0
let throttleCursor = 0
let throttleReady = false

function resetGame() {
    myStack = []
    currentPosition = 0
    currentLevel = 0
    gameHasEnded = false
    endGameMusicPlayed = false
    basic.clearScreen()
    led.plot(0, currentLevel)
}

resetGame()

basic.forever(() => {
    if (gameHasEnded) {
        displayResult()
    } else {
        playGame()
    }
})

input.onButtonPressed(Button.A, () => {
    myStack.push({ x: currentPosition, y: currentLevel })
    incrementLevel()
    led.plot(0, currentLevel)
})

input.onButtonPressed(Button.B, () => {
    resetGame()
})

function playGame() {
    for (let i = 0; i < myStack.length; i++) {
        led.plot(myStack[i].x, myStack[i].y)
    }
    throttle()
    if (throttleReady) {
        led.unplot(currentPosition, currentLevel)
        incrementPosition()
        led.plot(currentPosition, currentLevel)
    }
}

function displayResult() {
    if (winner) {
        playMusic(Melodies.BaDing)
        basic.showIcon(IconNames.Yes)
        basic.showAnimation(`
            . . . . .
            . . . . .
            . . . . .
            . . . . .
            . . . . .
        `)
    } else {
        playMusic(Melodies.Funeral)
        basic.showIcon(IconNames.No)
        basic.showAnimation(`
            . . . . .
            . . . . .
            . . . . .
            . . . . .
            . . . . .
        `)
    }
}

function playMusic(melody: Melodies) {
    if (!endGameMusicPlayed) {
        music.beginMelody(music.builtInMelody(melody))
        endGameMusicPlayed = true
    }
}

function incrementPosition() {
    currentPosition = (currentPosition + 1) % 5
}

function incrementLevel() {
    currentLevel += 1
    currentPosition = 0
    if (currentLevel > maxLevels) {
        endGame()
    }
}

function endGame() {
    winner = true
    for (let i = 0; i < myStack.length; i++) {
        if (myStack[0].x !== myStack[i].x) {
            winner = false
        }
    }
    gameHasEnded = true
}

function throttle() {
    throttleCursor += 1
    if (throttleCursor == gameSpeed) {
        throttleCursor = 0
        throttleReady = true
    } else {
        throttleReady = false
    }
}