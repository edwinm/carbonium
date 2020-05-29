// Check https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol/species
const array = [];

// Used by classList
let currentNodelist;

export function $(arg, doc?) {
  currentNodelist = (doc || document).querySelectorAll(arg);
  return new Proxy(currentNodelist, proxyHandler);
}

const proxyHandler = {
  get(target, prop) {
    console.log('>> get', target, prop, `(${typeof prop})`);

    // Return iterator when asked for iterator
    if (prop == Symbol.iterator) {
      return function* () {
        for (let i = 0; i < target.length; i++) {
          yield target[i];
        }
      }
    }

    if (prop == 'classList') {
      currentNodelist = target;
      const propValue = Reflect.get(document.body, prop);
      return new Proxy(propValue, proxyHandler);
    }

    // add, contains, remove…
    if (target instanceof DOMTokenList) {
      const propValue = Reflect.get(document.body.classList, prop);

      if (typeof propValue == 'function') {
        return new Proxy(propValue, {
          apply: function (target, thisArg, argumentsList) {
            for (const el of currentNodelist) {
              Reflect.apply(target, el.classList, argumentsList);
            }
            return new Proxy(currentNodelist, proxyHandler);
          }
        })
      } else {
        return propValue;
      }
    }


    // Are we dealing with an Array function?
    if (Array.prototype.hasOwnProperty(prop)) {
      const propValue = Reflect.get(array, prop);
      console.log('Array prop', propValue);
      if (typeof propValue == 'function') {
        return new Proxy(propValue, proxyHandler);
      }
    }

    // Are we dealing with an DOM property or function?
    // TODO document.body might be too restrictive
    if (prop in HTMLElement.prototype) {
      const propValue = Reflect.get(document.body, prop);
      console.log('DOM prop', propValue);

      if (typeof propValue == 'function') {
        return new Proxy(propValue, proxyHandler);
      } else {
        return propValue;
      }
    }

    // Are we dealing with length property?
    if (prop == 'length') {
      console.log('length', target.length);
      return target.length;
    }

    return Reflect.get(target, prop);
  },

  set(target, prop, value) {
    console.log('>> set', target, prop, value);
    for (const el of target) {
      Reflect.set(el, prop, value);
    }
    return true;
  },

  apply: function (target, thisArg, argumentsList) {
    console.log('>> apply', target, thisArg, argumentsList);
    if (typeof target.name == 'string' && Array.prototype.hasOwnProperty(target.name)) {
      console.log('Array method', target, thisArg, argumentsList);
      const ret = Reflect.apply(target, thisArg, argumentsList);
      // forEach returns same array
      const newTarget = typeof ret != 'undefined' ? ret : thisArg
      return new Proxy(newTarget, proxyHandler);
    } else {
      console.log('DOM method', target, thisArg, argumentsList);
      // Apply on individual elements
      for (const el of thisArg) {
        Reflect.apply(target, el, argumentsList);
      }
      return thisArg;
    }
  },
};


