const nx = require('../../dist/next-js-core2');

function compileAndroidCode() {
  nx.error('you are using the wrong nx.VERSION');
}

test('compiling android goes as expected', () => {
  expect(compileAndroidCode).toThrow();
  expect(compileAndroidCode).toThrow(Error);
  // You can also use the exact error message or a regexp
  expect(compileAndroidCode).toThrow('you are using the wrong nx.VERSION');
  expect(compileAndroidCode).toThrow(/VERSION/);
});
