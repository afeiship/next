const nx = require('../../dist/index');

describe('src/core/nx.is-xxx', function () {
  test('nx.isString', function () {
    expect(nx.isString('')).toBe(true);
    expect(nx.isString(null)).toBe(false);
    expect(nx.isString(undefined)).toBe(false);
    expect(nx.isString(123)).toBe(false);
    expect(nx.isString({})).toBe(false);
    expect(nx.isString([])).toBe(false);
    expect(nx.isString(function () {})).toBe(false);
  });

  test('nx.isBoolean', function () {
    expect(nx.isBoolean(true)).toBe(true);
    expect(nx.isBoolean(false)).toBe(true);
    expect(nx.isBoolean(null)).toBe(false);
    expect(nx.isBoolean(undefined)).toBe(false);
    expect(nx.isBoolean(123)).toBe(false);
    expect(nx.isBoolean({})).toBe(false);
    expect(nx.isBoolean([])).toBe(false);
    expect(nx.isBoolean(function () {})).toBe(false);
  });

  test('nx.isObject', function () {
    expect(nx.isObject({})).toBe(true);
    expect(nx.isObject(null)).toBe(false);
    expect(nx.isObject(undefined)).toBe(false);
    expect(nx.isObject(123)).toBe(false);
    expect(nx.isObject('')).toBe(false);
    expect(nx.isObject([])).toBe(false);
    expect(nx.isObject(function () {})).toBe(false);
  });

  test('nx.isArray', function () {
    expect(nx.isArray([])).toBe(true);
    expect(nx.isArray(null)).toBe(false);
    expect(nx.isArray(undefined)).toBe(false);
    expect(nx.isArray(123)).toBe(false);
    expect(nx.isArray('')).toBe(false);
    expect(nx.isArray({})).toBe(false);
    expect(nx.isArray(function () {})).toBe(false);
  });

  test('nx.isFunction', function () {
    expect(nx.isFunction(function () {})).toBe(true);
    expect(nx.isFunction(null)).toBe(false);
    expect(nx.isFunction(undefined)).toBe(false);
    expect(nx.isFunction(123)).toBe(false);
    expect(nx.isFunction('')).toBe(false);
    expect(nx.isFunction({})).toBe(false);
    expect(nx.isFunction([])).toBe(false);
  });

  test('nx.isNumber', function () {
    expect(nx.isNumber(123)).toBe(true);
    expect(nx.isNumber(NaN)).toBe(false);
    expect(nx.isNumber(123.456)).toBe(true);
    expect(nx.isNumber(null)).toBe(false);
    expect(nx.isNumber(undefined)).toBe(false);
    expect(nx.isNumber('')).toBe(false);
    expect(nx.isNumber({})).toBe(false);
    expect(nx.isNumber([])).toBe(false);
    expect(nx.isNumber(function () {})).toBe(false);
  });

  test('nx.isNaN', function () {
    expect(nx.isNaN(NaN)).toBe(true);
    expect(nx.isNaN(123)).toBe(false);
    expect(nx.isNaN(null)).toBe(false);
  });

  test('nx.isNil', function () {
    expect(nx.isNil(null)).toBe(true);
    expect(nx.isNil(undefined)).toBe(true);
    expect(nx.isNil(123)).toBe(false);
    expect(nx.isNil('')).toBe(false);
    expect(nx.isNil({})).toBe(false);
    expect(nx.isNil([])).toBe(false);
    expect(nx.isNil(function () {})).toBe(false);
  });

  test('nx.isNull', function () {
    expect(nx.isNull(null)).toBe(true);
    expect(nx.isNull(undefined)).toBe(false);
    expect(nx.isNull(123)).toBe(false);
    expect(nx.isNull('')).toBe(false);
    expect(nx.isNull({})).toBe(false);
    expect(nx.isNull([])).toBe(false);
    expect(nx.isNull(function () {})).toBe(false);
  });

  test('nx.isUndefined', function () {
    expect(nx.isUndefined(undefined)).toBe(true);
    expect(nx.isUndefined(null)).toBe(false);
    expect(nx.isUndefined(123)).toBe(false);
    expect(nx.isUndefined('')).toBe(false);
    expect(nx.isUndefined({})).toBe(false);
    expect(nx.isUndefined([])).toBe(false);
    expect(nx.isUndefined(function () {})).toBe(false);
  });

  test('nx.isPromiseLike', () => {
    const p1 = new Promise((resolve, reject) => {
      resolve(123);
    });
    // const p2 = new Promise((resolve, reject) => {
    //   reject(new Error('error'));
    // });
    const p3 = 123;
    const p4 = '123';
    const p5 = null;
    const p6 = undefined;
    const p7 = function () {};
    const p8 = { then: function () {} };
    const p9 = { then: function () {}, catch: function () {} };
    const p10 = {
      then: function () {},
      catch: function () {},
      finally: function () {}
    };

    expect(nx.isPromiseLike(p1)).toBe(true);
    // expect(nx.isPromiseLike(p2)).toBe(false);
    expect(nx.isPromiseLike(p3)).toBe(false);
    expect(nx.isPromiseLike(p4)).toBe(false);
    expect(nx.isPromiseLike(p5)).toBe(false);
    expect(nx.isPromiseLike(p6)).toBe(false);
    expect(nx.isPromiseLike(p7)).toBe(false);
    expect(nx.isPromiseLike(p8)).toBe(true);
    expect(nx.isPromiseLike(p9)).toBe(true);
    expect(nx.isPromiseLike(p10)).toBe(true);
  });
});
