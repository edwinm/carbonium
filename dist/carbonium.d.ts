/**!
 @preserve Carbonium 0.1
 @copyright 2020 Edwin Martin
 @license MIT
 */
export declare function $(arg: string, doc?: Document): CarboniumList;
declare type CarboniumType = HTMLInputElement & Array<HTMLElement>;
interface CarboniumList extends CarboniumType {
    concat(...items: ConcatArray<HTMLElement>[]): CarboniumList;
    concat(...items: (HTMLElement | ConcatArray<HTMLElement>)[]): CarboniumList;
    reverse(): CarboniumList;
    slice(start?: number, end?: number): CarboniumList;
    splice(start: number, deleteCount?: number): CarboniumList;
    splice(start: number, deleteCount: number, ...items: HTMLElement[]): CarboniumList;
    forEach(callbackfn: (value: HTMLElement, index: number, array: HTMLElement[]) => void, thisArg?: any): CarboniumList;
    filter(callbackfn: (value: HTMLElement, index: number, array: HTMLElement[]) => boolean, thisArg?: any): CarboniumList;
    classList: CarboniumClassList;
    setAttribute(qualifiedName: string, value: string): CarboniumList;
}
interface CarboniumClassList extends DOMTokenList {
    add(...tokens: string[]): CarboniumList;
    remove(...tokens: string[]): CarboniumList;
    replace(oldToken: string, newToken: string): CarboniumList;
    forEach(callbackfn: (value: string, key: number, parent: DOMTokenList) => void, thisArg?: any): CarboniumList;
}
export {};
