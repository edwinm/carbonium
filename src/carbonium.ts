/**
 Carbonium 0.1.6
 @copyright 2020 Edwin Martin
 @license MIT
 */

export function $<T extends HTMLElement = HTMLElement>(
  selectors: string,
  parentNode?: Document | ShadowRoot | HTMLElement
): CarboniumType<T> {
  const nodelist: NodeListOf<T> = (parentNode || document).querySelectorAll(
    selectors
  );
  return <CarboniumType<T>>(
    (<unknown>new Proxy<NodeListOf<T>>(nodelist, proxyHandler))
  );
}

// Used by classList and style
let currentListNodelist: NodeListOf<HTMLElement>;
let propList: string;

const proxyHandler: ProxyHandler<NodeListOf<HTMLElement>> = {
  get(target, prop) {
    let propValue = null;

    // Return iterator when asked for iterator
    if (prop == Symbol.iterator) {
      return function* () {
        for (let i = 0; i < target.length; i++) {
          yield target[i];
        }
      };
    }

    // Special case for style, classList and relList
    if (prop == "style" || prop == "classList" || prop == "relList") {
      currentListNodelist = target;
      propList = prop;
      const propValue = Reflect.get(document.body, prop);
      return new Proxy(propValue, proxyHandler);
    }

    // style.setProperty, getPropertyValue…, classList.add, contains, remove…, relList…
    if (
      target instanceof CSSStyleDeclaration ||
      target instanceof DOMTokenList
    ) {
      propValue = Reflect.get(document.body[propList], prop);

      if (typeof propValue == "function") {
        return new Proxy<Function>(propValue, {
          apply: function (target, thisArg, argumentsList) {
            currentListNodelist.forEach((el) => {
              Reflect.apply(target, el[propList], argumentsList);
            });
            return new Proxy(currentListNodelist, proxyHandler);
          },
        });
      } else {
        return propValue;
      }
    }

    // Are we dealing with an Array function?
    if (Array.prototype.hasOwnProperty(prop)) {
      const propValue = Reflect.get(Array.prototype, prop);
      if (typeof propValue == "function") {
        return new Proxy<Function>(propValue, {
          apply: function (target, thisArg, argumentsList) {
            const ret = Reflect.apply(target, thisArg, argumentsList);
            // forEach returns same array instead of undefined
            const newTarget = typeof ret != "undefined" ? ret : thisArg;
            return new Proxy(newTarget, proxyHandler);
          },
        });
      }
    }

    // Get property or call function on DOM elements
    if (target.length > 0) {
      // Might be DOM element specific, like input.select(),
      // so use first array element to get reference
      if (prop in target[0]) {
        propValue = Reflect.get(target[0], prop);
      }
    } else {
      // Empty list, targeted DOM element unknown,
      // use document.body
      if (prop in document.body) {
        propValue = Reflect.get(document.body, prop);
      }
    }

    // Propagate DOM prop value
    if (propValue) {
      if (typeof propValue == "function") {
        return new Proxy<Function>(propValue, {
          apply: function (target, thisArg, argumentsList) {
            let retFirst = null;
            let first = true;
            // Apply on individual elements
            for (const el of thisArg) {
              const ret = Reflect.apply(target, el, argumentsList);
              if (first) {
                retFirst = ret;
                first = false;
              }
            }
            return retFirst != null && retFirst != undefined
              ? retFirst
              : thisArg;
          },
        });
      } else {
        return propValue;
      }
    }

    // Default
    return Reflect.get(target, prop);
  },

  // DOM property is set
  set(target, prop, value) {
    if ("forEach" in target) {
      target.forEach((el) => {
        Reflect.set(el, prop, value);
      });
    } else {
      Reflect.set(target, prop, value);
    }
    return true;
  },
};

export type CarboniumType<T extends HTMLElement = HTMLElement> = CarboniumList<
  T
> &
  T;

interface CarboniumList<T extends HTMLElement> extends Array<T> {
  concat(...items: ConcatArray<T>[]): CarboniumType<T>;

  concat(...items: (T | ConcatArray<T>)[]): CarboniumType<T>;

  reverse(): CarboniumType<T>;

  slice(start?: number, end?: number): CarboniumType<T>;

  splice(start: number, deleteCount?: number): CarboniumType<T>;

  /* tslint:disable:unified-signatures */
  splice(start: number, deleteCount: number, ...items: T[]): CarboniumType<T>;

  forEach(
    callbackfn: (value: T, index: number, array: T[]) => void,
    thisArg?: any
  ): CarboniumType<T>;

  filter(
    callbackfn: (value: T, index: number, array: T[]) => boolean,
    thisArg?: any
  ): CarboniumType<T>;

  setAttribute(qualifiedName: string, value: string): CarboniumType<T>;

  classList: CarboniumClassList<T>;
  style: CarboniumStyleList<T>;
}

interface CarboniumClassList<T extends HTMLElement> extends DOMTokenList {
  add(...tokens: string[]): CarboniumType<T>;

  remove(...tokens: string[]): CarboniumType<T>;

  replace(oldToken: string, newToken: string): CarboniumType<T>;

  forEach(
    callbackfn: (value: string, key: number, parent: DOMTokenList) => void,
    thisArg?: any
  ): CarboniumType<T>;
}

interface CarboniumStyleList<T extends HTMLElement>
  extends CSSStyleDeclaration {
  removeProperty(property: string): CarboniumList<T> & string;

  setProperty(
    property: string,
    value: string | null,
    priority?: string
  ): CarboniumType<T>;
}
