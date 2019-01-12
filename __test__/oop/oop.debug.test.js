require('../../src/base');
require('../../src/oop-base');
require('../../src/oop-reflect');
require('../../src/oop');

describe('nx.DEBUG', () => {
  test('Class-debug', function() {
    nx.DEBUG = true;
    var Class1 = nx.declare({
      methods: {
        init: function() {
          console.log('init method 1');
        }
      }
    });
    var Class2 = nx.declare({
      methods: {
        init: function() {
          console.log('init method 2');
        }
      }
    });
    nx.DEBUG = false;

    console.log(nx.__instances__);

  });
});
