require('../../src/base');

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

  test('nx.set return undefined', () => {
    var item = { name: 'afeiship', test: { k1: { abc: 'ABC' } } };
    var rst = nx.set(item, 'test.k1.abc', '__ABC__');
    expect(rst).toBeUndefined();
  });
});
