require('../../src/base');
require('../../src/oop-base');
require('../../src/oop-reflect');
require('../../src/oop');

describe('nx.defineBombMethod', () => {
  test('Class-memeber', function() {
    nx.declare('Class1', {
      statics: {
        static1: 1233,
        status: 'loading'
      },
      properties: {
        prop1: 1234,
        prop2: {
          value: {
            name: 'fei'
          }
        }
      },
      methods: {
        init: function() {}
      }
    });

    var cls1 = new Class1();
    var prop_member = cls1['@prop1'];
    var method_member = cls1['@init'];

    //static:
    expect(Class1.static1).toBe(1233);
    expect(Class1.status).toBe('loading');

    //property:
    expect(cls1.prop1).toBe(1234);
    expect(cls1.prop2).toEqual({ name: 'fei' });

    // basic meta infomation:
    expect(Class1.__type__).toBe('Class1');
    expect(prop_member.__type__).toBe('property');
    expect(method_member.__type__).toBe('method');
    expect(prop_member.__meta__).toBe(1234);
  });

  test('Class-memeber', function() {
    nx.declare('Class1', {
      statics: {
        static1: 1233,
        status: 'loading'
      },
      properties: {
        prop1: 1234,
        prop2: {
          value: 'value1'
        }
      },
      methods: {
        init: function() {},
        m1: function() {
          console.log('m1 cosole');
        },
        m2: function() {
          console.log('m2 cosole');
        }
      }
    });

    var cls1 = new Class1();
    var methodKeys = Object.keys(cls1.__methods__);
    var propertyKeys = Object.keys(cls1.__properties__);
    expect(methodKeys).toEqual(['init', 'm1', 'm2']);
    expect(propertyKeys).toEqual(['prop1', 'prop2']);
    expect(Object.keys(Class1.__statics__)).toEqual(['static1','status']);
  });
});
