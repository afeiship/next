# use webpack/rollup
> 由于这个库并非标准方式导出，决定改用 webpack/rollup 来打包


## 现在的方式就是比较完美的
1. 问题在于现在所有的 next-package 存在一个问题：
2. 需要替换的：
```js
// old:
var global = global || this || self || window;

// new:
var global = global || window || self || Function('return this')();
```
