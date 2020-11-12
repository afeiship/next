const nx = require('../../dist/index');

describe('nx.DEBUG', () => {
  test('Class-debug', function() {
    nx.DEBUG = true;
    var Class1 = nx.declare({
      methods: {
        init: function() {
          this.cl1 = 1;
        }
      }
    });

    var cls1 = new Class1();
    var cls2 = new Class1();
    var cls3 = new Class1();
    var cls4 = new Class1();

    expect(nx.__instances__.length).toBe(4);
  });
});
