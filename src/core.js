(function () {
  var DOT = '.';
  var NUMBER = 'number';
  var UNDEF = 'undefined';
  var ARRAY_PROTO = Array.prototype;
  var toString = Object.prototype.toString;
  var hasOwn = Object.prototype.hasOwnProperty;
  var INDEXES_PATH_RE = /\[(\w+)\]/g;
  var MULTIPLE_DOT_RE = /[.]+/g;
  var EDGE_DOT_RE = /^\.|\.$/g;
  var POS1 = '.$1';
  var EMP = '';
  var normalize = function (path) {
    return path
      .replace(INDEXES_PATH_RE, POS1)
      .replace(MULTIPLE_DOT_RE, DOT)
      .replace(EDGE_DOT_RE, EMP);
  };

  nx.noop = function () {};

  nx.typeof = function (inTarget) {
    var isPrimitive = inTarget == null || typeof inTarget !== 'object';
    if (!isPrimitive) return toString.call(inTarget).slice(8, -1).toLowerCase();
    if (inTarget === null) return 'null';
    if (inTarget === undefined) return 'undefined';
    return typeof inTarget;
  };

  nx.stubTrue = function () {
    return true;
  };

  nx.stubFalse = function () {
    return false;
  };

  nx.stubValue = function (inValue) {
    return inValue;
  };

  nx.stubPromise = function (inValue) {
    return Promise.resolve(inValue);
  };

  nx.error = function (inMsg) {
    throw new Error(inMsg);
  };

  nx.try = function (inFn, inCatch) {
    var cb = inCatch || nx.noop;
    try {
      inFn();
    } catch (err) {
      cb(err);
    }
  };

  nx.forEach = function (inArray, inCallback, inContext) {
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

  nx.forIn = function (inObject, inCallback, inContext) {
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

  nx.each = function (inTarget, inCallback, inContext) {
    var key, length;
    var iterator = function (inKey, inValue, inIsArray) {
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

  nx.map = function (inTarget, inCallback, inContext) {
    var result = [];
    nx.each(inTarget, function () {
      var item = inCallback.apply(inContext, arguments);
      if (item !== nx.BREAKER) {
        result.push(item);
      } else {
        return nx.BREAKER;
      }
    });
    return result;
  };

  nx.mix = function (inTarget) {
    var target = inTarget || {};
    var i, length;
    var args = arguments;
    for (i = 1, length = args.length; i < length; i++) {
      nx.forIn(args[i], function (key, val) {
        target[key] = val;
      });
    }
    return target;
  };

  nx.slice = function (inTarget, inStart, inEnd) {
    return ARRAY_PROTO.slice.call(inTarget, inStart, inEnd);
  };

  nx.set = function (inTarget, inPath, inValue) {
    var indexesPath = normalize(inPath);
    var paths = indexesPath.split(DOT);
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

  nx.get = function (inTarget, inPath, inValue) {
    if (!inPath) return inTarget;
    var indexesPath = normalize(inPath);
    var paths = indexesPath.split(DOT);
    var result = inTarget || nx.GLOBAL;

    paths.forEach(function (path) {
      result = result && result[path];
    });

    return typeof inValue !== UNDEF && typeof result === UNDEF
      ? inValue
      : result;
  };

  nx.del = function (inTarget, inPath) {
    var indexesPath = normalize(inPath);
    var paths = indexesPath.split(DOT);
    for (var i = 0; i < paths.length; i++) {
      var path = paths[i];

      if (i === paths.length - 1) {
        delete inTarget[path];
        return true;
      }
      inTarget = inTarget[path];
    }
    return false;
  };

  nx.path = function (inTarget, inPath, inValue) {
    return inValue == null
      ? this.get(inTarget, inPath)
      : this.set(inTarget, inPath, inValue);
  };

  nx.to = function (inPromise) {
    return inPromise
      .then(function (data) {
        return [undefined, data];
      })
      .catch(function (err) {
        return [err];
      });
  };

  nx.createOverload = function () {
    var fnCacheMap = {};
    function overload() {
      var args = nx.slice(arguments);
      var key = args.map(nx.typeof).join();
      var fn = fnCacheMap[key];
      if (!fn) {
        throw new Error('No matching function, parameter type: [' + key + ']');
      }
      return fn.apply(this, args);
    }

    overload.add = function (inOptions) {
      var args = inOptions.args;
      var fn = inOptions.fn;
      var types = args.join();
      if (typeof fn !== 'function') {
        throw new Error('The fn must be a function');
      }
      fnCacheMap[types] = fn;
    };

    return overload;
  };
})();
