require('../dist/next-js-core2')(require);

nx.require('./test_amd', function (App) {
  console.log('app?',App);
});

