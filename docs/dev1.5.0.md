# develop plan:

## refactor:
+ [x]事件机制独立出来
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
```js
  // 留一下纪念吧
  var callStackRE1 = /__Class__\.(.*) \(/;
  var callStackRE2 = /at (.*) \(/;

  // ....
  base: function () {
    var callerName, method;
    var args, stackes;
    try {
      method = this.base.caller.__base__;
      if (method) {
        return method.apply(this, arguments);
      }
    } catch (e) {
      stackes = e.stack.split('\n')[2];
      callerName = (stackes.match(callStackRE1) || stackes.match(callStackRE2))[1];
      method = this.$base[callerName];
      args = [].slice.call(arguments, 0);
      return method.apply(this, args);
    }
  },
```

+ 优化 oop-reflect 写法
+ 移除 stubFunction

## returnValue/Then 等改成 stubArray/stubTrue/stubFalse
+ https://blog.csdn.net/imjaron/article/details/78421119

~~~
stub code大概就是占坑的代码，桩代码给出的实现是临时性的/待编辑的。它使得程序在结构上能够符合标准，又能够使程序员可以暂时不编辑这段代码。

举个《C专家编程》中的例子：
我的一位同事需要编写一个程序，要求在某一地点存储每个文件的文件名和相关信息。数据存储于一个结构表中，他决定使用散列表。这里就需要用到可调试性编码。他并不想一步登天，一次完成所有的任务。他首先让最简单的情况能够运行，就是散列函数总是返回一个0,，这个散列函数如下：int hash_filename(char *s){ return 0;}这个函数的效果就是一个散列表还未被使用。所有的元素都存储在第零个位置后面的链表中，这使得程序很容易调试，因为无需计算散列函数的具体值。
~~~

