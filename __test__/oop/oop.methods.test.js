require('../../src/base');
require('../../src/oop-base');
require('../../src/oop-reflect');
require('../../src/oop');

describe('class __methods__', () => {
  test('__methods__', function() {
    var Class1 = nx.declare({
      methods: {
        m1: function() {
          console.log('method1');
        },
        m2: function() {
          console.log('method2');
        }
      }
    });

    var Class2 = nx.declare({
      properties: {
        prop1: 'k1',
        prop2: 'k2'
      },
      methods: {
        m1: function() {
          console.log('method1 override in child');
        },
        m3: function() {
          console.log('method3 in child');
        },
        m4: function() {
          console.log('method4 in child');
        }
      }
    });

    var cls1 = new Class1();
    var cls2 = new Class2();

    expect(Object.keys(cls1.__methods__)).toEqual(['m1', 'm2']);
    expect(Object.keys(cls2.__methods__)).toEqual(['m1', 'm3', 'm4']);
  });
});
