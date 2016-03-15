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
      depsMap: {},
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
        Module.depsMap[this.path] = this.dependencies;
      },
      load: function (inCallback) {
        var ext, path, fullPath, loader;
        var baseUrl = nx.config.get('baseUrl');
        var deps = this.dependencies;
        nx.each(deps, function (_, dep) {
          ext = Path.getExt(dep);
          path = Path.normalize(baseUrl + dep);
          fullPath = Path.setExt(baseUrl + dep, ext);
          loader = new Loader(fullPath);
        }, this);
        if (deps.length === 0) {
        }
      },
      getModule: function (inPath) {
      }
    }
  });

}(nx, nx.GLOBAL));
