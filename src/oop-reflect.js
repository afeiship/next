(function(nx, global) {
  var MEMBER_PREFIX = '@';
  var VALUE = 'value';

  nx.defineProperty = function(inTarget, inName, inMeta, inIsStatic) {
    var key = MEMBER_PREFIX + inName;
    var getter, setter, descriptor;
    var value, filed;
    var isObject = typeof inMeta === 'object';
    var meta = inMeta && isObject ? inMeta : { value: inMeta };

    if (VALUE in meta) {
      value = meta.value;
      filed = '_' + inName;

      getter = function() {
        return filed in this
          ? this[filed]
          : typeof value === 'function'
          ? value.call(this)
          : value;
      };

      setter = function(inValue) {
        this[filed] = inValue;
      };
    } else {
      getter = inMeta.get || (inTarget[key] && inTarget[key].get) || nx.noop;
      setter = inMeta.set || (inTarget[key] && inTarget[key].set) || nx.noop;
    }

    //remain base setter/getter:
    if (key in inTarget) {
      getter.__base__ = inTarget[key].get;
      setter.__base__ = inTarget[key].set;
    }

    descriptor = inTarget[key] = {
      __meta__: inMeta,
      __name__: inName,
      __type__: 'property',
      __static__: !!inIsStatic,
      get: getter,
      set: setter,
      configurable: true
    };

    Object.defineProperty(inTarget, inName, descriptor);

    return descriptor;
  };

  nx.defineMethod = function(inTarget, inName, inMeta, inIsStatic) {
    var key = MEMBER_PREFIX + inName;
    key in inTarget && (inMeta.__base__ = inTarget[key].__meta__);

    inTarget[inName] = inMeta;
    return (inTarget[key] = {
      __meta__: inMeta,
      __name__: inName,
      __type__: 'method',
      __static__: !!inIsStatic
    });
  };

  nx.defineBombMethod = function(inTarget, inName, inMeta, inIsStatic) {
    var keys = inName.split(',');
    keys.forEach(function(key) {
      nx.defineMethod(inTarget, key, inMeta.call(inTarget, key), inIsStatic);
    });
  };

  nx.defineMembers = function(inMember, inTarget, inObject, inIsStatic) {
    nx.each(inObject, function(key, val) {
      if (key.indexOf(',') > -1) {
        nx.defineBombMethod(inTarget, key, val, inIsStatic);
      } else {
        nx['define' + inMember](inTarget, key, val, inIsStatic);
      }
    });
  };
})(nx, nx.GLOBAL);
