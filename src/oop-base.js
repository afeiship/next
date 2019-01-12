(function(nx, global) {
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

  classMeta.__methods__ = RootClass.prototype = {
    constructor: RootClass,
    init: nx.noop,
    destroy: nx.noop,
    base: function() {
      var caller = this.base.caller;
      var baseMethod;
      if (caller && (baseMethod = caller.__base__)) {
        return baseMethod.apply(this, arguments);
      }
    },
    parent: function(inName) {
      var args = nx.slice(arguments, 1);
      var type = this['@' + inName].__type__
      switch(true){
        case type === 'method':
          return this.$base[inName].apply(this, args);
          break;
        case type === 'property' && args.length === 0:
          return this.$base['@' + inName].get.apply(this)
          break;
        case type === 'property' && args.length === 1:
          this.$base['@' + inName].set.apply(this,args)
          break;
      }
    },
    toString: function() {
      return '[Class@' + this.__type__ + ']';
    }
  };

  //mix && export:
  nx.mix(RootClass, classMeta);
  nx.RootClass = RootClass;
})(nx, nx.GLOBAL);
