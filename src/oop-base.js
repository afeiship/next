(function(nx) {
  var RootClass = function() {};
  var classMeta = {
    __class_id__: 0,
    __type__: 'nx.RootClass',
    __base__: Object,
    __meta__: {},
    __static__: false,
    __statics__: {},
    __properties__: {},
    __methods__: {},
    __method_init__: nx.noop,
    __static_init__: nx.noop
  };

  var baseMethods = {
    base: function() {
      var caller = this.base.caller;
      var baseMethod;
      if (caller && (baseMethod = caller.__base__)) {
        return baseMethod.apply(this, arguments);
      }
    },
    parent: function(inName) {
      var isStatic = typeof this.__id__ === 'undefined';
      var args = nx.slice(arguments, 1);
      var base = isStatic ? this.__base__ : this.__base__.prototype;
      var type = this['@' + inName].__type__;
      var accessor = ['get', 'set'][args.length];
      switch (type) {
        case 'method':
          return base[inName].apply(this, args);
        case 'property':
          return base['@' + inName][accessor].apply(this, args);
      }
    }
  };

  classMeta.__methods__ = RootClass.prototype = nx.mix(
    {
      constructor: RootClass,
      init: nx.noop,
      destroy: nx.noop,
      toString: function() {
        return '[Class@' + this.__type__ + ']';
      }
    },
    baseMethods
  );

  //mix && export:
  nx.mix(classMeta.__statics__, baseMethods);
  nx.mix(RootClass, classMeta);
  nx.mix(RootClass, classMeta.__statics__);
  nx.RootClass = RootClass;
})(nx);
