const nx = require('../../dist/index');

describe('src/core/nx.isPromise', function () {
  test('nx.isPromise - Promise instances', () => {
    const p1 = new Promise((resolve) => resolve(123));
    const p2 = Promise.resolve(456);

    expect(nx.isPromise(p1)).toBe(true);
    expect(nx.isPromise(p2)).toBe(true);
  });

  test('nx.isPromise - non-Promise values', () => {
    const p1 = 123;
    const p2 = '123';
    const p3 = null;
    const p4 = undefined;
    const p5 = function () {};
    const p6 = { then: function () {} };
    const p7 = { then: function () {}, catch: function () {} };
    const p8 = { then: function () {}, catch: function () {}, finally: function () {} };
    const p9 = {};
    const p10 = [];

    expect(nx.isPromise(p1)).toBe(false);
    expect(nx.isPromise(p2)).toBe(false);
    expect(nx.isPromise(p3)).toBe(false);
    expect(nx.isPromise(p4)).toBe(false);
    expect(nx.isPromise(p5)).toBe(false);
    expect(nx.isPromise(p6)).toBe(false);
    expect(nx.isPromise(p7)).toBe(false);
    expect(nx.isPromise(p8)).toBe(false);
    expect(nx.isPromise(p9)).toBe(false);
    expect(nx.isPromise(p10)).toBe(false);
  });

  test('nx.isPromise - PromiseLike objects (should return false)', () => {
    const thenable = {
      then: function (resolve, reject) {
        resolve(123);
      }
    };

    expect(nx.isPromise(thenable)).toBe(false);
  });
});
