require('../../src/base');
require('../../src/oop-base');
require('../../src/oop-reflect');
require('../../src/oop');

describe('Call parent', () => {
  test('Class-call parent', function() {
    var total = 2;
    var Class1 = nx.declare({
      methods: {
        calc: function() {
          total++;
        }
      }
    });

    var Class2 = nx.declare({
      extends: Class1,
      methods: {
        calc: function() {
          this.parent('calc');
          total = total * 2;
        }
      }
    });

    var cls2 = new Class2();
    cls2.calc();
    expect(total).toBe(6);
  });
});
