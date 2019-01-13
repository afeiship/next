require('../../src/base');
require('../../src/oop-base');
require('../../src/oop-reflect');
require('../../src/oop');

/**
./node_modules/.bin/jest __test__/oop/oop.es6.test.js
*/

describe('oop class es6', () => {
  test('Es6 class extends:', function() {
    var num1 = 1;
    var Class1 = nx.declare({
      properties: {
        prop1: {
          get: function() {
            return 'prop1';
          }
        },
        prop2: 123,
        prop3: null
      },
      methods: {
        m1: function() {
          num1++;
        },
        m3: function() {
          return 10;
        }
      }
    });

    class Class2 extends Class1 {
      m2() {
        num1 = num1 * 2;
      }
      m3() {
        return super.m3() * 10;
      }
    }

    var cls2 = new Class2();
    cls2.m1();
    expect(num1).toBe(2);
    expect(cls2.prop1).toBe('prop1');
    expect(cls2.prop2).toBe(123);
    cls2.m2();
    expect(num1).toBe(4);
    expect(cls2.m3()).toBe(100);

    // readonly prop works:
    cls2.prop1 = 123;
    expect(cls2.prop1).toBe('prop1');
  });
});
