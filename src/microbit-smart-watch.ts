// Switch smart watch mode with A+B

let mode = 0

const MODE = {
    TEMPERATURE: 0,
    ROCK_PAPER_SCISSORS: 1,
    PEDOMETER: 2,
    ACCELERATION_PLOT: 3,
    LIGHT_LEVEL_PLOT: 4
}

input.onButtonPressed(Button.AB, () => {
    mode = (mode + 1) % 5
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
    } else if (mode === MODE.PEDOMETER) {
        let steps: number

        steps = 0
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
    } else if (mode === MODE.ACCELERATION_PLOT) {
        led.plotBarGraph(
            input.acceleration(Dimension.X),
            1023
        )
    } else {
        led.plotBarGraph(
            input.lightLevel(),
            255
        )
    }
})
