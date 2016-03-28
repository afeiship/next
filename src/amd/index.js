(function (nx, global) {

  var Module = nx.amd.Module;
  nx.define = function (inDeps, inFactory) {
    var len = arguments.length;
    var deps = [];
    var factory = null;
    var path = Module.getCurrentScript();
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
    Module.current = new Module(path, deps, factory);
    return Module.current;
  };


  nx.require = function (inDeps, inCallback) {
    var currentModule = Module.current;
    var nDeps = inDeps.length;

    if (nDeps === 0) {
      currentModule.sets({
        exports: inCallback.apply(null),
        loaded: true
      });
      currentModule.load(inCallback);
    } else {

    }
  };

}(nx, nx.GLOBAL));
