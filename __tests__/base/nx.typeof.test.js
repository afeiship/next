const nx = require('../../dist/index');

describe('src/core/typeof', function() {
  test('nx.typeof', function() {
    var t1 = 1;
    var t2 = 'str';
    var t3 = true;
    var t4 = {};
    var t5 = [];
    var t6 = function() {};
    var t7 = null;
    var t8 = undefined;
    var t9 = new Date();
    var t10 = new RegExp();

    expect(nx.typeof(t1)).toBe('number');
    expect(nx.typeof(t2)).toBe('string');
    expect(nx.typeof(t3)).toBe('boolean');
    expect(nx.typeof(t4)).toBe('object');
    expect(nx.typeof(t5)).toBe('array');
    expect(nx.typeof(t6)).toBe('function');
    expect(nx.typeof(t7)).toBe('null');
    expect(nx.typeof(t8)).toBe('undefined');
    expect(nx.typeof(t9)).toBe('date');
    expect(nx.typeof(t10)).toBe('regexp');
  });
});
