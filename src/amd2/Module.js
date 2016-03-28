(function (nx, global) {

  var STATUS = nx.amd.Status;
  nx.declare('nx.amd.Module', {
    statics: {
      all: {},
      current: null
    },
    properties: {
      status: STATUS.PENDING,
      dependencies: null,
      factory: null,
      value: null
    },
    methods: {
      init: function (deps, factory) {
        this.sets({
          dependencies: deps || [],
          factory: factory || nx.noop,
          value: {}
        });

        this._callbacks = [];
      },
      require: function (inCallback) {
        var status = this.get('status');

        if (inCallback) {
          if (status === STATUS.RESOLVED) {
            //类似于CSS这种,直接处理掉.
            inCallback(this.get('value'));
          } else {
            this._callbacks.push(inCallback);
          }
        }

        if (status === STATUS.LOADING) {
          var deps = this.get('dependencies');
          var factory = this.get('factory');
          var value = this.get('value');
          var count = deps.length;
          var params = [];
          var self = this;
          var done = function (inValue, inParams) {
            var value = factory.apply(inValue, inParams) || inValue;
            self.set('value', value);
            self.set('status', STATUS.RESOLVED);

            nx.each(self._callbacks, function (_, callback) {
              callback(value);
            });

            self._callbacks = [];
          };

          this.set('status', STATUS.RESOLVING);

          if (count === 0) {
            done(value, params);
          } else {
            nx.each(deps, function (index, dep) {
              nx.require(dep, function (param) {
                params[index] = param;
                count--;
                if (count === 0) {
                  done(value, params);
                }
              }, self);
            });
          }
        }
      }
    }
  });

}(nx, nx.GLOBAL));
