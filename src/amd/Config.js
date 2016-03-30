(function (nx, global) {

  var Config = nx.declare('nx.amd.Config', {
    statics: {
      __config__: {},
      getInstance: function () {
        var instance = Config.instance;
        if (!instance) {
          instance = Config.instance = new Config();
        }
        return instance;
      }
    },
    methods: {
      set: function (inName, inValue) {
        Config.__config__[inName] = inValue;
      },
      get: function (inName) {
        return Config.__config__[inName];
      },
      gets: function () {
        return Config.__config__;
      }
    }
  });

  nx.config = Config.getInstance();

  //default config:
  nx.config.sets({
    baseUrl: './'
  });

}(nx, nx.GLOBAL));
