var assert = require('assert');
var nx = require('../dist/next');

describe('src/base-forIn', function () {
  it('nx.forIn-object each', function () {
    var obj = { name: 'fei', email: '1290657123@qq.com', nx: 'next' };
    var result_str = '';
    var result_can_break ='';


    nx.forIn(obj, function (key, value) {
      result_str = result_str + '-' + value;
    });


    nx.forIn(obj, function (key, value) {
      if(key==='nx'){
        return nx.BREAKER;
      }
      result_can_break = result_can_break + '-' + value;
    });


    assert.equal(result_str.indexOf('next') > -1, true);
    assert.equal(result_can_break.indexOf('next') > -1, false);
  });

});
