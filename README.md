# next-js-core2
A javascript OOP toolkit for mobile.

## usage:
+ install
```bash
npm install --save afeiship/next-js-core2
```
+ use in node:
```javascript
var nx = require('next-js-core2');
```
+ use in browser:
```html
<script type="text/javascript" src="../libs/next-js-core2/dist/next-js-core2.js"></script>
<script type="text/javascript">
(function(nx, global) {
  nx.declare('myApp',{
    statics:{
      init:function(){
        alert('hello next!');
      }
    }
  });
}(nx, nx.GLOBAL));
</script>
```

## features:
+ [x] oop 
+ [x] methods bomb

## size:


## todo:
+ [x] split base to string,array,object module.
+ [x] add mocha test for every module.
+ [x] fix this.base issue
+ [x] fix touch device(wechat) this.base() thrrow errors bug. [Temp way: this.$base.init.call(this); ]
+ [x] split base to a standalone project?(next-js-lang)
+ [x] test case
+ [x] optimzie '__pure_static__'
+ [x] nx.binds/nx.delegates [nx.bind] on old android condition.

## size:
+ [ default size ]: all files 16 kB
+ [ minimize size ]: all files 8 kB
+ [real size]: 5,945 bytes (8 KB on disk) -> 5,191 bytes

## test
+ test base:mocha test/test_base.js
+ test oop:mocha test/test_oop.js

## resources:
+ ﻿http://stackoverflow.com/questions/29572466/how-do-you-find-out-the-caller-function-in-javascript-when-use-strict-is-enabled
+ ﻿http://stackoverflow.com/questions/9777905/how-to-get-caller-from-strict-mode
+ https://github.com/epeli/underscore.string
+ http://www.ruanyifeng.com/blog/2015/12/a-mocha-tutorial-of-examples.html

## log:
+ [2015-12-01]:finish core refactor.
+ [2016-04-03]:finish node & browser AMD implement.
+ [2017-08-12]:refactor 1.3.0
