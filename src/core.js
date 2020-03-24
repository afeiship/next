(function() {
  var DOT = '.';
  var NUMBER = 'number';
  var UNDEF = 'undefined';
  var ARRAY_PROTO = Array.prototype;
  var hasOwn = Object.prototype.hasOwnProperty;

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

  nx.get = function(inTarget, inPath, inValue) {
    if (!inPath) return inTarget;
    var paths = inPath.split(DOT);
    var result = inTarget || nx.GLOBAL;

    paths.forEach(function(path) {
      result = result && result[path];
    });

    return typeof inValue !== UNDEF && result == null ? inValue : result;
  };

  nx.path = function(inTarget, inPath, inValue) {
    return inValue == null
      ? this.get(inTarget, inPath)
      : this.set(inTarget, inPath, inValue);
  };
})();
