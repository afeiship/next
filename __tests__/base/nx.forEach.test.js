const nx = require('../../dist/index');

describe('Array looping', () => {
  var myArray;

  beforeEach(function() {
    myArray = ['A', 'B', 'C', 'D'];
  });

  test('should pass the index', function() {
    nx.forEach(myArray, function(value, index) {
      expect(String(index)).toMatch(/[0-9]/);
    });
  });

  test('should pass the element', function() {
    nx.forEach(myArray, function(value, index) {
      expect(value).toMatch(/[A-D]/);
    });
  });
});

describe('Array looping -- change context', () => {
  var myArray;
  var myObject;

  beforeEach(function() {
    myArray = ['A', 'B', 'C', 'D'];
    myObject = {
      testA: 'A',
      testB: 'B',
      testC: 'C',
      testD: 'D'
    };
  });

  test('should pass the element', function() {
    var result1 = '';
    nx.forEach(
      myArray,
      function(value, index) {
        result1 += value + '__' + this.testA;
      },
      myObject
    );
    expect(result1).toBe('A__AB__AC__AD__A');
  });
});

describe('should break by nx.BREAKER', () => {
  var myArray;
  beforeEach(function() {
    myArray = ['A', 'B', 'C', 'D'];
  });
  test('should break by nx.BREAKER', function() {
    var result1 = '';
    nx.forEach(myArray, function(value, index) {
      if (value === 'D') {
        return nx.BREAKER;
      } else {
        result1 += value;
      }
    });
    expect(result1).toBe('ABC');
  });
});
