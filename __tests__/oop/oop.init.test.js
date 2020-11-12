const nx = require('../../dist/index');

describe('nx.defineBombMethod', () => {
  test('Class-init', function() {
    var num1 = 1;
    var num2 = 0;
    nx.declare('Class1', {
      methods: {
        init: function() {
          num1++;
        }
      }
    });

    var Class2 = nx.declare({
      methods: {
        init: function() {
          num2++;
        }
      }
    });

    var cls1 = new Class1();
    var cls2 = new Class2();

    expect(num1).toBe(2);
    expect(num2).toBe(1);
  });
});
