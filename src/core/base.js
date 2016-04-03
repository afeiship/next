nx = {
  BREAKER: {},
  VERSION: '1.0.10',
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
