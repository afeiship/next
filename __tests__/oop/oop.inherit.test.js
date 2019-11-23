const nx = require('../../dist/next-js-core2');

/**
./node_modules/.bin/jest __tests__/oop/oop.inherit.test.js
*/

describe('nx.DEBUG', () => {
  test('Class inherit', function() {
    var num1 = 1;

    var Person = nx.declare({
      methods: {
        init: function(name, age) {
          this._name = name;
          this._age = age;
        },
        plus: function() {
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
    fei.plus();

    expect(type.indexOf('nx.Anonymous') > -1).toBe(true);
    expect(fei._name).toBe('fei');
    expect(num1).toBe(2);
  });

  test('__methods__', () => {
    var Human = nx.declare({
      methods: {
        m1: function() {},
        m2: function() {},
        m3: function() {}
      }
    });

    var Man = nx.declare({
      extends: Human,
      methods: {
        m4: function() {},
        m5: function() {},
        m6: function() {}
      }
    });

    var h1 = new Human();
    var man = new Man();
    var h1Methods = h1.__methods__;
    var manMethods = man.__methods__;
    var h1Keys = Object.keys(h1Methods);
    var manKeys = Object.keys(manMethods);
    man.m4();

    expect(h1Keys).toEqual(['m1', 'm2', 'm3']);
    expect(manKeys).toEqual(['m1', 'm2', 'm3', 'm4', 'm5', 'm6']);
  });

  test('__properties__', () => {
    var Human = nx.declare({
      properties: {
        prop1: {
          get: function() {
            return this._prop1;
          },
          set: function(inValue) {
            this._prop1 = '__' + inValue + '__';
          }
        },
        prop2: 'value2',
        prop3: 'value3'
      }
    });

    var Man = nx.declare({
      extends: Human,
      properties: {
        prop1: {
          set: function(inValue) {
            this.base(inValue);
            this._prop1 = '@' + this._prop1 + '@';
          }
        }
      }
    });

    var h1 = new Human();
    var m1 = new Man();

    h1.prop1 = 'H1';
    m1.prop1 = 'M1';

    expect(h1.prop1).toBe('__H1__');
    expect(m1.prop1).toBe('@__M1__@');
  });

  test('__methods__', () => {
    var Human = nx.declare({
      statics: {
        m1: function() {
          return 'm1';
        },
        m2: function() {
          return 'm2';
        },
        m3: function() {}
      }
    });

    var Man = nx.declare({
      extends: Human,
      statics: {
        m1: function() {
          return this.parent('m1') + '@';
        },
        m2: function() {
          // failed! has bug:
          return this.base() + '@';
        },
        m5: function() {},
        m6: function() {}
      }
    });

    var h1Statics = Human.__statics__;
    var manStatics = Man.__statics__;
    var m1Rst = Man.m1();

    var h1Keys = Object.keys(h1Statics);
    var manKeys = Object.keys(manStatics);

    expect(h1Keys).toEqual(['base', 'parent', 'm1', 'm2', 'm3']);
    expect(manKeys).toEqual(['base', 'parent', 'm1', 'm2', 'm3', 'm5', 'm6']);
    expect(m1Rst).toBe('m1@');
    expect(Man.m2()).toBe('m2@');
  });
});
