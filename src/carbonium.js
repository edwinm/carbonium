/**
 Carbonium __buildVersion__
 @copyright 2020 Edwin Martin
 @license MIT
 */
export function $(selectors, parentNode) {
  let nodelist;
  if (selectors[0] == "<") {
    nodelist = [
      new DOMParser().parseFromString(selectors, "text/html").body.firstChild,
    ];
  } else {
    nodelist = (parentNode || document).querySelectorAll(selectors);
  }
  return new Proxy(nodelist, proxyHandler);
}
// Used by classList and style
let currentListNodelist;
let propList;
const proxyHandler = {
  get(target, prop) {
    let propValue = null;
    // Return iterator when asked for iterator
    if (prop == Symbol.iterator) {
      console.log("Iterator!!!");
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
        return new Proxy(propValue, {
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
        return new Proxy(propValue, {
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
        return new Proxy(propValue, {
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
