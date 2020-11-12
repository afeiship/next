const nx = require('../../dist/index');

/**

./node_modules/.bin/jest __tests__/base/nx.set.test.js

@thanks to:
https://github.com/lukeed/dset/blob/master/test/index.js
*/

describe('nx.set name/path', () => {
  test('nx.set object value', () => {
    var item = { name: 'afeiship' };
    nx.set(item, 'name', 'feizheng');
    expect(item).toEqual({ name: 'feizheng' });
  });

  test('nx.set object path', () => {
    var item = { name: 'afeiship', test: { k1: { abc: 'ABC' } } };
    nx.set(item, 'test.k1.abc', '__ABC__');
    expect(item).toEqual({
      name: 'afeiship',
      test: { k1: { abc: '__ABC__' } }
    });
  });

  test('nx.set return target', () => {
    var item = { name: 'afeiship', test: { k1: { abc: 'ABC' } } };
    var rst = nx.set(item, 'test.k1.abc', '__ABC__');
    expect(rst).toBe(item);
  });

  test('nx.set a.b.0.c to deep array', () => {
    var qux = {};
    nx.set(qux, 'a.0.b.0', 1);
    nx.set(qux, 'a.0.b.1', 2);
    expect(qux).toEqual({ a: [{ b: [1, 2] }] });
  });

  test.only('nx.set a.b.[0].c to deep array', () => {
    var qux = {};
    nx.set(qux, 'a.[0].b.[0]', 1);
    nx.set(qux, 'a.[0].b.[1]', 2);
    expect(qux).toEqual({ a: [{ b: [1, 2] }] });
  });
});
