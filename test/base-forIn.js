var assert = require('assert');
var nx = require('../dist/next-js-core2');

describe('src/base-forIn', function () {
  it('nx.forIn-object each', function () {
    var obj = { name: 'fei', email: '1290657123@qq.com', nx: 'next' };
    var result_str = '';


    nx.forIn(obj, function (key, value) {
      result_str = result_str + '-' + value;
    });

    assert.equal(result_str.indexOf('next') > -1, true);
  });

});
