var assert = require('assert');
var nx = require('../dist/next');


describe('src/base-forEach', function () {
  it('nx.forEach-array', function () {
    var arr = [1, 2, 3];
    var result = 0;
    var result_can_break = 0;

    nx.forEach(arr, function (item, index) {
      result = result + item;
    });



    nx.forEach(arr, function (item, index) {
      if(item === 3 ){
        return nx.BREAKER;
      }
      result_can_break = result_can_break + item;
    });


    assert.equal(result, 6);
    assert.equal(result_can_break, 3);
  });

});
