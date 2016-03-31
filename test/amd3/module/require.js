/**
 * Created by duanyao on 2015/5/12.
 */
(function () {
  var define;
  window.modules = {};
  var getUrl = function (src) {
    var scriptSrc = '';
    //判断URL是否是
    // ./或者
    // /或者
    // 直接是以字符串开头
    // 或者是以http://开头;
    if (src.indexOf('/') === 0 || src.indexOf('./') === 0) {
      scriptSrc = require.config.base + src.replace(/^\//, '').replace(/^\.\//, '');
    } else if (src.indexOf('http:') === 0) {
      scriptSrc = src;
    } else if (src.match(/^[a-zA-Z1-9]/)) {
      scriptSrc = require.config.base + src;
    } else if (true) {
      alert('src错误!');
    }
    if (scriptSrc.lastIndexOf('.js') === -1) {
      scriptSrc += '.js';
    }
    return scriptSrc;
  };

  var loadScript = function (src) {
    var scriptSrc = getUrl(src);
    var sc = document.createElement('script');
    var head = document.getElementsByTagName('head')[0];
    sc.src = scriptSrc;
    sc.onload = function () {
      console.log('script tag is load, the url is : ' + src);
    };
    head.appendChild(sc);
  };

  var getBasePath = function () {
    var src = getCurrentPath();
    var index = src.lastIndexOf('/');
    return src.substring(0, index + 1);
  };

  var getCurrentNode = function () {
    if (document.currentScript) return document.currentScript;
    var arrScript = document.getElementsByTagName('script');
    var len = arrScript.length;
    for (var i = 0; i < len; i++) {
      if (arrScript[i].readyState === 'interactive') {
        return arrScript[i];
      }
    }

    //IE11的特殊处理;
    var path = getCurrentPath();
    for (var i = 0; i < len; i++) {
      if (path.indexOf(arrScript[i].src) !== -1) {
        return arrScript[i];
      }
    }
    throw new Error('getCurrentNode error');
  };

  var getCurrentPath = function () {
    var repStr = function (str) {
      return (str || '').replace(/[\&\?]{1}[\w\W]+/g, '') || '';
    };
    if (document.currentScript) return repStr(document.currentScript.src);

    //IE11没有了readyState属性， 也没有currentScript属性;
    // 参考 https://github.com/samyk/jiagra/blob/master/jiagra.js
    var stack;
    try {
      a.b.c(); //强制报错,以便捕获e.stack
    } catch (e) { //safari的错误对象只有line,sourceId,sourceURL
      stack = e.stack;
      if (!stack && window.opera) {
        //opera 9没有e.stack,但有e.Backtrace,但不能直接取得,需要对e对象转字符串进行抽取
        stack = (String(e).match(/of linked script \S+/g) || []).join(' ');
      }
    }
    if (stack) {
      /**e.stack最后一行在所有支持的浏览器大致如下:
       *chrome23:
       * at http://113.93.50.63/data.js:4:1
       *firefox17:
       *@http://113.93.50.63/query.js:4
       *opera12:http://www.oldapps.com/opera.php?system=Windows_XP
       *@http://113.93.50.63/data.js:4
       *IE10:
       *  at Global code (http://113.93.50.63/data.js:4:1)
       *  //firefox4+ 可以用document.currentScript
       */
      stack = stack.split(/[@ ]/g).pop(); //取得最后一行,最后一个空格或@之后的部分
      stack = stack[0] === '(' ? stack.slice(1, -1) : stack.replace(/\s/, ''); //去掉换行符
      return stack.replace(/(:\d+)?:\d+$/i, ''); //去掉行号与或许存在的出错字符起始位置
    }

    //实在不行了就走这里;
    var node = getCurrentNode();
    //IE>=8的直接通过src可以获取，IE67要通过getAttriubte获取src;
    return repStr(document.querySelector ? node.src : node.getAttribute('src', 4)) || '';

    throw new Error('getCurrentPath error!');
  };

  var loadDpt = function (module) {
    var dp = '';
    for (var p = 0; p < module.deps.length; p++) {
      //获取绝对的地址;
      dp = getUrl(module.deps[p]);
      //如果依赖没有加载就直接加载;
      if (!modules[dp]) {
        loadScript(dp);
      }
    }
  };

  //主要的模块， 检测所有未加载的模块中未完成了的依赖是否加载完毕，如果加载完毕就加载模块， 如果加载过的话，而且所有依赖的模块加载完毕就执行该模块
  //而且此模块的exports为该模块的执行结果;
  var checkDps = function () {
    for (var key in modules) {
      //初始化该模块需要的参数;
      var params = [];
      var module = modules[key];
      //加载完毕就什么都不做;
      if (module.state === 'complete') {
        continue;
      }
      if (module.state === 'initial') {
        //如果依赖没有加载就加载依赖并且modules没有该module就加载这个模块;
        loadDpt(module);
        module.state = 'loading';
      }
      if (module.state === 'loading') {
        //如果这个依赖加载完毕
        for (var p = 0; p < module.deps.length; p++) {
          //获取绝对的地址;
          var dp = getUrl(module.deps[p]);
          //如果依赖加载完成了， 而且状态为complete;;
          if (modules[dp] && modules[dp].state === 'complete') {
            params.push(modules[dp].exports);
          }
        }
        //如果依赖全部加载完毕，就执行;
        if (module.deps.length === params.length) {
          if (typeof module.exports === 'function') {
            module.exports = module.exports.apply(modules, params);
            module.state = 'complete';
            //每一次有一个模块加载完毕就重新检测modules，看看是否有未加载完毕的模块需要加载;
            checkDps();
          }
        }
      }
    }
  };

  //[],fn; fn
  define = function (deps, fn, name) {
    if (typeof deps === 'function') {
      fn = deps;
      deps = [];//我们要把数组清空;
    }

    if (typeof deps !== 'object' && typeof fn !== 'function') {
      alert('参数错误')
    }

    var src = getCurrentPath();
    //没有依赖, 没有加载该模块就新建一个该模块;
    if (deps.length === 0) {
      modules[src] = {
        name: name || src,
        src: src,
        deps: [],
        exports: (typeof fn === 'function') && fn(),
        state: 'complete'
      };

    } else {
      modules[src] = {
        name: name || src,
        src: src,
        deps: deps,
        exports: fn,
        state: 'initial'
      };
    }

    return checkDps();
  };

  window.define = define;
  window.require = function () {
    //如果是require的话那么模块的名字就是一个不重复的名字，避免和define重名;
    var args = Array.prototype.slice.call(arguments);
    define(args);
  };
  require.config = {
    base: getBasePath()
  };
  require.loadScript = loadScript;
  var loadDefaultJS = getCurrentNode().getAttribute('data-main');
  loadDefaultJS && loadScript(loadDefaultJS);
})();
