const nx = require('../../dist/index');

// /Users/a7/github/next/__tests__/base/nx.del.test.js
describe('nx.get name/path', () => {
  test('nx.del should worked', () => {
    var obj = { name: 'afeiship', a: { b: { c: 'c-value' } } };
    expect(obj.a.b.c).toBe('c-value');
    var ret1 = nx.del(obj, 'a.b.c');
    expect(ret1).toBe(true);
    expect(obj.a.b.c).toBe(undefined);
    expect(obj).toEqual({ name: 'afeiship', a: { b: {} } });
  });

  test('del path has not exists value should get false', () => {
    const obj = { name: 'afei' };
    const res1 = nx.del(obj, 'preferences_tag.US');
    expect(res1).toBe(false);
  });

  // https://github.com/sindresorhus/dot-prop/blob/master/test.js
});
