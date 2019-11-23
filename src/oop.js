(function(nx) {
  var classId = 1,
    instanceId = 0;
  var NX_ANONYMOUS = 'nx.Anonymous';

  function LifeCycle(inType, inMeta) {
    this.type = inType;
    this.meta = inMeta;
    this.base = inMeta.extends || nx.RootClass;
    this.$base = this.base.prototype;
    this.__class_meta__ = {};
    this.__class__ = null;
    this.__constructor__ = null;
  }

  LifeCycle.prototype = {
    constructor: LifeCycle,
    initMetaProcessor: function() {
      var meta = this.meta;
      var methods = meta.methods || {};
      var statics = meta.statics || {};
      nx.mix(this.__class_meta__, {
        __type__: this.type,
        __meta__: meta,
        __base__: this.base,
        __class_id__: classId++,
        __method_init__: methods.init || this.base.__method_init__,
        __static_init__: statics.init || this.base.__static_init__,
        __static__: !meta.methods && !!meta.statics
      });
    },
    createClassProcessor: function() {
      var self = this;
      this.__class__ = function() {
        this.__id__ = instanceId++;
        self.__constructor__.apply(this, arguments);
        self.registerDebug(this);
      };
    },
    inheritProcessor: function() {
      var classMeta = this.__class_meta__;
      this.inheritedClass(classMeta);
      this.defineMethods(classMeta, true);
      this.defineMethods(classMeta, false);
      this.defineProperties(classMeta);
    },
    inheritedClass: function(inClassMeta) {
      var SuperClass = function() {};
      var Class = this.__class__;
      SuperClass.prototype = this.$base;
      Class.prototype = new SuperClass();
      Class.prototype.$base = this.$base;
      Class.prototype.constructor = Class;
    },
    defineMethods: function(inClassMeta, inIsStatic) {
      var key = inIsStatic ? 'statics' : 'methods';
      var key_ = '__' + key + '__';
      var target = inIsStatic ? this.__class__ : this.__class__.prototype;
      var baseTarget = inIsStatic ? this.base : this.base.prototype;
      var methods = baseTarget[key_] || {};
      nx.forIn(this.meta[key], function(key, value) {
        if (methods[key] && typeof value === 'function') {
          value.__base__ = methods[key];
        }
      });
      target[key_] = nx.mix(inClassMeta[key_], methods, this.meta[key]);
      nx.defineMembers('Method', target, target[key_], inIsStatic);
    },
    defineProperties: function(inClassMeta) {
      var isStatic = inClassMeta.__static__;
      var target = isStatic ? this.__class__ : this.__class__.prototype;
      target.__properties__ = nx.mix(
        inClassMeta.__properties__,
        this.meta.properties
      );
      nx.defineMembers('Property', target, target.__properties__, isStatic);
    },
    methodsConstructorProcessor: function() {
      var classMeta = this.__class_meta__;
      this.__constructor__ = function() {
        classMeta.__method_init__.apply(this, arguments);
      };
    },
    staticsConstructorProcessor: function() {
      var classMeta = this.__class_meta__;
      classMeta.__static_init__.call(this.__class__);
    },
    registerProcessor: function() {
      var Class = this.__class__;
      var type = this.type;
      var classMeta = this.__class_meta__;

      nx.mix(Class.prototype, classMeta);
      nx.mix(Class, classMeta);
      if (type.indexOf(NX_ANONYMOUS) === -1) {
        nx.set(nx.GLOBAL, type, Class);
      }
    },
    registerDebug: function(inInstance) {
      if (nx.DEBUG) {
        nx.set(nx, '__instances__.' + (instanceId - 1), inInstance);
        nx.set(nx, '__instances__.length', instanceId);
      }
    }
  };

  nx.declare = function(inType, inMeta) {
    var type = typeof inType === 'string' ? inType : NX_ANONYMOUS + classId;
    var meta = inMeta || inType;
    var lifeCycle = new LifeCycle(type, meta);
    lifeCycle.initMetaProcessor();
    lifeCycle.createClassProcessor();
    lifeCycle.inheritProcessor();
    lifeCycle.methodsConstructorProcessor();
    lifeCycle.staticsConstructorProcessor();
    lifeCycle.registerProcessor();
    return lifeCycle.__class__;
  };
})(nx);
