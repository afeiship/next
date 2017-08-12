var assert = require('assert');
var nx = require('../dist/next-js-core2');

describe('Base.js', function () {
  it('nx.each', function () {
    var arr = [1, 2, 3];
    var obj = {
      name: 'fei',
      nx: 'next'
    };
    var result = 0;
    assert.equal(-1, [1, 2, 3].indexOf(4));
  });
});
