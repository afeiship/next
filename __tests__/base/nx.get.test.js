const nx = require('../../dist/next-js-core2');

describe('nx.get name/path', () => {
  test('nx.get object value', () => {
    var item = { name: 'afeiship' };
    var rst = nx.get(item, 'name');
    expect(rst).toBe('afeiship');
  });

  test('nx.get object path', () => {
    var item = { name: 'afeiship', test: { k1: { abc: 'ABC' } } };
    var rst = nx.get(item, 'test.k1.abc');
    expect(rst).toBe('ABC');
  });

  test('nx.get object path with empty string', () => {
    var item = { name: 'afeiship', test: { k1: { abc: 'ABC' } } };
    var rst = nx.get(item, '');
    expect(rst).toEqual({ name: 'afeiship', test: { k1: { abc: 'ABC' } } });
  });
});
