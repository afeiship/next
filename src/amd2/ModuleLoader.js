(function (nx, global) {

  var doc = global.document;
  var isBrowserEnv = !!doc;
  var head = isBrowserEnv && (doc.head || doc.getElementsByTagName('head')[0] || doc.documentElement);
  var Path = nx.amd.Path;
  var Module = nx.amd.Module;
  var STATUS = nx.amd.Status;
  var completeRE = /loaded|complete/;

  nx.declare('nx.amd.ModuleLoader', {
    methods: {
      init: function (inPath, inExt, inCallback) {
        var path = this.path = inPath || '';
        this.ext = inExt;
        this.module = Module.all[path] = new Module(path);
        this.callback = inCallback || nx.noop;
        this.load();
      },
      load: function () {
        var ext = this.ext;
        if (ext) {
          return this[ext]();
        }
        nx.error('The ext ' + ext + ' is not supported.');
      },
      css: function () {
        var linkNode = doc.createElement('link');
        linkNode.rel = 'stylesheet';
        linkNode.href = Path.setExt(this.path, 'css');
        head.appendChild(linkNode);

        this.module.sets({
          value: linkNode,
          path: this.path,
          dependencies: Module.current.get('dependencies'),
          factory: Module.current.get('factory'),
          status: STATUS.RESOLVED
        });
        this.module.require(this.callback);
      },
      js: function () {
        var scriptNode = doc.createElement('script');
        var supportOnload = "onload" in scriptNode;
        var self = this;
        var handler = function (err) {
          scriptNode.onload = scriptNode.onerror = scriptNode.onreadystatechange = null;
          if (err) {
            nx.error('Failed to load module:' + self.path);
          } else {
            self.module.sets({
              path: self.path,
              dependencies: Module.current.get('dependencies'),
              factory: Module.current.get('factory'),
              status: STATUS.LOADING
            });
            self.module.require(self.callback);
          }
        };

        scriptNode.src = Path.setExt(self.path, 'js');
        scriptNode.async = true;
        head.appendChild(scriptNode);
        if (supportOnload) {
          scriptNode.onload = function () {
            handler(null);
          };
        } else {
          scriptNode.onreadystatechange = function (e) {
            if (completeRE.test(scriptNode.readyState)) {
              handler(null);
            } else {
              handler(e);
            }
          };
        }
        scriptNode.onerror = function (e) {
          handler(e);
        };
      }
    }
  });

}(nx, nx.GLOBAL));
