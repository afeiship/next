const nx = require('../../dist/next-js-core2');

describe('Class static', () => {
  test('oop.static-can-called-child', function() {
    var total = 1;
    var Class1 = nx.declare({
      statics: {
        instance: null,
        getInstance: function() {
          total++;
          return this.instance;
        }
      }
    });

    var Class2 = nx.declare({
      extends: Class1
    });

    Class1.getInstance();
    expect(total).toBe(2);
    Class2.getInstance();
    expect(total).toBe(3);
  });
});
