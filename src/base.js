
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
