(function (nx, global) {

  var Module = nx.amd.Module;
  var Path = nx.amd.Path;
  var ModuleLoader = nx.amd.ModuleLoader;

  nx.define = function (inDeps, inFactory) {
    var len = arguments.length;
    var deps = [];
    var factory = null;
    switch (true) {
      case len === 2:
        deps = inDeps;
        factory = arguments[1];
        break;
      case len === 1 && nx.isFunction(inDeps):
        factory = inDeps;
        break;
      case len === 1 && nx.isArray(inDeps):
        deps = inDeps;
        factory = function () {
          var result = {length: arguments.length};
          nx.each(arguments, function (index, mod) {
            if (mod.__module__) {
              result[mod.__module__] = mod;
            }
            result[index] = mod;
          });

          return result;
        };
        break;
      default:
        nx.error('Invalid arguments.');
    }
    Module.current = new Module( deps, factory);
    return Module.current;
  };

  nx.require = function (inPath, inCallback, inOwner) {
    if (nx.isString(inPath)) {
      var currentPath = inPath,
        currentModule,
        ownerPath,
        ext = Path.getExt(inPath);

      // If PATH does not have a value, assign the first loaded module path to it
      if (!nx.PATH) {
        nx.PATH = Path.parent(inPath) || './';
        currentPath = Path.last(inPath);
      }
      // If original path does not contain a SLASH, it should be the library path
      ownerPath = inOwner ? Path.parent(inOwner.get('path')) : nx.PATH;
      currentPath = Path.normalize(ownerPath + currentPath);
      currentModule = Module.all[currentPath];

      if (currentModule) {
        return currentModule.require(inCallback);
      } else {
        new ModuleLoader(currentPath, ext, inCallback);
      }
    }
  };


  if (typeof module !== 'undefined' && module.exports) {
    nx.require = function (inSysRequire) {
      nx.require = function (inPath, inCallback) {
        var deps = nx.toArray(inPath);
        var params = [], param;
        deps.forEach(function (item) {
          param = inSysRequire(item);
          params.push(param);
        });
        inCallback.apply(null, params);
      }
    };

    module.exports = nx.require;
  }

}(nx, nx.GLOBAL));
