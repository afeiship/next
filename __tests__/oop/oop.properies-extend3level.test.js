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

    var ins3 = new Cls3();
    var props3 = Object.keys(ins3.__properties__);
    var ins2 = new Cls2();
    var props2 = Object.keys(ins2.__properties__);

    expect(ins3.prop1).toBe('prop1');
    expect(ins3.prop2).toBe('prop2');
    expect(ins3.prop3).toBe('prop3');
    expect(props3).toEqual(['prop1', 'prop2', 'prop3']);
    expect(props2).toEqual(['prop1', 'prop2']);
  });
});
