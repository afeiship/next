const nx = require('../../dist/index');

describe('nx.get name/path', () => {
  test('nx.del should worked', () => {
    var obj = { name: 'afeiship', a: { b: { c: 'c-value' } } };
    expect(obj.a.b.c).toBe('c-value');
    var ret1 = nx.del(obj, 'a.b.c');
    expect(ret1).toBe(true);
    expect(obj.a.b.c).toBe(undefined);
    expect(obj).toEqual({ name: 'afeiship', a: { b: {} } });
  });

  // https://github.com/sindresorhus/dot-prop/blob/master/test.js
});
