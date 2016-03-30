require('../dist/next-js-core2')(require);

nx.load('./test_amd', function (App) {
  console.log('app?', App);
});

