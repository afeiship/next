const nx = require('../../dist/next-js-core2');

describe('nx.Anonymous', () => {
  test('Class-init', function() {
    var Class1 = nx.declare({
      methods: {
        init: function() {
          console.log('init method');
        }
      }
    });

    var type = Class1.__type__;
    expect(typeof type).toBe('string');
    expect(type.indexOf('nx.Anonymous')).toBe(0);
    expect(nx.get(nx.GLOBAL, type)).toBeUndefined();
  });
});
