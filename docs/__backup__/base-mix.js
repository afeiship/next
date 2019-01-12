var assert = require('assert');
var nx = require('../dist/next-js-core2');

describe('src/base-mix', function () {
  it('nx.mix', function () {
    var obj1 = {name: 'fei'};
    var obj2 = {email: '1290657123@qq.com'};

    var result = {};

    nx.mix(result, obj1, obj2);

    assert.equal(result.name, obj1.name);
    assert.equal(result.email, obj2.email);
  });

});
