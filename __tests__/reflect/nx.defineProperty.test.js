const nx = require('../../dist/next-js-core2');

describe('nx.defineProperty: privmit/object value', () => {
  test('set primitive value, writable value', () => {
    var obj = {};
    nx.defineProperty(obj, 'num1', 123);
    expect(obj.num1).toBe(123);
    obj.num1 = 234;
    expect(obj.num1).toBe(234);
  });

  test('set primitive value, by meta value', () => {
    var obj = {};
    nx.defineProperty(obj, 'num1', { value: 123 });
    expect(obj.num1).toBe(123);
    obj.num1 = 2345;
    expect(obj.num1).toBe(2345);
  });

  test('set primitive value, readonly->meta-get', () => {
    var obj = {};
    nx.defineProperty(obj, 'num1', {
      get: function() {
        return 123;
      }
    });
    expect(obj.num1).toBe(123);
    obj.num1 = 2345;
    expect(obj.num1).toBe(123);
  });

  test('set primitive value, by function', () => {
    var obj = {};
    nx.defineProperty(obj, 'dynamicValue', () => {
      return '__' + 1233;
    });
    expect(obj.dynamicValue).toBe('__1233');
    obj.dynamicValue = 2345;
    expect(obj.dynamicValue).toBe(2345);
    expect(obj._dynamicValue).toBe(2345);
  });
});

describe('nx.defineProperty: descriptor', () => {
  var myObject = {};
  var Person;
  beforeEach(function() {
    myObject = {
      testA: 'A',
      testB: 'B'
    };
    Person = function() {};
  });

  test('defautl normal property', () => {
    var desp = nx.defineProperty(myObject, 'memory', {
      set: function(inValue) {
        return nx.mix(myObject, inValue);
      },
      get: function() {
        return myObject;
      }
    });

    myObject.memory = {
      testB: 123
    };

    expect(myObject.testB).toBe(123);
    expect(myObject.memory === myObject).toBe(true);
    expect(desp.__name__).toBe('memory');
    expect(desp.__type__).toBe('property');
    expect(desp.__static__).toBe(false);
  });

  test('defautl static property', () => {
    var desp = nx.defineProperty(
      Person,
      'memory',
      {
        set: function(inValue) {
          return nx.mix(Person, inValue);
        },
        get: function() {
          return Person;
        }
      },
      true
    );

    Person.memory = {
      testB: 123
    };

    expect(Person.testB).toBe(123);
    expect(Person.memory === Person).toBe(true);
    expect(desp.__name__).toBe('memory');
    expect(desp.__type__).toBe('property');
    expect(desp.__static__).toBe(true);
  });
});

describe('nx.defineProperty: Array.proptytpe', () => {
  // add last property:
  nx.defineProperty(Array.prototype, 'last', {
    get: function() {
      return this[this.length - 1];
    }
  });

  var arr1 = [1, 2, 3];
  var arr2 = [2, 3, { name: 'fei' }];

  expect(arr1.last).toBe(3);
  expect(arr2.last.name).toBe('fei');
});

describe('nx.defineProperty: Class/prototype value', () => {
  function DataHub(inData) {
    this.data = inData;
  }

  nx.defineProperty(DataHub.prototype, 'memory', {
    set: function(inValue) {
      nx.mix(this.data, inValue);
    },
    get: function() {
      return this.data;
    }
  });

  var data1 = new DataHub({ init: 123 });
  data1.memory = { k1: 'value1' };

  expect(data1.memory).toEqual({ init: 123, k1: 'value1' });
});
