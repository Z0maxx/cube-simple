import { Side, Orientation, CubeLayer, Direction, Cube, Layer, ColorNumber, Notation } from "./cube-constants"

export type TSide = typeof Side[keyof typeof Side]

export type TOriention = typeof Orientation[keyof typeof Orientation]

export type TCubeLayer = typeof CubeLayer[keyof typeof CubeLayer]

export type TDirection = typeof Direction[keyof typeof Direction]

export type TCube = typeof Cube[keyof typeof Cube]

export type TLayer = typeof Layer[keyof typeof Layer]

export type TColorNumber = typeof ColorNumber[keyof typeof ColorNumber]

export type TNotation = typeof Notation[keyof typeof Notation]

export type Move = {
    targetCube: TCube
    targetSides: Array<TSide>
    originCube: TCube
    originSides: Array<TSide>
}

export type MoveWithLayer = Move & {
    targetLayer: TLayer
    originLayer: TLayer
}

export type TranslatedNotation = {
    layer: boolean
    twice: boolean
    direction: TDirection
    cubeLayer?: TCubeLayer
}

export type CubeSolve = {
    moves: Array<TNotation>
    error: string
}

export type SolverWorkerMessage = {
    threadIdx: number
    wasmScript: string
    whiteCross: boolean
    longestSequence: boolean
    cubeColorNumbers: Array<Array<Array<TColorNumber>>>
}

export type SolverWorkerResponse = {
    threadIdx: number
    cubeSolve: CubeSolve
    isWhite?: boolean
}

export type WasmModule = {
    arguments: string[];
    print: (text: string) => void;
}