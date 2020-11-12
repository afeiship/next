const nx = require('../../dist/index');

/**
 * nx.each
 */
describe('nx.each', function() {
  /**
   * Arrays
   */
  describe('Array looping', function() {
    var myArray;

    beforeEach(function() {
      myArray = ['A', 'B', 'C', 'D'];
    });

    test('should pass the index', function() {
      nx.each(myArray, function(index, value) {
        expect(String(index)).toMatch(/[0-9]/);
      });
    });

    test('should pass the element', function() {
      nx.each(myArray, function(index, value) {
        expect(value).toMatch(/[A-D]/);
      });
    });
  });

  /**
   * Object
   */
  describe('Object looping', function() {
    var myObject;

    beforeEach(function() {
      myObject = {
        testA: 'A',
        testB: 'B',
        testC: 'C',
        testD: 'D'
      };
    });

    test('should pass the value', function() {
      nx.each(myObject, function(prop, value, obj) {
        expect(value).toMatch(/[A-D]/);
      });
    });

    test('should pass the property name', function() {
      nx.each(myObject, function(prop, value, obj) {
        expect(prop).toMatch(/test[A-D]/);
      });
    });

    test('should pass the initial object', function() {
      nx.each(myObject, function(prop, value, obj) {
        expect(Object.prototype.toString.call(obj)).toBe('[object Object]');
      });
    });

    test('should pass the null, will not execute', function() {
      var total = 0;
      nx.each(null, function(prop, value, obj) {
        total++;
      });
      expect(total).toBe(0);
    });

    test('should pass the undefined, will not execute', function() {
      var total = 0;
      nx.each(undefined, function(prop, value, obj) {
        total++;
      });
      expect(total).toBe(0);
    });
  });

  /**
   * Context
   */
  describe('Context changing', function() {
    var myObject;
    var myArray;

    beforeEach(function() {
      myArray = ['A', 'B', 'C', 'D'];
      myObject = {
        testA: 'A',
        testB: 'B',
        testC: 'C',
        testD: 'D'
      };
    });

    test('should change the context to the iterated Object', function() {
      nx.each(
        myObject,
        function(prop, value, obj) {
          expect(this.testA).toEqual('A');
        },
        myObject
      );
    });

    test('should change the context to the iterated Array', function() {
      nx.each(
        myArray,
        function(index, value) {
          expect(this[0]).toEqual('A');
        },
        myArray
      );
    });
  });
});

describe('should break by nx.BREAKER', () => {
  var myArray;
  var myObject;
  beforeEach(function() {
    myArray = ['A', 'B', 'C', 'D'];
    myObject = { testA: 'A', testB: 'B', testC: 'C', testD: 'D' };
  });
  test('should break by nx.BREAKER', function() {
    var result1 = '';
    nx.each(myArray, function(index, value) {
      if (value === 'D') {
        return nx.BREAKER;
      } else {
        result1 += value;
      }
    });
    expect(result1).toBe('ABC');
  });

  test('should pass the element', function() {
    var result1 = '';
    nx.each(myObject, function(key, value) {
      if (value === 'D') {
        return nx.BREAKER;
      }
      result1 += value;
    });
    expect(result1).toBe('ABC');
  });
});

describe('I can know my type isArray:true/false', () => {
  var myArray;
  var myObject;
  beforeEach(function() {
    myArray = ['A'];
    myObject = { testA: 'A' };
  });
  test('I can know my type isArray: true', function() {
    nx.each(myArray, function(index, value, target, isArray) {
      expect(isArray).toBe(true);
    });
  });

  test('I can know my type isObject: false', function() {
    nx.each(myObject, function(key, value, target, isArray) {
      expect(isArray).toBe(false);
    });
  });
});
