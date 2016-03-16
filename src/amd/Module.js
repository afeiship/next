(function (nx, global) {

  var Path = nx.amd.Path;
  var Loader = nx.amd.Loader;
  var Module = nx.declare('nx.amd.Module', {
    properties: {
      path: '',
      dependencies: null,
      factory: null
    },
    statics: {
      all: {},
      current: null
    },
    methods: {
      init: function (inPath, inDeps, inFactory) {
        this.sets({
          path: inPath || '',
          dependencies: inDeps || [],
          factory: inFactory || nx.noop
        });
        this.resetProperties();
      },
      resetProperties: function () {
        //todo:buggy
        this.__factory=this.get('factory');
        this._count = this.dependencies.length;
        this._params = [];
      },
      load: function (inCallback) {
        var ext, path;
        var baseUrl = nx.config.get('baseUrl');
        var deps = this.dependencies;
        this.on('allLoad', function () {
          this.onModuleAllLoad.call(this, inCallback);
        }, this);
        nx.each(deps, function (_, dep) {
          ext = Path.getExt(dep);
          path = Path.normalize(
            Path.setExt(baseUrl + dep, ext)
          );
          this.attachLoader(path, ext, inCallback);
        }, this);
      },
      attachLoader: function (inPath, inExt) {
        var loader = this.loader = new Loader(inPath, inExt);
        loader.on('load', this.onModuleLoad, this);
        loader.load();
      },
      onModuleLoad: function () {
        console.log('item load');
        var factory = Module.current.get('factory');
        this._params[this._count] = factory();
        this._count--;
        this.sets({
          path: this.loader.path,
          dependencies: Module.current.get('dependencies'),
          factory: factory
        });
        if (this._count === 0) {
          this.fire('allLoad');
        }
      },
      onModuleAllLoad: function (inCallback) {
        console.log('this.this.__factory',this.__factory);
        console.log('this._count', this._count);
        console.log('this._params', this._params);
        console.log('inCallback', inCallback);
        console.log('All loaded!');
      }
    }
  });

}(nx, nx.GLOBAL));
