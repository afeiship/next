(function (nx, global) {

  var Module = nx.amd.Module;
  var isNodeEnv = typeof module !== 'undefined' && module.exports;

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
    Module.current = new Module('', deps, factory);
    return Module.current;
  };


  nx.require = function (inDeps, inCallback) {
    var nDeps = inDeps.length;
    var count = 0, params = [];
    var done = function () {
      if (count === nDeps) {
        inCallback.apply(null, params);
      }
    };

    inDeps.forEach(function (dep) {
      Module.load(dep, function (param) {
        count++;
        params.push(param);
        done();
      });
    });
  };


  if (isNodeEnv) {
    nx.__currentRequire = function (inSystemRequire) {
      nx.__currentRequire = inSystemRequire;
    };

    module.exports = nx.__currentRequire;
  }


}(nx, nx.GLOBAL));
