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

  test('nx.get when object has array', ()=>{
    var obj = {
      'part1': {
        'name': 'Part 1',
        'size': '20',
        'qty': '50'
      },
      'part2': {
        'name': 'Part 2',
        'size': '15',
        'qty': '60'
      },
      'part3': [
        {
          'name': 'Part 3A',
          'size': '10',
          'qty': '20'
        }, {
          'name': 'Part 3B',
          'size': '5',
          'qty': '20'
        }, {
          'name': 'Part 3C',
          'size': '7.5',
          'qty': '20'
        }
      ]
    };

    var part1name = "part1.name";
    var part2quantity = "part2.qty";
    var part3name1 = "part3[0].name";
    var part3Size2 = "part3.1.size";

    expect(nx.get(obj, part1name)).toBe('Part 1');
    expect(nx.get(obj, part2quantity)).toBe('60');
    expect(nx.get(obj, part3name1)).toBe('Part 3A');
    expect(nx.get(obj, part3Size2)).toBe('5');
  });

});
