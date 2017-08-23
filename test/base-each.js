var assert = require('assert');
var nx = require('../dist/next-js-core2');

describe('src/base-each', function () {
  it('nx.each-array/object each', function () {
    var arr = [1, 2, 3];
    var obj = {name: 'fei', email: '1290657123@qq.com', nx: 'next'};
    var result = 0;
    var result_str = '';

    nx.each(arr, function (index, item) {
      result = result + item;
    });

    nx.each(obj, function (index, item) {
      result_str = result_str + '-' + item;
    });

    assert.equal(result, 6);
    assert.equal(result_str.indexOf('next') > -1, true);
  });

});
