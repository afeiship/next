nx = {
  BREAKER: {},
  VERSION: '1.2.0',
  DEBUG: false,
  GLOBAL: (function () {
    return this;
  }).call(null)
};

(function (nx, global) {

  var undefined;
  var camelCaseRE = /[-_]+(.)?/g;
  var emptyArray = [], slice = emptyArray.slice;
  var dasherizeRE1 = /::/g,
    dasherizeRE2 = /([A-Z]+)([A-Z][a-z])/g,
    dasherizeRE3 = /([a-z\d])([A-Z])/g,
    dasherizeRE4 = /_/g,
    dasherizeREPLACER = '$1_$2';

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
        if (nx.isArrayLike(inTarget)) {
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

  nx.camelCase = function (inStr) {
    return (inStr || '').replace(camelCaseRE, function (match, chr) {
      return chr ? chr.toUpperCase() : '';
    });
  };

  nx.dasherize = function (inStr) {
    return inStr.replace(dasherizeRE1, '/')
      .replace(dasherizeRE2, dasherizeREPLACER)
      .replace(dasherizeRE3, dasherizeREPLACER)
      .replace(dasherizeRE4, '-')
      .toLowerCase()
  };

  nx.trim = function (inStr) {
    return inStr == null ? '' : inStr.trim();
  };

  nx.capitalize = function (inStr) {
    return inStr.charAt(0).toUpperCase() + inStr.slice(1);
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


  nx.isUndefined = function (inObj) {
    return inObj === undefined;
  };

  nx.isNull = function (inObj) {
    return inObj === null;
  };

  nx.isNil = function (inObj) {
    return inObj == null;
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

  nx.isEmptyObject = function (inObj) {
    var key;
    for (key in inObj) return false;
    return true;
  };

  nx.replace = function (inString, inArray) {
    var i, length = inArray.length;
    for (i = 0; i < length; i++) {
      inString = inString.replace(inArray[i][0], inArray[i][1]);
    }
    return inString;
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
      if (inTarget.set && inTarget !== nx) {
        return inTarget.set(inName, inValue);
      } else {
        return inTarget[inName] = inValue;
      }
    }
  };

  nx.path = function (inTarget, inPath, inValue) {
    var paths = inPath.split('.'),
      result = inTarget || nx.global,
      last;

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
