require('../dist/next-js-core2')(require);
nx.define(['underscore'], function (underscore) {
  return nx.declare({
    module: 'tstAMd',
    methods: {
      init: function () {
        console.log('init!');
      }
    }
  });
});


