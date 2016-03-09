(function (nx, global) {

  var STATUS = nx.amd.Status;
  nx.declare('nx.amd.Module', {
    statics: {
      all: {},
      current: null
    },
    properties: {
      status: STATUS.PENDING,
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
      require: function (inCallback) {
        var status = this.get('status');

        if (inCallback) {
          if (status === STATUS.RESOLVED) {
            inCallback(this.get('value'));
          } else {
            this._callbacks.push(inCallback);
          }
        }

        if (status === STATUS.LOADING) {
          var path = this.get('path');
          var deps = this.get('dependencies');
          var factory = this.get('factory');
          var value = this.get('value');
          var count = deps.length;
          var params = [];
          var self = this;

          this.set('status', STATUS.RESOLVING);

          if (count === 0) {
            value = factory.call(value) || value;
            this.set('value', value);
            this.set('status', STATUS.RESOLVED);

            nx.each(this._callbacks, function (_, callback) {
              callback(value);
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
                  self.set('status', STATUS.RESOLVED);

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

}(nx, nx.GLOBAL));