require('../../src/base');
require('../../src/oop-base');
require('../../src/oop-reflect');
require('../../src/oop');

describe('nx.DEBUG', () => {
  test('Class-debug', function() {
    var num1 = 1;
    var StaticClass1 = nx.declare({
      statics: {
        init: function() {
          num1++;
        }
      }
    });

    expect(num1).toBe(2);
  });
});
