require('../dist/next-js-core2')(module, require);


nx.require('./test_amd', function (App) {
  console.log('app?');
});

