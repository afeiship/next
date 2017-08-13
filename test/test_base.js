var assert = require('assert');
var nx = require('../dist/next-js-core2');

describe('src/base.js', function () {
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


  it('nx.mix', function () {
    var obj1 = {name: 'fei'};
    var obj2 = {email: '1290657123@qq.com'};

    var result = {};

    nx.mix(result, obj1, obj2);

    assert.equal(result.name, obj1.name);
    assert.equal(result.email, obj2.email);
  });

});
