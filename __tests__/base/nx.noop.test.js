const nx = require('../../dist/next-js-core2');
var noop = function() {};

test('nx.noop is a noop function ', () => {
  expect(typeof nx.noop === 'function').toBe(true);
  expect(nx.noop.toString()).toBe(noop.toString());
});
