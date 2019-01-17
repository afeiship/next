nx = {
  BREAKER: {},
  VERSION: '__VERSION__',
  DEBUG: false,
  GLOBAL: function() {
    return this;
  }.call(null)
};

(function(nx, global) {
  var DOT = '.';
  var NUMBER = 'number';
  var ARRAY_PROTO = Array.prototype;
  var hasOwn = Object.prototype.hasOwnProperty;

  //global.nx will be 'undefined' in webpack/node/weapp env:
  global.nx = global.nx || nx;

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
      if (hasOwn.call(inObject, key)) {
        result = inCallback.call(inContext, key, inObject[key], inObject);
        if (result === nx.BREAKER) {
          break;
        }
      }
    }
  };

  nx.each = function(inTarget, inCallback, inContext) {
    var key, length;
    var iterator = function(inKey, inValue, inIsArray) {
      return (
        inCallback.call(inContext, inKey, inValue, inTarget, inIsArray) ===
        nx.BREAKER
      );
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
    var result = inTarget || nx.GLOBAL;
    var last = paths.pop();

    paths.forEach(function(path) {
      result = result[path] = result[path] || {};
    });
    result[last] = inValue;
    return inTarget;
  };

  nx.get = function(inTarget, inPath) {
    var paths = inPath.split(DOT);
    var result = inTarget || nx.GLOBAL;

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
