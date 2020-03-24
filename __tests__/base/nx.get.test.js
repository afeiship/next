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

  test('nx.get get default value should return default value', () => {
    var item = { name: 'afei', age: null };
    var res = nx.get(item, 'age', 20);
    expect(res).toBe(20);
  });

  test('nx.get get default value should return default value == false', () => {
    var item = { name: 'afei', sex: false };
    var res = nx.get(item, 'sex', 'yes?');
    expect(res).toBe(false);
  });
});
