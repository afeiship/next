(function (nx, global) {

  var Module = nx.amd.Module;
  var Loader = nx.amd.Loader;
  nx.define = function (inDeps, inFactory) {
    var len = arguments.length;
    var deps = [];
    var factory = null;
    var path = Loader.getCurrentScriptPath();
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
          var result = {__index__: true, length: arguments.length};
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
    Module.current = new Module(path, deps, factory);
    return Module.current;
  };


}(nx, nx.GLOBAL));
