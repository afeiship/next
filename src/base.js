const root =
  typeof globalThis !== 'undefined'
    ? globalThis
    : typeof self !== 'undefined'
    ? self
    : typeof global !== 'undefined'
    ? global
    : Function('return this')();

var nx = (root.nx = root.nx || {
  BREAKER: {},
  NIL: {},
  VERSION: __VERSION__,
  DEBUG: false,
  GLOBAL: root
});

export default nx;
export { nx };
