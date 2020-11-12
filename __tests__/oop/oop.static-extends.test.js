const nx = require('../../dist/index');

describe('src/oop.js', function() {
  test('test __methods__', function() {
    var total = 0;
    var Class1 = nx.declare({
      statics: {
        m1: function() {
          total++;
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
          this.m1();
          total++;
        }
      }
    });

    Class2.m4();
    expect(total).toBe(2);
  });
});
