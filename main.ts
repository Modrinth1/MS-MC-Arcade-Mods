//% color=#FFA500 icon="\uf017" block="Time"
namespace Time {

    // Helper function for left padding numbers with zeros
    function pad(num: number): string {
        return num < 10 ? "0" + num : "" + num
    }

    // ---------- Clock Section ----------
    //% blockId=clock_time block="time"
    //% group="Clock"
    export function clockTime(): string {
        // Approximate system time using running time in ms
        const totalSeconds = control.millis() / 1000
        const hours = Math.floor((totalSeconds / 3600) % 24)
        const minutes = Math.floor((totalSeconds / 60) % 60)
        return pad(hours) + ":" + pad(minutes)
    }

    //% blockId=clock_date block="date"
    //% group="Clock"
    export function clockDate(): string {
        // Fake date starting from 01/01/2025
        const baseDay = 1
        const baseMonth = 1
        const baseYear = 2025
        const daysSinceStart = Math.floor(control.millis() / (1000 * 60 * 60 * 24))
        const day = (baseDay + daysSinceStart) % 30
        const month = (baseMonth + Math.floor((baseDay + daysSinceStart) / 30)) % 12
        const dd = pad(day || 1)
        const mm = pad(month || 1)
        return dd + "/" + mm + "/" + baseYear
    }

    //% blockId=clock_display block="%timeOrDate kind %kindText"
    //% timeOrDate.shadow="string"
    //% kindText.defl="time"
    //% group="Clock"
    export function displayTimeOrDate(timeOrDate: string, kindText: string) {
        return timeOrDate + " (" + kindText + ")"
    }

    // ---------- Timer Section ----------
    //% group="Timer"
    //% blockId=timer_start block="start timer"
    export function startTimer(): void { }

    //% blockId=timer_stop block="stop timer"
    export function stopTimer(): void { }

    //% blockId=timer_elapsed block="elapsed time"
    export function elapsedTime(): number {
        return 0
    }

    // ---------- Stopwatch Section ----------
    //% group="Stopwatch"
    //% blockId=stopwatch_start block="start stopwatch"
    export function startStopwatch(): void { }

    //% blockId=stopwatch_stop block="stop stopwatch"
    export function stopStopwatch(): void { }

    //% blockId=stopwatch_elapsed block="elapsed time"
    export function stopwatchElapsed(): number {
        return 0
    }
}