var assert = require('assert');
var nx = require('../dist/next-js-core2');

describe('src/base-map', function () {
  it('nx.map-array', function () {
    var arr = [1, 2, 3];
    var result = nx.map(arr, function (index, item) {
      return item * 2;
    });

    assert.deepEqual([2,4,6], result);
  });
});


describe('src/base-map', function () {
  it('nx.map-object', function() {
    var obj = { name: 'fei', email: '1290657123@qq.com', nx: 'next' };
    var keys = nx.map(obj, function (key, value) {
      return key;
    });

    var values = nx.map(obj, function(key,value){
      return value;
    });

    assert.equal(keys.indexOf('name')!==-1, true);
    assert.equal(keys.indexOf('email')!==-1, true);
    assert.equal(keys.indexOf('nx')!==-1, true);

    assert.equal(values.indexOf('fei')!==-1, true);
    assert.equal(values.indexOf('1290657123@qq.com')!==-1, true);
    assert.equal(values.indexOf('next')!==-1, true);
  });
});
