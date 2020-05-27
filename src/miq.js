/// <reference path="miq.d.ts" />
/**!
 @preserve miq 1.15.0
 @copyright 2019 Edwin Martin
 @see {@link http://www.bitstorm.org/javascript/miq/}
 @license MIT
 */

export default $;

/**
 * Miq, the micro DOM library
 */
/** @type {function(...*):*} */
const miqx = function (arg, doc) {
  doc = doc && doc.first || doc || document;

  // $(function() {...})
  if (typeof arg == 'function') {
    if (doc.readyState == 'loading') {
      doc.addEventListener('DOMContentLoaded', arg);
    } else {
      arg();
    }
  } else {
    var ret = Object.create($.fn), match;
    ret.length = 0;

    // $([domObject]) or $(miqObject)
    if (typeof arg == 'object') {
      if ('length' in arg) {
        arg.forEach(function (a) {
          ret.push(a)
        });

        // $(domObject)
      } else {
        ret.push(arg);
      }

      // $()
    } else if (!arg) {
      ret.push(doc.createDocumentFragment());

      // $('<div>')
    } else if ((match = arg.match(/<(.+)>/))) {
      ret.push(doc.createElement(match[1]));

      // $('div.widget')
    } else {
      ret = $(doc.querySelectorAll(arg));
    }

    return ret;
  }
};

$.fn = Object.create(Array.prototype, {
  first: {
    get: function () {
      return this[0];
    },
  },

  eq: {
    value: function (i) {
      return $(this[i || 0]);
    },
  },

  on: {
    value: function (evt, fn) {
      for (var i = 0; i < this.length; i++) {
        this[i].addEventListener(evt, fn);
      }
      return this;
    },
  },

  off: {
    value: function (evt, fn) {
      for (var i = 0; i < this.length; i++) {
        this[i].removeEventListener(evt, fn);
      }
      return this;
    },
  },

  addClass: {
    value: function (cls) {
      for (var i = 0; i < this.length; i++) {
        if (!$.fn.hasClass.call({ first: this[i] }, cls)) {
          this[i].className += ' ' + cls;
        }
      }
      return this;
    },
  },

  removeClass: {
    value: function (cls) {
      for (var i = 0; i < this.length; i++) {
        this[i].className = this[i].className.replace(cls, '');
      }
      return this;
    },
  },

  hasClass: {
    value: function (cls) {
      return this.first.className != '' && new RegExp('\\b' + cls + '\\b').test(this.first.className);
    },
  },

  prop: {
    value: function (property, value) {
      if (typeof value == 'undefined') {
        return this.first[property];
      } else {
        for (var i = 0; i < this.length; i++) {
          this[i][property] = value;
        }
        return this;
      }
    },
  },

  attr: {
    value: function (property, value) {
      if (typeof value == 'undefined') {
        return this.first.getAttribute(property);
      } else {
        for (var i = 0; i < this.length; i++) {
          this[i].setAttribute(property, value);
        }
        return this;
      }
    },
  },

  removeAttr: {
    value: function (property) {
      for (var i = 0; i < this.length; i++) {
        this[i].removeAttribute(property);
      }
      return this;
    },
  },

  val: {
    value: function (value) {
      var el = this.first;
      var prop = 'value';

      switch (el.tagName) {
        case 'SELECT':
          prop = 'selectedIndex';
          break;
        case 'OPTION':
          prop = 'selected';
          break;
        case 'INPUT':
          if (el.type == 'checkbox' || el.type == 'radio') {
            prop = 'checked';
          }
          break;
      }

      return this.prop(prop, value);
    },
  },

  append: {
    value: function (value) {
      var t = this, v = $(value), len = v.length;

      for (var i = 0; i < len; i++) {
        t.first.appendChild(v[i].first || v[i]);
      }
      return this;
    },
  },

  before: {
    value: function (value) {
      this.first.parentElement.insertBefore($().append(value).first, this.first);
      return this;
    },
  },

  parent: {
    value: function () {
      return $(this.first.parentNode);
    },
  },

  clone: {
    value: function () {
      return $(this.first.cloneNode(true));
    },
  },

  remove: {
    value: function () {
      for (var i = 0; i < this.length; i++) {
        this[i].parentNode.removeChild(this[i]);
      }
      return this;
    },
  },

  find: {
    value: function (value) {
      return $(value, this.first);
    },
  },

  closest: {
    value: function (selector) {
      var el = this.first;
      do {
        if (el[$.matches](selector)) {
          return $(el);
        }
      } while (el = el.parentElement);
      return null;
    },
  },

  is: {
    value: function (selector) {
      return $(this.filter(function (el) {
        return el[$.matches](selector);
      }));
    },
  },

  css: {
    value: function (property, value) {
      if (typeof value == 'undefined') {
        return this.first.style[property];
      } else {
        for (var i = 0; i < this.length; i++) {
          this[i].style[property] = value;
        }
        return this;
      }
    },
  },

  html: {
    value: function (value) {
      return this.prop('innerHTML', value);
    },
  },

  text: {
    value: function (value) {
      return this.prop('textContent', value);
    },
  },
});

$.miq = '1.15.0';

$.ajaxCallback = function (url, resolve, reject, options) {
  var xmlHttp = new XMLHttpRequest();

  xmlHttp.onreadystatechange = function () {
    var result;
    if (xmlHttp.readyState == 4) {
      if (xmlHttp.status == 200) {
        switch (options.dataType) {
          case 'xml':
            result = xmlHttp.responseXML;
            break;
          case 'json':
            result = JSON.parse(xmlHttp.responseText);
            break;
          default:
            result = xmlHttp.responseText;
            break;
        }
        resolve(result);
      } else if (reject) {
        reject('Ajax error: ' + xmlHttp.status);
      }
    }
  };
  xmlHttp.open(options.method || 'GET', url, true);
  if (options.headers) {
    for (var key in options.headers) {
      xmlHttp.setRequestHeader(key, options.headers[key]);
    }
  }
  xmlHttp.send(options.data || '');
};

$.ajax = function (url, options) {
  return new Promise(function (resolve, reject) {
    $.ajaxCallback(url, resolve, reject, options);
  });
};

$.matches = ['matches', 'webkitMatchesSelector', 'mozMatchesSelector', 'msMatchesSelector'].filter(function (sel) {
  return sel in document.documentElement;
})[0];

self.$ = $;
