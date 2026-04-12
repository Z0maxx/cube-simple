export class AssertionError extends Error {
    constructor(asserts: string, value: unknown) {
        if (value instanceof HTMLElement) {
            const id = Array.from(value.attributes).find(a => a.name === 'id')
            value = `${value.constructor.name}${id ? '#' + id : ''}`
        }
        super(`Not a ${asserts}: ` + value)
    }
}

function isDefined<T>(value: T): asserts value is NonNullable<T> {
    if (value == undefined || value == null) {
        throw new Error('Value is not defined')
    }
}

function isHTMLCanvasElement(value: unknown): asserts value is HTMLCanvasElement {
    if (!(value instanceof HTMLCanvasElement)) {
        throw new AssertionError(HTMLCanvasElement.name, value)
    }
}

function isHTMLInputElement(value: unknown): asserts value is HTMLInputElement {
    if (!(value instanceof HTMLInputElement)) {
        throw new AssertionError(HTMLInputElement.name, value)
    }
}

function isHTMLElement(value: unknown): asserts value is HTMLElement {
    if (!(value instanceof HTMLElement)) {
        throw new AssertionError(HTMLInputElement.name, value)
    }
}

export function assertExists<T>(value: T): NonNullable<T> {
    isDefined(value)
    return value
}

export function assertHTMLCanvasElement(value: unknown): HTMLCanvasElement {
    isHTMLCanvasElement(value)
    return value
}

export function assertHTMLInputElement(value: unknown): HTMLInputElement {
    isHTMLInputElement(value)
    return value
}

export function assertHTMLElement(value: unknown): HTMLElement {
    isHTMLElement(value)
    return value
}