const nx = require('../../dist/next-js-core2');


describe('nx.stub true/false/value', function () {

  test('stub true', () => {
    var trueFn = nx.stubTrue;
    expect(trueFn()).toBe(true)
  });


  test('stub false', () => {
    var falseFn = nx.stubFalse;
    expect(falseFn()).toBe(false)
  });


  test('stub value', () => {
    var valueFn = nx.stubValue;
    expect(valueFn('aaa')).toBe('aaa')
  });
});
