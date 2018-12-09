# develop plan:

## refactor:
+ 事件机制独立出来
  - on
  - off
  - fire (这个后续版本中考虑移除，或者改名为： emit ?)
  - one (永远只会 attach 一次，防止多次 attach，而没有 detach 带来的问题)
  - once (执行一次之后，就会被off掉)

## optimize:
+ 利用 forIn/forEach 优化 nx.each 代码
  - 考虑优化 .lengh 的写法

+ 测试现在 nx.slice 的性能，考虑是否优化写法
  - 测试

+ 移除 oop 中 this.base 很猥琐的实现

+ 优化 oop-reflect 写法
