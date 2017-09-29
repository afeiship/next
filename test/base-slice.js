var assert = require('assert');
var nx = require('../dist/next-js-core2');

// var _;
// _ = nx.is || require('next-is');
// _ = nx.parse || require('next-json');

describe('src/base-slice', function() {
  it('nx.import will return an array', function() {
    var abc = function(){
      return nx.slice(arguments);
    };

    var rs1 = abc(1,2,3);
    assert.deepEqual(rs1, [1,2,3]);
  });


});
