var assert = require('assert');
var nx = require('../dist/next-js-core2');


describe('src/base-forEach', function () {
  it('nx.forEach-array', function () {
    var arr = [1, 2, 3];
    var result = 0;

    nx.forEach(arr, function (item, index) {
      result = result + item;
    });


    assert.equal(result, 6);
  });

});
