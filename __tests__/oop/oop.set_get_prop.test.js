const nx = require('../../dist/index');

describe('nx.set_get_prop', () => {
  test('Class-property', function() {
    var Class1 = nx.declare({
      properties: {
        prop1: {
          get: function() {
            return this._prop1;
          },
          set: function(inValue) {
            this._prop1 = inValue * 2;
          }
        }
      }
    });
    var cls1 = new Class1();
    cls1.prop1 = 2;
    expect(cls1.prop1).toBe(4);
  });
});
