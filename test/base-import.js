var assert = require('assert');
var nx = require('../dist/next-js-core2');

// var _;
// _ = nx.is || require('next-is');
// _ = nx.parse || require('next-json');

describe('src/base-import', function() {
  it('nx.import will return an array', function() {
    assert.equal(nx.import(['is']) instanceof Array, true);
  });

  it('nx.import is will have nx.isPlainObject method', function() {
    var obj = {};
    var notPlainObject = [];
    notPlainObject.test = 1234;

    nx.import(['is']);

    assert.equal( !!nx.isPlainObject, true);
    assert.equal( nx.isPlainObject(obj), true);
    assert.equal( nx.isPlainObject(notPlainObject), false);
  });
});
