require('../../src/base');
require('../../src/oop-base');
require('../../src/oop-reflect');
require('../../src/oop');

describe('nx.DEBUG', () => {
  test('Class-debug', function() {
    var Class1 = nx.declare({
      properties: {
        prop1: {
          get: function() {
            return this._prop1;
          },
          set: function(inValue) {
            this._prop1 = inValue * 2;
          }
        },
        prop2: 'love'
      }
    });

    var Class2 = nx.declare({
      extends: Class1,
      properties: {
        prop1: {
          set: function(inValue) {
            this.base(inValue + 100);
          }
        }
      }
    });
    var cls1 = new Class1();
    var cls2 = new Class2();

    cls1.prop1 = 2;
    cls2.prop1 = 2;

    expect(4).toBe(cls1.prop1);
    expect(204).toBe(cls2.prop1);
    expect('love').toBe(cls2.prop2);
  });

  test('Class-debug', function() {
    var Class1 = nx.declare({
      properties: {
        prop1: {
          get: function() {
            return this._prop1;
          },
          set: function(inValue) {
            this._prop1 = inValue * 2;
          }
        },
        prop2: 'love'
      }
    });

    var Class2 = nx.declare({
      extends: Class1,
      properties: {
        prop1: {
          set: function(inValue) {
            this.parent('prop1',inValue + 100);
          }
        }
      }
    });
    var cls1 = new Class1();
    var cls2 = new Class2();

    cls1.prop1 = 2;
    cls2.prop1 = 2;

    expect(4).toBe(cls1.prop1);
    expect(204).toBe(cls2.prop1);
    expect('love').toBe(cls2.prop2);
  });
});
