![test](https://github.com/edwinm/carbonium/workflows/Test/badge.svg) [![Coverage Status](https://coveralls.io/repos/github/edwinm/carbonium/badge.svg?branch=master)](https://coveralls.io/github/edwinm/carbonium?branch=master) [![CodeFactor](https://www.codefactor.io/repository/github/edwinm/carbonium/badge)](https://www.codefactor.io/repository/github/edwinm/carbonium) [![Size](https://img.shields.io/github/size/edwinm/carbonium/dist/bundle.min.js)](https://github.com/edwinm/carbonium/blob/master/dist/bundle.min.js) [![npm version](https://badge.fury.io/js/carbonium.svg)](https://www.npmjs.com/package/carbonium) [![GitHub](https://img.shields.io/github/license/edwinm/carbonium.svg)](https://github.com/edwinm/carbonium/blob/master/LICENSE)

# carbonium

> One kilobyte library for easy manipulation of the DOM

With carbonium, you can call `$(selector)` and the result can be accessed as both an element and an array of matched elements.
Operations on the result as an element will be applied to all matched elements.

## Examples

To set the `left` CSS property of all elements with the class `indent` to 40 pixels:

```javascript
$(".indent").style.left = "40px";
```

To add the class `important` to all div's with "priority" as content:

```javascript
$("div")
  .filter((el) => el.textContent == "priority")
  .classList.add("important");
```

You can use carbonium to create elements:

```javascript
const error = $("<div class='error'>An error has occured!</div>")[0];
```

## Installation

```bash
npm install --save-dev carbonium
```

Now you can import carbonium:

```javascript
import { $ } from "carbonium";
```

If you don't want to install or use a bundler like webpack or rollup.js, you can import carbonium like this:

```javascript
const { $ } = await import(
  "https://cdn.jsdelivr.net/npm/carbonium/dist/bundle.min.js"
);
```

## API

### `$(selector [, document])`

**`selector: string`** - Selector to select elements

**`document: object` (optional)** - Document or element in which to apply the selector

### `$(html [, document])`

**`html: string`** - HTML of element to create

**`document: object` (optional)** - Document or element in which to apply the selector

Returns an array of the matched elements, which can also be accessed as a single element.

## Typescript

Carbonium is written in TypeScript and provides all typings.
You can use generics to declare a specific type of element,
for example `HTMLInputElement` to make the `disabled` property available:

```typescript
$<HTMLInputElement>("input, select, button").disabled = true;
```

## Why?

Most frameworks are quite bulky and are bad for performance, both when loading a site and when doing DOM operations ([1](https://css-tricks.com/radeventlistener-a-tale-of-client-side-framework-performance/)).

On the other side, using native DOM and writing `document.querySelectorAll(selector)` each time you want to do some DOM operations will become tedious.
You can write your own helper function, but that only takes part of the pain away.

Carbonium seeks to find the sweet spot between using a framework and using the native DOM.

## jQuery

Isn't this just jQuery and isn't that obsolete and bad practice?

No. Carbonium doesn't have the disadvantages of jQuery:

1. Carbonium is very small: just around one kilobyte.
2. There's no new API to learn, carbonium only provides standard DOM API's.

## Name

Carbonium is the Latin name for carbon. Carbon has two forms (allotropes): graphite and diamond.
Just like this library, in which the result presents itself both as one element and as a list of elements.

## License

Copyright 2020 [Edwin Martin](https://bitstorm.org/) and released under the MIT license.
