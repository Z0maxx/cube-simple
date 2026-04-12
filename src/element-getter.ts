import { assertHTMLElement, assertHTMLInputElement } from "./assertions";

export function getHTMLElement(querySelector: string): HTMLElement {
    return assertHTMLElement(document.querySelector(querySelector))
}

export function getHTMLInputElement(querySelector: string): HTMLInputElement {
    return assertHTMLInputElement(document.querySelector(querySelector))
}