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
+ use:
```javascript
require('next-js-core2')(require);
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
