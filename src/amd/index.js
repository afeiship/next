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

  nx.require = function (path, callback, owner) {
    if (nx.isString(path)) {
      var currentPath = path,
        currentModule,
        ownerPath,
        ext = Path.getExt(path);

      // If PATH does not have a value, assign the first loaded module path to it
      if (!nx.PATH) {
        nx.PATH = Path.parent(path) || './';
        currentPath = Path.last(path);
      }
      // If original path does not contain a SLASH, it should be the library path
      ownerPath = owner ? Path.parent(owner.get('path')) : nx.PATH;
      currentPath = Path.normalize(ownerPath + currentPath);
      currentModule = Module.all[currentPath];

      if (currentModule) {
        return currentModule.require(callback);
      } else {
        new ModuleLoader(currentPath, ext, callback);
      }
    }
  };


}(nx, nx.GLOBAL));
