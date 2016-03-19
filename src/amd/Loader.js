(function (nx, global) {

  var doc = global.document;
  var isBrowserEnv = !!doc;
  var head = isBrowserEnv && (doc.head || doc.getElementsByTagName('head')[0] || doc.documentElement);
  var completeRE = /loaded|complete/;
  var Module = nx.amd.Module;

  nx.declare('nx.amd.Loader', {
    methods: {
      init: function (inPath, inExt) {
        this.path = inPath;
        this.ext = inExt;
      },
      load: function () {
        var ext = this.ext;
        if (ext) {
          return this[ext]();
        }
        nx.error('The ext ' + ext + ' is not supported.');
      },
      js: function () {
        var scriptNode = doc.createElement('script');
        var supportOnload = "onload" in scriptNode;
        var self = this;
        var path = this.path;
        var complete = function (err) {
          scriptNode.onload = scriptNode.onerror = scriptNode.onreadystatechange = null;
          if (err) {
            nx.error('Failed to load module:' + path);
          } else {
            self.fire('load', this);
          }
        };

        scriptNode.src = path;
        scriptNode.async = true;
        head.appendChild(scriptNode);

        if (supportOnload) {
          scriptNode.onload = function () {
            complete(null);
          };
        } else {
          scriptNode.onreadystatechange = function (e) {
            if (completeRE.test(scriptNode.readyState)) {
              complete(null);
            } else {
              complete(e);
            }
          };
        }
        scriptNode.onerror = function (e) {
          complete(e);
        }
      },
      css: function () {
        var linkNode = doc.createElement('link');
        linkNode.rel = 'stylesheet';
        linkNode.href = this.path;
        head.appendChild(linkNode);

        Module.current.sets({
          factory: nx.noop,
          dependencies: [],
          value: null
        });

        this.fire('load', this);
      }
    }
  });

}(nx, nx.GLOBAL));
