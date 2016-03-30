(function (nx, global) {

  var STATUS = nx.amd.Status;
  var doc = global.document;

  var Module = nx.declare('nx.amd.Module', {
    statics: {
      all: {},
      current: null,
      getCurrentScript: function () {
        if (doc.currentScript) {
          return doc.currentScript.src; //FF,Chrome
        }
        var stack;
        try {
          a.b.c();
        } catch (e) {
          stack = e.stack;
          if (!stack && window.opera) {
            stack = String(e);
            if (!stack && window.opera) {
              stack = (String(e).match(/of linked script \S+/g) || []).join(" ");
            }
          }
        }
        if (stack) {
          stack = stack.split(/[@ ]/g).pop();
          stack = stack[0] === "(" ? stack.slice(1, -1) : stack;
          return stack.replace(/(:\d+)?:\d+$/i, "");
        }
        // IE
        var nodes = head.getElementsByTagName("script");
        for (var i = 0, node; node = nodes[i++];) {
          if (node.readyState === 'interactive') {
            return node.src;
          }
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
              nx.load(dep, function (param) {
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
