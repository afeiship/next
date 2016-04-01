require('../dist/next-js-core2')(require);
console.log('test_amd.js file inner');
nx.define(['underscore'], function (underscore) {
  return nx.declare({
    module:'tstAMd',
    methods: {
      init: function () {
        console.log('init!');
      }
    }
  });
});


