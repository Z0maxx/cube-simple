import { assertExists } from "./assertions"
import { Color, ColorNumber, cubeColors, whiteCross } from "./cube-constants"
import { setupSequence } from "./sequence-executor"
import { SolverWorkerMessage, SolverWorkerResponse, TColorNumber } from "./types"

let workerText: string | null = null
let wasmScript: string | null = null

export function initCubeSolver() {
    const solveLoader = assertExists(document.getElementById('solve-loader'))
    const solveButton = assertExists(document.getElementById('solve'))
    solveButton.addEventListener('click', async _ => {
        solveLoader.setAttribute('style', 'display: block')
        const cubeColorNumbers: Array<Array<Array<TColorNumber>>> = []
        cubeColors.forEach(layer => {
            const layerColorNumbers: Array<Array<TColorNumber>> = []
            layer.forEach(cube => {
                const colorNumbers: Array<TColorNumber> = []
                cube.forEach(color => {
                    switch (color) {
                        case Color.BLACK:
                            colorNumbers.push(ColorNumber.BLACK)
                            break
                        case Color.WHITE:
                            colorNumbers.push(ColorNumber.WHITE)
                            break
                        case Color.RED:
                            colorNumbers.push(ColorNumber.RED)
                            break
                        case Color.BLUE:
                            colorNumbers.push(ColorNumber.BLUE)
                            break
                        case Color.GREEN:
                            colorNumbers.push(ColorNumber.GREEN)
                            break
                        case Color.YELLOW:
                            colorNumbers.push(ColorNumber.YELLOW)
                            break
                        case Color.ORANGE:
                            colorNumbers.push(ColorNumber.ORANGE)
                            break
                    }
                })
                layerColorNumbers.push(colorNumbers)
            })
            cubeColorNumbers.push(layerColorNumbers)
        })

        wasmScript ??= assertExists(document.querySelector('#wasm-script')).textContent
        const workerPromises = []
        workerText ??= assertExists(document.querySelector('#solver-worker')).textContent
        const workerBlob = new Blob([workerText ?? ''], { type: 'text/javascript' })
        let percentage = 0
        for (let i = 0; i < 6; i++) {
            const threadIdx = i
            const worker = new Worker(window.URL.createObjectURL(workerBlob))
            workerPromises.push(new Promise<SolverWorkerResponse>(res => {
                worker.addEventListener('message', (ev: MessageEvent<SolverWorkerResponse>) => {
                    percentage += 1/6 * 100
                    solveButton.style.setProperty('--percentage', percentage + '%')
                    res(ev.data)
                })
            }))

            const message: SolverWorkerMessage = {
                threadIdx,
                wasmScript: wasmScript ?? '',
                cubeColorNumbers,
                whiteCross: whiteCross.checked
            }

            worker.postMessage(message)
        }

        const results = await Promise.all(workerPromises)
        solveButton.style.setProperty('--percentage', '0%')
        const moves = results
            .sort((a, b ) => a.cubeSolve.moves.length - b.cubeSolve.moves.length)[0]
            .cubeSolve
            .moves

        solveLoader.removeAttribute('style')
        setupSequence(moves)
    })
}