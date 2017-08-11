# next-js-core2
A javascript OOP toolkit for mobile.

## install
+ test:npm install mocha --save-dev
+ build:npm install gulp del gulp-concat gulp-rename gulp-uglify gulp-umd gulp-filter --save-dev

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
    methods:{
      init:function(){
        alert('hello next!');
      }
    }
  });
}(nx, nx.GLOBAL));
</script>
```

## todo:
+ [ ] split base to string,array,object module.
+ [ ] add mocha test for every module.
+ [x] fix this.base issue
+ [ ] fix touch device(wechat) this.base() thrrow errors bug. [Temp way: this.$base.init.call(this); ]
+ [ ] split base to a standalone project?(next-js-lang)
+ [ ] test case
+ [ ] optimzie '__pure_static__'
+ [ ] nx.binds/nx.delegates [nx.bind] on old android condition.

## size:
+ [ default size ]: all files 23.62 kB
+ [ minimize size ]: all files 11 kB

## test
+ test base:mocha test/test_base.js
+ test oop:mocha test/test_oop.js
+ http://www.ruanyifeng.com/blog/2015/12/a-mocha-tutorial-of-examples.html


## resources:
+ ﻿http://stackoverflow.com/questions/29572466/how-do-you-find-out-the-caller-function-in-javascript-when-use-strict-is-enabled
+ ﻿http://stackoverflow.com/questions/9777905/how-to-get-caller-from-strict-mode
+ https://github.com/epeli/underscore.string

##log:
+ [2015-12-01]:finish core refactor.
+ [2016-04-03]:finish node & browser AMD implement.
