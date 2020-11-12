(function () {
  var assert = require('assert');
  var nx = require('../dist/next');

  describe('src/oop-bomb.js', function () {
    it('Class-bomb', function () {
      nx.declare('Class1', {
        methods: {
          request: function (inName, inData) {
            return ['request', inName, inData].join('-');
          },
          'post,get,put': function(name){
            return function(inData){
              return this.request(name,inData);
            }
          }
        }
      });

      var cl1= new Class1();

      assert.equal(cl1.post('postdata'), 'request-post-postdata');
      assert.equal(cl1.get('getdata'), 'request-get-getdata');
      assert.equal(cl1.put('putdata'), 'request-put-putdata');


    });


  });
}());
