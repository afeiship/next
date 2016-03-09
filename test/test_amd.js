require('../dist/next-js-core2')(require);
nx.define(['underscore'],function () {
  return nx.declare({
    methods: {
      init: function () {
        console.log('init!');
      }
    }
  });
});
