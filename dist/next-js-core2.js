nx = {
  BREAKER: {},
  VERSION: '1.6.2',
  DEBUG: false,
  GLOBAL: function() {
    return this;
  }.call(null)
};

(function(nx, global) {
  var DOT = '.';
  var NUMBER = 'number';
  var ARRAY_PROTO = Array.prototype;

  nx.noop = function() {};

  nx.error = function(inMsg) {
    throw new Error(inMsg);
  };

  nx.try = function(inFn) {
    try {
      inFn();
    } catch (_) {}
  };

  nx.forEach = function(inArray, inCallback, inContext) {
    var length = inArray.length;
    var i;
    var result;
    for (i = 0; i < length; i++) {
      result = inCallback.call(inContext, inArray[i], i, inArray);
      if (result === nx.BREAKER) {
        break;
      }
    }
  };

  nx.forIn = function(inObject, inCallback, inContext) {
    var key;
    var result;
    for (key in inObject) {
      if (inObject.hasOwnProperty(key)) {
        result = inCallback.call(inContext, key, inObject[key], inObject);
        if (result === nx.BREAKER) {
          break;
        }
      }
    }
  };

  nx.each = function(inTarget, inCallback, inContext) {
    var key, length;
    var iterator = function(inKey, inValue) {
      return (
        inCallback.call(inContext, inKey, inValue, inTarget) === nx.BREAKER
      );
    };

    if (inTarget) {
      length = inTarget.length;
      if (typeof length === NUMBER) {
        for (key = 0; key < length; key++) {
          if (iterator(key, inTarget[key])) {
            break;
          }
        }
      } else {
        for (key in inTarget) {
          if (inTarget.hasOwnProperty(key)) {
            if (iterator(key, inTarget[key])) {
              break;
            }
          }
        }
      }
    }
  };

  nx.map = function(inTarget, inCallback, inContext) {
    var result = [];
    nx.each(inTarget, function() {
      var item = inCallback.apply(inContext, arguments);
      if (item !== nx.BREAKER) {
        result.push(item);
      } else {
        return nx.BREAKER;
      }
    });
    return result;
  };

  nx.mix = function(inTarget) {
    var target = inTarget || {};
    var i, length;
    var args = arguments;
    for (i = 1, length = args.length; i < length; i++) {
      nx.forIn(args[i], function(key, val) {
        target[key] = val;
      });
    }
    return target;
  };

  nx.slice = function(inTarget, inStart, inEnd) {
    return ARRAY_PROTO.slice.call(inTarget, inStart, inEnd);
  };

  nx.set = function(inTarget, inPath, inValue) {
    var paths = inPath.split(DOT);
    var result = inTarget || global;
    var last = paths.pop();

    paths.forEach(function(path) {
      result = result[path] = result[path] || {};
    });
    result[last] = inValue;
    return inTarget;
  };

  nx.get = function(inTarget, inPath) {
    var paths = inPath.split(DOT);
    var result = inTarget || nx.global;

    paths.forEach(function(path) {
      result = result && result[path];
    });
    return result;
  };

  nx.path = function(inTarget, inPath, inValue) {
    return inValue == null
      ? this.get(inTarget, inPath)
      : this.set(inTarget, inPath, inValue);
  };
})(nx, nx.GLOBAL);

if (typeof module !== 'undefined' && module.exports) {
  module.exports = nx;
} else {
  if (typeof define === 'function' && define.amd) {
    define([], function() {
      return nx;
    });
  } else {
    nx.GLOBAL.nx = nx;
  }
}

(function(nx, global) {
  var RootClass = function() {};
  var classMeta = {
    __class_id__: 0,
    __type__: 'nx.RootClass',
    __base__: Object,
    __meta__: {},
    __static__: false,
    __statics__: {},
    __properties__: {},
    __methods__: {},
    __method_init__: nx.noop,
    __static_init__: nx.noop
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
      var isStatic = typeof this.__id__ === 'undefined';
      var args = nx.slice(arguments, 1);
      var base = isStatic ? this.__base__ : this.__base__.prototype;
      var type = this['@' + inName].__type__;
      var accessor = ['get', 'set'][args.length];
      switch (type) {
        case 'method':
          return base[inName].apply(this, args);
        case 'property':
          return base['@' + inName][accessor].apply(this, args);
      }
    }
  };

  classMeta.__methods__ = RootClass.prototype = nx.mix(
    {
      constructor: RootClass,
      init: nx.noop,
      destroy: nx.noop,
      toString: function() {
        return '[Class@' + this.__type__ + ']';
      }
    },
    baseMethods
  );

  //mix && export:
  nx.mix(classMeta.__statics__, baseMethods);
  nx.mix(RootClass, classMeta);
  nx.mix(RootClass, classMeta.__statics__);
  nx.RootClass = RootClass;
})(nx, nx.GLOBAL);

(function(nx, global) {
  var MEMBER_PREFIX = '@';
  var VALUE = 'value';
  var COMMA = ',';

  nx.defineProperty = function(inTarget, inName, inMeta, inIsStatic) {
    var key = MEMBER_PREFIX + inName;
    var getter, setter, descriptor;
    var value, filed;
    var typeOfObject = typeof inMeta === 'object';
    var meta = inMeta && typeOfObject ? inMeta : { value: inMeta };

    if (VALUE in meta) {
      value = meta.value;
      filed = '_' + inName;

      getter = function() {
        return filed in this
          ? this[filed]
          : typeof value === 'function'
          ? value.call(this)
          : value;
      };

      setter = function(inValue) {
        this[filed] = inValue;
      };
    } else {
      getter = inMeta.get || (inTarget[key] && inTarget[key].get) || nx.noop;
      setter = inMeta.set || (inTarget[key] && inTarget[key].set) || nx.noop;
    }

    //remain base setter/getter:
    if (key in inTarget) {
      getter.__base__ = inTarget[key].get;
      setter.__base__ = inTarget[key].set;
    }

    descriptor = inTarget[key] = {
      __meta__: inMeta,
      __name__: inName,
      __type__: 'property',
      __static__: !!inIsStatic,
      get: getter,
      set: setter,
      configurable: true
    };

    Object.defineProperty(inTarget, inName, descriptor);

    return descriptor;
  };

  nx.defineMethod = function(inTarget, inName, inMeta, inIsStatic) {
    var key = MEMBER_PREFIX + inName;
    inTarget[inName] = inMeta;
    return (inTarget[key] = {
      __meta__: inMeta,
      __name__: inName,
      __type__: 'method',
      __static__: !!inIsStatic
    });
  };

  nx.defineBombMethod = function(inTarget, inName, inMeta, inIsStatic) {
    var keys = inName.split(COMMA);
    keys.forEach(function(key) {
      nx.defineMethod(inTarget, key, inMeta.call(inTarget, key), inIsStatic);
    });
  };

  nx.defineMembers = function(inMember, inTarget, inObject, inIsStatic) {
    nx.forIn(inObject, function(key, val) {
      if (key.indexOf(COMMA) > -1) {
        nx.defineBombMethod(inTarget, key, val, inIsStatic);
      } else {
        nx['define' + inMember](inTarget, key, val, inIsStatic);
      }
    });
  };
})(nx, nx.GLOBAL);

(function(nx, global) {
  var classId = 1,
    instanceId = 0;
  var NX_ANONYMOUS = 'nx.Anonymous';

  function LifeCycle(inType, inMeta) {
    this.type = inType;
    this.meta = inMeta;
    this.base = inMeta.extends || nx.RootClass;
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
      nx.mix(this.__class_meta__, {
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
      var self = this;
      this.__class__ = function() {
        this.__id__ = instanceId++;
        self.__constructor__.apply(this, arguments);
        self.registerDebug(this);
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
      var SuperClass = function() {};
      var Class = this.__class__;
      SuperClass.prototype = this.$base;
      Class.prototype = new SuperClass();
      Class.prototype.$base = this.$base;
      Class.prototype.constructor = Class;
    },
    defineMethods: function(inClassMeta, inIsStatic) {
      var key = inIsStatic ? 'statics' : 'methods';
      var key_ = inIsStatic ? '__statics__' : '__methods__';
      var target = inIsStatic ? this.__class__ : this.__class__.prototype;
      var baseTarget = inIsStatic ? this.base : this.base.prototype;
      var methods = baseTarget[key_] || {};
      nx.forIn(this.meta[key], function(key, value) {
        if (methods[key] && typeof value === 'function') {
          value.__base__ = methods[key];
        }
      });
      target[key_] = nx.mix(inClassMeta[key_], methods, this.meta[key]);
      nx.defineMembers('Method', target, target[key_], inIsStatic);
    },
    defineProperties: function(inClassMeta) {
      var isStatic = inClassMeta.__static__;
      var target = isStatic ? this.__class__ : this.__class__.prototype;
      target.__properties__ = nx.mix(
        inClassMeta.__properties__,
        this.meta.properties
      );
      nx.defineMembers('Property', target, target.__properties__, isStatic);
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

      nx.mix(Class.prototype, classMeta);
      nx.mix(Class, classMeta);
      if (type.indexOf(NX_ANONYMOUS) === -1) {
        nx.set(nx.GLOBAL, type, Class);
      }
    },
    registerDebug: function(inInstance) {
      if (nx.DEBUG) {
        nx.set(nx, '__instances__.' + (instanceId - 1), inInstance);
        nx.set(nx, '__instances__.length', instanceId);
      }
    }
  };

  nx.declare = function(inType, inMeta) {
    var type = typeof inType === 'string' ? inType : NX_ANONYMOUS + classId;
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
})(nx, nx.GLOBAL);
