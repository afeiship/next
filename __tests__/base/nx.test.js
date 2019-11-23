const nx = require('../../dist/next-js-core2');

test('nx attached to global', () => {
  expect(typeof nx === 'object').toBe(true);
});

test('nx.VERSION attached to nx', () => {
  expect(typeof nx.VERSION === 'string').toBe(true);
});

test('nx.DEBUG attached to nx', () => {
  expect(typeof nx.DEBUG === 'boolean').toBe(true);
});

test('nx.GLOBAL attached to nx', () => {
  expect(typeof nx.GLOBAL === 'object').toBe(true);
});

test('nx.noop attached to nx', () => {
  expect(typeof nx.noop === 'function').toBe(true);
});

test('nx.BREAKER attached to nx', () => {
  expect(typeof nx.BREAKER === 'object').toBe(true);
});

test('nx.BREAKER is a plain object', () => {
  expect(nx.BREAKER).toEqual({});
});
