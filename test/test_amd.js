require('../dist/next-js-core2')(require);
nx.define(['underscore'], function (underscore) {
  console.log('ini?');
  return nx.declare({
    methods: {
      init: function () {
        console.log('init!');
      }
    }
  });
});

require('../dist/next-js-core2')(require);
var underscore=require('underscore');
var archy=require('archy');
function testRe(deps,callback){
  var params=[];
  deps.forEach(function(item){
    params.push(
      require(item)
    );
  });
  callback.apply(null,params);
}

testRe(['underscore','archy'],function(a,b){
  console.log(a,b);
});


