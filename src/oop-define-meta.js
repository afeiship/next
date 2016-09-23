(function (nx, global) {

  nx.defineProperty = function (inTarget, inName, inMeta) {
    var key = '@' + inName;
    var valType;
    var meta = nx.isObject(inMeta) ? inMeta : {
      value: inMeta
    };
    var getter, setter, descriptor;
    var value, filed;

    if ('value' in meta) {
      value = meta.value;
      filed = '_' + inName;
      valType = nx.type(value);

      getter = function () {
        if (filed in this) {
          return this[filed];
        } else {
          return nx.isFunction(valType) ? value.call(this) : value;
        }
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

  nx.defineMethod = function (inTarget, inName, inMeta) {
    var key = '@' + inName;
    var descriptor = inTarget[key] = {
      __meta__: inMeta,
      __name__: inName,
      __type__: 'method'
    };
    inTarget[inName] = inMeta;
    return descriptor;
  };

  nx.defineStatic = function (inTarget, inName, inMeta) {
    var descriptor = {
      __meta__: inMeta,
      __name__: inName,
      __type__: 'static'
    };
    //nx.isFunction(inMeta) && nx.mix(inMeta, descriptor);
    inTarget[inName] = inMeta;
    return descriptor;
  };

}(nx, nx.GLOBAL));
