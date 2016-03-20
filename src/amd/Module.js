(function (nx, global) {

  var Path = nx.amd.Path;
  var Loader = nx.amd.Loader;
  var STATUS = nx.amd.Status;

  var Module = nx.declare('nx.amd.Module', {
    properties: {
      path: '',
      value: null,
      dependencies: null,
      factory: null,
      status: STATUS.PENDING,
      count: {
        get: function () {
          return this._count;
        },
        set: function (inValue) {
          if (inValue === 0) {
            //this._loadingModules.reverse();
            this.fire('allLoad');
          }
          this._count = inValue;
        }
      }
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
        this._loadingModules = [];
      },
      load: function (inCallback, inOwner) {
        var ext, path, ownerPath;
        var baseUrl = nx.config.get('baseUrl'),
          deps = this.dependencies;
        this.count = this._length = deps.length;
        this.on('allLoad', function () {
          this.onModuleAllLoad.call(this, inCallback);
        }, this);

        nx.each(deps, function (_, dep) {
          ownerPath = inOwner ? Path.parent(inOwner.get('path')) : baseUrl;
          ext = Path.getExt(dep);
          path = Path.normalize(
            Path.setExt(ownerPath + dep, ext)
          );
          this.attachLoader(path, ext, inCallback);
        }, this);
      },
      attachLoader: function (inPath, inExt) {
        var loader = new Loader(inPath, inExt);
        loader.on('load', this.onModuleLoad, this);
        loader.load();
      },
      onModuleLoad: function (inLoader) {
        //console.log('item load');
        var currentModule = Module.current,
          factory = currentModule.get('factory'),
          deps = currentModule.get('dependencies'),
          value = currentModule.get('value'),
          nDeps = deps.length;

        Module.all[inLoader.path] = currentModule;

        currentModule.sets({
          path: inLoader.path,
          dependencies: deps,
          factory: factory
        });

        this.count--;

        this._loadingModules[this.count] = currentModule;
        if (nDeps === 0) {
          currentModule.set('value', factory());
        } else {
          currentModule.load(factory, currentModule);
        }

      },
      onModuleAllLoad: function (inCallback) {
        console.log(Module.all);
        //console.log('inCallback:->', inCallback);
        //console.log('this._callbacks', this._callbacks);
        //console.log('this._callback',this._callback);
        //console.log('this._params',this._params);
        //console.log('inCallback', inCallback);
        //console.log('All loaded!');
        //console.log(inCallback.toString(), inParam);
        //inCallback.call(this, params);
        //this.params = [];
        //console.log(this._params[0]);
        //this._callback(this._params[0]);
        //inCallback.call(this._params.slice(1));
      }
    }
  });

}(nx, nx.GLOBAL));
