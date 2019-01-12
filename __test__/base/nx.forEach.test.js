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
