(function (nx, global) {

  var callStackRE1 = /__Class__\.(.*) \(/;
  var callStackRE2 = /at (.*) \(/;

  function RootClass() {
  }

  var classMeta = {
    __classId__: 0,
    __type__: 'nx.RootClass',
    __module__: 'root',
    __base__: Object,
    __meta__: {},
    __init__: nx.noop,
    __static_init__: nx.noop,
    __mixins__: [],
    __statics__: {},
    __properties__: [],
    __methods__: {}
  };

  var prototype = classMeta.__methods__ = RootClass.prototype = {
    constructor: RootClass,
    init: nx.noop,
    destroy: nx.noop,
    base: function () {
      var callerName, method;
      var args, stackes;
      try {
        method = this.base.caller.__base__;
        if (method) {
          return method.apply(this, arguments);
        }
      } catch (e) {
        stackes = e.stack.split('\n')[2];
        callerName = (stackes.match(callStackRE1) || stackes.match(callStackRE2))[1];
        method = this.$base[callerName];
        args = [].slice.call(arguments, 0);
        return method.apply(this, args);
      }
    },
    get: function (inName) {
      var type = this.memberType(inName);
      switch (type) {
        case 'method':
        case 'property':
        case 'undefined':
          return this[inName];
        case 'static':
          return this.constructor[inName];
      }
    },
    set: function (inName, inValue) {
      this[inName] = inValue;
    },
    gets: function () {
      var result = {};
      nx.each(this.__properties__, function (inName) {
        result[inName] = this.get(inName);
      }, this);
      return result;
    },
    sets: function (inTarget) {
      nx.each(inTarget, function (inName, inValue) {
        this.set(inName, inValue);
      }, this);
    },
    member: function (inName) {
      return this['@' + inName];
    },
    memberMeta: function (inName) {
      var member = this.member(inName);
      return member && member.__meta__;
    },
    memberType: function (inName) {
      var member = this.member(inName);
      return (member && member.__type__) || 'undefined';
    },
    toString: function () {
      return '[Class@' + this.__type__ + ']';
    }
  };

  nx.mix(RootClass, classMeta);
  nx.mix(prototype, classMeta, nx.event);

  nx.RootClass = RootClass;

}(nx, nx.GLOBAL));
