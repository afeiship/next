(function () {

  var assert = require('assert');
  var nx = require('../dist/next-js-core2');
  describe('src/base.js', function () {

    describe('#each()', function () {
      it('Class can call its each method', function () {
        function Collection(inData) {
          this._data = inData || [];
        }

        Collection.prototype.each = function () {
          return 'my each';
        };

        var col1=new Collection();

        var result=nx.each(col1,function(_,val){
        });
        assert.equal('my each', result);
      });


      it('[1,2,3,4,5] sum is:15', function () {
        var arr1 = [1, 2, 3, 4, 5];
        var result = 0;
        nx.each(arr1, function (_, val) {
          result = result + val;
        });
        assert.equal(15, result);
      });


      it('{map} keys & values', function () {
        var map = {
          name: 'afei',
          age: 123,
          son: 'none',
          hobby: 'programming'
        };
        var keys = [], values = [];
        nx.each(map, function (key, val) {
          keys.push(key);
          values.push(val);
        });

        assert.deepEqual(['name', 'age', 'son', 'hobby'], keys);
        assert.deepEqual(['afei', 123, 'none', 'programming'], values);

      });

      it('each can break by nx.BREAKER', function () {
        var arr2 = ['a', 'b', 'c', 3, 'e'];
        var result = [];
        nx.each(arr2, function (_, val) {
          if (nx.isNumber(val)) {
            return nx.BREAKER;
          }
          result.push(val);
        });
        assert.deepEqual(['a', 'b', 'c'], result);
      });
    });


  });

}());
