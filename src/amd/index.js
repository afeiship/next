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
    return Module.current = new Module('', deps, factory);
  };

  nx.require = function (inPath, inCallback, inOwner) {
    if (nx.isString(inPath)) {
      var currentPath = inPath,
        currentModule,
        ownerPath,
        ext = Path.getExt(inPath),
        scheme;

      // If PATH does not have a value, assign the first loaded module path to it
      if (!nx.PATH) {
        nx.PATH = Path.parent(inPath) || './';
        currentPath = Path.last(inPath);
      }
      // If original path does not contain a SLASH, it should be the library path
      ownerPath = inOwner ? Path.parent(inOwner.get('path')) : nx.PATH;
      currentPath = Path.normalize(ownerPath + currentPath);
      currentModule = Module.all[currentPath];

      scheme = ext || 'js';
      if (currentModule) {
        return currentModule.require(inCallback);
      } else {
        new ModuleLoader(currentPath, scheme, inCallback);
      }
    }
  };

  nx.require = function (inSysRequire) {
    nx.require = function (inPath, inCallback) {
      new ModuleLoader(inPath, 'node', inCallback, inSysRequire);
      //var module = new Module(inPath);
      //module.sets({
      //  value: inSysRequire(inPath),
      //  path: inPath,
      //  dependencies: Module.current.get('dependencies'),
      //  factory: Module.current.get('factory'),
      //  status: nx.amd.Status.LOADING
      //});
      //module.require(inCallback);
    }
  };


  if (typeof module !== 'undefined' && module.exports) {
    module.exports = nx.require;
  }

}(nx, nx.GLOBAL));
