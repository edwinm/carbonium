/**!
 @preserve Carbonium 0.1
 @copyright 2020 Edwin Martin
 @license MIT
 */
export declare function $(arg: string, doc?: Document): CarboniumList;
declare type AllElements = HTMLInputElement & HTMLCanvasElement;
export declare type CarboniumType = AllElements & Array<AllElements>;
interface CarboniumList extends CarboniumType {
    concat(...items: ConcatArray<AllElements>[]): CarboniumList;
    concat(...items: (AllElements | ConcatArray<AllElements>)[]): CarboniumList;
    reverse(): CarboniumList;
    slice(start?: number, end?: number): CarboniumList;
    splice(start: number, deleteCount?: number): CarboniumList;
    splice(start: number, deleteCount: number, ...items: AllElements[]): CarboniumList;
    forEach(callbackfn: (value: AllElements, index: number, array: AllElements[]) => void, thisArg?: any): CarboniumList;
    filter(callbackfn: (value: AllElements, index: number, array: AllElements[]) => boolean, thisArg?: any): CarboniumList;
    setAttribute(qualifiedName: string, value: string): CarboniumList;
    classList: CarboniumClassList;
    style: CarboniumStyleList;
}
interface CarboniumClassList extends DOMTokenList {
    add(...tokens: string[]): CarboniumList;
    remove(...tokens: string[]): CarboniumList;
    replace(oldToken: string, newToken: string): CarboniumList;
    forEach(callbackfn: (value: string, key: number, parent: DOMTokenList) => void, thisArg?: any): CarboniumList;
}
interface CarboniumStyleList extends CSSStyleDeclaration {
    removeProperty(property: string): CarboniumList & string;
    setProperty(property: string, value: string | null, priority?: string): CarboniumList;
}
export {};
