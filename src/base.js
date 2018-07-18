nx = {
  BREAKER: {},
  VERSION: '1.3.9',
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
    var key;
    var result;
    for (var key in inObject) {
      if (inObject.hasOwnProperty(key)) {
        result = inCallback.call(inContext, key, inObject[key], inObject );
        if (result === nx.BREAKER) {
          break;
        }
      }
    }
  };

  nx.each = function (inTarget, inCallback, inContext) {
    var key, length;
    var iterator = function (inKey, inValue) {
      return inCallback.call(inContext, inKey, inValue, inTarget) === nx.BREAKER;
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
      result[index] = inCallback.call(inContext, currentKey, inTarget[currentKey], inTarget );
    }
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

  nx.path = function (inTarget, inPath, inValue) {
    var paths = inPath.split(DOT);
    var result = inTarget || nx.global;
    var last;

    if (undefined === inValue) {
      paths.forEach(function(path){
        result = result[path];
      })
    } else {
      last = paths.pop();
      paths.forEach(function (path) {
        result = result[path] = result[path] || {};
      });
      result[last] = inValue;
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
