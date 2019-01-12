require('../../src/base');
require('../../src/oop-base');
require('../../src/oop-reflect');

describe('nx.defineBombMethod', () => {
  test('define boob function', () => {
    var obj = {
      key: '__KEY__'
    };

    nx.defineBombMethod(obj, 'm1,m2,m3', function(inName) {
      return function() {
        return this.key + inName;
      };
    });

    expect(obj.m1()).toBe('__KEY__m1');
  });
});
