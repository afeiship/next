;(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.nx = factory();
  }
}(this, function() {
var nx = {
  BREAKER: {},
  VERSION: '1.0.0',
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

  //populate class2type map:
  javascriptType.split(' ').forEach(function (inName) {
    class2type["[object " + inName + "]"] = inName.toLowerCase()
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
    if (inObj && inObj.__type__) {
      return inObj.__type__;
    }
    return inObj == null ? String(inObj) :
    class2type[toString.call(inObj)] || 'object';
  };


  nx.isNumber = function (obj) {
    return !isNaN(obj) && typeof(obj) == 'number';
  };

  nx.isBoolean = function (obj) {
    return typeof(obj) == 'boolean';
  };

  nx.isString = function (obj) {
    return typeof(obj) == 'string';
  };

  nx.isArray = Array.isArray || function (obj) {
      return obj instanceof Array;
    };

  nx.isArrayLike = function (obj) {
    return typeof obj.length == 'number';
  };

  nx.isFunction = function (obj) {
    return typeof(obj) == 'function';
  };

  nx.isObject = function (obj) {
    return nx.type(obj) == 'object';
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

  nx.has = function (inTarget, inName) {
    if (inTarget) {
      if (inTarget.__has__) {
        return inTarget.__has__(inName);
      } else {
        return inName in inTarget;
      }
    }
    return false;
  };

  nx.get = function (inTarget, inName) {
    if (inTarget) {
      if (inTarget.__get__) {
        return inTarget.__get__(inName);
      } else {
        return inTarget[inName];
      }
    }
  };

  nx.set = function (inTarget, inName, inValue) {
    if (inTarget) {
      if (inTarget.__set__) {
        return inTarget.__set__(inName, inValue);
      } else {
        return inTarget[inName] = inValue;
      }
    }
  };

  nx.gets = function (inTarget) {
    if (inTarget) {
      if (inTarget.__gets__) {
        return inTarget.__gets__();
      } else {
        return nx.mix({}, inTarget);
      }
    }
  };

  nx.sets = function (inTarget, inObject) {
    if (inTarget) {
      if (inTarget.__sets__) {
        return inTarget.__sets__(inObject);
      } else {
        return nx.mix(inTarget, inObject);
      }
    }
  };


  nx.is = function (inTarget, inType) {
    if (inTarget && inTarget.__is__) {
      return inTarget.__is__(inType);
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

  nx.parse = function (inValue) {
    return JSON.parse(inValue);
  };

  nx.stringify = function (inValue, inReplacer, inSpace) {
    return JSON.stringify(inValue, inReplacer, inSpace);
  };

}(nx, nx.GLOBAL));

return nx;
}));
