(function(nx, global) {
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
      var methods = this.meta.methods || {};
      var statics = this.meta.statics || {};
      nx.mix(this.__class_meta__, {
        __type__: this.type,
        __meta__: this.meta,
        __base__: this.base,
        __class_id__: classId++,
        __method_init__: methods.init || this.base.__method_init__,
        __static_init__: statics.init || this.base.__static_init__,
        __static__: !this.meta.methods && !!this.meta.statics
      });
    },
    createClassProcessor: function() {
      var self = this;
      this.__class__ = function() {
        this.__id__ = ++instanceId;
        self.__constructor__.apply(this, arguments);
      };
    },
    inheritProcessor: function() {
      var classMeta = this.__class_meta__;
      this.extendsClass(classMeta);
      this.defineMethods(classMeta);
      this.defineProperties(classMeta);
      this.defineStatics(classMeta);
    },
    copyBaseProto: function() {
      this.__class__.prototype.$base = this.$base;
    },
    extendsClass: function(inClassMeta) {
      var BaseClass = function() {};
      BaseClass.prototype = this.$base;
      this.__class__.prototype = new BaseClass();
      this.__class__.constructor = this.__class__;
    },
    defineMethods: function(inClassMeta) {
      var methods = nx.mix(inClassMeta.__methods__, this.meta.methods);
      nx.defineMembers('Method', this.__class__.prototype, methods, false);
    },
    defineProperties: function(inClassMeta) {
      var isStatic = inClassMeta.__static__;
      var target = isStatic ? this.__class__ : this.__class__.prototype;
      var properties = nx.mix(inClassMeta.__properties__, this.meta.properties);
      nx.defineMembers('Property', target, properties, isStatic);
    },
    defineStatics: function(inClassMeta) {
      var statics = nx.mix(inClassMeta.__statics__, this.meta.statics);
      nx.defineMembers('Method', this.__class__, statics, true);
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
      if (type !== NX_ANONYMOUS + classId) {
        nx.set(nx.GLOBAL, type, Class);
      }
    }
  };

  nx.declare = function(inType, inMeta) {
    var type = typeof inType === 'string' ? inType : NX_ANONYMOUS + classId;
    var meta = inMeta || inType;
    var lifeCycle = new LifeCycle(type, meta);
    lifeCycle.initMetaProcessor();
    lifeCycle.createClassProcessor();
    lifeCycle.copyBaseProto();
    lifeCycle.inheritProcessor();
    lifeCycle.methodsConstructorProcessor();
    lifeCycle.staticsConstructorProcessor();
    lifeCycle.registerProcessor();
    return lifeCycle.__class__;
  };
})(nx, nx.GLOBAL);
