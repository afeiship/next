(function() {
  var assert = require('assert');
  var nx = require('../dist/next');

  describe('src/oop.js', function() {
    it('Class-memeber', function() {
      nx.declare('Class1', {
        statics: {
          static1: 1233,
          status: 'loading'
        },
        properties: {
          prop1: 1234,
          prop2: {
            value: {
              name: 'fei'
            }
          }
        },
        methods: {
          init: function() {
            // console.log('method init!');
          }
        }
      });

      var cls1 = new Class1();
      var prop_member = cls1['@prop1'];
      var method_member = cls1['@init'];

      assert.equal(prop_member.__type__, 'property');
      assert.equal(prop_member.__meta__, '1234');
      assert.equal(method_member.__type__, 'method');
    });

    it('Class-methods-init', function() {
      var num1 = 1;
      var num2 = 0;
      nx.declare('Class1', {
        methods: {
          init: function() {
            num1++;
          }
        }
      });

      var Class2 = nx.declare({
        methods: {
          init: function() {
            num2++;
          }
        }
      });

      var cls1 = new Class1();
      var cls2 = new Class2();

      assert.equal(num1, 2);
      assert.equal(num2, 1);
    });

    it('Class extend', function() {
      var num1 = 1;
      var Person = nx.declare({
        methods: {
          init: function(name, age) {
            this._name = name;
            this._age = age;
          },
          sayHi: function() {
            num1++;
          }
        }
      });

      var Programmer = nx.declare({
        extends: Person,
        methods: {
          init: function(name, age, lang) {
            this.base(name, age);
            this._lang = lang;
          }
        }
      });

      var fei = new Programmer('fei', 108, 'js');
      var type = fei.__type__;
      fei.sayHi();

      assert.equal(true, !!~type.indexOf('nx.Anonymous'));
      assert.equal(fei._name, 'fei');
      assert.equal(2, num1);
    });

    it('Class multi level extend', function() {
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

      assert.equal(result, 1234);
    });

    it('static init will auto execute', function() {
      var num1 = 1;
      var StaticClass1 = nx.declare({
        statics: {
          init: function() {
            num1++;
          }
        }
      });

      assert.equal(num1, 2);
    });

    it('props can be called in init', function() {
      var Class1 = nx.declare({
        properties: {
          prop1: 1
        },
        methods: {
          init: function() {
            this.prop1++;
          }
        }
      });
      var cls1 = new Class1();
      assert.equal(2, cls1.prop1);
    });

    it('props is null', function() {
      var Class1 = nx.declare({
        properties: {
          prop1: null
        },
        methods: {
          init: function() {
            this.prop1 = this.prop1 + '';
          }
        }
      });
      var cls1 = new Class1();
      assert.equal('null', cls1.prop1);
    });

    it('props has set/get method', function() {
      var Class1 = nx.declare({
        properties: {
          prop1: {
            get: function() {
              return this._prop1;
            },
            set: function(inValue) {
              this._prop1 = inValue * 2;
            }
          }
        }
      });
      var cls1 = new Class1();
      cls1.prop1 = 2;
      assert.equal(4, cls1.prop1);
    });

    it('props set/get can be inherited', function() {
      var Class1 = nx.declare({
        properties: {
          prop1: {
            get: function() {
              return this._prop1;
            },
            set: function(inValue) {
              this._prop1 = inValue * 2;
            }
          },
          prop2: 'love'
        }
      });

      var Class2 = nx.declare({
        extends: Class1,
        properties: {
          prop1: {
            set: function(inValue) {
              this.base(inValue + 100);
            }
          }
        }
      });
      var cls1 = new Class1();
      var cls2 = new Class2();

      cls1.prop1 = 2;
      cls2.prop1 = 2;

      assert.equal(4, cls1.prop1);
      assert.equal(204, cls2.prop1);
      assert.equal('love', cls2.prop2);
    });

    it('static can be called in child class', function() {
      var total = 1;
      var Class1 = nx.declare({
        statics: {
          instance: null,
          getInst: function() {
            total++;
            // console.log('get instance');
            return this.instance;
          }
        }
      });

      var Class2 = nx.declare({
        extends: Class1
      });

      Class1.getInst();
      assert.equal(2, total);
      Class2.getInst();
      assert.equal(3, total);
    });

    it('call parent method', function() {
      var total = 2;
      var Class1 = nx.declare({
        methods: {
          calc: function() {
            total++;
          }
        }
      });

      var Class2 = nx.declare({
        extends: Class1,
        methods: {
          calc: function() {
            this.parent('calc');
            total = total * 2;
          }
        }
      });

      var cls2 = new Class2();
      cls2.calc();

      assert.equal(6, total);
    });

    it('test __methods__', function() {
      var Class1 = nx.declare({
        methods: {
          m1: function() {
            console.log('method1');
          },
          m2: function() {
            console.log('method2');
          }
        }
      });

      var Class2 = nx.declare({
        properties: {
          prop1: 'k1',
          prop2: 'k2'
        },
        methods: {
          m1: function() {
            console.log('method1 override in child');
          },
          m3: function() {
            console.log('method3 in child');
          },
          m4: function() {
            console.log('method2 in child');
          }
        }
      });

      var cls1 = new Class1();
      var cls2 = new Class2();
      assert.deepEqual(Object.keys(cls1.__methods__), ['m1', 'm2']);
      assert.deepEqual(Object.keys(cls2.__methods__), ['m1', 'm3', 'm4']);
      // console.log(cls2.__properties__);
    });
  });
})();
