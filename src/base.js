nx = {
  BREAKER: {},
  VERSION: '1.3.5',
  DEBUG: false,
  GLOBAL: (function () {
    return this;
  }).call(null)
};

(function (nx, global) {

  var DOT = '.';
  var NUMBER = 'number';
  var ARRAY_PROTO = Array.prototype;
  var RETURN_THEN = { then: nx.noop };

  //global.nx will be 'undefined' in webpack/node env:
  global.nx = global.nx || nx;

  nx.noop = function () {
  };

  nx.returnValue = function(inValue){
    return inValue;
  };

  nx.returnTrue = function(){
    return true;
  };

  nx.returnFalse = function(){
    return false;
  };

  nx.returnThen = function(){
    return RETURN_THEN;
  };

  nx.returnEventValue = function(inEvent){
    var target = inEvent.target;
    return target ? target.value : null;
  };

  nx.error = function (inMsg) {
    throw new Error(inMsg);
  };

  nx.forEach = function(inArray, inCallback, inContext){
    var length = inArray.length;
    var i;
    var result;
    if( typeof length === NUMBER ){
      for(i = 0; i<length; i++){
        result = inCallback.call(inContext, inArray[i], i, inArray );
        if( result === nx.BREAKER){
          break;
        }
      }
    }
  };

  nx.forIn = function(inObject, inCallback, inContext){
    for (var key in inObject) {
      if (inObject.hasOwnProperty(key)) {
        if (inCallback.call(inContext, key, inObject[key])) {
          break;
        }
      }
    }
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
    var result = Array(length);

    for (var index = 0; index < length; index++) {
      var currentKey = keys ? keys[index] : index;
      result[index] = inCallback(currentKey, inTarget[currentKey], inTarget );
    }
    return result;
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

  nx.slice = function (inTarget, inStart, inEnd) {
    return ARRAY_PROTO.slice.call(inTarget, inStart, inEnd);
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
} else {
  if (typeof define === 'function' && define.amd) {
    define([], function () {
      return nx;
    });
  } else {
    window.nx = nx;
  }
}
