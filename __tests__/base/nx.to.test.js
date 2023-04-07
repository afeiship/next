const nx = require('../../dist/index');

// @thanks to: https://github.com/scopsy/await-to-js/blob/master/test/await-to-js.test.ts

test('should return a value when resolved', async () => {
  const testInput = 41;
  const promise = Promise.resolve(testInput);

  const [err, data] = await nx.to(promise);

  expect(err).toBeUndefined();
  expect(data).toEqual(testInput);
});

it('should return an error when promise is rejected', async () => {
  const promise = Promise.reject('Error');
  const [err, data] = await nx.to(promise);

  expect(err).toEqual('Error');
  expect(data).toBeUndefined();
});
