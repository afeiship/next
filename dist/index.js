var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.js
var index_exports = {};
__export(index_exports, {
  default: () => index_default,
  nx: () => base_default
});
module.exports = __toCommonJS(index_exports);

// src/base.js
var root = typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : typeof global !== "undefined" ? global : Function("return this")();
var nx = root.nx = root.nx || {
  BREAKER: {},
  NIL: {},
  VERSION: "1.6.4",
  DEBUG: false,
  GLOBAL: root
};
var base_default = nx;

// src/core.js
(function() {
  var DOT = ".";
  var NUMBER = "number";
  var UNDEF = "undefined";
  var ARRAY_PROTO = Array.prototype;
  var toString = Object.prototype.toString;
  var hasOwn = Object.prototype.hasOwnProperty;
  var INDEXES_PATH_RE = /\[(\w+)\]/g;
  var MULTIPLE_DOT_RE = /[.]+/g;
  var EDGE_DOT_RE = /^\.|\.$/g;
  var POS1 = ".$1";
  var EMP = "";
  var normalize = function(path) {
    return path.toString().replace(INDEXES_PATH_RE, POS1).replace(MULTIPLE_DOT_RE, DOT).replace(EDGE_DOT_RE, EMP);
  };
  base_default.noop = function() {
  };
  base_default.typeof = function(inTarget) {
    if (inTarget === null) return "null";
    if (inTarget === void 0) return "undefined";
    var isPrimitive = typeof inTarget !== "object";
    if (!isPrimitive) return toString.call(inTarget).slice(8, -1).toLowerCase();
    return typeof inTarget;
  };
  base_default.stubTrue = function() {
    return true;
  };
  base_default.stubFalse = function() {
    return false;
  };
  base_default.stubValue = function(inValue) {
    return inValue;
  };
  base_default.stubPromise = function(inValue) {
    if (typeof inValue === "undefined") return Promise.resolve();
    return Promise.resolve(inValue);
  };
  base_default.isBoolean = function(inTarget) {
    return typeof inTarget === "boolean";
  };
  base_default.isString = function(inTarget) {
    return typeof inTarget === "string";
  };
  base_default.isNumber = function(inTarget) {
    return typeof inTarget === NUMBER && !isNaN(inTarget);
  };
  base_default.isNaN = function(inTarget) {
    return isNaN(inTarget);
  };
  base_default.isFunction = function(inTarget) {
    return typeof inTarget === "function";
  };
  base_default.isNil = function(inTarget) {
    return inTarget == null;
  };
  base_default.isNull = function(inTarget) {
    return inTarget === null;
  };
  base_default.isUndefined = function(inTarget) {
    return inTarget === void 0;
  };
  base_default.isArray = function(inTarget) {
    return Array.isArray(inTarget);
  };
  base_default.isObject = function(inTarget) {
    if (Array.isArray(inTarget)) return false;
    return typeof inTarget === "object" && inTarget !== null;
  };
  base_default.isPromiseLike = function(inTarget) {
    if (!inTarget) return false;
    return typeof inTarget === "object" && typeof inTarget.then === "function";
  };
  base_default.isPromise = function(inTarget) {
    return typeof inTarget === "object" && inTarget instanceof Promise;
  };
  base_default.try = function(inFn, inCatch) {
    var cb = inCatch || base_default.noop;
    try {
      inFn();
    } catch (err) {
      cb(err);
    }
  };
  base_default.forEach = function(inArray, inCallback, inContext) {
    var length = inArray.length;
    var i;
    var result;
    for (i = 0; i < length; i++) {
      result = inCallback.call(inContext, inArray[i], i, inArray);
      if (result === base_default.BREAKER) {
        break;
      }
    }
  };
  base_default.forIn = function(inObject, inCallback, inContext) {
    var key;
    var result;
    for (key in inObject) {
      if (hasOwn.call(inObject, key)) {
        result = inCallback.call(inContext, key, inObject[key], inObject);
        if (result === base_default.BREAKER) {
          break;
        }
      }
    }
  };
  base_default.each = function(inTarget, inCallback, inContext) {
    var key, length;
    var iterator = function(inKey, inValue, inIsArray) {
      return inCallback.call(inContext, inKey, inValue, inTarget, inIsArray) === base_default.BREAKER;
    };
    if (inTarget) {
      length = inTarget.length;
      if (typeof length === NUMBER) {
        for (key = 0; key < length; key++) {
          if (iterator(key, inTarget[key], true)) {
            break;
          }
        }
      } else {
        for (key in inTarget) {
          if (hasOwn.call(inTarget, key)) {
            if (iterator(key, inTarget[key], false)) {
              break;
            }
          }
        }
      }
    }
  };
  base_default.mix = function(inTarget) {
    var target = inTarget || {};
    var i, length;
    var args = arguments;
    for (i = 1, length = args.length; i < length; i++) {
      base_default.forIn(args[i], function(key, val) {
        target[key] = val;
      });
    }
    return target;
  };
  base_default.slice = function(inTarget, inStart, inEnd) {
    return ARRAY_PROTO.slice.call(inTarget, inStart, inEnd);
  };
  base_default.set = function(inTarget, inPath, inValue) {
    var indexesPath = normalize(inPath);
    var paths = indexesPath.split(DOT);
    var result = inTarget || base_default.GLOBAL;
    var len_ = paths.length - 1;
    var last = paths[len_];
    for (var i = 0; i < len_; i++) {
      var path = paths[i];
      var target = isNaN(+paths[i + 1]) ? {} : [];
      result = result[path] = result[path] || target;
    }
    result[last] = inValue;
    return inTarget;
  };
  base_default.get = function(inTarget, inPath, inValue) {
    if (!inPath) return inTarget;
    if (Array.isArray(inPath))
      return inPath.map(function(path) {
        return base_default.get(inTarget, path, inValue);
      });
    var idx = normalize(inPath);
    var paths = idx.split(DOT);
    var result = inTarget || base_default.GLOBAL;
    paths.forEach(function(path) {
      result = result && result[path];
    });
    return typeof inValue !== UNDEF && typeof result === UNDEF ? inValue : result;
  };
  base_default.del = function(inTarget, inPath) {
    var indexesPath = normalize(inPath);
    var paths = indexesPath.split(DOT);
    for (var i = 0; i < paths.length; i++) {
      var path = paths[i];
      if (i === paths.length - 1) {
        if (inTarget == null) return false;
        if (typeof inTarget === "object") delete inTarget[path];
        return true;
      }
      inTarget = inTarget[path];
    }
    return false;
  };
  base_default.to = function(inPromise) {
    return inPromise.then(function(data) {
      return [void 0, data];
    }).catch(function(err) {
      return [err, void 0];
    });
  };
})();

// src/oop-base.js
(function() {
  var RootClass = function() {
  };
  var classMeta = {
    __class_id__: 0,
    __type__: "nx.RootClass",
    __base__: Object,
    __meta__: {},
    __static__: false,
    __statics__: {},
    __properties__: {},
    __methods__: {},
    __method_init__: base_default.noop,
    __static_init__: base_default.noop
  };
  var baseMethods = {
    base: function() {
      var caller = this.base.caller;
      var baseMethod;
      if (caller && (baseMethod = caller.__base__)) {
        return baseMethod.apply(this, arguments);
      }
    },
    parent: function(inName) {
      var isStatic = typeof this.__id__ === "undefined";
      var args = base_default.slice(arguments, 1);
      var base = isStatic ? this.__base__ : this.__base__.prototype;
      var type = this["@" + inName].__type__;
      var accessor = ["get", "set"][args.length];
      switch (type) {
        case "method":
          return base[inName].apply(this, args);
        case "property":
          return base["@" + inName][accessor].apply(this, args);
      }
    }
  };
  classMeta.__methods__ = RootClass.prototype = base_default.mix(
    {
      constructor: RootClass,
      init: base_default.noop,
      destroy: base_default.noop,
      toString: function() {
        return "[Class@" + this.__type__ + "]";
      }
    },
    baseMethods
  );
  base_default.mix(classMeta.__statics__, baseMethods);
  base_default.mix(RootClass, classMeta);
  base_default.mix(RootClass, classMeta.__statics__);
  base_default.RootClass = RootClass;
})();

// src/oop-reflect.js
(function() {
  var MEMBER_PREFIX = "@";
  var VALUE = "value";
  var COMMA = ",";
  base_default.defineProperty = function(inTarget, inName, inMeta, inIsStatic) {
    var key = MEMBER_PREFIX + inName;
    var getter, setter, descriptor;
    var value, filed;
    var typeOfObject = typeof inMeta === "object";
    var meta = inMeta && typeOfObject ? inMeta : { value: inMeta };
    if (VALUE in meta) {
      value = meta.value;
      filed = "_" + inName;
      getter = function() {
        return filed in this ? this[filed] : base_default.isFunction(value) ? value.call(this) : value;
      };
      setter = function(inValue) {
        this[filed] = inValue;
      };
    } else {
      getter = inMeta.get || inTarget[key] && inTarget[key].get || base_default.noop;
      setter = inMeta.set || inTarget[key] && inTarget[key].set || base_default.noop;
    }
    if (key in inTarget) {
      getter.__base__ = inTarget[key].get;
      setter.__base__ = inTarget[key].set;
    }
    descriptor = inTarget[key] = {
      __meta__: inMeta,
      __name__: inName,
      __type__: "property",
      __static__: !!inIsStatic,
      get: getter,
      set: setter,
      configurable: true
    };
    Object.defineProperty(inTarget, inName, descriptor);
    return descriptor;
  };
  base_default.defineMethod = function(inTarget, inName, inMeta, inIsStatic) {
    var key = MEMBER_PREFIX + inName;
    inTarget[inName] = inMeta;
    return inTarget[key] = {
      __meta__: inMeta,
      __name__: inName,
      __type__: "method",
      __static__: !!inIsStatic
    };
  };
  base_default.defineBombMethod = function(inTarget, inName, inMeta, inIsStatic) {
    var keys = inName.split(COMMA);
    keys.forEach(function(key, index) {
      base_default.defineMethod(
        inTarget,
        key,
        inMeta.call(inTarget, key, index),
        inIsStatic
      );
    });
  };
  base_default.defineMembers = function(inMember, inTarget, inObject, inIsStatic) {
    base_default.forIn(inObject, function(key, val) {
      var idx = key.indexOf(COMMA);
      var hasComma = idx > -1;
      if (hasComma) {
        base_default.defineBombMethod(inTarget, key, val, inIsStatic);
      } else {
        base_default["define" + inMember](inTarget, key, val, inIsStatic);
      }
    });
  };
})();

// src/oop.js
(function() {
  var classId = 1, instanceId = 0;
  var NX_ANONYMOUS = "nx.Anonymous";
  function LifeCycle(inType, inMeta) {
    this.type = inType;
    this.meta = inMeta;
    this.base = inMeta.extends || base_default.RootClass;
    this.$base = this.base.prototype;
    this.__class_meta__ = {};
    this.__class__ = null;
    this.__constructor__ = null;
  }
  LifeCycle.prototype = {
    constructor: LifeCycle,
    initMetaProcessor: function() {
      var meta = this.meta;
      var methods = meta.methods || {};
      var statics = meta.statics || {};
      base_default.mix(this.__class_meta__, {
        __type__: this.type,
        __meta__: meta,
        __base__: this.base,
        __class_id__: classId++,
        __method_init__: methods.init || this.base.__method_init__,
        __static_init__: statics.init || this.base.__static_init__,
        __static__: !meta.methods && !!meta.statics
      });
    },
    createClassProcessor: function() {
      var self2 = this;
      this.__class__ = function() {
        this.__id__ = instanceId++;
        self2.__constructor__.apply(this, arguments);
        self2.registerDebug(this);
      };
    },
    inheritProcessor: function() {
      var classMeta = this.__class_meta__;
      this.inheritedClass(classMeta);
      this.defineMethods(classMeta, true);
      this.defineMethods(classMeta, false);
      this.defineProperties(classMeta);
    },
    inheritedClass: function(inClassMeta) {
      var SuperClass = function() {
      };
      var Class = this.__class__;
      SuperClass.prototype = this.$base;
      Class.prototype = new SuperClass();
      Class.prototype.$base = this.$base;
      Class.prototype.constructor = Class;
    },
    defineMethods: function(inClassMeta, inIsStatic) {
      var key = inIsStatic ? "statics" : "methods";
      var key_ = "__" + key + "__";
      var target = inIsStatic ? this.__class__ : this.__class__.prototype;
      var baseTarget = inIsStatic ? this.base : this.base.prototype;
      var methods = baseTarget[key_] || {};
      base_default.forIn(this.meta[key], function(key2, value) {
        if (methods[key2] && typeof value === "function") {
          value.__base__ = methods[key2];
        }
      });
      target[key_] = base_default.mix(inClassMeta[key_], methods, this.meta[key]);
      base_default.defineMembers("Method", target, target[key_], inIsStatic);
    },
    defineProperties: function(inClassMeta) {
      var isStatic = inClassMeta.__static__;
      var target = isStatic ? this.__class__ : this.__class__.prototype;
      var baseTarget = isStatic ? this.base : this.base.prototype;
      target.__properties__ = base_default.mix(
        null,
        baseTarget.__properties__,
        inClassMeta.__properties__,
        this.meta.properties
      );
      base_default.defineMembers("Property", target, target.__properties__, isStatic);
    },
    methodsConstructorProcessor: function() {
      var classMeta = this.__class_meta__;
      this.__constructor__ = function() {
        classMeta.__method_init__.apply(this, arguments);
      };
    },
    staticsConstructorProcessor: function() {
      var classMeta = this.__class_meta__;
      classMeta.__static_init__.call(this.__class__);
    },
    registerProcessor: function() {
      var Class = this.__class__;
      var type = this.type;
      var classMeta = this.__class_meta__;
      base_default.mix(Class.prototype, classMeta);
      base_default.mix(Class, classMeta);
      if (type.indexOf(NX_ANONYMOUS) === -1) {
        base_default.set(base_default.GLOBAL, type, Class);
      }
    },
    registerDebug: function(inInstance) {
      if (base_default.DEBUG) {
        base_default.set(base_default, "__instances__." + (instanceId - 1), inInstance);
        base_default.set(base_default, "__instances__.length", instanceId);
      }
    }
  };
  base_default.define = function(inType, inMeta) {
    var type = typeof inType === "string" ? inType : NX_ANONYMOUS + classId;
    var meta = inMeta || inType;
    var lifeCycle = new LifeCycle(type, meta);
    lifeCycle.initMetaProcessor();
    lifeCycle.createClassProcessor();
    lifeCycle.inheritProcessor();
    lifeCycle.methodsConstructorProcessor();
    lifeCycle.staticsConstructorProcessor();
    lifeCycle.registerProcessor();
    return lifeCycle.__class__;
  };
  base_default.declare = base_default.define;
})();

// src/index.js
var index_default = base_default;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  nx
});

if (typeof module !== 'undefined' && module.exports && module.exports.default) {
  var _nx = module.exports.default;
  module.exports = _nx;
  module.exports.default = _nx;
  module.exports.nx = _nx;
}

//# sourceMappingURL=index.js.map