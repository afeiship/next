(function (nx, global) {

  function RootClass() {
  }

  var classMeta = {
    __classId__: 0,
    __type__: 'nx.RootClass',
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
    base: function () {
      //TODO:NOT SUPPORT ES5 `USE STRICT` MODE
      var method = this.base.caller.__base__;
      if (method) {
        return method.apply(this, arguments);
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
      return member.__meta__;
    },
    memberType: function (inName) {
      var member = this.member(inName);
      return member.__type__;
    },
    init: function () {
      //will be implement
    },
    destroy: function () {
      //will be implement
    },
    toString: function () {
      return '[Class@' + this.__type__ + ']';
    }
  };

  nx.mix(RootClass, classMeta);
  nx.mix(prototype, classMeta);
  nx.mix(prototype, nx.event);

  nx.RootClass = RootClass;

}(nx, nx.GLOBAL));
