require('../dist/next-js-core2')(module, require);
nx.define(function () {
  return nx.declare({
    methods: {
      init: function () {
        console.log('init!');
      }
    }
  });
});
