const nx = require('../../dist/index');

describe('oop.prop-before-method.test', () => {
  test('Class', function() {
    var Class1 = nx.declare({
      properties: {
        prop1: 1
      },
      methods: {
        init: function() {
          this.prop1++;
        }
      }
    });
    var cls1 = new Class1();
    expect(2).toBe(cls1.prop1);
  });
});
