(function () {
  var assert = require('assert');
  var nx = require('../../dist/next-js-core2');

  describe('test `nx.binds`', () => {

    var obj1 = {
      val1:'obj1-1',
      val2:'obj1-2',
      method1: function(){
        return this.val1;
      },
      method1: function(){
        return this.val2;
      }
    };

    var obj2 = {
      val1:'obj2-1',
      val2:'obj2-2'
    };

    var MyClass = function(){
      nx.binds(this,['methods1','methods2']);
    };

    it('nx-binds', function () {

      assert.equal(arr1.length, 10);
      assert.equal(arr1[0], 1);
      assert.equal(arr1[2], 3);
      assert.equal(arr1[9], 10);
    });
  });

}());
