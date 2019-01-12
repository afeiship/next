(function() {
  var assert = require('assert');
  var nx = require('../dist/next-js-core2');

  describe('src/oop.js', function() {
    it('test __methods__', function() {
      var Class1 = nx.declare({
        statics: {
          m1: function() {
            console.log('method1');
          },
          m2: function() {
            console.log('method2');
          }
        }
      });

      var Class2 = nx.declare({
        extends: Class1,
        statics: {
          m4: function() {
            console.log(typeof this.m1);
            this.m1();
          }
        }
      });

      Class2.m4();
    });
  });
})();
