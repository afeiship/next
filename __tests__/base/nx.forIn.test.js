require('../../src/base');
// https://github.com/toddmotto/foreach/blob/master/test/spec/foreach-spec.js
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
    nx.forIn(myObject, function(prop, value, obj) {
      expect(value).toMatch(/[A-D]/);
    });
  });

  test('should pass the property name', function() {
    nx.forIn(myObject, function(prop, value, obj) {
      expect(prop).toMatch(/test[A-D]/);
    });
  });

  test('should pass the initial object', function() {
    nx.forIn(myObject, function(prop, value, obj) {
      expect(Object.prototype.toString.call(obj)).toBe('[object Object]');
    });
  });
});

/**
 * Context
 */
describe('Context changing', function() {
  var myObject;

  beforeEach(function() {
    myObject = {
      testA: 'A',
      testB: 'B',
      testC: 'C',
      testD: 'D'
    };
  });

  test('should change the context to the iterated Object', function() {
    nx.forIn(
      myObject,
      function(prop, value, obj) {
        expect(this.testA).toBe('A');
      },
      myObject
    );
  });
});

describe('Each can by break by nx.BREAKER', () => {
  var myObject;

  beforeEach(function() {
    myObject = {
      testA: 'A',
      testB: 'B',
      testC: 'C',
      testD: 'D'
    };
  });

  test('should pass the element', function() {
    var result1 = '';
    nx.forIn(myObject, function(key, value) {
      if (value === 'D') {
        return nx.BREAKER;
      }
      result1 += value;
    });
    expect(result1).toBe('ABC');
  });
});
