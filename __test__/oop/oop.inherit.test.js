require('../../src/base');
require('../../src/oop-base');
require('../../src/oop-reflect');
require('../../src/oop');

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
