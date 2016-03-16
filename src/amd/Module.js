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
          console.log(path);
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
          deps = inLoader.ext === 'css' ? [] : currentModule.get('dependencies'),
          nDeps = deps.length,
          params=[];

        console.log(nDeps);
        if (nDeps === 0) {
          //end:
          console.log('end!!!');
        } else {
          nx.each(deps,function(index,dep){
            currentModule.load(function(){
              //params[index]=Module.current.get('factory')
            })
          });
          console.log('ing!!!');
        }


        this._count--;
        this.sets({
          path: inLoader.path,
          dependencies: deps,
          factory: factory
        });
        if (this._count === 0) {
          this.fire('allLoad');
        }
      },
      onModuleAllLoad: function (inCallback) {
        //console.log('this._callback',this._callback);
        //console.log('this._params',this._params);
        //console.log('inCallback', inCallback);
        //console.log('All loaded!');
        //console.log(inCallback.toString(), inParam);
        inCallback.call(this);
        //console.log(this._params[0]);
        //this._callback(this._params[0]);
        //inCallback.call(this._params.slice(1));
      }
    }
  });

}(nx, nx.GLOBAL));
