##next-js-core2
A javascript OOP toolkit for mobile.

##install
+ test:npm install mocha --save-dev
+ build:npm install gulp del gulp-concat gulp-rename gulp-uglify gulp-umd gulp-filter --save-dev

## usage:
+ install
```bash
npm install --save afeiship/next-js-core2
```
+ use in node:
```javascript
var nx = require('next-js-core2')
```
+ use in browser:
```html
<script type="text/javascript" src="../libs/next-js-core2/dist/next-js-core2.js"></script>
<script type="text/javascript">
nx.declare('myApp',{
  methods:{
    init:function(){
      alert('hello next!');
    }
  }
})
</script>
```

## todo:
- [ ] split base to string,array,object module.
- [ ] add mocha test for every module.


##test
+ test base:mocha test/test_base.js
+ test oop:mocha test/test_oop.js
+ http://www.ruanyifeng.com/blog/2015/12/a-mocha-tutorial-of-examples.html

##log:
+ [2015-12-01]:finish core refactor.
+ [2016-04-03]:finish node & browser AMD implement.
