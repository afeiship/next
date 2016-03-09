(function (nx, global) {

  var DOT = '.',
    DOUBLE_DOT = '..',
    SLASH = '/',
    STATUS_PENDING = 0,
    STATUS_LOADING = 1,
    STATUS_RESOLVING = 2,
    STATUS_RESOLVED = 3,
    doc = global.document;

  // Normalize the path. e.g. "./aa/bb/.././cc" -> "./aa/cc"
  var normalizePath = function (inPath) {
    var tokens = inPath.split(SLASH);
    var normalized = [], token, count = 0;

    for (var i = 0, len = tokens.length; i < len; i++) {
      token = tokens[i];
      if (token) {
        if (token === DOUBLE_DOT) {
          if (count > 0) {
            count--;
            normalized.pop();
          }
          else {
            normalized.push(DOUBLE_DOT);
          }
        }
        else if (token === DOT) {
          if (i === 0) {
            normalized.push(DOT);
          }
        }
        else {
          count++;
          normalized.push(token);
        }
      }
      else {
        if (count > 0 && i < len - 1) {
          normalized = normalized.slice(0, -count);
        }
        else {
          normalized.push('');
        }
      }
    }

    return normalized.join(SLASH);
  };

  // Get the parent path
  var parentPath = function (path) {
    return path.slice(0, path.lastIndexOf(SLASH) + 1);
  };

  // Get the last path
  var lastPath = function (path) {
    return path.slice(path.lastIndexOf(SLASH) + 1);
  };

  // Append ext to path accordingly
  var appendExt = function (path, ext) {
    var extLength = ext.length;
    var end = path.slice(-extLength);

    if (end === ext) {
      return path;
    }
    else if (end[extLength - 1] === SLASH) {
      return path + 'index' + DOT + ext;
    }
    else {
      return path + DOT + ext;
    }
  };

  // Get the ext of path
  var getExt = function (path) {
    var slashIndex = path.lastIndexOf(SLASH);
    var dotIndex = path.lastIndexOf(DOT);

    if (dotIndex > slashIndex) {
      return path.slice(dotIndex + 1);
    }
    else {
      return '';
    }
  };

  var Module = nx.declare('nx.Module', {
    statics: {
      all: {},
      current: null
    },
    properties: {
      status: STATUS_PENDING,
      path: '',
      dependencies: null,
      factory: null,
      value: null
    },
    methods: {
      init: function (path, deps, factory) {
        this.sets({
          path: path,
          dependencies: deps || [],
          factory: factory,
          value: {}
        });

        this._callbacks = [];
      },
      require: function (callback) {
        var status = this.get('status');

        if (callback) {
          if (status === STATUS_RESOLVED) {
            callback(this.get('value'));
          }
          else {
            this._callbacks.push(callback);
          }
        }

        if (status === STATUS_LOADING) {
          var path = this.get('path');
          var deps = this.get('dependencies');
          var factory = this.get('factory');
          var value = this.get('value');
          var count = deps.length;
          var params = [];
          var self = this;

          this.set('status', STATUS_RESOLVING);

          if (count === 0) {
            value = factory.call(value) || value;
            this.set('value', value);
            this.set('status', STATUS_RESOLVED);

            nx.each(this._callbacks, function (_, c) {
              c(value);
            });

            this._callbacks = [];
          } else {
            nx.each(deps, function (index, dep) {
              nx.require(dep, function (param) {
                params[index] = param;
                count--;
                if (count === 0) {
                  value = factory.apply(value, params) || value;
                  self.set('value', value);
                  self.set('status', STATUS_RESOLVED);

                  nx.each(self._callbacks, function (_, callback) {
                    callback(value);
                  });

                  self._callbacks = [];
                }
              }, self);
            });
          }
        }
      }
    }
  });


  nx.define = function () {
    var args = arguments;
    var nArgs = args.length;
    var arg0 = args[0];
    var deps = [];
    var factory = null;

    if (nArgs === 2) {
      deps = arg0;
      factory = arguments[1];
    } else if (nArgs === 1) {
      if (nx.isFunction(arg0)) {
        factory = arg0;
      } else if (nx.isArray(arg0)) {
        deps = arg0;
        factory = function () {
          var result = {length: arguments.length};
          nx.each(arguments, function (index, mod) {
            if (mod.__type__) {
              result[mod.__type__] = mod;
            }

            result[index] = mod;
          });

          return result;
        };
      } else {
        factory = function () {
          return arg0;
        };
      }
    } else {
      nx.error('Invalid arguments.');
    }

    Module.current = new Module('', deps, factory);

    return Module.current;
  };


  nx.require = function (path, callback, owner) {
    if (nx.isString(path)) {
      var currentPath = path,
        currentModule,
        ownerPath,
        result = {},
        ext = getExt(path),
        scheme = null;

      // If PATH does not have a value, assign the first loaded module path to it
      if (!nx.PATH) {
        nx.PATH = parentPath(path) || (DOT + SLASH);
        currentPath = lastPath(path);
      }

      // Check ext to determine the scheme
      switch (ext) {
        case 'css':
        case 'json':
          scheme = ext;
          break;
        default:
          break;
      }

      // If original path does not contain a SLASH, it should be the library path
      ownerPath = owner ? parentPath(owner.get('path')) : nx.PATH;
      currentPath = normalizePath(ownerPath + currentPath);
      currentModule = Module.all[currentPath];

      if (currentModule) {
        return currentModule.require(callback);
      } else {
        currentModule = Module.all[currentPath] = new Module(currentPath);
        if (doc) { // Browser Environment
          var head = doc.head || doc.getElementsByTagName('head')[0];

          if (!scheme) {
            var scriptNode = doc.createElement('script');
            var handler = function (err) {
              scriptNode.onload = null;
              scriptNode.onerror = null;

              if (err) {
                nx.error('Failed to load module:' + currentPath);
              }
              else {
                currentModule.sets({
                  path: currentPath,
                  dependencies: Module.current.get('dependencies'),
                  factory: Module.current.get('factory'),
                  status: STATUS_LOADING
                });
                currentModule.require(callback);
              }
            };

            scriptNode.src = appendExt(currentPath, 'js');
            scriptNode.async = true;
            head.appendChild(scriptNode);
            if ('onload' in scriptNode) {
              scriptNode.onload = function () {
                handler(null);
              };
            } else {
              scriptNode.onreadystatechange = function (e) {
                var state = scriptNode.readyState;
                if (state === 'loaded' || state === 'complete') {
                  handler(null);
                }
                else {
                  handler(e);
                }
              };
            }

            scriptNode.onerror = function (e) {
              handler(e);
            };
          }
          else if (scheme === 'css') {
            var linkNode = doc.createElement('link');
            linkNode.rel = 'stylesheet';
            linkNode.href = appendExt(currentPath, 'css');
            head.appendChild(linkNode);

            currentModule.sets({
              value: linkNode,
              path: currentPath,
              dependencies: Module.current.get('dependencies'),
              factory: Module.current.get('factory'),
              status: STATUS_RESOLVED
            });
            currentModule.require(callback);

          }
          else {
            nx.error('The scheme ' + scheme + ' is not supported.');
          }
        } else {
          // NodeJS environment

          result = require(currentPath);
          currentModule.sets({
            value: result,
            path: currentPath,
            dependencies: Module.current.get('dependencies'),
            factory: Module.current.get('factory'),
            status: STATUS_LOADING
          });
          currentModule.require(callback);

        }
      }
    }
  };

  //For nodejs env
  if (!doc) {
    module.exports = function (inModule, inSysRequire) {
      nx.require = function (path, callback, owner) {
        var result = inSysRequire(path);
        return inModule.exports = callback.call(owner || global, result);
      }
    };
  }

}(nx, nx.GLOBAL));
