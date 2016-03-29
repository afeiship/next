(function (nx, global) {

  var doc = global.document;
  var STATUS = nx.amd.Status;

  nx.declare('nx.amd.Module', {
    statics: {
      all: {},
      current: null,
      getCurrentScript: function () {
        var stack;
        var nodes, i, node;
        if (doc.currentScript) {
          return doc.currentScript.src; //FF,Chrome
        }
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
        nodes = head.getElementsByTagName("script");
        for (i = 0; node = nodes[i++];) {
          if (node.readyState === 'interactive') {
            return node.src;
          }
        }
      },
      getModule: function () {

      }
    },
    properties: {
      path: '',
      loaded: false,
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
          exports: {}
        });

        this._callbacks = [];
      },
      load: function (inCallback) {
      }
    }
  });

}(nx, nx.GLOBAL));
