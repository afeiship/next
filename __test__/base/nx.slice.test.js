require('../../src/base');

test('arguments slice to array', () => {
  function abc() {
    return nx.slice(arguments);
  }
  var args = abc(1, 2, 3);
  expect(args).toEqual([1, 2, 3]);
});
