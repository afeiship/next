const nx = require('../../dist/index');

var total = 0;
function compileAndroidCode() {
  nx.error('you are using the wrong nx.VERSION');
  total++;
}
function compileAndroidCodeWithTry() {
  nx.try(function() {
    nx.error('you are using the wrong nx.VERSION');
  });
  total++;
}

test('compiling android goes as expected', () => {
  expect(compileAndroidCode).toThrow();
  expect(total).toBe(0);
  compileAndroidCodeWithTry();
  expect(total).toBe(1);
});
