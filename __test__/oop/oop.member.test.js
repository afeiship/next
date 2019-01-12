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

    expect(prop_member.__type__).toBe('property');
    expect(prop_member.__meta__).toBe('1234');
    expect(method_member.__type__).toBe('method');
  });
});
