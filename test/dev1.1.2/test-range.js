(function () {
  var assert = require('assert');
  var nx = require('../../dist/next-js-core2');

  describe('test `nx.range`', () => {
    it('range 1-10, step:1', function () {
      var arr1 = nx.range(1,10,(inValue)=>{
        return inValue + 1;
      });

      assert.equal(arr1.length, 10);
      assert.equal(arr1[0], 1);
      assert.equal(arr1[2], 3);
      assert.equal(arr1[9], 10);
    });
  });

}());
