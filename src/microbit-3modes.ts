let mode = 0
let steps = 0

const MODE = {
    TEMPERATURE: 0,
    ROCK_PAPER_SCISSORS: 1,
    PEDOMETER: 2
}

input.onButtonPressed(Button.AB, () => {
    mode = (mode + 1) % 3
})

basic.forever(() => {
    if (mode === MODE.TEMPERATURE) {
        let temp = input.temperature()
        basic.showString(temp.toString())
    } else if (mode === MODE.ROCK_PAPER_SCISSORS) {
        let tool = 0;
        input.onGesture(Gesture.Shake, () => {
            let tool = Math.random(3)
            if (tool == 0) {
                basic.showLeds(`
                # # # # #
                # . . . #
                # . . . #
                # . . . #
                # # # # #
                `)
            } else if (tool == 1) {
                basic.showLeds(`
                . . . . .
                . # # # .
                . # # # .
                . # # # .
                . . . . .
                `)
            } else {
                basic.showLeds(`
                # # . . #
                # # . # .
                . . # . .
                # # . # .
                # # . . #
                `)
            }
        })
    } else {
        basic.showNumber(steps, 150)
        input.onShake(() => {
            steps = steps + 1
            basic.showNumber(steps, 150)
            basic.pause(100)
        })
        input.onButtonPressed(Button.A, () => {
            steps = steps + 1
            basic.showNumber(steps, 150)
            basic.pause(100)
        })
    }
})