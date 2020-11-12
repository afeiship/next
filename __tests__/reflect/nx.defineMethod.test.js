const nx = require('../../dist/index');

describe('nx.defineMethod', () => {
  test('define a function', () => {
    function DataHub() {}
    nx.defineMethod(DataHub.prototype, 'm1', function() {
      console.log('m1 method.');
    });

    var data1 = new DataHub();
    expect(typeof data1.m1).toBe('function');
  });
});
