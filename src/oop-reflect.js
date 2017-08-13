(function (nx, global) {

  nx.defineProperty = function (inTarget, inName, inMeta, inMixins) {
    var key = '@' + inName;
    var getter, setter, descriptor;
    var value, filed;
    var meta = (inMeta && typeof inMeta === 'object') ? inMeta : {
        value: inMeta
      };

    if ('value' in meta) {
      value = meta.value;
      filed = '_' + inName;

      getter = function () {
        return filed in this ? this[filed] : (typeof value === 'function') ? value.call(this) : value;
      };

      setter = function (inValue) {
        this[filed] = inValue;
      };

    } else {
      getter = inMeta.get || inTarget[key] && inTarget[key].get || nx.noop;
      setter = inMeta.set || inTarget[key] && inTarget[key].set || nx.noop;
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
      get: getter,
      set: setter,
      configurable: true
    };

    Object.defineProperty(inTarget, inName, descriptor);

    return descriptor;
  };

  nx.defineMethod = function (inTarget, inName, inMeta, inMixins) {
    var key = '@' + inName;

    inMixins.forEach(function (mixin) {
      var prototype = mixin.prototype;
      key in prototype && (inMeta.__base__ = prototype[key].__meta__);
    });

    key in inTarget && (inMeta.__base__ = inTarget[key].__meta__);

    inTarget[inName] = inMeta;
    return inTarget[key] = {
      __meta__: inMeta,
      __name__: inName,
      __type__: 'method'
    };
  };

  nx.defineStatic = function (inTarget, inName, inMeta, inMixins) {
    var key = '@' + inName;

    inMixins.forEach(function (mixin) {
      key in mixin && (inMeta.__base__ = mixin[key].__meta__);
    });

    (key in inTarget) && (inMeta.__base__ = inTarget[key].__meta__);

    inTarget[inName] = inMeta;
    return inTarget[key] = {
      __meta__: inMeta,
      __name__: inName,
      __type__: 'static'
    };
  };

  nx.defineMembers = function (inMember, inTarget, inObject, inMixins) {
    var memberAction = 'define' + inMember.charAt(0).toUpperCase() + inMember.slice(1);
    nx.each(inObject, function (key, val) {
      nx[memberAction](inTarget, key, val, inMixins);
    });
  };

}(nx, nx.GLOBAL));
