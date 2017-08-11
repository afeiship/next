
nx = {
  BREAKER: {},
  VERSION: '1.2.0',
  DEBUG: false,
  GLOBAL: (function() {
    return this;
  }).call(null)
};

(function(nx, global) {

  var undefined;
  var class2type = {};
  var toString = class2type.toString;
  var fomratRE = /(?:{)([\w.]+?)(?:})/gm;
  var $wRE = ',';
  var camelCaseRE=/[-_]+(.)?/g;
  var javascriptType = 'Boolean Number String Function Array Date RegExp Object Error';
  var emptyArray = [],
    filter = emptyArray.filter,
    slice = emptyArray.slice,
    concat = emptyArray.concat;

  //populate class2type map:
  javascriptType.split(' ').forEach(function(inName) {
    class2type['[object ' + inName + ']'] = inName.toLowerCase()
  });

  nx.noop = function() {};

  nx.$w = function(inString,inSparator){
    return String(inString).split(inSparator || $wRE);
  };

  nx.error = function(inMsg) {
    throw new Error(inMsg);
  };

  nx.each = function(inTarget, inCallback, inContext) {
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

  nx.type = function(inObj) {
    if (inObj && nx.isFunction(inObj.type)) {
      return inObj.type();
    }
    return inObj == null ? String(inObj) :
      class2type[toString.call(inObj)] || 'object';
  };

  nx.camelCase = function(inStr) {
    return (inStr || '').replace(camelCaseRE, function(match, chr) {
      return chr ? chr.toUpperCase() : '';
    });
  };

  nx.trim = function(inStr) {
    return inStr == null ? '' : String.prototype.trim.call(inStr);
  };

  nx.capitalize = function(inStr) {
    return inStr.charAt(0).toUpperCase() + inStr.slice(1);
  };

  // "true"  => true
  // "false" => false
  // "null"  => null
  // "42"    => 42
  // "42.5"  => 42.5
  // "08"    => "08"
  // JSON    => parse if valid
  // String  => self

  nx.deserializeValue = function(inValue) {
    try {
      return inValue ?
        inValue == 'true' ||
        (inValue == 'false' ? false :
          inValue == 'null' ? null :
            +inValue + '' == inValue ? +inValue :
              /^[\[\{]/.test(inValue) ? nx.parse(inValue) :
                inValue) :
        inValue;
    } catch (e) {
      return inValue;
    }
  };

  nx.dasherize = function(inStr) {
    return inStr.replace(/::/g, '/')
      .replace(/([A-Z]+)([A-Z][a-z])/g, '$1_$2')
      .replace(/([a-z\d])([A-Z])/g, '$1_$2')
      .replace(/_/g, '-')
      .toLowerCase()
  };

  nx.clone = function(target, source, deep) {
    var isPlainObject = nx.isPlainObject,
      isArray = nx.isArray;
    for (var key in source)
      if (deep && (isPlainObject(source[key]) || isArray(source[key]))) {
        if (isPlainObject(source[key]) && !isPlainObject(target[key]))
          target[key] = {}
        if (isArray(source[key]) && !isArray(target[key]))
          target[key] = []
        nx.clone(target[key], source[key], deep)
      } else if (source[key] !== undefined) target[key] = source[key]
    return target;
  };

  nx.mix = function(inTarget) {
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

  nx.union = function (inTarget){
    var i,length;
    var j,count,item;
    var args = arguments;
    for (i = 1, length = args.length; item = args[i],i < length; i++) {
      for(j=0, count = item.length; j < count; j++){
        inTarget.push(item[j]);
      }
    }
    return inTarget;
  };

  nx.isUndefined = function(inObj){
    return inObj === undefined;
  };

  nx.isNull = function(inObj){
    return inObj === null;
  };

  nx.isNil = function (inObj){
    return inObj == null;
  };

  nx.isNumber = function(inObj) {
    return !isNaN(inObj) && typeof(inObj) == 'number';
  };

  nx.isBoolean = function(inObj) {
    return typeof(inObj) == 'boolean';
  };

  nx.isString = function(inObj) {
    return typeof(inObj) == 'string';
  };

  nx.isArray = Array.isArray || function(inObj) {
      return inObj instanceof Array;
    };

  nx.isArrayLike = function(inObj) {
    return typeof inObj.length == 'number';
  };

  nx.isFunction = function(inObj) {
    return typeof(inObj) == 'function';
  };

  nx.isObject = function(inObj) {
    return nx.type(inObj) == 'object';
  };

  nx.isDocument = function(inObj) {
    return inObj != null && inObj.nodeType == 9;
  };

  nx.isWindow = function(inObj) {
    return inObj != null && inObj == inObj.global;
  };

  nx.isPlainObject = function(inObj) {
    return nx.isObject(inObj) && !nx.isWindow(inObj) && Object.getPrototypeOf(inObj) == Object.prototype;
  };

  nx.isEmptyObject = function(inObj) {
    var key;
    for (key in inObj) return false;
    return true;
  };

  nx.mulReplace = function(inString, inArray) {
    var i, length = inArray.length;
    for (i = 0; i < length; i++) {
      inString = inString.replace(inArray[i][0], inArray[i][1]);
    }
    return inString;
  };

  // http://dev.qwrap.com/download/latest/apps/qwrap-debug.js?20131207
  nx.escapeChars = function(inString) {
    return nx.mulReplace(inString, [
      [/\\/g, "\\\\"],
      [/"/g, "\\\""],
      //[/'/g, "\\\'"],//标准json里不支持\后跟单引号
      [/\r/g, "\\r"],
      [/\n/g, "\\n"],
      [/\t/g, "\\t"]
    ]);
  };

  nx.has = function(inTarget, inName) {
    if (inTarget) {
      if (inTarget.has) {
        return inTarget.has(inName);
      } else {
        return inName in inTarget;
      }
    }
    return false;
  };

  nx.get = function(inTarget, inName) {
    if (inTarget) {
      if (inTarget.get) {
        return inTarget.get(inName);
      } else {
        return inTarget[inName];
      }
    }
  };

  nx.set = function(inTarget, inName, inValue) {
    if (inTarget) {
      if (inTarget.set && inTarget !== nx) {
        return inTarget.set(inName, inValue);
      } else {
        return inTarget[inName] = inValue;
      }
    }
  };

  nx.gets = function(inTarget) {
    if (inTarget) {
      if (inTarget.gets) {
        return inTarget.gets();
      } else {
        return nx.mix({}, inTarget);
      }
    }
  };

  nx.sets = function(inTarget, inObject) {
    if (inTarget) {
      if (inTarget.sets) {
        return inTarget.sets(inObject);
      } else {
        return nx.mix(inTarget, inObject);
      }
    }
  };

  //todo:about NaN? (nx.type?)
  nx.is = function(inTarget, inType) {
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

  nx.path = function(inTarget, inPath, inValue) {
    if (typeof inPath !== 'string') {
      nx.error('Path must be a string!');
    }

    var paths = inPath.split('.'),
      result = inTarget || nx.global,
      last;

    if (undefined === inValue) {
      nx.each(paths, function(_, path) {
        result = nx.get(result, path);
      });
    } else {
      last = paths.pop();
      paths.forEach(function(path) {
        result = result[path] = result[path] || {};
      });
      nx.set(result, last, inValue);
    }
    return result;
  };

  nx.format = function(inString, inArgs) {
    var result = inString || '';
    var replaceFn = nx.isArray(inArgs) ? function(str, match) {
        return inArgs[match];
      } : function(str, match) {
        return nx.path(inArgs, match);
      };
    result = inString.replace(fomratRE, replaceFn);
    return result;
  };

  // Some old versions of Android don't have Function.prototype.bind
  nx.bind = function(inMethod, inContext){
    return function () {
      return inMethod.apply(inContext, arguments);
    };
  };

  nx.binds = function(inContext,inArray){
    nx.each(inArray, function (_, name) {
      this[name] = this[name].bind(this);
    }, inContext);
  };

  nx.delegates = function(inSource,inTarget,inArray){
    inArray.forEach(function(name){
      inSource[name] = inTarget[name].bind(inTarget);
    });
  };

  //todo: nx.Promise
  nx.delay = function(inInterval){
    return new Promise(function(resolve){
      var timeout = setTimeout(function(){
        resolve(timeout);
      },inInterval);
    });
  };

  nx.toArray = function(inObj) {
    if (!inObj) return [];
    if (nx.isArrayLike(inObj)) return slice.call(inObj);
    return [inObj];
  };

  nx.compact = function(inArray) {
    return filter.call(inArray, function(item) {
      return item != null
    });
  };

  nx.parse = function(inValue) {
    try {
      return JSON.parse(inValue);
    } catch (_) {}
    return inValue;
  };

  nx.stringify = function(inValue) {
    try {
      return JSON.stringify(inValue);
    } catch (_) {}
    return inValue;
  };

  // http://dev.qwrap.com/download/latest/apps/qwrap-debug.js?20131207
  nx.toString = function(inObj) {
    var arr;
    if (inObj == null) {
      return inObj + '';
    }
    if (typeof inObj != 'string' && inObj.toJSON) { //JK: IE8的字符串的toJSON有问题，丢了引号
      return inObj.toJSON();
    }
    var type = nx.type(inObj);
    switch (type) {
      case 'string':
        return '"' + nx.escapeChars(inObj) + '"';
      case 'number':
        var ret = inObj.toString();
        return /N/.test(ret) ? 'null' : ret;
      case 'boolean':
      case 'function':
        return inObj.toString();
      case 'date':
        return 'new Date(' + inObj.getTime() + ')';
      case 'array':
        for (var arr = [], i = 0; i < inObj.length; i++) {
          arr[i] = nx.toString(inObj[i]);
        }
        return '[' + arr.join(',') + ']';
      case 'object':
        if (nx.isPlainObject(inObj)) {
          arr = [];
          for (i in inObj) {
            arr.push('"' + nx.escapeChars(i) + '":' + nx.toString(inObj[i]));
          }
          return '{' + arr.join(',') + '}';
        }
    }
    return 'null'; //无法序列化的，返回null;
  };

  nx.delete = function(inObject, inArray) {
    var obj = nx.clone({}, inObject, true);
    inArray.forEach(function(key) {
      delete obj[key];
    });
    return obj;
  };

  nx.param = function(inObj) {
    var str = [];
    var key, value, encodeValue;
    for (key in inObj) {
      value = inObj[key];
      if (value != null) {
        encodeValue = nx.isArray(value) ? value.join() : value;
        str.push(encodeURIComponent(key) + '=' + encodeURIComponent(encodeValue));
      }
    }
    return str.join("&");
  };

  nx.hashlize = function(inUrl) {
    var result = {};
    var query = inUrl ==null ? global.location.search.substring(1):inUrl.substring(inUrl.indexOf('?') + 1);
    var params = query.split('&');
    var arr, pair, key, value;
    nx.each(params, function(_, param) {
      pair = param.split('=');
      key = pair[0];
      value = pair[1];
      if(value){
        switch (typeof result[key]) {
          case 'undefined':
            result[key] = decodeURIComponent(value);
            break;
          case 'string':
            arr = [result[key], decodeURIComponent(value)];
            result[key] = arr;
            break;
          default:
            result[key].push(decodeURIComponent(value));
        }
      }
    });
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

  var callStackRE1 = /__Class__\.(.*) \(/;
  var callStackRE2 = /at (.*) \(/;

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
        args = nx.toArray(arguments);
        return method.apply(this, args);
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
          //todo: remove is
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
    init: nx.noop,
    destroy: nx.noop,
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
    this.base = inMeta.extends || nx.RootClass;
    this.module = nx.camelCase(inMeta.module);
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
        __pure_static__: !this.meta.methods && !!this.meta.statics
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
      var target = inClassMeta.__pure_static__ ? this.__Class__ : this.__Class__.prototype;
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
    lifeCycle.copyBaseProto();
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
