const nx = require('../../dist/index');

/**
./node_modules/.bin/jest __test__/oop/oop/oop.properies-extend3level.test.js
*/

describe.only('oop properties multiple level invalid', () => {
  test('static init will start automatic:', function () {
    var Cls1 = nx.declare({
      properties: {
        prop1: function () {
          return 'prop1';
        }
      }
    });

    var Cls2 = nx.declare({
      extends: Cls1,
      properties: {
        prop2: function () {
          return 'prop2';
        }
      }
    });

    var Cls3 = nx.declare({
      extends: Cls2,
      properties: {
        prop3: function () {
          return 'prop3';
        }
      }
    });

    var ins = new Cls3();
    var props = Object.keys(ins.__properties__);

    expect(ins.prop1).toBe('prop1');
    expect(ins.prop2).toBe('prop2');
    expect(ins.prop3).toBe('prop3');
    expect(props).toEqual(['prop1', 'prop2', 'prop3']);
  });
});
