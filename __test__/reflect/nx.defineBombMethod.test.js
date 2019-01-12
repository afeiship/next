require('../../src/base');
require('../../src/oop-base');
require('../../src/oop-reflect');

describe('nx.defineBombMethod', () => {
  test('define bomb function', () => {
    var obj = {
      key: '__KEY__'
    };

    nx.defineBombMethod(obj, 'm1,m2,m3', function(inName) {
      return function() {
        return this.key + inName;
      };
    });

    expect(obj.m1()).toBe('__KEY__m1');
    expect(obj.m2()).toBe('__KEY__m2');
    expect(obj.m3()).toBe('__KEY__m3');
  });
});
