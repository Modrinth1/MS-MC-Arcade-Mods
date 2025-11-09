// --------------------------------------------------------------------
// TIME MOD
// --------------------------------------------------------------------

//% color=#FFA500 icon="\uf017" block="Time"
namespace Time {

    // --------------------------------------------------------------------
    // Helpers
    // --------------------------------------------------------------------
    function pad(num: number): string {
        return num < 10 ? "0" + num : "" + num
    }

    // 5x5 digit grids for numeric HUD
    let digitImgs: Image[] = [
        img`
            . # # # .
            # . . . #
            # . . . #
            # . . . #
            . # # # .
        `, // 0
        img`
            . . # . .
            . # # . .
            . . # . .
            . . # . .
            . # # # .
        `, // 1
        img`
            # # # # .
            . . . # .
            . # # # .
            # . . . .
            # # # # .
        `, // 2
        img`
            # # # # .
            . . . # .
            . # # # .
            . . . # .
            # # # # .
        `, // 3
        img`
            # . . #
            # . . #
            # # # #
            . . . #
            . . . #
        `, // 4
        img`
            # # # #
            # . . .
            # # # .
            . . . #
            # # # .
        `, // 5
        img`
            . # # #
            # . . .
            # # # .
            # . . #
            . # # .
        `, // 6
        img`
            # # # #
            . . . #
            . . # .
            . # . .
            . # . .
        `, // 7
        img`
            . # # .
            # . . #
            . # # .
            # . . #
            . # # .
        `, // 8
        img`
            . # # .
            # . . #
            . # # #
            . . . #
            # # # .
        `  // 9
    ]

    let colonImg = img`
        . . . . .
        . # . # .
        . . . . .
        . # . # .
        . . . . .
    `

    let dotImg = img`
        . . . . .
        . . . . .
        . . . . .
        . . . . .
        . # # . .
    `

    function createNumberImage(value: string, color: number = 1): Image {
        let imgs: Image[] = []
        for (let i = 0; i < value.length; i++) {
            const c = value.charAt(i)
            if (c >= "0" && c <= "9") imgs.push(digitImgs[parseInt(c)].clone())
            else if (c == ":") imgs.push(colonImg.clone())
            else if (c == ".") imgs.push(dotImg.clone())
        }

        let width = imgs.length * 5
        let combined = image.create(width, 5)
        for (let i = 0; i < imgs.length; i++) {
            imgs[i].fill(color)
            combined.blit(i * 5, 0, 5, 5, imgs[i], 0, 0, 0, 0, false, false)
        }
        return combined
    }

    // --------------------------------------------------------------------
    // CLOCK / DATE
    // --------------------------------------------------------------------
    let simHour = 0
    let simMinute = 0
    let simDay = 1
    let simMonth = 1
    let simYear = 2025

    //% blockId=time_clock_time
    //% block="time"
    //% group="Clock"
    export function clockTime(): string {
        return pad(simHour) + ":" + pad(simMinute)
    }

    //% blockId=time_clock_date
    //% block="date"
    //% group="Clock"
    export function clockDate(): string {
        return pad(simDay) + "/" + pad(simMonth) + "/" + simYear
    }

    //% blockId=time_set_time
    //% block="set time to %hour | : %minute"
    //% group="Clock"
    export function setTime(hour: number, minute: number): void {
        simHour = hour % 24
        simMinute = minute % 60
    }

    //% blockId=time_set_date
    //% block="set date to %day / %month / %year"
    //% group="Clock"
    export function setDate(day: number, month: number, year: number): void {
        simDay = Math.max(1, Math.min(31, day))
        simMonth = Math.max(1, Math.min(12, month))
        simYear = year
    }

    // --------------------------------------------------------------------
    // TIMER (COUNTDOWN)
    // --------------------------------------------------------------------
    let timerTotal = 0
    let timerRemaining = 0
    let timerRunning = false
    let timerPaused = false
    let timerLastUpdate = 0

    //% blockId=time_timer_start_seconds
    //% block="start timer for %seconds s"
    //% group="Timer"
    export function startTimer(seconds: number): void {
        timerTotal = Math.max(0, seconds)
        timerRemaining = timerTotal
        timerRunning = true
        timerPaused = false
        timerLastUpdate = control.millis()
    }

    //% blockId=time_timer_pause
    //% block="pause timer"
    //% group="Timer"
    export function pauseTimer(): void {
        if (timerRunning) timerPaused = true
    }

    //% blockId=time_timer_unpause
    //% block="unpause timer"
    //% group="Timer"
    export function unpauseTimer(): void {
        if (timerRunning) timerPaused = false
        timerLastUpdate = control.millis()
    }

    //% blockId=time_timer_stop
    //% block="stop timer"
    //% group="Timer"
    export function stopTimer(): void {
        timerRunning = false
        timerPaused = false
        timerRemaining = 0
    }

    //% blockId=time_timer_remaining
    //% block="time left (s)"
    //% group="Timer"
    export function timerLeft(): number {
        if (!timerRunning) return 0
        const now = control.millis()
        if (!timerPaused) {
            const delta = (now - timerLastUpdate) / 1000
            timerRemaining = Math.max(0, timerRemaining - delta)
            timerLastUpdate = now
            if (timerRemaining <= 0) timerRunning = false
        }
        return Math.floor(timerRemaining * 100) / 100
    }

    // --------------------------------------------------------------------
    // STOPWATCH (ELAPSED TIME)
    // --------------------------------------------------------------------
    let stopwatchStart = 0
    let stopwatchRunning = false

    //% blockId=time_stopwatch_start
    //% block="start stopwatch"
    //% group="Stopwatch"
    export function startStopwatch(): void {
        stopwatchStart = control.millis()
        stopwatchRunning = true
    }

    //% blockId=time_stopwatch_stop
    //% block="stop stopwatch"
    //% group="Stopwatch"
    export function stopStopwatch(): void {
        stopwatchRunning = false
    }

    //% blockId=time_stopwatch_elapsed
    //% block="stopwatch time (s)"
    //% group="Stopwatch"
    export function stopwatchElapsed(): number {
        if (!stopwatchRunning) return 0
        return Math.floor((control.millis() - stopwatchStart) / 10) / 100
    }

    // --------------------------------------------------------------------
    // HUD / DISPLAY
    // --------------------------------------------------------------------
    let hud: Sprite = null

    //% blockId=time_show_time_hud
    //% block="show time HUD at x %x | y %y | color %color"
    //% group="Display/HUD"
    export function showTimeHUD(x: number, y: number, color: number = 1): void {
        if (hud) hud.destroy()
        hud = sprites.create(createNumberImage(clockTime(), color), SpriteKind.Player)
        hud.setPosition(x, y)
    }

    //% blockId=time_show_stopwatch_hud
    //% block="show stopwatch HUD at x %x | y %y | color %color"
    //% group="Display/HUD"
    export function showStopwatchHUD(x: number, y: number, color: number = 1): void {
        if (hud) hud.destroy()
        hud = sprites.create(createNumberImage(stopwatchElapsed() + "s", color), SpriteKind.Player)
        hud.setPosition(x, y)
    }

    //% blockId=time_hide_hud
    //% block="hide HUD"
    //% group="Display/HUD"
    export function hideHUD(): void {
        if (hud) {
            hud.destroy()
            hud = null
        }
    }
}

// --------------------------------------------------------------------
// LOGIC (XOR inside existing Boolean group)
// --------------------------------------------------------------------
namespace logic {
    //% blockId=logic_xor
    //% block="%a xor %b"
    //% group="Boolean"
    export function xor(a: boolean, b: boolean): boolean {
        return (a && !b) || (b && !a)
    }
}

// --------------------------------------------------------------------
// VERSION HISTORY
// --------------------------------------------------------------------
/*
v1.01 – Initial Clock/Date reporters.
v1.02 – Added Timer start/stop/elapsed.
v1.03 – Added Stopwatch start/stop/elapsed.
v1.04 – Initial HUD with TextSprite (broke).
v1.05 – Numeric HUD grids added.
v1.06 – Added milliseconds to 2 dp.
v1.07 – XOR block in Logic.
v1.08 – Removed kind dropdown.
v1.09 – Fixed padStart errors.
v1.10 – Fixed background/thread issues.
v1.11 – HUD using countdown style from info.
v1.12 – Line 107 fixed, stopwatch/timer functional.
v1.13 – Fixed createTextSprite errors.
v1.14 – HUD digits converted to grids.
v1.15 – Typed Image[] arrays.
v1.16 – Initial attempt at createImageSprite (online fails).
v1.17 – Line 108 7-arg blit tried.
v1.18 – Fixed blit 11-arg issue, removed createImageSprite, HUD works online, XOR works.
v1.19 – Corrected blit argument types, fixed all errors in v1.18, color HUD added.
v1.20 – Added improved HUD customization and display features.
v1.21 – XOR moved to Boolean group, lowercase block, maintains all previous improvements.
v1.22 – Timer revamped: countdown, pause/unpause, stopwatch simplified, HUD improvements.
v1.23 – Timer is proper countdown with start/pause/unpause/stop, `time left (s)` reporter added, stopwatch unchanged.
*/