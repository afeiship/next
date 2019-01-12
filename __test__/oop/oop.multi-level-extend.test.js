require('../../src/base');
require('../../src/oop-base');
require('../../src/oop-reflect');
require('../../src/oop');

describe('Class multi level extend', () => {
  test('Class-debug', function() {
    var result = 0;
    var Http = nx.declare({
      methods: {
        init: function() {
          this.koa = {
            req: 1234
          };
        }
      }
    });

    var Bussiness = nx.declare({
      extends: Http
    });

    var Example = nx.declare({
      extends: Bussiness,
      methods: {
        exec: function() {
          result = this.koa.req;
        }
      }
    });

    var app = new Example();
    app.exec();

    expect(result).toBe(1234);
  });
});
