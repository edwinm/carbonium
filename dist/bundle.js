/**
 Carbonium 1.1.0
 @copyright 2020 Edwin Martin
 @license MIT
 */
function $(selectors, parentNode) {
    let nodelist;
    // If the first parameter starts with "<", create a DOM node
    if (selectors[0] == "<") {
        nodelist = [
            new DOMParser().parseFromString(selectors, "text/html").body.firstChild,
        ];
    }
    else {
        // Else, do querySelectorAll
        nodelist = (parentNode || document).querySelectorAll(selectors);
    }
    // Wrap it in a Proxy
    return new Proxy(nodelist, proxyHandler);
}
// Used by style, classList and relList
// When setting one of these, remember the elements to apply to
let currentListNodelist;
let propList;
const proxyHandler = {
    get(target, prop) {
        let propValue = null;
        // Return iterator when asked for iterator, only used in ES2015+
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
            // Matched elements can be a list of any element or an empty list
            // Use getter of, for example, document.body.style
            const propValue = Reflect.get(document.body, prop);
            return new Proxy(propValue, proxyHandler);
        }
        // style.setProperty, getPropertyValue…, classList.add, contains, remove…, relList…
        if (target instanceof CSSStyleDeclaration ||
            target instanceof DOMTokenList) {
            // Matched elements can be a list of any element or an empty list
            // Use getter of, for example, document.body.style.color
            propValue = Reflect.get(document.body[propList], prop);
            // When getter is a function, apply it to all matched elements
            if (typeof propValue == "function") {
                return new Proxy(propValue, {
                    apply: function (target, thisArg, argumentsList) {
                        currentListNodelist.forEach((el) => {
                            Reflect.apply(target, el[propList], argumentsList);
                        });
                        return new Proxy(currentListNodelist, proxyHandler);
                    },
                });
            }
            else {
                return propValue;
            }
        }
        // Are we dealing with an Array function like forEach, map and filter?
        if (Array.prototype.hasOwnProperty(prop)) {
            const propValue = Reflect.get(Array.prototype, prop);
            if (typeof propValue == "function") {
                return new Proxy(propValue, {
                    apply: function (target, thisArg, argumentsList) {
                        const ret = Reflect.apply(target, thisArg, argumentsList);
                        // When function returns undefined (like forEach),
                        // return all matched elements, so calls can be chained
                        // For example forEach(…).setAttribute(…)
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
        }
        else {
            // Empty list, targeted DOM element unknown,
            // use getter of document.body
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
            }
            else {
                return propValue;
            }
        }
        // Default
        return Reflect.get(target, prop);
    },
    // DOM property is set
    set(target, prop, value) {
        if ("forEach" in target && !(target instanceof CSSStyleDeclaration)) {
            target.forEach((el) => {
                Reflect.set(el, prop, value);
            });
        }
        else {
            Reflect.set(target, prop, value);
        }
        return true;
    },
};

export { $ };
//# sourceMappingURL=bundle.js.map
