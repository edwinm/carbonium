// Used by classList
let classListNodelist;

export function $(arg, doc?) {
  const nodelist = (doc || document).querySelectorAll(arg);
  return new Proxy(nodelist, proxyHandler);
}

const proxyHandler = {
  get(target, prop) {
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
        return new Proxy(propValue, {
          apply: function (target, thisArg, argumentsList) {
            for (const el of classListNodelist) {
              Reflect.apply(target, el.classList, argumentsList);
            }
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
        return new Proxy(propValue, proxyHandler);
      }
    }

    // Get property or call function on DOM elements
    if (target.length > 0) {
      // Might be DOM element specific, like input.select(), so use first array element to get reference
      if (prop in target[0]) {
        const propValue = Reflect.get(target[0], prop);
        if (typeof propValue == 'function') {
          return new Proxy(propValue, proxyHandler);
        } else {
          return propValue;
        }
      }
    } else {
      // Empty list, targeted DOM element unknown, use HTMLElement and document.body
      if (prop in document.body) {
        const propValue = Reflect.get(document.body, prop);
        if (typeof propValue == 'function') {
          return new Proxy(propValue, proxyHandler);
        } else {
          return propValue;
        }
      }
    }

    // Default
    return Reflect.get(target, prop);
  },

  set(target, prop, value) {
    for (const el of target) {
      Reflect.set(el, prop, value);
    }
    return true;
  },

  apply: function (target, thisArg, argumentsList) {
    if (typeof target.name == 'string' && Array.prototype.hasOwnProperty(target.name)) {
      const ret = Reflect.apply(target, thisArg, argumentsList);
      // forEach returns same array
      const newTarget = typeof ret != 'undefined' ? ret : thisArg
      return new Proxy(newTarget, proxyHandler);
    } else {
      // Apply on individual elements
      for (const el of thisArg) {
        Reflect.apply(target, el, argumentsList);
      }
      return thisArg;
    }
  },
};


