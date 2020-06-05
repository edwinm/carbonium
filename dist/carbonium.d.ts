/**!
 @preserve Carbonium 0.1.6
 @copyright 2020 Edwin Martin
 @license MIT
 */
export declare function $<T extends HTMLElement = HTMLElement>(selectors: string, parentNode?: Document | ShadowRoot | HTMLElement): CarboniumType<T>;
export declare type CarboniumType<T extends HTMLElement = HTMLElement> = CarboniumList<T> & T;
interface CarboniumList<T extends HTMLElement> extends Array<T> {
    concat(...items: ConcatArray<T>[]): CarboniumType<T>;
    concat(...items: (T | ConcatArray<T>)[]): CarboniumType<T>;
    reverse(): CarboniumType<T>;
    slice(start?: number, end?: number): CarboniumType<T>;
    splice(start: number, deleteCount?: number): CarboniumType<T>;
    splice(start: number, deleteCount: number, ...items: T[]): CarboniumType<T>;
    forEach(callbackfn: (value: T, index: number, array: T[]) => void, thisArg?: any): CarboniumType<T>;
    filter(callbackfn: (value: T, index: number, array: T[]) => boolean, thisArg?: any): CarboniumType<T>;
    setAttribute(qualifiedName: string, value: string): CarboniumType<T>;
    classList: CarboniumClassList<T>;
    style: CarboniumStyleList<T>;
}
interface CarboniumClassList<T extends HTMLElement> extends DOMTokenList {
    add(...tokens: string[]): CarboniumType<T>;
    remove(...tokens: string[]): CarboniumType<T>;
    replace(oldToken: string, newToken: string): CarboniumType<T>;
    forEach(callbackfn: (value: string, key: number, parent: DOMTokenList) => void, thisArg?: any): CarboniumType<T>;
}
interface CarboniumStyleList<T extends HTMLElement> extends CSSStyleDeclaration {
    removeProperty(property: string): CarboniumList<T> & string;
    setProperty(property: string, value: string | null, priority?: string): CarboniumType<T>;
}
export {};
