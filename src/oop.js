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
      this.extendsClass(classMeta);
      this.defineMethods(classMeta);
      this.defineProperties(classMeta);
      this.defineStatics(classMeta);
    },
    extendsClass: function(inClassMeta) {
      var SuperClass = function() {};
      SuperClass.prototype = this.$base;
      this.__class__.prototype = new SuperClass();
      this.__class__.prototype.$base = this.$base;
      this.__class__.prototype.constructor = this.__class__;
    },
    defineMethods: function(inClassMeta) {
      var target = this.__class__.prototype;
      target.__methods__ = nx.mix(
        inClassMeta.__methods__,
        target.__methods__,
        this.meta.methods
      );
      nx.defineMembers('Method', target, target.__methods__, false);
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
    defineStatics: function(inClassMeta) {
      var target = this.__class__;
      target.__statics__ = nx.mix(
        inClassMeta.__statics__,
        this.base.__statics__,
        this.meta.statics
      );
      nx.defineMembers('Method', target, target.__statics__, true);
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
})(nx, nx.GLOBAL);
