nx = {
  BREAKER: {},
  VERSION: '1.3.0',
  DEBUG: false,
  GLOBAL: (function () {
    return this;
  }).call(null)
};

(function (nx, global) {

  var DOT = '.';
  var NUMBER = 'number';

  nx.noop = function () {
  };

  nx.error = function (inMsg) {
    throw new Error(inMsg);
  };

  nx.each = function (inTarget, inCallback, inContext) {
    var key, length;
    var iterator = function (inKey, inValue) {
      return inCallback.call(inContext, inKey, inValue) === nx.BREAKER;
    };

    if (inTarget) {
      if (inTarget.each) {
        return inTarget.each(inCallback, inContext);
      } else {
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
    }
  };

  nx.mix = function (inTarget) {
    var target = inTarget || {};
    var i, length;
    var args = arguments;
    for (i = 1, length = args.length; i < length; i++) {
      nx.each(args[i], function (key, val) {
        target[key] = val;
      });
    }
    return target;
  };

  nx.get = function (inTarget, inName) {
    if (inTarget) {
      if (inTarget.get) {
        return inTarget.get(inName);
      } else {
        return inTarget[inName];
      }
    }
  };

  nx.set = function (inTarget, inName, inValue) {
    if (inTarget) {
      if (inTarget.set && inTarget !== nx) {
        return inTarget.set(inName, inValue);
      } else {
        return inTarget[inName] = inValue;
      }
    }
  };

  nx.path = function (inTarget, inPath, inValue) {
    var paths = inPath.split(DOT);
    var result = inTarget || nx.global;
    var last;

    if (undefined === inValue) {
      nx.each(paths, function (_, path) {
        result = nx.get(result, path);
      });
    } else {
      last = paths.pop();
      paths.forEach(function (path) {
        result = result[path] = result[path] || {};
      });
      nx.set(result, last, inValue);
    }
    return result;
  };

}(nx, nx.GLOBAL));


if (typeof module !== 'undefined' && module.exports) {
  module.exports = nx;
}

(function (nx, global) {

  nx.event = {
    init: function () {
      this.__listeners__ = {};
    },
    destroy: function () {
      this.__listeners__ = {};
    },
    on: function (inName, inHandler, inContext) {
      var map = this.__listeners__;
      var listeners = map[inName] = map[inName] || [];
      listeners.push({
        owner: this,
        handler: inHandler,
        context: inContext
      });
    },
    off: function (inName, inHandler, inContext) {
      var listeners = this.__listeners__[inName];
      if (inHandler) {
        nx.each(listeners, function (index, listener) {
          if (listener.handler === inHandler && (!inContext || listener.context === inContext )) {
            listeners.splice(index, 1);
          }
        });
      } else {
        listeners.length = 0;
      }
    },
    fire: function (inName, inArgs) {
      var listeners = this.__listeners__[inName];
      if (listeners) {
        nx.each(listeners, function (_, listener) {
          if (listener && listener.handler) {
            if (listener.handler.call(listener.context || listener.owner, listener.owner, inArgs) === false) {
              return nx.BREAKER;
            }
          }
        });
      }
    }
  };

}(nx, nx.GLOBAL));

(function (nx, global) {

  var callStackRE1 = /__Class__\.(.*) \(/;
  var callStackRE2 = /at (.*) \(/;

  function RootClass() {
  }

  var classMeta = {
    __classId__: 0,
    __type__: 'nx.RootClass',
    __module__: 'root',
    __base__: Object,
    __meta__: {},
    __init__: nx.noop,
    __static_init__: nx.noop,
    __mixins__: [],
    __statics__: {},
    __properties__: [],
    __methods__: {}
  };

  var prototype = classMeta.__methods__ = RootClass.prototype = {
    constructor: RootClass,
    init: nx.noop,
    destroy: nx.noop,
    base: function () {
      var callerName, method;
      var args, stackes;
      try {
        method = this.base.caller.__base__;
        if (method) {
          return method.apply(this, arguments);
        }
      } catch (e) {
        stackes = e.stack.split('\n')[2];
        callerName = (stackes.match(callStackRE1) || stackes.match(callStackRE2))[1];
        method = this.$base[callerName];
        args = [].slice.call(arguments, 0);
        return method.apply(this, args);
      }
    },
    get: function (inName) {
      var type = this.memberType(inName);
      switch (type) {
        case 'method':
        case 'property':
        case 'undefined':
          return this[inName];
        case 'static':
          return this.constructor[inName];
      }
    },
    set: function (inName, inValue) {
      this[inName] = inValue;
    },
    gets: function () {
      var result = {};
      nx.each(this.__properties__, function (inName) {
        result[inName] = this.get(inName);
      }, this);
      return result;
    },
    sets: function (inTarget) {
      nx.each(inTarget, function (inName, inValue) {
        this.set(inName, inValue);
      }, this);
    },
    member: function (inName) {
      return this['@' + inName];
    },
    memberMeta: function (inName) {
      var member = this.member(inName);
      return member && member.__meta__;
    },
    memberType: function (inName) {
      var member = this.member(inName);
      return (member && member.__type__) || 'undefined';
    },
    toString: function () {
      return '[Class@' + this.__type__ + ']';
    }
  };

  nx.mix(RootClass, classMeta);
  nx.mix(prototype, classMeta, nx.event);

  nx.RootClass = RootClass;

}(nx, nx.GLOBAL));

(function (nx, global) {

  nx.defineProperty = function (inTarget, inName, inMeta, inMixins) {
    var key = '@' + inName;
    var getter, setter, descriptor;
    var value, filed;
    var meta = (inMeta && typeof inMeta === 'object') ? inMeta : {
        value: inMeta
      };

    if ('value' in meta) {
      value = meta.value;
      filed = '_' + inName;

      getter = function () {
        return filed in this ? this[filed] : (typeof value === 'function') ? value.call(this) : value;
      };

      setter = function (inValue) {
        this[filed] = inValue;
      };

    } else {
      getter = inMeta.get || inTarget[key] && inTarget[key].get || nx.noop;
      setter = inMeta.set || inTarget[key] && inTarget[key].set || nx.noop;
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
      get: getter,
      set: setter,
      configurable: true
    };

    Object.defineProperty(inTarget, inName, descriptor);

    return descriptor;
  };

  nx.defineMethod = function (inTarget, inName, inMeta, inMixins) {
    var key = '@' + inName;

    inMixins.forEach(function (mixin) {
      var prototype = mixin.prototype;
      key in prototype && (inMeta.__base__ = prototype[key].__meta__);
    });

    key in inTarget && (inMeta.__base__ = inTarget[key].__meta__);

    inTarget[inName] = inMeta;
    return inTarget[key] = {
      __meta__: inMeta,
      __name__: inName,
      __type__: 'method'
    };
  };

  nx.defineStatic = function (inTarget, inName, inMeta, inMixins) {
    var key = '@' + inName;

    inMixins.forEach(function (mixin) {
      key in mixin && (inMeta.__base__ = mixin[key].__meta__);
    });

    (key in inTarget) && (inMeta.__base__ = inTarget[key].__meta__);

    inTarget[inName] = inMeta;
    return inTarget[key] = {
      __meta__: inMeta,
      __name__: inName,
      __type__: 'static'
    };
  };

  nx.defineMembers = function (inMember, inTarget, inObject, inMixins) {
    var memberAction = 'define' + inMember.charAt(0).toUpperCase() + inMember.slice(1);
    nx.each(inObject, function (key, val) {
      nx[memberAction](inTarget, key, val, inMixins);
    });
  };

}(nx, nx.GLOBAL));

(function (nx, global) {

  var classId = 1,
    instanceId = 0;
  var NX_ANONYMOUS = 'nx.Anonymous';
  var arrayProto = Array.prototype;
  var slice = arrayProto.slice;
  var concat = arrayProto.concat;

  /**
   * Private
   * @returns {Array|Array.<T>|*}
   */
  function union() {
    var map = {};
    var result = concat.apply(arrayProto, arguments);
    return result.filter(function (val) {
      return !map[val.__type__] && (map[val.__type__] = true);
    });
  }

  function LifeCycle(inType, inMeta) {
    this.type = inType;
    this.meta = inMeta;
    this.base = inMeta.extends || nx.RootClass;
    this.module = inMeta.module;
    this.$base = this.base.prototype;
    this.__classMeta__ = {};
    this.__Class__ = null;
    this.__constructor__ = null;
  }

  LifeCycle.prototype = {
    constructor: LifeCycle,
    initMetaProcessor: function () {
      var methods = this.meta.methods || {};
      var statics = this.meta.statics || {};
      nx.mix(this.__classMeta__, {
        __type__: this.type,
        __meta__: this.meta,
        __base__: this.base,
        __module__: this.module,
        __classId__: classId++,
        __init__: methods.init || this.base.__init__,
        __static_init__: statics.init || this.base.__static_init__,
        __static_pure__: !this.meta.methods && !!this.meta.statics
      });
    },
    createClassProcessor: function () {
      var self = this;
      this.__Class__ = function () {
        var args = slice.call(arguments);
        this.__id__ = ++instanceId;
        this.__listeners__ = {};
        self.__constructor__.apply(this, args);
      };
    },
    mixinItemsProcessor: function () {
      var base = this.base;
      var mixins = this.meta.mixins || [];
      var classMeta = this.__classMeta__;
      var mixinMixins = [],
        mixinMethods = {},
        mixinProperties = {},
        mixinStatics = {},

        mixItemMixins = [],
        mixinItemMethods = {},
        mixinItemProperties = {},
        mixinItemStatics = {};

      nx.each(mixins, function (index, mixinItem) {
        mixItemMixins = mixinItem.__mixins__;
        mixinItemMethods = mixinItem.__methods__;
        mixinItemProperties = mixinItem.__properties__;
        mixinItemStatics = mixinItem.__statics__;

        mixinMixins = mixinMixins.concat(mixItemMixins);
        nx.mix(mixinMethods, mixinItemMethods);
        nx.mix(mixinProperties, mixinItemProperties);
        nx.mix(mixinStatics, mixinItemStatics);
      });

      classMeta.__mixins__ = union(mixinMixins, base.__mixins__, mixins);
      classMeta.__methods__ = nx.mix(mixinMethods, base.__methods__);
      classMeta.__properties__ = nx.mix(mixinProperties, base.__properties__);
      classMeta.__statics__ = nx.mix(mixinStatics, base.__statics__);
    },
    inheritProcessor: function () {
      var classMeta = this.__classMeta__;
      this.copyAtProps(classMeta);
      this.defineMethods(classMeta);
      this.defineProperties(classMeta);
      this.defineStatics(classMeta);
    },
    copyBaseProto: function () {
      this.__Class__.prototype.$base = this.$base;
    },
    copyAtProps: function (inClassMeta) {
      var prototype = this.$base;
      nx.each(prototype, function (name, prop) {
        if (name.indexOf('@') > -1) {
          this.__Class__.prototype[name] = prop;
        }
      }, this);
    },
    defineMethods: function (inClassMeta) {
      var methods = nx.mix(inClassMeta.__methods__, this.meta.methods);
      nx.defineMembers('method', this.__Class__.prototype, methods, inClassMeta.__mixins__);
    },
    defineProperties: function (inClassMeta) {
      var target = inClassMeta.__static_pure__ ? this.__Class__ : this.__Class__.prototype;
      var properties = nx.mix(inClassMeta.__properties__, this.meta.properties);
      nx.defineMembers('property', target, properties, inClassMeta.__mixins__);
    },
    defineStatics: function (inClassMeta) {
      var statics = nx.mix(inClassMeta.__statics__, this.meta.statics);
      nx.defineMembers('static', this.__Class__, statics, inClassMeta.__mixins__);
    },
    methodsConstructorProcessor: function () {
      var classMeta = this.__classMeta__;
      var mixins = classMeta.__mixins__;
      this.__constructor__ = function () {
        var args = slice.call(arguments);
        nx.each(mixins, function (_, mixItem) {
          mixItem.__init__.call(this);
        }, this);
        classMeta.__init__.apply(this, args);
      };
    },
    staticsConstructorProcessor: function () {
      var classMeta = this.__classMeta__;
      classMeta.__static_init__.call(this.__Class__);
    },
    registerNsProcessor: function () {
      var Class = this.__Class__;
      var type = this.type;
      var classMeta = this.__classMeta__;

      nx.mix(Class.prototype, classMeta, {constructor: Class});
      nx.mix(Class, classMeta);
      if (type !== (NX_ANONYMOUS + classId)) {
        nx.path(global, type, Class);
      }
    }
  };

  nx.declare = function (inType, inMeta) {
    var type = typeof(inType) === 'string' ? inType : (NX_ANONYMOUS + classId);
    var meta = inMeta || inType;
    var lifeCycle = new LifeCycle(type, meta);
    lifeCycle.initMetaProcessor();
    lifeCycle.createClassProcessor();
    lifeCycle.copyBaseProto();
    lifeCycle.mixinItemsProcessor();
    lifeCycle.inheritProcessor();
    lifeCycle.methodsConstructorProcessor();
    lifeCycle.staticsConstructorProcessor();
    lifeCycle.registerNsProcessor();
    return lifeCycle.__Class__;
  };

}(nx, nx.GLOBAL));
