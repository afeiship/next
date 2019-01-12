require('../../src/base');

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
});
