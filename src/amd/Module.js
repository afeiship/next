(function (nx, global) {

  var STATUS = nx.amd.Status;
  var Path = nx.amd.Path;
  var isNodeEnv = typeof module !== 'undefined' && module.exports;
  var Module = nx.declare('nx.amd.Module', {
    statics: {
      all: {},
      current: null,
      load: function (inPath, inCallback, inOwner) {
        var currentPath = inPath,
          currentModule,
          ownerPath,
          loader,
          ext = Path.getExt(inPath);

        // If original path does not contain a SLASH, it should be the library path
        ownerPath = inOwner ? Path.parent(inOwner.get('path')) : './';
        currentPath = Path.normalize(ownerPath + currentPath);
        currentModule = Module.all[currentPath];

        if (currentModule) {
          return currentModule.load(inCallback);
        } else {
          if (!isNodeEnv) {
            loader = new nx.amd.Loader(currentPath, ext, inCallback);
          } else {
            loader = new nx.amd.Loader(inPath, 'nodejs', inCallback);
          }
          loader.load();
        }
      }
    },
    properties: {
      path: '',
      status: STATUS.PENDING,
      dependencies: null,
      factory: null,
      exports: null
    },
    methods: {
      init: function (inPath, inDeps, inFactory) {
        this.sets({
          path: inPath || '',
          dependencies: inDeps || [],
          factory: inFactory || nx.noop,
          exports: null
        });

        this._callbacks = [];
      },
      load: function (inCallback) {
        var status = this.get('status');
        if (status === STATUS.RESOLVED) {
          if (inCallback) {
            inCallback(this.get('exports'));
          }
        } else {
          if (inCallback) {
            this._callbacks.push(inCallback);
          }
        }

        if (status === STATUS.LOADING) {
          var deps = this.get('dependencies');
          var factory = this.get('factory');
          var exports = this.get('exports');
          var count = deps.length;
          var params = [];
          var self = this;
          var done = function (inValue, inParams) {
            var value = factory.apply(inValue, inParams) || inValue;
            self.set('exports', value);
            self.set('status', STATUS.RESOLVED);

            nx.each(self._callbacks, function (_, callback) {
              callback(value);
            });

            self._callbacks = [];
          };

          this.set('status', STATUS.RESOLVING);

          if (count === 0) {
            done(exports, params);
          } else {
            nx.each(deps, function (index, dep) {
              Module.load(dep, function (param) {
                params[index] = param;
                count--;
                if (count === 0) {
                  done(exports, params);
                }
              }, self);
            });
          }
        }
      }
    }
  });

}(nx, nx.GLOBAL));
