##next-js-core2
A javascript OOP toolkit for mobile.

##install
+ test:npm install mocha --save-dev
+ build:npm install gulp del gulp-concat gulp-rename gulp-uglify gulp-umd gulp-filter --save-dev


##test
+ test base:mocha test/test_base.js
+ test oop:mocha test/test_oop.js

##resources:
+ AMD-Require:https://github.com/arqex/amdrequire/blob/master/amdrequire.js


## my mind:
a-->[b,c,d]
          b--->[e,f]

1) 假设所有的依赖已经加载好了.
b.exports,
c.exports,
d.exports,
e.exports,
f.exports都是有值的(正常情况下都不为null)

b.loaded && c.loaded ... ===true;




1) a--->Module.count ==3
2) a->b[e,f]+2=5
