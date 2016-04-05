require('../dist/next-js-core2')(require);

nx.require(['./test_amd'], function (App) {
  var app = new App();
  console.dir(app.__module__);
});

