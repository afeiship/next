; (function () {
  // Export nx.
  /** Detect free variable `global` from Node.js. */
  var freeGlobal = typeof global == 'object' && global && global.Object === Object && global;
  /** Detect free variable `self`. */
  var freeSelf = typeof self == 'object' && self && self.Object === Object && self;
  /** Used as a reference to the global object. */
  var root = freeGlobal || freeSelf || Function('return this')();
  /** Detect free variable `exports`. */
  var freeExports = typeof exports == 'object' && exports && !exports.nodeType && exports;
  /** Detect free variable `module`. */
  var freeModule = freeExports && typeof module == 'object' && module && !module.nodeType && module;

  var nx = {
    VERSION: '1.23',
    GLOBAL: root
  };

  // Some AMD build optimizers, like r.js, check for condition patterns like:
  if (typeof define == 'function' && typeof define.amd == 'object' && define.amd) {
    // Expose Lodash on the global object to prevent errors when Lodash is
    // loaded by a script tag in the presence of an AMD loader.
    // See http://requirejs.org/docs/errors.html#mismatch for more details.
    root.nx = nx;

    // Define as an anonymous module so, through path mapping, it can be
    // referenced as the "nx" module.
    define(function () {
      return nx;
    });
  }
  // Check for `exports` after `define` in case a build optimizer adds it.
  else if (freeModule) {
    // Export for Node.js.
    (freeModule.exports = nx).nx = nx;
    // Export for CommonJS support.
    freeExports.nx = nx;
  }
  else {
    // Export to the global object.
    root.nx = nx;
  }
}.call(this));
