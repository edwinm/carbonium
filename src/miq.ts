export function $(arg: string, doc?: Document): any {
  const nodelist = (doc || document).querySelectorAll(arg);
  return new Proxy(nodelist, proxyHandler);
}

// Used by classList
let classListNodelist: NodeListOf<HTMLElement>;

const proxyHandler: ProxyHandler<NodeListOf<HTMLElement>> = {
  get(target, prop) {

    // Return iterator when asked for iterator
    if (prop == Symbol.iterator) {
      return function* () {
        for (let i = 0; i < target.length; i++) {
          yield target[i];
        }
      }
    }

    // Special case for classList
    if (prop == 'classList') {
      classListNodelist = target;
      const propValue = Reflect.get(document.body, prop);
      return new Proxy(propValue, proxyHandler);
    }

    // classList.add, contains, remove…
    if (target instanceof DOMTokenList) {
      const propValue = Reflect.get(document.body.classList, prop);

      if (typeof propValue == 'function') {
        return new Proxy<Function>(propValue, {
          apply: function (target, thisArg, argumentsList) {
            classListNodelist.forEach((el) => {
              Reflect.apply(target, el.classList, argumentsList);
            });
            return new Proxy(classListNodelist, proxyHandler);
          }
        })
      } else {
        return propValue;
      }
    }

    // Are we dealing with an Array function?
    if (Array.prototype.hasOwnProperty(prop)) {
      const propValue = Reflect.get(Array.prototype, prop);
      if (typeof propValue == 'function') {
        return new Proxy<Function>(propValue, {
          apply: function (target, thisArg, argumentsList) {
            const ret = Reflect.apply(target, thisArg, argumentsList);
            // forEach returns same array instead of undefined
            const newTarget = typeof ret != 'undefined' ? ret : thisArg
            return new Proxy(newTarget, proxyHandler);
          }
        });
      }
    }

    // Get property or call function on DOM elements
    if (target.length > 0) {
      // Might be DOM element specific, like input.select(),
      // so use first array element to get reference
      if (prop in target[0]) {
        const propValue = Reflect.get(target[0], prop);
        if (typeof propValue == 'function') {
          return new Proxy(propValue, proxyDOMFunctionHandler);
        } else {
          return propValue;
        }
      }
    } else {
      // Empty list, targeted DOM element unknown,
      // use document.body
      if (prop in document.body) {
        const propValue = Reflect.get(document.body, prop);
        if (typeof propValue == 'function') {
          return new Proxy(propValue, proxyDOMFunctionHandler);
        } else {
          return propValue;
        }
      }
    }

    // Default
    return Reflect.get(target, prop);
  },

  // DOM property is set
  set(target, prop, value) {
    target.forEach((el) => {
      Reflect.set(el, prop, value);
    });
    return true;
  },
};

const proxyDOMFunctionHandler: ProxyHandler<Function> = {
  apply: function (target, thisArg, argumentsList) {
    // Apply on individual elements
    for (const el of thisArg) {
      Reflect.apply(target, el, argumentsList);
    }
    return thisArg;
  },
}


