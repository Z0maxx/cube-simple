import { assertExists } from "./assertions"
import { Color, ColorNumber, Cube, cubeColors, Layer, longestSequence, Side, whiteCross } from "./cube-constants"
import { getHTMLElement } from "./element-getter"
import { setupSequence } from "./sequence-executor"
import { SolverWorkerMessage, SolverWorkerResponse, TColorNumber } from "./types"

let workerText: string | null = null
let wasmScript: string | null = null

export function initCubeSolver() {
    const solveButton = getHTMLElement('#solve')
    const solveLoader = getHTMLElement('#solve-loader')
    solveButton.addEventListener('click', async _ => {
        solveLoader.setAttribute('style', 'display: flex; pointer-events: auto')
        const cubeColorNumbers: Array<Array<Array<TColorNumber>>> = []
        const cubeColorStrings: Array<Array<Array<string>>> = []
        cubeColors.forEach(layer => {
            const layerColorNumbers: Array<Array<TColorNumber>> = []
            const layerColorStrings: Array<Array<string>> = []
            layer.forEach(cube => {
                const colorNumbers: Array<TColorNumber> = []
                const colorStrings: Array<string> = []
                cube.forEach(color => {
                    switch (color) {
                        case Color.BLACK:
                            colorNumbers.push(ColorNumber.BLACK)
                            colorStrings.push('black')
                            break
                        case Color.WHITE:
                            colorNumbers.push(ColorNumber.WHITE)
                            colorStrings.push('white')
                            break
                        case Color.RED:
                            colorNumbers.push(ColorNumber.RED)
                            colorStrings.push('red')
                            break
                        case Color.BLUE:
                            colorNumbers.push(ColorNumber.BLUE)
                            colorStrings.push('blue')
                            break
                        case Color.GREEN:
                            colorNumbers.push(ColorNumber.GREEN)
                            colorStrings.push('green')
                            break
                        case Color.YELLOW:
                            colorNumbers.push(ColorNumber.YELLOW)
                            colorStrings.push('yellow')
                            break
                        case Color.ORANGE:
                            colorNumbers.push(ColorNumber.ORANGE)
                            colorStrings.push('orange')
                            break
                    }
                })

                layerColorNumbers.push(colorNumbers)
                layerColorStrings.push(colorStrings)
            })
            
            cubeColorNumbers.push(layerColorNumbers)
            cubeColorStrings.push(layerColorStrings)
        })

        const loaderIds = [...Array(6).keys()].map(i => 'solve-loader-face-' + i)
        solveLoader.innerHTML = `
            <div class="bg-blue-300/50 p-4 rounded-md flex justify-center items-center gap-2 flex-col">
                <div class="text-4xl font-bold bg-blue-300 p-2 rounded-md">
                    <span class="bg-clip-text text-transparent bg-linear-to-br from-rose-500 to-fuchsia-500">Solving</span>
                </div>
                <div class="flex gap-2">
                    ${createFaceElements(getLeftFace(cubeColorStrings), loaderIds[0])}
                    ${createFaceElements(getFrontFace(cubeColorStrings), loaderIds[1])}
                    ${createFaceElements(getRightFace(cubeColorStrings), loaderIds[2])}
                </div>
                <div class="flex gap-2">
                    ${createFaceElements(getTopFace(cubeColorStrings), loaderIds[3])}
                    ${createFaceElements(getBottomFace(cubeColorStrings), loaderIds[4])}
                    ${createFaceElements(getBackFace(cubeColorStrings), loaderIds[5])}
                </div>
            </div>`

        wasmScript ??= assertExists(document.querySelector('#wasm-script')).textContent
        const workerPromises = []
        workerText ??= assertExists(document.querySelector('#solver-worker')).textContent
        const workerBlob = new Blob([workerText ?? ''], { type: 'text/javascript' })
        for (let i = 0; i < 6; i++) {
            const threadIdx = i
            const worker = new Worker(window.URL.createObjectURL(workerBlob))
            workerPromises.push(new Promise<SolverWorkerResponse>(res => {
                worker.addEventListener('message', (ev: MessageEvent<SolverWorkerResponse>) => {
                    assertExists(document.getElementById(loaderIds[threadIdx])).removeAttribute('style')
                    res(ev.data)
                })
            }))

            const message: SolverWorkerMessage = {
                threadIdx,
                wasmScript: wasmScript ?? '',
                cubeColorNumbers,
                whiteCross: whiteCross.checked,
                longestSequence: longestSequence.checked
            }

            worker.postMessage(message)
        }

        const results = await Promise.all(workerPromises)
        const moves = whiteCross.checked ? assertExists(results.find(r => r.isWhite)).cubeSolve.moves : results
            .sort((a, b) => {
                const l1 = a.cubeSolve.moves.length
                const l2 = b.cubeSolve.moves.length
                return longestSequence.checked ? l2 - l1 : l1 - l2
            })[0]
            .cubeSolve
            .moves

        setTimeout(() => {
            solveLoader.removeAttribute('style')
            setupSequence(moves)
        }, 300)
    })
}

function createFaceElements(colors: Array<Array<string>>, id: string) {
    return `
    <div id=${id} style="opacity: 50%">` +
        colors.map(r => '<div class="flex">' +
            r.map(c => `<div class="solve-loader-cubie size-5 md:size-8" style="background: ${c}"></div>`)
            .join('') +
        '</div>')
        .join('') +
    '</div>'
}

function getFrontFace(colors: Array<Array<Array<string>>>) {
    return [
        [colors[Layer.FRONT][Cube.TOP_LEFT][Side.FRONT], colors[Layer.FRONT][Cube.TOP][Side.FRONT], colors[Layer.FRONT][Cube.TOP_RIGHT][Side.FRONT]],
        [colors[Layer.FRONT][Cube.LEFT][Side.FRONT], colors[Layer.FRONT][Cube.CENTER][Side.FRONT], colors[Layer.FRONT][Cube.RIGHT][Side.FRONT]],
        [colors[Layer.FRONT][Cube.BOTTOM_LEFT][Side.FRONT], colors[Layer.FRONT][Cube.BOTTOM][Side.FRONT], colors[Layer.FRONT][Cube.BOTTOM_RIGHT][Side.FRONT]]
    ]
}

function getBackFace(colors: Array<Array<Array<string>>>) {
    return [
        [colors[Layer.BACK][Cube.TOP_RIGHT][Side.BACK], colors[Layer.BACK][Cube.TOP][Side.BACK], colors[Layer.BACK][Cube.TOP_LEFT][Side.BACK]],
        [colors[Layer.BACK][Cube.RIGHT][Side.BACK], colors[Layer.BACK][Cube.CENTER][Side.BACK], colors[Layer.BACK][Cube.LEFT][Side.BACK]],
        [colors[Layer.BACK][Cube.BOTTOM_RIGHT][Side.BACK], colors[Layer.BACK][Cube.BOTTOM][Side.BACK], colors[Layer.BACK][Cube.BOTTOM_LEFT][Side.BACK]]
    ]
}

function getLeftFace(colors: Array<Array<Array<string>>>) {
    return [
        [colors[Layer.BACK][Cube.TOP_LEFT][Side.LEFT], colors[Layer.MIDDLE][Cube.TOP_LEFT][Side.LEFT], colors[Layer.FRONT][Cube.TOP_LEFT][Side.LEFT]],
        [colors[Layer.BACK][Cube.LEFT][Side.LEFT], colors[Layer.MIDDLE][Cube.LEFT][Side.LEFT], colors[Layer.FRONT][Cube.LEFT][Side.LEFT]],
        [colors[Layer.BACK][Cube.BOTTOM_LEFT][Side.LEFT], colors[Layer.MIDDLE][Cube.BOTTOM_LEFT][Side.LEFT], colors[Layer.FRONT][Cube.BOTTOM_LEFT][Side.LEFT]]
    ]
}

function getRightFace(colors: Array<Array<Array<string>>>) {
    return [
        [colors[Layer.FRONT][Cube.TOP_RIGHT][Side.RIGHT], colors[Layer.MIDDLE][Cube.TOP_RIGHT][Side.RIGHT], colors[Layer.BACK][Cube.TOP_RIGHT][Side.RIGHT]],
        [colors[Layer.FRONT][Cube.RIGHT][Side.RIGHT], colors[Layer.MIDDLE][Cube.RIGHT][Side.RIGHT], colors[Layer.BACK][Cube.RIGHT][Side.RIGHT]],
        [colors[Layer.FRONT][Cube.BOTTOM_RIGHT][Side.RIGHT], colors[Layer.MIDDLE][Cube.BOTTOM_RIGHT][Side.RIGHT], colors[Layer.BACK][Cube.BOTTOM_RIGHT][Side.RIGHT]]
    ]
}

function getTopFace(colors: Array<Array<Array<string>>>) {
    return [
        [colors[Layer.BACK][Cube.TOP_LEFT][Side.TOP], colors[Layer.BACK][Cube.TOP][Side.TOP], colors[Layer.BACK][Cube.TOP_RIGHT][Side.TOP]],
        [colors[Layer.MIDDLE][Cube.TOP_LEFT][Side.TOP], colors[Layer.MIDDLE][Cube.TOP][Side.TOP], colors[Layer.MIDDLE][Cube.TOP_RIGHT][Side.TOP]],
        [colors[Layer.FRONT][Cube.TOP_LEFT][Side.TOP], colors[Layer.FRONT][Cube.TOP][Side.TOP], colors[Layer.FRONT][Cube.TOP_RIGHT][Side.TOP]],
    ]
}

function getBottomFace(colors: Array<Array<Array<string>>>) {
    return [
        [colors[Layer.FRONT][Cube.BOTTOM_LEFT][Side.BOTTOM], colors[Layer.FRONT][Cube.BOTTOM][Side.BOTTOM], colors[Layer.FRONT][Cube.BOTTOM_RIGHT][Side.BOTTOM]],
        [colors[Layer.MIDDLE][Cube.BOTTOM_LEFT][Side.BOTTOM], colors[Layer.MIDDLE][Cube.BOTTOM][Side.BOTTOM], colors[Layer.MIDDLE][Cube.BOTTOM_RIGHT][Side.BOTTOM]],
        [colors[Layer.BACK][Cube.BOTTOM_LEFT][Side.BOTTOM], colors[Layer.BACK][Cube.BOTTOM][Side.BOTTOM], colors[Layer.BACK][Cube.BOTTOM_RIGHT][Side.BOTTOM]],
    ]
}