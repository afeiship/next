require('../../src/base');
require('../../src/oop-base');
require('../../src/oop-reflect');
require('../../src/oop');

describe('class __bomb__', () => {
  test('Class-bomb', function() {
    nx.declare('Class1', {
      methods: {
        request: function(inName, inData) {
          return ['request', inName, inData].join('-');
        },
        'post,get,put': function(name) {
          return function(inData) {
            return this.request(name, inData);
          };
        }
      }
    });

    var cl1 = new Class1();

    expect(cl1.post('postdata')).toBe('request-post-postdata');
    expect(cl1.get('getdata')).toBe('request-get-getdata');
    expect(cl1.put('putdata')).toBe('request-put-putdata');
  });
});
