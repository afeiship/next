(function () {
  var assert = require('assert');
  var nx = require('../dist/next-js-core2');
  describe('src/oop.js', function () {

    describe('#Normal Class', function () {
      it('Class-memeber', function () {
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
            init: function () {
              console.log('method init!');
            }
          }
        });

        var cls1=new Class1();
        var prop_member=cls1.member('prop1');
        var method_member=cls1.member('init');

        assert.equal(prop_member.__type__, 'property');
        assert.equal(prop_member.__meta__, '1234');
        assert.equal(method_member.__type__, 'method');

      });

      it('Class-methods-init', function () {
        var num1 = 1;
        var num2 = 0;
        nx.declare('Class1', {
          methods: {
            init: function () {
              num1++;
            }
          }
        });

        var Class2 = nx.declare({
          methods: {
            init: function () {
              num2++;
            }
          }
        });


        var cls1 = new Class1();
        var cls2 = new Class2();


        assert.equal(num1, 2);
        assert.equal(num2, 1);
      });


      it('Class extend', function () {
        var num1 = 1;
        var Person = nx.declare({
          methods: {
            init: function (name, age) {
              this._name = name;
              this._age = age;
            },
            sayHi: function () {
              num1++;
            }
          }
        });


        var Programmer = nx.declare({
          extends: Person,
          methods: {
            init: function (name, age, lang) {
              this.base(name, age);
              this._lang = lang;
            }
          }
        });

        var fei = new Programmer('fei', 108, 'js');
        var type = fei.type();
        fei.sayHi();

        assert.equal('nx.Anonymous', type);
        assert.equal(fei._name, 'fei');
        assert.equal(2, num1);

      });


      it('static init will auto execute', function () {
        var num1 = 1;
        var StaticClass1 = nx.declare({
          statics: {
            init: function () {
              num1++;
            }
          }
        });

        assert.equal(num1, 2);
      });


      it('props can be called in init', function () {
        var Class1 = nx.declare({
          properties: {
            prop1: 1
          },
          methods: {
            init: function () {
              this.prop1++;
            }
          }
        });
        var cls1 = new Class1();
        assert.equal(2, cls1.prop1);
      });


      it('props has set/get method', function () {
        var Class1 = nx.declare({
          properties: {
            prop1: {
              get: function () {
                return this._prop1;
              },
              set: function (inValue) {
                this._prop1 = inValue * 2;
              }
            }
          }
        });
        var cls1 = new Class1();
        cls1.prop1 = 2;
        assert.equal(4, cls1.prop1);
      });


      it('props set/get can be inherited', function () {
        var Class1 = nx.declare({
          properties: {
            prop1: {
              get: function () {
                return this._prop1;
              },
              set: function (inValue) {
                this._prop1 = inValue * 2;
              }
            }
          }
        });

        var Class2 = nx.declare({
          extend: Class1,
          properties: {
            prop1: {
              set: function (inValue) {
                this.base(inValue + 100)
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
      });


      it('oop mixins', function () {
        var coding = false;
        var study = false;
        var fly = false;
        var superman_init = false;
        var superFly = false;

        var Programmer = nx.declare({
          methods: {
            coding: function () {
              coding = true;
            }
          }
        });

        var Student = nx.declare({
          methods: {
            study: function () {
              study = true;
            }
          }
        });

        var Bird = nx.declare({
          methods: {
            fly: function () {
              fly = true;
            }
          }
        });

        var SuperMan = nx.declare({
          mixins: [
            Programmer,
            Student,
            Bird
          ],
          methods: {
            init: function () {
              superman_init = true;
              //console.log('I have many skills!');
            },
            fly: function () {
              this.base();
              superFly = true;
            }
          }
        });

        var superman = new SuperMan();
        superman.coding();
        superman.study();
        superman.fly();

        assert.equal(superman_init, true);
        assert.equal(coding, true);
        assert.equal(study, true);
        assert.equal(fly, true);
        assert.equal(superFly, true);


      });


    });
  });//end
}());
