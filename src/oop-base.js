(function (nx, global) {

  var callStackRE1 = /__Class__\.(.*) \(/;
  var callStackRE2 = /at (.*) \(/;

  function RootClass() {
  }

  var classMeta = {
    __classId__: 0,
    __type__: 'nx.RootClass',
    __base__: Object,
    __module__: 'root',
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
        args = nx.toArray(arguments);
        return method.apply(this, args);
      }
    },
    setMeta: function (inName, inValue) {
      this['__' + inName + '__'] = inValue;
    },
    getMeta: function (inName) {
      return this['__' + inName + '__'];
    },
    is: function (inType) {
      var type = this.__type__;
      if (type === inType) {
        return true;
      } else {
        var base = this.__base__;
        if (base) {
          //todo: remove is
          return nx.is(base.prototype, inType);
        } else {
          return false;
        }
      }
    },
    type: function () {
      return this.__type__;
    },
    has: function (inName) {
      return inName in this;
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
    init: nx.noop,
    destroy: nx.noop,
    toString: function () {
      return '[Class@' + this.__type__ + ']';
    }
  };

  nx.mix(RootClass, classMeta);
  nx.mix(prototype, classMeta);
  nx.mix(prototype, nx.event);

  nx.RootClass = RootClass;

}(nx, nx.GLOBAL));
