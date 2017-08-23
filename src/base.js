nx = {
  BREAKER: {},
  VERSION: '1.3.1',
  DEBUG: false,
  GLOBAL: (function () {
    return this;
  }).call(null)
};

(function (nx, global) {

  var DOT = '.';
  var NUMBER = 'number';
  var NOOP_ARRAY = [];

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

  nx.map = function(inTarget, inCallback, inContext){
    var keys = typeof inTarget.length === NUMBER ? null : Object.keys( inTarget );
    var length = (keys || inTarget).length;
    var results = Array(length);

    for (var index = 0; index < length; index++) {
      var currentKey = keys ? keys[index] : index;
      results[index] = inCallback(currentKey, inTarget[currentKey], inTarget );
    }
    return results;
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

  nx.import = function(inKeys){
    var result = [];
    var isClient = typeof window !== 'undefined';
    return nx.map(inKeys,function(index, key){
      return isClient ? nx[key] : require('next-' + key);
    });
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
