const nx = require('../../dist/next-js-core2');

describe('src/base-mix', function() {
  test('nx.mix', function() {
    var obj1 = { name: 'fei' };
    var obj2 = { email: '1290657123@qq.com' };

    var result = {};

    nx.mix(result, obj1, obj2);

    expect(result.name).toBe(obj1.name);
    expect(result.email).toBe(obj2.email);
    expect(result).toEqual({ name: 'fei', email: '1290657123@qq.com' });
    expect(obj1).toEqual({ name: 'fei' });
    expect(obj2).toEqual({ email: '1290657123@qq.com' });
  });
});
