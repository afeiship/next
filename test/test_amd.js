var nx = require('../dist/next-js-core2');

var Module1 = nx.define(['debug'], function (debug) {
  return nx.declare({
    methods: {
      init: function () {
        console.log('init!');
        console.log(debug);
      }
    }
  })
});
//console.log(Module1);

nx.require(Module1,function(App){
  new App();
});
