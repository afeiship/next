require('../../src/base');

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
  var myArrayB;

  beforeEach(function() {
    myArray = ['A', 'B', 'C', 'D'];
    myArrayB = ['A1', 'B1', 'C1', 'D1'];
  });

  test('should pass the element', function() {
    var result = '';
    nx.forEach(
      myArray,
      function(value, index) {
        result += value;
      },
      myArrayB
    );
    console.log(result);
  });
});
