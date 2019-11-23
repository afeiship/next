const nx = require('../../dist/next-js-core2');

/**
./node_modules/.bin/jest __test__/oop/oop.static-init.test.js
*/

describe('oop static init', () => {
  test('static init will start automatic:', function() {
    var num1 = 1;
    var StaticClass1 = nx.declare({
      statics: {
        init: function() {
          num1++;
        }
      }
    });

    expect(num1).toBe(2);
  });
});
