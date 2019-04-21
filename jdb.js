/*!
 * JdB.js v1.24.1 - https://www.we-rl.xyz/ depend to
 * jQuery v3.2.1+ - https://jquery.com/
 * 
 * Includes Sizzle.js - https://sizzlejs.com/
 *
 * Copyright JS Foundation and other contributors
 * Released under the MIT license - https://jquery.org/license
 *
 * Date: 2018-07-28T15:00Z - JdB.js
 * Date: 2017-03-20T18:59Z - jQuery
 */
/*!
 Copyright (C) 2017 JdB.js by Jose Ngoyi <jdb[at]wetrafa[dot]xyz>.

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
*/

(function(root, factory) {
  if (typeof define === "function" && define.amd) {
    // AMD. Register as an anonymous module.
    define([], factory(root));
  } else if (typeof exports === "object") {
    // Node. Does not work with strict CommonJS, but
    // only CommonJS-like environments that support module.exports,
    // like Node.
    module.exports = factory(root);
  } else {
    // Browser globals (root is window)
    root.jdb = factory(root); }
})(typeof global !== "undefined" ? global : this.window || this.global, function (root) {
  "use strict";

  if (!jdb || !window.jdb || (jdb &&
    typeof jdb !== "object")) {
    var jdb = window.jdb = {};
  }
  
  var jdb = window.jdb = {
    check: {
      jQuery: function() {
        return "jQuery" in window || jdb.typeOf(jQuery) === "function";
      },
      localStorage: function() {
        return "localStorage" in window && window.localStorage !== null;
      },
      sessionStorage: function() {
        return "sessionStorage" in window && window.sessionStorage !== null;
      }
    },

    /**
     * Check the presence of jQuery in the DOM.
     * @public
     * @type {Function}
     * @returns {Object}
     **/
    isjQueryThere: function() {
      if (!this.check.jQuery()) {
        console.warn("jQuery is not loaded or defined. JdB.js can\'t work without it.");
      }
      return !!jQuery;
    },

    /**
     * Get the body or head DOM.
     * @public
     * @type {Object}
     */
    head: document.head || document.getElementsByTagName("head")[0],
    body: document.body || document.getElementsByTagName("body")[0],

    /**
     * @public
     * @type {Function}
     * @returns {string}
     **/
    protocol: (function(){
      return document.location.protocol === "https:" ? "https:" : "http:";
      // if (window.location.protocol !== "http:" || "https:")
      //   return jdb.any("https:", "http:");
    })(),

    /**
     * Load new file to append on head tag.
     * @public
     * @type {Function}
     * @param {string} filelink File(s) link(s).
        The extension is optional for url.
     * @param {string} filetype Language of file: js or css.
     * @param {string} [javascript] If file is a javascript.
     * @param {Function} callback Callback function.
     */
    loadFile: function (filelink, filetype, javascript, callback) {
      var filelinks = this.pushClassesInArray(filelink),
          filength = filelinks.length,
          fileref, /* fileid, */ i;
          
      if (!filetype) {
        filetype = filelink.split(".").pop();
      }
      for (i = 0; i < filength; i++) {
        if (filetype == "js") {
          // If file is a javascript file.
          var ext = filelinks[i].substring(filelinks[i].lastIndexOf("/") + 1, filelinks[i].lastIndexOf("."));
          fileref = this.createElement("script");
          if (javascript) { 
            fileref.setAttribute("type", "text/javascript");
          }
          if (fileref.readyState) { // for IE
            fileref.onreadystatechange = function() {
              if (fileref.readyState == "loaded" ||
                  fileref.readyState == "complete") {
                fileref.onreadystatechange = null;
                if (jdb.typeOf(callback) === "function") {
                  callback();
                }
              }
            };
          } else { // Others browser.
            fileref.onload = function (event) {
              if (jdb.typeOf(callback) === "function") {
                callback(event);
              }
            };
          }
          if (ext.indexOf("js") > -1) {
            fileref.setAttribute("src", filelinks[i]);
          } else {
            fileref.setAttribute("src", filelinks[i] + ".js");
          }
        } else if (filetype == "css") {
          // If file is a style sheet.
          var ext = filelinks[i].substring(filelinks[i].lastIndexOf("/") + 1, filelinks[i].lastIndexOf("."));
          fileref = this.createElement("link");
          fileref.setAttribute("rel",  "stylesheet");
          fileref.setAttribute("type", "text/css");
          if (ext.indexOf("css") > -1) {
            fileref.setAttribute("href", filelinks[i]);
          } else {
            fileref.setAttribute("href", filelinks[i] + ".css");
          }
        }
        if (this.typeOf(fileref) !== "undefined") {
          this.head.appendChild(fileref);
          // fileid = filelinks[i].substring(filelink.lastIndexOf("/") + 1);
          // console.info("File " + fileid + " loaded successfully.");
        }
      }
    },

    /**
     * @public
     * @type {Function}
     * @param {*} value Value to put in an Array
     * @returns {Array} 
     */
    pushClassesInArray: function (value) {
      if (Array.isArray(value)) { return value; }
      if (this.typeOf(value) === "string") {
        return value.match(/[^\x20\t\r\n\f]+/g) || [];
      }
      return [];
    },

    /**
     * @public
     * @type {Function}
     * @param {*} value Value to put in an Array
     * @returns {Array} 
     */
    pushStringInArray: function (value) {
      var arr = arguments.length;
      if (Array.isArray(arguments)) {
        if (arr === 1) {
          return arguments;
        }
      }
      if (arr === 1) {
        return value.split(" ");
      }
      var arrayList = [], i;
      if (arguments) {
        for (i = 0; i < arr; i++) {
          arrayList.push(arguments[i]);
        }
      }
      return arrayList;
    },

    /**
     * Get the type of the value.
     * @public
     * @param {*} value
     * @returns {string}
     */
    typeOf: function (value) {
      if (Array.isArray(value)) {
        return "Array";
      } else if (value !== null && typeof value === "object" && !Array.isArray(value)) {
        return "object";
      } else {
        return typeof value;
      }
    },

    /**
     * Custom firebug console.
     * @public
     * @type {Function}
     * @param {*} obj "item" to display in the firebug console.
     * @param {string} [consoleMethod] The log method to use for the logging.
     */
    log: function (obj, consoleMethod) {
      if (window.console || window.console.firebug) {
        if (this.typeOf(consoleMethod) === "string" && this.typeOf(console[consoleMethod]) === "function") {
          console[consoleMethod](obj);
        } else { console.log(obj); }
      }
    },

    /**
     * Get all given arguments and
     * return the true argument.
     * @public
     * @type {Function}
     * @param {*} firstValue
     * @param {*} secondValue
     * @returns {*}
     */
    any: function (firstValue, secondValue) {
      return firstValue || secondValue;
    },

    /**
     * Shuffle an array or push string(s) 
     * argument in and return one value
     * @public
     * @type {Function}
     * @param {value}
     * @returns {*}
     */
    shuffle: function (value) {
      if (this.typeOf(value) === "string") {
        var i, arr = arguments.length;
        value = [];
        for (i = 0; i < arr; i++) {
          value.push(arguments[i]);
        }
      }
      for (var j, x, ii = value.length; ii; j = parseInt(Math.random() * ii),
        x = value[--ii], value[ii] = value[j], value[j] = x);
        return value.sort(function(){
          return 0.5 - Math.random();
        })[0];
    },

    /**
     * Create a random number between @min and @max.
     * @public
     * @type {Function}
     * @param {number} min The minimum number.
     * @param {number} max The maximum number.
     * @returns {number} The generated number between min and max.
     */
    random: function (min, max) {
      var value = Math.floor(Math.random() * (max - min + 1)) + min;
      return value;
    },

    /**
     * Get selected id and return HTML DOM for this one.
     * @public
     * @type {Function}
     * @param {?(string|Object)} id Selector: 
     * if the selector is a string, the function can be used in place of $ of jQuery
     * else if the selector is an object, the function can be use as the default javascript.
     * @returns {Object} DOM selector (jQuery or default javascript).
     */
    getElements: function (id) {
      return this.typeOf(id) == "object" ? id : $(id);
    },

    /**
     * Get the class list of an element.
     * @public
     * @type {Function}
     * @param {Object} selector Selector;
     * @returns {Object}
     */
    getClass: function (selector) {
      var elem = document.querySelector(selector);
      return elem.getAttribute("class") || "";
    },

    /**
     * Create an iframe and append it on the first selected element.
     * @public
     * @type {Function}
     * @param {string} selector Selector of the element where to append the iframe.
     * @param {?(string|Object)} url Link source of the iframe element.
     */
    loadIframe: function (selector, url, options) {
      var iframe = this.createElement("iframe"), delay;
      var parent = document.querySelector(selector);
      iframe.setAttribute("src", url);
      parent.appendChild(iframe);
      if (options.showOnload == true) {
        if (!this.isVisible(parent)) {
          delay = options.timeout ?
            options.timeout : 1000;
          setTimeout(function(){
            jdb.show(parent);
          }, delay);
        }
      }
    },

    /**
     * Get a value of an url parameter.
     * @public
     * @type {Function}
     * @param {string} name Parameter name.
     * @param {string} [url=window.location.href] Link of actual page.
     * @param {requestCallback} [callback] An existing function name or new function.
     * @returns {?string}
     */
    getUrlParam: function (name, url, callback) {
      var regex, param, results;
      if (!url) url = window.location.href;
      name = name.replace(/[\[\]]/g, "\\$&");
      regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)");
      results = regex.exec(url);
      if (!results) return null;
      if (!results[2]) return "";
      param = decodeURIComponent(results[2].replace(/\+/g, " "));
      if (this.typeOf(callback) === "function") {
        callback(param);
      }
      return param;
    },

    /**
     * Creates a new URL by appending or replacing the given query key and value.
     * Not supporting URL with username and password.
     * Parameters used: state name value type reload.
     * @public
     * @type {Function}
     * @param {Object} data The object containing all other parameters.
     * @param {requestCallback} [callback] An existing function name or new function.
     */
    uptodateUrlParam: function (data, callback) {
      var a, b, c, d, e, f, fn, invalideMsg = function() {
        throw "Invalide parameters: @jdb.uptodateUrlParam" +
          " must have at least two parameters.";
      };
      // Fallback for browser that don't support the history API.
      if (!("replaceState" in window.history)) { return; }
      if (this.typeOf(data) === "undefined") { return invalideMsg(); }
      if ($.isEmptyObject(data)) { return invalideMsg(); }

      data = data || {};
      // [state] can be "push" or "replace". Default is "push".
      if (!data.state) { data.state = "push"; }
      if (data.name) {
        data.name = (data.encode !== false) ?
          encodeURIComponent(data.name) : data.name;
      }
      if (data.value) {
        data.value = (data.encode !== false) ?
          encodeURIComponent(data.value) : data.value;
      }
      e = this.getUrlParam(data.name);
      a = window.location;

      if (a.search.indexOf(data.name) > -1) {
        b = new RegExp("[?&]" + a.search + "(=([^&#]*)|&|#|$)");
        c = b.exec(a.href);
      }

      if (data.type === "add") {
        d = a.search === "" ? "?" : "&";
        if (c || c !== null) {
          if (e === null) {
            fn = a.pathname + (d === "&" ? a.search : "") +
              d + data.name + "=" + data.value + a.hash;
          } else {
            fn = a.pathname + a.search.replace(e, data.value) + a.hash;
          }
          window.history[data.state + "State"](null, "", fn);
        } else {
          fn = a.pathname + (d === "&" ? a.search : "") +
               d + data.name + "=" + data.value + a.hash;
          window.history[data.state + "State"](null, "", fn);
        }
      } else if (data.type === "remove") {
        var e_ = a.search.indexOf(e + "&") > -1;
        var _e = a.search.indexOf("&" + data.name) > -1;
        var ii = _e ? ("&" + data.name + "=" + e) :
          e_ ? (data.name + "=" + e + "&") :
          e === "" ? (data.name) : (data.name + "=" + e);
        f = a.search.replace(ii, "");

        var o = f.length === 1; 
        o = o ? (f.indexOf("?") === 0) : !1;
        fn = a.pathname + (o ? "" : f) + a.hash;
        window.history[data.state + "State"](null, "", fn);
      }

      if (this.typeOf(callback) === "function") { callback(); }
      if (data.reload === true) {
        setTimeout(function(){
          a.reload();
        }, 200);
      }
    },

    updateUrlParam: function (data, callback) {
      this.uptodateUrlParam(data, callback);
    },

    /**
     * Crypt and decrypt text.
     * @public
     * @type {Function}
     * @param {string} xx Text to encrypt or decrypt.
     * @param {number} type 0 to decrypt.
     */
    encrypt: function (xx, type) {
      var a, b, c;
      if (type === 0) {
        a = decodeURIComponent(xx);
        b = unescape(a);
        c = atob(b);
      } else {
        a = btoa(xx);
        b = escape(a);
        c = encodeURIComponent(b);
      }
      return c;
    },

    /**
     * Get, Set or delete cookie.
     * @public
     * @type {Function}
     * @param {string} name Cookie name.
     * @param {string} value Cookie value (null to delete or undefined to get).
     * @param {Object} [options] Cookie option in {}
     * - expires (in days)
     * - domain
     * - path
     * @returns {?(string|Array)} value or true.
     */
    cookie: function (name, value, options) {
      if (this.typeOf(value) === "undefined") {
        var k, n, v, i, cookies = document.cookie.split(";");
        k = cookies.length;
        for (i = 0; i < k; i++) {
          n = $.trim(cookies[i].substr(0,cookies[i].indexOf("=")));
          v = cookies[i].substr(cookies[i].indexOf("=") +1);
          if (n === name) { return this.encrypt(v, 0); }
        }
      } else {
        options = options || {};
        if (!value) {
          value = "";
          options.expires = -365;
        } else {
          if (!options.encrypt || options.encrypt == true) {
            value = this.encrypt(value);
          }
        }
        if (options.expires) {
          var today = new Date();
          today.setDate(today.getDate() + options.expires);
          value += "; expires=" + today.toUTCString();
        }
        if (options.domain) { value += "; domain=" + options.domain; }
        if (options.path)   { value += "; path="   + options.path; }
        document.cookie = name + "=" + value;
      }
    },

    storage: {
      /** 
       * Save data to [type]Storage.
       * @public
       * @type {Function}
       * @param {string} [type] Type of storage
       * @param {string} key
       * @param {(Array|Object|string)} value 
       */
      set: function (type, key, value) {
        // jdb.set("name", {a:[1,2,3], b:"ok"});
        if (!key || !value) { return; }
        if (!type) { type = "local"; }
        if (jdb.typeOf(value) === "object") {
          value = JSON.stringify(value);
        }
        window[type + "Storage"].setItem(key, value);
      },

      /** 
       * Read data from [type]Storage.
       * @public
       * @type {Function}
       * @param {string} [type] Type of storage
       * @param {string} key
       * @returns {*}
       */
      get: function (type, key) {
        if (!type) { type = "local"; }
        var value = window[type + "Storage"].getItem(key);
    
        if (!value) { return; }
        if (value === null) { return false; } 
        if (value[0] === "{" || value[0] == "[") {
          value = JSON.parse(value);
        }
        return value;
      },

      /** 
       * Remove saved data from [type]Storage.
       * @public
       * @type {Function}
       * @param {string} [type] Type of storage
       * @param {string} key
       */
      remove: function (type, key) {
        if (!type) { type = "local"; }
        window[type + "Storage"].removeItem(key);
      },

      /** 
       * Set, get or remove data.
       * @public
       * @type {Function}
       * @param {string} [type] Type of storage
       */
      removeAll: function (type) {
        if (!type) { type = "session"; }
        window[type + "Storage"].clear();
      }
    },

    /**
     * Get date bsed on the given date.
     * @public
     * @type {Function}
     * @param {*} time
     * @returns {string}
     **/
    getDate: function (time) {
      var t, d, mo, y, h, m, s, months, date, offset;
      date = new Date(time);
      offset = (new Date().getTimezoneOffset() / 60) * -1;
      t = new Date(date.getTime() + offset);
      months = ["Janvier", "Février", "Mars",
        "Avril", "Mai", "Juin", "Juillet", "Août",
        "Septembre", "Octobre", "Novembre", "Decembre"];
      d = t.getDate();
      mo = months[t.getMonth()];
      y = t.getFullYear();
      h = t.getHours();
      m = t.getMinutes();
      s = t.getSeconds();
      return {
        date: d + " " + mo + " " + y,
        time: h + "h " + m + "min " + s + "sec",
        full: d + " " + mo + " " + y + " à " + h + "h " + m + "min " + s + "sec",
        getDay: d, getMonths: mo, getFullYear: y, getHours: h, getMinutes: m, getSeconds: s
      };
    },

    /**
     * Get the function argument as defined.
     * @public
     * @type {Function}
     * @param {Function} func Function to get argument(s)
     * @returns {Array} Array container of argument(s)
     */
    getArgs: function (func) {
      // First match everything inside the function argument parens.
      var args = func.toString().match(/function\s.*?\(([^)]*)\)/)[1];
     
      // Split the arguments string into an array comma delimited.
      return args.split(",").map(function(arg) {
        // Ensure no inline comments are parsed and trim the whitespace.
        return arg.replace(/\/\*.*\*\//, "").trim();
      }).filter(function(arg) {
        // Ensure no undefined values are added.
        return arg;
      });
    },

    /**
     * Get value of selected property.
     * @public
     * @type {Function}
     * @param {Object} element Selector.
     * @param {string} style Property.
     */
    getStyleValue: function (selector, property) {
      var element = document.querySelector(selector);
      if (element && element.nodeType !== 1) {
        return [];
      }
      // NOTE: 1 DOM access here
      var val, css = window.getComputedStyle(element, null);
      if (property)
        val = css[property] || css.getPropertyValue(property);
        return val;
    },

    /**
     * Prevents the default functionality.
     * This is strictly for old IE.
     * @public
     * @type {Function}
     * @param {event} event
     * @returns {Object}
     */
    preventDefaults: function (event) {
      if (event.preventDefault) {
        if (event.stopImmediatePropagation) {
          event.stopImmediatePropagation();
        }
        event.preventDefault();
        event.stopPropagation();
        return false;
      } else {
        event.returnValue = false;
      }
    },

    /**
     * Creates an HTML element without a specified class name.
     * @public
     * @type {Function}
     * @param {string} elementName The node type.
     * @returns {Element} The created element.
     */
    createElement: function (elementName) {
      return document.createElement(elementName);
    },

    /**
     * Creates an HTML element of a specified type with a specified class name.
     * @public
     * @type {Function}
     * @param {string} type The node type.
     * @param {string} className The class name to use.
     * @returns {Element} The created element.
     */
    createElementWithClassName: function (type, className) {
      var element = this.createElement(type);
      element.className = className;
      return element;
    },

    /**
     * Add html text to selected element.
     * @public
     * @type {Function}
     * @param {string} selector Selector.
     * @param {string} content Text.
     */
    html: function (selector, content) {
      return $(selector).html(content);
    },

    /**
     * Replace &, <, >, ", and ' characters with their special entities.
     * @public
     * @type {Function}
     * @param {*} original The original text to escape.
     * @param {number} [_unescape] 0 to unescape.
     * @returns {string} The string with all the characters mentioned above, replaced.
     */
    escapeHTML: function (original, _unescape) {
      var computedText;
      if (_unescape === 0) {
        computedText = original.replace(/&amp;/g, "&")
          .replace(/&lt;/g, "<").replace(/&gt;/g, ">")
          .replace(/&quot;/g, "\"").replace(/&#39;/g, "\'");
      } else {
        computedText = original.replace(/&/g, "&amp;")
          .replace(/</g, "&lt;").replace(/>/g, "&gt;")
          .replace(/\"/g, "&quot;").replace(/\'/g, "&#39;");
      }
      return computedText;
    },

    /**
     * Replace '&amp;', &lt;', '&gt;', '&quot;' and '&#39;' special entities with their HTML characters.
     * @public
     * @type {Function}
     * @param {*} original The original text to unescape.
     * @param {number} [_escape] 0 to escape.
     * @returns {string} The string with all the characters mentioned above, replaced.
     */
    unescapeHTML: function (original, _escape) {
      var computedText;
      if (_escape === 0) {
        computedText = original.replace(/&/g, "&amp;")
          .replace(/</g, "&lt;").replace(/>/g, "&gt;")
          .replace(/\"/g, "&quot;").replace(/\'/g, "&#39;");
      } else {
        computedText = original.replace(/&amp;/g, "&")
          .replace(/&lt;/g, "<").replace(/&gt;/g, ">")
          .replace(/&quot;/g, "\"").replace(/&#39;/g, "\'");
      }
      return computedText;
    },

    /**
     * Scroll to selected element.
     * @public
     * @type {Function}
     * @param {string} selector Selector.
     * @param {requestCallback} [callback] Callback.
     */
    targetTo: function (selector, callback) {
      $("html, body").animate({ 
        scrollTop: $(selector).offset().top
      }, "slow", function() {
        if (jdb.typeOf(callback) === "function") {
          callback();
        }
      });
    },

    /**
     * Scroll to the top of page.
     * @public
     * @type {Function}
     * @param {?(number|string)} [speed="slow"] Scroll speed.
     * @param {requestCallback} [callback] Callback.
     * @returns {boolean}
     */
    goUp: function (speed, callback) {
      if (!speed) { speed = "slow"; }
      $("html, body").animate({
        scrollTop: 0
      }, speed, function() {
        if (jdb.typeOf(callback) === "function") {
          callback();
        }
      });
      return false;
    },

    goBack: function() {
      window.history.back();
    },

    noBack: function() {
      window.history.forward();
    },

    /**
     * @public
     * @type {Function}
     * @param {string} selector Selector
     * */
    hide: function (selector) {
      return $(selector).hide();
    },

    /**
     * @public
     * @type {Function}
     * @param {string} selector Selector
     * @param {string} [a] e.g.: 0
     */
    show: function (selector, a) {
      if (a) { this.hide(selector); }
      return $(selector).show();
    },
    
    /**
     * Listens to on events.
     * @public
     * @type {Function}
     * @param {string} type Type of event.
     * @param {(Object|string)} Element
     * @param {fn} Function to call when event trigger.
     */
    addEvent: function (element, event, fn) {
      element = this.typeOf(element) === "object" ?
        element : document.querySelector(element);
      "addEventListener" in window ?
        element.addEventListener(event, fn, false) :
        element.attachEvent("on" + event.toLowerCase(), fn);
    },

    /**
     * Listens to multiple events.
     * @public
     * @type {Function}
     * @param {string} type Type of event.
     * @param {(Object|string)} Element
     * @param {fn} Function to call when event trigger.
     */
    addMultipleEvent: function (element, events, fn) {
      events = this.pushStringInArray(events);
      var i, e_lenght = events.length;
      for (var i = 0; i < e_lenght; i++) {
        element.addEventListener(events[i], fn, false);
      }
    },

    /**
     * Add one or multiple style to selected element.
     * @public
     * @type {Function}
     * @param {string} selector Selector.
     * @param {?(string|Object)} prop Property.
     * @param {string} value Value to add. If empty, return the property value.
     */
    addStyle: function (selector, prop, value) {
      if (this.typeOf(value) === "undefined") {
        return this.getStyleValue(selector, prop);
      }
      if (this.typeOf(prop) === "Object") {
        return $(selector).css(prop);
      } else if (this.typeOf(prop) === "string") {
        return $(selector).css(prop, value);
      }
    },

    /**
     * Add style element to head.
     * @public
     * @type {Function}
     * @param {string} css New style to add to the HEAD element.
     * @param {*} [returnValue]
     * @returns {*}
     */
    injectStyle: function (css, returnValue) {
      if (this.typeOf(document) === "undefined") {
        return returnValue;
      }
      css = css || "";
      var style = this.createElement("style");
      style.type = "text/css";
      this.head.appendChild(style);
      
      if (style.styleSheet) {
        style.styleSheet.cssText = css;
      } else {
        style.appendChild(document.createTextNode(css));
      }
      return returnValue;
    },

    /**
     * Toggle show selected element.
     * @public
     * @type {Function}
     * @param {string} selector Selector.
     */
    toggleShow: function (selector) {
      var i, x = $(selector),
          xlength = x.length;
      for (i = 0; i < xlength; i++) {
        if (x[i].style.display == "none") {
          this.addStyle(x[i], "display", "block");
        } else {
          this.addStyle(x[i], "display", "none");
        }
      }
    },
    
    /**
     * Add class(es) from selected element.
     * @public
     * @type {Function}
     * @param {*} selector Selector.
     * @param {?(string|Object)} name Class(es) name.
     */
    addClass: function (selector, name) {
      return $(selector).addClass(name);
    },
    
    /**
     * Remove class(es) to selected element.
     * @public
     * @type {Function}
     * @param {*} selector Selector.
     * @param {?(string|Object)} name Class(es) name.
     */
    removeClass: function (selector, name) {
      return $(selector).removeClass(name);
    },

    /**
     * Toggle one class or between 2 classes.
     * @public
     * @type {Function}
     * @param {*} selector Selector.
     * @param {string} c1 First class name.
     * @param {string} [c2] Second class name.
     */
    toggleClass: function (selector, c1, c2) {
      var $el = $(selector);
      this.toggleClassElements($el, c1, c2);
    },
    
    /**
     * Toggle one class or between 2 classes.
     * @public
     * @type {Function}
     * @param {Object} elements Selector.
     * @param {string} c1 First class name.
     * @param {string} [c2] Second class name.
     */
    toggleClassElements: function (elements, c1, c2) {
      var i, l = elements.length;
      for (i = 0; i < l; i++) {
        this.toggleClassElement(elements[i], c1, c2);
      }
    },

    /**
     * Toggle one class or between 2 classes.
     * @public
     * @type {Function}
     * @param {Object} element Selector.
     * @param {string} c1 First class name.
     * @param {string} [c2] Second class name.
     */
    toggleClassElement: function (element, c1, c2) {
      var t1, t2, t1Arr, t2Arr, j, k, arr, allPresent;
      t1 = (c1 || "");
      t2 = (c2 || "");
      t1Arr = t1.split(/\s+/);
      t2Arr = t2.split(/\s+/);
      arr = element.className.split(/\s+/);
      if (t2Arr.length === 0) {
        allPresent = true;
        k = t1Arr.length;
        for (j = 0; j < k; j++) {
          if (arr.indexOf(t1Arr[j]) == -1) {
            allPresent = false;
          }
        }
        if (allPresent) {
          this.removeClass(element, t1);
        } else {
          this.addClass(element, t1);
        }
      } else {
        allPresent = true;
        k = t1Arr.length;
        for (j = 0; j < k; j++) {
          if (arr.indexOf(t1Arr[j]) == -1) {
            allPresent = false;
          }
        }
        if (allPresent) {
          this.removeClass(element, t1);
          this.addClass(element, t2);
        } else {
          this.removeClass(element, t2);
          this.addClass(element, t1);
        }
      }
    },

    /**
     * Filter lists and tables.
     * @public
     * @type {Function}
     * @param {string} id Elements container.
     * @param {string} selector Element class to filter.
     * @param {Object} filter Get the filter input value.
     */
    filterHTML: function (id, selector, filter, nofound) {
      var a, b, c, i, ii, iii, hit, k;
      a = this.getElements(id);
      k = a.length;
      for (i = 0; i < k; i++) {
        b = this.getElements(selector);
        var m = b.length;
        for (ii = 0; ii < m; ii++) {
          hit = 0;
          if (b[ii].innerHTML.toUpperCase().indexOf(filter.toUpperCase()) > -1) {
            hit = 1;
          }
          c = b[ii].getElementsByTagName("*");
          var n = c.length;
          for (iii = 0; iii < n; iii++) {
            if (c[iii].innerHTML.toUpperCase().indexOf(filter.toUpperCase()) > -1) {
              hit = 1;
            }
          }
          if (hit == 1) { b[ii].style.display = "";
          } else { b[ii].style.display = "none"; }
        }
      }
      // A callback if there isn't matched result.
      // Added in v2.24.1
      if (this.typeOf(nofound) === "function") {
        nofound(a.filter(":visible").length);
      }
    },

    /**
     * Sort lists, tables and other alphabetically.
     * @public
     * @type {Function}
     * @param {string} id Elements container.
     * @param {string} selector Elements class to sort.
     * @param {string} [sortvalue] <Use: table>tr>td:nth-child(1)>
     */
    sortHTML: function (id, selector, sortvalue) {
      var a, b, i, ii, y, bytt, v1, v2, cc, j, k;
      a = this.getElements(id);
      k = a.length;
      for (i = 0; i < k; i++) {
        for (j = 0; j < 2; j++) {
          cc = 0;
          y = 1;
          while (y == 1) {
            y = 0;
            b = a[i].querySelectorAll(selector);
            var m = (b.length - 1);
            for (ii = 0; ii < m; ii++) {
              bytt = 0;
              if (sortvalue) {
                v1 = b[ii].querySelector(sortvalue).innerHTML.toLowerCase();
                v2 = b[ii + 1].querySelector(sortvalue).innerHTML.toLowerCase();
              } else {
                v1 = b[ii].innerHTML.toLowerCase();
                v2 = b[ii + 1].innerHTML.toLowerCase();
              }
              if ((j === 0 && (v1 > v2)) || (j == 1 && (v1 < v2))) {
                bytt = 1;
                break;
              }
            }
            if (bytt == 1) {
              b[ii].parentNode.insertBefore(b[ii + 1], b[ii]);
              y = 1;
              cc++;
            }
          }
          if (cc > 0) {break;}
        }
      }
    },

    /**
     * Next button: this().next()
     * Previous button: this().previous()
     * @public
     * @type {Function}
     * @param {string} selector Selector of elements to slide.
     * @param {number} [ms] Interval in milliseconds. If 0 disable auto-start.
     * @param {requestCallback} [callback] Callback.
     * @returns {Object}
     */
    slideshow: function (selector, ms, callback) {
      var i, ss, x = this.getElements(selector), l = x.length;
      ss = {};
      ss.current = 1;
      ss.x = x;
      ss.ondisplaychange = callback;
      if (!isNaN(ms) || ms === 0) {
        ss.milliseconds = ms;
      } else { ss.milliseconds = 1000; }
    
      ss.start = function() {
        ss.display(ss.current);
        if (ss.ondisplaychange) {ss.ondisplaychange();}
        if (ss.milliseconds > 0) {
          window.clearTimeout(ss.timeout);
          ss.timeout = window.setTimeout(ss.next, ss.milliseconds);
        }
      };
      ss.next = function() {
        ss.current += 1;
        if (ss.current > ss.x.length) {
          ss.current = 1;
        } ss.start();
      };
      ss.previous = function() {
        ss.current -= 1;
        if (ss.current < 1) {
          ss.current = ss.x.length;
        } ss.start();
      };
      ss.display = function (n) {
        jdb.addStyle(ss.x, "display", "none");
        jdb.addStyle(ss.x[n - 1], "display", "block");
      };
      ss.start();
      return ss;
    },
    
    /**
     * Including HTML is done by using a Jjdb-include-html attribute.
     * @public
     * @type {Function}
     * @param {requestCallback} [callback] Callback.
     */
    includeHTML: function (callback) {
      var z, i, k, elmnt, file, xhttp;
      z = document.getElementsByTagName("*");
      k = z.length;
      for (i = 0; i < k; i++) {
        elmnt = z[i];
        file = elmnt.getAttribute("jdb-include-html");
        if (file) {
          xhttp = new XMLHttpRequest();
          xhttp.onreadystatechange = function() {
            if (this.readyState == 4) {
              if (this.status == 200) { elmnt.innerHTML = this.responseText; }
              if (this.status == 404) { elmnt.innerHTML = "Page introuvable."; }
              elmnt.removeAttribute("jdb-include-html");
              jdb.includeHTML(callback);
            }
          };
          xhttp.open("GET", file, true);
          xhttp.send();
          return;
        }
      }
      if (this.typeOf(callback) === "function") {
        callback();
      }
    },

    /**
     * Get any externale file.
     * @public
     * @type {Function}
     * @param {string} file File link
     * @param {requestCallback} [callback] Callback
     */
    getHttpData: function (file, callback) {
      var i, files = this.typeOf(file) === "string" ? new Array(file) : file;
      for (i = 0; i < files.length; i++) {
        this.http(files[i], function() {
          if (this.readyState == 4 && this.status == 200) {
            if (jdb.typeOf(callback) === "function") {
              callback(this.responseText);
            }
          }
        });
      }
    },
    
    /**
     * Get JSON data.
     * Can work with jdb-repeat attribute.
     * @public
     * @type {Function}
     * @param {string} file File link.
     * @param {requestCallback} [callback] Callback.
     */
    getHttpObject: function (file, callback) {
      this.http(file, function() {
        if (this.readyState == 4 && this.status == 200) {
          callback(JSON.parse(this.responseText));
        }
      });
    },
    
    /**
     * @public
     * @type {Function}
     * @param {string} id Selector.
     * @param {string} file File link.
     */
    displayHttp: function (id, file) {
      this.http(file, function() {
        if (this.readyState == 4 && this.status == 200) {
          this.displayObject(id, JSON.parse(this.responseText));
        }
      });
    },
    
    /**
     * @public
     * @type {Function}
     * @param {string} target Selector.
     * @param {requestCallback} [callback] Callback.
     * @param {*} [xml]
     * @param {*} [method]
     * @param {Object} [headers]
     */
    http: function (target, callback, xml, method, headers) {
      var httpObj;
      if (!method) { method = "GET"; }
      if (window.XMLHttpRequest) {
        httpObj = new XMLHttpRequest();
      } else if (window.ActiveXObject) {
        httpObj = new ActiveXObject("Microsoft.XMLHTTP");
      }
      if (httpObj) {
        if (callback) {
          httpObj.onreadystatechange = callback;
        }
        if (this.typeOf(headers) === "object") {
          for (var header in headers) {
            httpObj.setRequestHeader(header, headers[header]);
          }
        }
        httpObj.open(method, target, true);
        httpObj.send(xml);
      }
    },

    /**
     * @public
     * @type {Function}
     * @param {object} x html.
     * @param {string} att Attribute name.
     * @returns {string}
     */
    getElementsByAttribute: function (x, att) {
      var arr = [], arrCount = -1, i, l,
          y = x.getElementsByTagName("*"),
          z = att.toUpperCase();
          l = y.length;
      for (i = -1; i < l; i += 1) {
        if (i == -1) { y[i] = x; }
        if (y[i].getAttribute(z) !== null) {
          arrCount += 1; arr[arrCount] = y[i];
        }
      }
      return arr;
    },
    
    dataObject: {},

    /**
     * Get data from an object and put it in the selected element by id.
     * @public
     * @type {Function}
     * @param {string} id Id selector where to put put date.
     * @param {Object} data Data to put in the selected element.
     */
    displayObject: function (id, data) {
      var htmlObj, htmlTemplate, html, arr = [], a, l, rowClone,
          x, j, kl, i, ii, cc, repeat, repeatObj, repeatX = "";
      htmlObj = document.getElementById(id);
      htmlTemplate = init_template(id, htmlObj);
      html = htmlTemplate.cloneNode(true);
      arr = this.getElementsByAttribute(html, "jdb-repeat");
      l = arr.length;
      for (j = (l - 1); j >= 0; j -= 1) {
        cc = arr[j].getAttribute("jdb-repeat").split(/\s+/);
        if (cc.length == 1) {
          repeat = cc[0];
        } else {
          repeatX = cc[0];
          repeat = cc[2];
        }
        arr[j].removeAttribute("jdb-repeat");
        repeatObj = data[repeat];
        if (repeatObj && typeof repeatObj == "object" && repeatObj.length != "undefined") {
          i = 0;
          for (x in repeatObj) {
            i += 1;
            rowClone = arr[j];
            rowClone = jdb_replace_curly(rowClone, "element", repeatX, repeatObj[x]);
            a = rowClone.attributes;
            kl = a.length;
            for (ii = 0; ii < kl; ii += 1) {
              a[ii].value = jdb_replace_curly(a[ii], "attribute", repeatX, repeatObj[x]).value;
            }
            (i === repeatObj.length) ? arr[j].parentNode.replaceChild(rowClone, arr[j]) : arr[j].parentNode.insertBefore(rowClone, arr[j]);
          }
        } else {
          console.log("jdb-repeat must be an array. " + repeat + " is not an array.");
          continue;
        }
      }
      html = jdb_replace_curly(html, "element");
      htmlObj.parentNode.replaceChild(html, htmlObj);
      function init_template (id, obj) {
        var template;
        template = obj.cloneNode(true);
        if (jdb.dataObject.hasOwnProperty(id)) {return jdb.dataObject[id];}
        jdb.dataObject[id] = template;
        return template;
      }
      function jdb_replace_curly (elmnt, typ, repeatX, x) {
        var value, rowClone, pos1, pos2, originalHTML,
            lookFor, lookForARR = [], i, k, cc, r;
        rowClone = elmnt.cloneNode(true);
        pos1 = 0;
        while (pos1 > -1) {
          originalHTML = (typ == "attribute") ? rowClone.value : rowClone.innerHTML;
          pos1 = originalHTML.indexOf("{{", pos1);
          if (pos1 === -1) {break;}
          pos2 = originalHTML.indexOf("}}", pos1 + 1);
          lookFor = originalHTML.substring(pos1 + 2, pos2);
          lookForARR = lookFor.split("||");
          value = undefined;
          k = lookForARR.length;
          for (i = 0; i < k; i += 1) {
            lookForARR[i] = lookForARR[i].replace(/^\s+|\s+$/gm, ""); //trim
            if (x) {value = x[lookForARR[i]];}
            if (value === undefined && data) {value = data[lookForARR[i]];}
            if (value === undefined) {
              cc = lookForARR[i].split(".");
              if (cc[0] == repeatX) {value = x[cc[1]]; }
            }
            if (value === undefined) {
              if (lookForARR[i] == repeatX) {value = x;}
            }
            if (value === undefined) {
              if (lookForARR[i].substr(0, 1) == '\"') {
                value = lookForARR[i].replace(/"/g, "");
              } else if (lookForARR[i].substr(0,1) == "\'") {
                value = lookForARR[i].replace(/\'/g, "");
              }
            }
            if (value !== undefined) {break;}
          }
          if (value !== undefined) {
            r = "{{" + lookFor + "}}";
            if (typ == "attribute") {
              rowClone.value = rowClone.value.replace(r, value);
            } else {
              jdb_replace_html(rowClone, r, value);
            }
          } pos1 = pos1 + 1;
        } return rowClone;
      }
      function jdb_replace_html(aa, r, result) {
        var a = aa, b, l, i, x, j;
        if (a.hasAttributes()) {
          b = a.attributes;
          l = b.length;
          for (i = 0; i < l; i += 1) {
            if (b[i].value.indexOf(r) > -1) {b[i].value = b[i].value.replace(r, result);}
          }
        }
        x = a.getElementsByTagName("*");
        l = x.length;
        a.innerHTML = a.innerHTML.replace(r, result);
      }
    },
    
    /**
     * Get the content from a template,
     * and add it to the selected element.
     * @public
     * @type {Function}
     * @param {string} template Template id.
     * @param {string} where Where to add the template.
     * @param {requestCallback} [callback] Callback function.
     */
    extractTemplateContent: function (template, where, callback) {
      var temp = document.getElementById(template);
      var clon = temp.content.cloneNode(true);
      if (this.typeOf(callback) === "function") {
        callback(clon);
      }
      return document.querySelector(where).appendChild(clon);
    },

    /** 
     * @public
     * @type {Function}
     * @param {string} Selector
     */
    shuffleHTML: function (selector) {
      var i, index1, index2, temp_val,
        selector_ = $(selector),
        count = selector_.length,
        $parent = selector_.parent(),
        shuffled_array = [];
    
      for (i = 0; i < count; i++) {
        shuffled_array.push(i);
      }
    
      for (i = 0; i < count; i++) {
        index1 = (Math.random() * count) | 0;
        index2 = (Math.random() * count) | 0;
    
        temp_val = shuffled_array[index1];
        shuffled_array[index1] = shuffled_array[index2];
        shuffled_array[index2] = temp_val;
      }
    
      $(selector).detach();
      for (i = 0; i < count; i++) {
        $parent.append(selector_.eq(shuffled_array[i]));
      }
    },
    
    /**
     * Copy value from a input or textarea element
     * when user click to selected element.
     * @public
     * @type {Function}
     * @param {string} button Element selector. Firer of copy.
     * @param {string} area Textarea or input selector.
     * @param {requestCallback} [callback] Callback to fire after copy success.
     * @returns {boolean}
     */
    copyTxt: function (button, area, callback) {
      var copyTest, successful, message, text;
      $(button).each(function(){
        $(this).click(function(){
          copyTest = document.queryCommandSupported("copy");
          if (copyTest === true) {
            // Select the text field.
            $(area).select();
            // Copy the text from the text field.
            successful = document.execCommand("copy");
            message = successful ? "Success" : "Error";
            text = message === "Success" ? "Text copied to clipboard" : "Error on copying text";
            console.log(message + ": " + text);
            if (successful && jdb.typeOf(callback) === "function") {
              callback(this, area == button ? this : area);
            }
          } else {
            console.log("Your browser doesn\'t support the copy command");
            return copyTest;
          }
        });
      });
    },

    /**
     * Check if given param is an URL.
     * @public
     * @type {Function}
     * @param {string} url URL link.
     * @returns {boolean}
     */
    isUrl: function (url) {
      var _regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
      return _regexp.test(url);
    },
    
    /**
     * Check if an element is visible.
     * @public
     * @type {Function}
     * @param {string} selector Selector.
     * @returns {?(boolean|number)}
     */
    isVisible: function (elem) {
      var element;
      if (window.jQuery) {
        return $(elem).is(":visible");
      } else {
        element = this.typeOf(elem) === "object" ? elem : document.querySelector(elem);
        return !!(element.offsetWidth) || 
          !!(element.offsetHeight) ||
          !!(element.getClientRects().length);
      }
    },
    
    /**
     * @public
     * @type {Function}
     * @param {Object} event Event name.
     * @param {?(Object|string)} panel Active panel class selector.
     * @param {string} panelAll Class selector of all panel.
     * @param {string} buttonAll Class selector of all navigation button.
     * @param {string} className Name of class to add to the active button.
     */
    toggleItem: function (event, panel, panelAll, buttonAll, className) {
      $(panelAll).hide();
      $(buttonAll).removeClass(className);
      $(panel).show();
      $(event.currentTarget).addClass(className);
      return false;
    },

    /**
     * Test if element supports attribute.
     * @public
     * @type {Function}
     * @param {string} element Element name.
     * @param {string} attribute Attribute name.
     * @returns {boolean}
     */
    supportAttribute: function (element, attribute) {
      return !!(attribute in this.createElement(element));
    },

    /**
     * Enable draggable functionality on DOM elements.
     * @public
     * @type {Function}
     * @param {string} selector Element elector name.
     * @param {number} [ease] Option CSS transition.
     */
    dragmove: function (selector, ease) {
      if (ease) {
        if (this.typeOf(ease) === "number") {
          this.injectStyle("div {\n  -webkit-transition: all " + ease + "ms ease-out;\n  -moz-transition: all " + ease + "ms ease-out;\n  -o-transition: all " + ease + "ms ease-out;\n  transition: all " + ease + "ms ease-out;\n}");
        } else { console.log("The 'ease' parameter must be a number."); }
      }

      $(selector).each(function(){
        var $document = $(document);
        var $this = $(this), active;
        var startX, startY;
        var click, touch;

        $this.on("mousedown touchstart", function (e) {
          active = true;
          startX = e.originalEvent.pageX - $this.offset().left;
          startY = e.originalEvent.pageY - $this.offset().top;

          if ("mousedown"  == e.type) click = $this;
          if ("touchstart" == e.type) touch = $this;
          if (window.mozInnerScreenX == null) return false;
        });

        $document.on("mousemove touchmove", function (e) {
          if ("mousemove" == e.type && active) {
            click.offset({
              left: e.originalEvent.pageX - startX,
              top:  e.originalEvent.pageY - startY
            });
          }
          if ("touchmove" == e.type && active) {
            touch.offset({
              left: e.originalEvent.pageX - startX,
              top:  e.originalEvent.pageY - startY
            });
          }
        }).on("mouseup touchend", function() {
          active = false;
        });
      });
    },

    /**
     * Truncate large texts by adding ellipsis.
     * @public
     * @type {Function}
     * @param {string} selector Element elector name.
     * @param {number} [ease] Option CSS transition.
     */
    ellipsis: function (selector, max) {
      $(selector).each(function(){
        var $this = $(this);
        var text = $this.text();
        var textLength = text.length;
        // Run only if the text has
        // more than 'x' characters.
        if (textLength > max) {
          $this.text(text.substr(0, max) + "…");
        }
      });
    },

    version: "1.24.1"
  };

  // Check jQuery.
  jdb.isjQueryThere();

  // Public APIs.
  return jdb;
});