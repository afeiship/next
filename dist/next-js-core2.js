nx = {
  BREAKER: {},
  VERSION: '1.0.9',
  DEBUG: false,
  GLOBAL: (function () {
    return this;
  }).call(null)
};

(function (nx, global) {

  var undefined;
  var class2type = {};
  var toString = class2type.toString;
  var rPath = /(?:{)([\w.]+?)(?:})/gm;
  var javascriptType = 'Boolean Number String Function Array Date RegExp Object Error';
  var emptyArray = [],
    filter = emptyArray.filter,
    slice = emptyArray.slice,
    concat = emptyArray.concat;

  //populate class2type map:
  javascriptType.split(' ').forEach(function (inName) {
    class2type['[object ' + inName + ']'] = inName.toLowerCase()
  });

  nx.noop = function () {
  };

  nx.error = function (inMsg) {
    throw new Error(inMsg);
  };

  nx.each = function (inTarget, inCallback, inContext) {
    var key, length;
    if (inTarget) {
      if (inTarget.each) {
        return inTarget.each(inCallback, inContext);
      } else {
        length = inTarget.length;
        if (nx.isArrayLike(inTarget)) {
          for (key = 0; key < length; key++) {
            if (inCallback.call(inContext, key, inTarget[key]) === nx.BREAKER) {
              break;
            }
          }
        } else {
          for (key in inTarget) {
            if (inTarget.hasOwnProperty(key)) {
              if (inCallback.call(inContext, key, inTarget[key]) === nx.BREAKER) {
                break;
              }
            }
          }
        }
      }
    }
  };

  nx.type = function (inObj) {
    if (inObj && inObj.type) {
      return inObj.type();
    }
    return inObj == null ? String(inObj) :
    class2type[toString.call(inObj)] || 'object';
  };

  nx.camelCase = function (inStr) {
    return (inStr || '').replace(/[-_]+(.)?/g, function (match, chr) {
      return chr ? chr.toUpperCase() : '';
    });
  };

  nx.trim = function (inStr) {
    return inStr == null ? '' : String.prototype.trim.call(inStr)
  };

  nx.deserializeValue = function (inValue) {
    try {
      return inValue ?
      inValue == 'true' ||
      ( inValue == 'false' ? false :
        inValue == 'null' ? null :
          +inValue + '' == inValue ? +inValue :
            /^[\[\{]/.test(inValue) ? nx.parse(inValue) :
              inValue )
        : inValue;
    } catch (e) {
      return inValue;
    }
  };

  nx.dasherize = function (inStr) {
    return inStr.replace(/::/g, '/')
      .replace(/([A-Z]+)([A-Z][a-z])/g, '$1_$2')
      .replace(/([a-z\d])([A-Z])/g, '$1_$2')
      .replace(/_/g, '-')
      .toLowerCase()
  };

  nx.clone = function (inTarget, inSource, inDeep) {
    var isPlainObject = nx.isPlainObject,
      isArray = nx.isArray;
    var key;
    for (key in inSource) {
      if (inDeep) {
        if (isPlainObject(inSource[key]) || isArray(inSource[key])) {
          if (isPlainObject(inSource[key]) && !isPlainObject(inTarget[key])) {
            inTarget[key] = {};
          }
          if (isArray(inSource[key]) && !isArray(inTarget[key])) {
            inTarget[key] = [];
          }
          nx.clone(inTarget[key], inSource[key], inDeep);
        }
      }
      else if (inSource[key] !== undefined) {
        inTarget[key] = inSource[key];
      }
    }
    return inTarget;
  };

  nx.mix = function (inTarget) {
    var deep, args = slice.call(arguments, 1);
    if (typeof inTarget == 'boolean') {
      deep = inTarget;
      inTarget = args.shift();
    }
    args.forEach(function (arg) {
      nx.clone(inTarget, arg, deep);
    });
    return inTarget;
  };

  nx.isNumber = function (inObj) {
    return !isNaN(inObj) && typeof(inObj) == 'number';
  };

  nx.isBoolean = function (inObj) {
    return typeof(inObj) == 'boolean';
  };

  nx.isString = function (inObj) {
    return typeof(inObj) == 'string';
  };

  nx.isArray = Array.isArray || function (inObj) {
      return inObj instanceof Array;
    };

  nx.isArrayLike = function (inObj) {
    return typeof inObj.length == 'number';
  };

  nx.isFunction = function (inObj) {
    return typeof(inObj) == 'function';
  };

  nx.isObject = function (inObj) {
    return nx.type(inObj) == 'object';
  };

  nx.isDocument = function (inObj) {
    return inObj != null && inObj.nodeType == 9;
  };

  nx.isWindow = function (inObj) {
    return inObj != null && inObj == inObj.global;
  };

  nx.isPlainObject = function (inObj) {
    return nx.isObject(inObj) && !nx.isWindow(inObj) && Object.getPrototypeOf(inObj) == Object.prototype;
  };

  nx.isEmptyObject = function (obj) {
    var key;
    for (key in obj) return false;
    return true;
  };

  nx.has = function (inTarget, inName) {
    if (inTarget) {
      if (inTarget.has) {
        return inTarget.has(inName);
      } else {
        return inName in inTarget;
      }
    }
    return false;
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
      if (inTarget.set) {
        return inTarget.set(inName, inValue);
      } else {
        return inTarget[inName] = inValue;
      }
    }
  };

  nx.gets = function (inTarget) {
    if (inTarget) {
      if (inTarget.gets) {
        return inTarget.gets();
      } else {
        return nx.mix({}, inTarget);
      }
    }
  };

  nx.sets = function (inTarget, inObject) {
    if (inTarget) {
      if (inTarget.sets) {
        return inTarget.sets(inObject);
      } else {
        return nx.mix(inTarget, inObject);
      }
    }
  };

  nx.is = function (inTarget, inType) {
    if (inTarget && inTarget.is) {
      return inTarget.is(inType);
    } else {
      if (typeof inType === 'string') {
        switch (inType) {
          case 'undefined':
            return inTarget === undefined;
          case 'null':
            return inTarget === null;
          case 'object':
            return nx.isObject(inTarget);
          case 'plain':
            return nx.isPlainObject(inTarget);
          case 'string':
          case 'boolean':
          case 'number':
          case 'function':
            return typeof(inTarget) === inType;
          case 'array':
            return nx.isArray(inTarget);
          default:
            return toString(inTarget).toLowerCase().slice(8, -1) === inType;
        }
      } else if (typeof inType === 'function') {
        return inTarget instanceof inType;
      }
    }
  };

  nx.path = function (inTarget, inPath, inValue) {
    if (typeof inPath !== 'string') {
      nx.error('Path must be a string!');
    }

    var paths = inPath.split('.'),
      result = inTarget || nx.global,
      last;

    if (undefined === inValue) {
      nx.each(paths, function (path) {
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

  nx.format = function (inString, inArgs) {
    var result = inString || '';
    var replaceFn = nx.isArray(inArgs) ? function (str, match) {
      return inArgs[match];
    } : function (str, match) {
      return nx.path(inArgs, match);
    };
    result = inString.replace(rPath, replaceFn);
    return result;
  };

  nx.toArray = function (obj) {
    if (!obj) return [];
    if (nx.isArrayLike(obj)) return slice.call(obj);
    return [obj];
  };

  nx.parse = function (inValue) {
    try {
      return JSON.parse(inValue);
    } catch (_) {
    }
    return inValue;
  };

  nx.stringify = function (inValue) {
    try {
      return JSON.stringify(inValue);
    } catch (_) {
    }
    return inValue;
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
        nx.each(listeners, function (index,listener) {
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
        nx.each(listeners, function (_,listener) {
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

  function RootClass() {
  }

  var classMeta = {
    __classId__: 0,
    __type__: 'nx.RootClass',
    __base__: Object,
    __module__: 'root',
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
    base: function () {
      //TODO:NOT SUPPORT ES5 `USE STRICT` MODE
      var method = this.base.caller.__base__;
      if (method) {
        return method.apply(this, arguments);
      }
    },
    setMeta: function (inName, inValue) {
      this['__' + inName + '__'] = inValue;
    },
    getMeta: function (inName) {
      return this['__' + inName + '__'];
    },
    is: function (inType) {
      var type = this.__type__;
      if (type === inType) {
        return true;
      } else {
        var base = this.__base__;
        if (base) {
          return nx.is(base.prototype, inType);
        } else {
          return false;
        }
      }
    },
    type: function () {
      return this.__type__;
    },
    has: function (inName) {
      return inName in this;
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
    init: function () {
      //will be implement
    },
    destroy: function () {
      //will be implement
    },
    toString: function () {
      return '[Class@' + this.__type__ + ']';
    }
  };

  nx.mix(RootClass, classMeta);
  nx.mix(prototype, classMeta);
  nx.mix(prototype, nx.event);

  nx.RootClass = RootClass;

}(nx, nx.GLOBAL));

(function (nx, global) {

  nx.defineProperty = function (inTarget, inName, inMeta) {
    var key = '@' + inName;
    var valType;
    var meta = nx.isObject(inMeta) ? inMeta : {
      value: inMeta
    };
    var getter, setter, descriptor;
    var value, filed;

    if ('value' in meta) {
      value = meta.value;
      filed = '_' + inName;
      valType = nx.type(value);

      getter = function () {
        if (filed in this) {
          return this[filed];
        } else {
          return nx.isFunction(valType) ? value.call(this) : value;
        }
      };

      setter = function (inValue) {
        this[filed] = inValue;
      };

    } else {
      getter = inMeta.get || inTarget[key].get || nx.noop;
      setter = inMeta.set || inTarget[key].set || nx.noop;
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

  nx.defineMethod = function (inTarget, inName, inMeta) {
    var key = '@' + inName;
    var descriptor = inTarget[key] = {
      __meta__: inMeta,
      __name__: inName,
      __type__: 'method'
    };
    inTarget[inName] = inMeta;
    return descriptor;
  };

  nx.defineStatic = function (inTarget, inName, inMeta) {
    var descriptor = {
      __meta__: inMeta,
      __name__: inName,
      __type__: 'static'
    };
    //nx.isFunction(inMeta) && nx.mix(inMeta, descriptor);
    inTarget[inName] = inMeta;
    return descriptor;
  };

}(nx, nx.GLOBAL));

(function (nx, global) {

  var classId = 1,
    instanceId = 0,
    instanceMap = {};
  var NX_ANONYMOUS = 'nx.Anonymous';

  var __ = {
    distinct: function (inArray) {
      var result = [],
        map = {},
        key;

      inArray.forEach(function (val) {
        key = val.__type__;
        if (!map[key]) {
          map[key] = true;
          result.push(val);
        }
      });
      return result || inArray;
    },
    union: function () {
      var result = [];
      nx.each(arguments, function (_, item) {
        result = result.concat(item || []);
      });
      return __.distinct(result);
    }
  };

  function LifeCycle(inType, inMeta) {
    this.type = inType;
    this.meta = inMeta;
    this.base = inMeta.extend || nx.RootClass;
    this.module=nx.camelCase(inMeta.module);
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
        __static_init__: statics.init || this.base.__static_init__
      });
    },
    createClassProcessor: function () {
      var self = this;
      this.__Class__ = function () {
        this.__id__ = ++instanceId;
        this.__listeners__ = {};
        self.__constructor__.apply(this, nx.toArray(arguments));
        nx.DEBUG && (instanceMap[instanceId] = this);
      };
    },
    mixinItemsProcessor: function () {
      var base = this.base;
      var mixins = this.meta.mixins;
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

      classMeta.__mixins__ = __.union(mixinMixins, base.__mixins__, mixins);
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
    copyAtProps: function (inClassMeta) {
      var prototype = this.$base;
      nx.each(prototype, function (name, prop) {
        if (name.indexOf('@') > -1) {
          this.__Class__.prototype[name] = prop;
        }
      }, this);
    },
    defineMethods: function (inClassMeta) {
      var metaMethods = this.meta.methods || {};
      var methods = Object.keys(metaMethods);
      var extendMethods = inClassMeta.__methods__;
      var target = this.__Class__.prototype;

      nx.each(extendMethods, function (name, method) {
        nx.defineMethod(target, name, method);
        if (methods.indexOf(name) > -1) {
          nx.defineMethod(target, name, metaMethods[name]);
          target[name].__base__ = method;
        }
      });

      nx.each(metaMethods, function (name, method) {
        if (!target[name]) {
          nx.defineMethod(target, name, method);
        }
      });

      inClassMeta.__methods__ = nx.mix(extendMethods, metaMethods);

    },
    defineProperties: function (inClassMeta) {
      var metaProperties = this.meta.properties || {};
      var extendProperties = inClassMeta.__properties__;
      var target = this.__Class__.prototype;
      nx.each(metaProperties, function (name, prop) {
        nx.defineProperty(target, name, prop);
      });
      inClassMeta.__properties__ = nx.mix(extendProperties, metaProperties);
    },
    defineStatics: function (inClassMeta) {
      var staticsMembers = nx.mix(inClassMeta.__statics__, this.meta.statics);
      nx.each(staticsMembers, function (staticKey, staticMeta) {
        nx.defineStatic(this.__Class__, staticKey, staticMeta);
      }, this);
    },
    methodsConstructorProcessor: function () {
      var classMeta = this.__classMeta__;
      var mixins = classMeta.__mixins__;
      this.__constructor__ = function () {
        nx.each(mixins, function (index, mixItem) {
          mixItem.__init__.call(this);
        }, this);
        classMeta.__init__.apply(this, nx.toArray(arguments));
      };
    },
    staticsConstructorProcessor: function () {
      var classMeta = this.__classMeta__;
      classMeta.__static_init__.call(this.__Class__);
    },
    registerNsProcessor: function () {
      var type = this.type,
        Class = this.__Class__;
      var classMeta = this.__classMeta__;

      nx.mix(Class.prototype, classMeta, {
        constructor: this.__Class__
      });

      nx.mix(Class, classMeta);
      if (type !== NX_ANONYMOUS) {
        nx.path(global, type, Class);
      }
    }
  };


  nx.declare = function (inType, inMeta) {
    var type = typeof(inType) === 'string' ? inType : NX_ANONYMOUS;
    var meta = inMeta || inType;
    var lifeCycle = new LifeCycle(type, meta);
    lifeCycle.initMetaProcessor();
    lifeCycle.createClassProcessor();
    lifeCycle.mixinItemsProcessor();
    lifeCycle.inheritProcessor();
    lifeCycle.methodsConstructorProcessor();
    lifeCycle.staticsConstructorProcessor();
    lifeCycle.registerNsProcessor();
    return lifeCycle.__Class__;
  };


  if (nx.DEBUG) {
    nx.$ = function (id) {
      return instanceMap[id];
    };
  }

}(nx, nx.GLOBAL));

(function (nx, global) {

  var Config = nx.declare('nx.amd.Config', {
    statics: {
      __config__: {},
      getInstance: function () {
        var instance = Config.instance;
        if (!instance) {
          instance = Config.instance = new Config();
        }
        return instance;
      }
    },
    methods: {
      set: function (inName, inValue) {
        Config.__config__[inName] = inValue;
      },
      get: function (inName) {
        return Config.__config__[inName];
      },
      gets: function () {
        return Config.__config__;
      }
    }
  });

  nx.config = Config.getInstance();

}(nx, nx.GLOBAL));

(function (nx, global) {

  var DOT = '.',
    DOUBLE_DOT = '..',
    SLASH = '/';

  nx.declare('nx.amd.Path', {
    statics: {
      normalize: function (inPath) {
        var tokens = inPath.split(SLASH);
        var normalized = [], token, count = 0;

        for (var i = 0, len = tokens.length; i < len; i++) {
          token = tokens[i];
          if (token) {
            if (token === DOUBLE_DOT) {
              if (count > 0) {
                count--;
                normalized.pop();
              } else {
                normalized.push(DOUBLE_DOT);
              }
            } else if (token === DOT) {
              if (i === 0) {
                normalized.push(DOT);
              }
            } else {
              count++;
              normalized.push(token);
            }
          } else {
            if (count > 0 && i < len - 1) {
              normalized = normalized.slice(0, -count);
            } else {
              normalized.push('');
            }
          }
        }

        return normalized.join(SLASH);
      },
      parent: function (inPath) {
        return inPath.slice(0, inPath.lastIndexOf(SLASH) + 1);
      },
      last: function (inPath) {
        return inPath.slice(inPath.lastIndexOf(SLASH) + 1);
      },
      setExt: function (inPath, inExt) {
        var extLength = inExt.length;
        var end = inPath.slice(-extLength);

        if (end === inExt) {
          return inPath;
        } else if (end[extLength - 1] === SLASH) {
          return inPath + 'index' + DOT + inExt;
        } else {
          return inPath + DOT + inExt;
        }
      },
      getExt: function (inPath) {
        var slashIndex = inPath.lastIndexOf(SLASH);
        var dotIndex = inPath.lastIndexOf(DOT);

        if (dotIndex > slashIndex) {
          return inPath.slice(dotIndex + 1);
        } else {
          return 'js';
        }
      },
      unique: function (inPathArray) {
        var map = {};
        inPathArray.forEach(function (path) {
          map[path] = true;
        });
        return Object.keys(map);
      }
    }
  });

}(nx, nx.GLOBAL));

(function (nx, global) {

  nx.declare('nx.amd.Status', {
    statics: {
      PENDING: 0,
      LOADING: 1,
      RESOLVING: 2,
      RESOLVED: 3
    }
  });

}(nx, nx.GLOBAL));

(function (nx, global) {

  var doc = global.document;
  var isBrowserEnv = !!doc;
  var head = isBrowserEnv && (doc.head || doc.getElementsByTagName('head')[0] || doc.documentElement);
  var completeRE = /loaded|complete/;

  nx.declare('nx.amd.Loader', {
    methods: {
      init: function (inPath, inExt) {
        this.path = inPath;
        this.ext = inExt;
      },
      load: function () {
        var ext = this.ext;
        if (ext) {
          return this[ext]();
        }
        nx.error('The ext ' + ext + ' is not supported.');
      },
      js: function () {
        var scriptNode = doc.createElement('script');
        var supportOnload = "onload" in scriptNode;
        var self = this;
        var path = this.path;
        var complete = function (err) {
          scriptNode.onload = scriptNode.onerror = scriptNode.onreadystatechange = null;
          scriptNode = null;
          if (err) {
            nx.error('Failed to load module:' + path);
          } else {
            self.fire('load', this);
          }
        };

        scriptNode.src = path;
        scriptNode.async = true;
        head.appendChild(scriptNode);

        if (supportOnload) {
          scriptNode.onload = function () {
            complete(null);
          };
        } else {
          scriptNode.onreadystatechange = function (e) {
            if (completeRE.test(scriptNode.readyState)) {
              complete(null);
            } else {
              complete(e);
            }
          };
        }

        scriptNode.onerror = function (e) {
          complete(e);
        };

      },
      css: function () {
        var linkNode = doc.createElement('link');
        linkNode.rel = 'stylesheet';
        linkNode.href = this.path;
        head.appendChild(linkNode);

        //special module properties for css:
        nx.amd.Module.current.sets({
          factory: function () {
            return null;
          },
          dependencies: [],
          value: null
        });

        this.fire('load', this);
      }
    }
  });

}(nx, nx.GLOBAL));

(function (nx, global) {

  var Path = nx.amd.Path;
  var Loader = nx.amd.Loader;
  var STATUS = nx.amd.Status;

  var Module = nx.declare('nx.amd.Module', {
    properties: {
      path: '',
      value: null,
      dependencies: null,
      factory: null,
      status: STATUS.PENDING,
      count: {
        get: function () {
          return this._count;
        },
        set: function (inValue) {
          if (inValue === 0) {
            //this._loadingModules.reverse();
            this.fire('allLoad');
          }
          this._count = inValue;
        }
      }
    },
    statics: {
      all: {},
      current: null
    },
    methods: {
      init: function (inPath, inDeps, inFactory) {
        this.sets({
          path: inPath || '',
          dependencies: inDeps || [],
          factory: inFactory || nx.noop
        });
        this._loadingModules = [];
      },
      load: function (inCallback, inOwner) {
        var ext, path, ownerPath;
        var baseUrl = nx.config.get('baseUrl'),
          deps = this.dependencies;
        this.count = this._length = deps.length;
        this.on('allLoad', function () {
          this.onModuleAllLoad.call(this, inCallback);
        }, this);

        nx.each(deps, function (_, dep) {
          ownerPath = inOwner ? Path.parent(inOwner.get('path')) : baseUrl;
          ext = Path.getExt(dep);
          path = Path.normalize(
            Path.setExt(ownerPath + dep, ext)
          );
          this.attachLoader(path, ext, inCallback);
        }, this);
      },
      attachLoader: function (inPath, inExt) {
        var loader = new Loader(inPath, inExt);
        loader.on('load', this.onModuleLoad, this);
        loader.load();
      },
      onModuleLoad: function (inLoader) {
        //console.log('item load');
        var currentModule = Module.current,
          factory = currentModule.get('factory'),
          deps = currentModule.get('dependencies'),
          value = currentModule.get('value'),
          nDeps = deps.length;

        Module.all[inLoader.path] = currentModule;
        
        currentModule.sets({
          path: inLoader.path,
          dependencies: deps,
          factory: factory
        });

        this.count--;

        this._loadingModules[this.count] = currentModule;
        if (nDeps === 0) {
          currentModule.set('value', factory());
        } else {
          currentModule.load(factory, currentModule);
        }

      },
      onModuleAllLoad: function (inCallback) {
        console.log(Module.all);
        //console.log('inCallback:->', inCallback);
        //console.log('this._callbacks', this._callbacks);
        //console.log('this._callback',this._callback);
        //console.log('this._params',this._params);
        //console.log('inCallback', inCallback);
        //console.log('All loaded!');
        //console.log(inCallback.toString(), inParam);
        //inCallback.call(this, params);
        //this.params = [];
        //console.log(this._params[0]);
        //this._callback(this._params[0]);
        //inCallback.call(this._params.slice(1));
      }
    }
  });

}(nx, nx.GLOBAL));

(function (nx, global) {

  var Module = nx.amd.Module;
  nx.define = function (inDeps, inFactory) {
    var len = arguments.length;
    var deps = [];
    var factory = null;
    switch (true) {
      case len === 2:
        deps = inDeps;
        factory = arguments[1];
        break;
      case len === 1 && nx.isFunction(inDeps):
        factory = inDeps;
        break;
      case len === 1 && nx.isArray(inDeps):
        deps = inDeps;
        factory = function () {
          var result = {__index__: true, length: arguments.length};
          nx.each(arguments, function (index, mod) {
            if (mod.__module__) {
              result[mod.__module__] = mod;
            }
            result[index] = mod;
          });

          return result;
        };
        break;
      default:
        nx.error('Invalid arguments.');
    }
    return Module.current = new Module('', deps, factory);
  };

}(nx, nx.GLOBAL));
