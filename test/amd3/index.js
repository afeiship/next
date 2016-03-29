(function (w, DOC) {
  var _$ = w.$;
  var head = DOC.head || DOC.getElementsByTagName('head')[0];
  var html = DOC.documentElement;
  var W3C = DOC.dispatchEvent;
  var basePath = getCurrentScript(DOC);
  basePath = basePath.substring(0, basePath.lastIndexOf('/') + 1);
  var hasOwn = Object.prototype.hasOwnProperty;
  var toString = Object.prototype.toString;
  var class2type = {};

  var noop = function () {
  };

  var AS = function () {
    if (this == w) {
      return new AS(arguments);
    } else {
      console.info(this);
    }
  };
  AS.prototype = {
    constructor: AS
  };
  AS.fn = AS.prototype;
  AS.extend = function () {
    var args = arguments;
    if (args.length === 2) {
      var target = args[0];
      var source = args[1];
      for (var attr in source) {
        target[attr] = source[attr];
      }
    } else {
      for (var i = 0, len = args.length; i < len; i++) {
        var obj = args[i];
        for (var attr in obj) {
          AS[attr] = obj[attr];
        }
      }
    }
  };

  /*AMD模块开始*/
  var modules = {};

  function getEmptyModule() {
    return {
      deps: [],
      offers: [],
      state: 0,
      factory: noop
    };
  }

  function getCurrentScript(DOC) {
    if (DOC.currentScript) {
      return DOC.currentScript.src; //FF,Chrome
    }
    var stack;
    try {
      a.b.c();
    } catch (e) {
      stack = e.stack; // 利用错误异常立刻抛出快速获得当前加载文件路径
      if (!stack && window.opera) {
        stack = String(e);
        if (!stack && window.opera) {
          stack = (String(e).match(/of linked script \S+/g) || []).join(" ");
        }
      }
    }
    if (stack) {
      stack = stack.split(/[@ ]/g).pop(); //取得最后一行,最后一个空格或@之后的部分
      stack = stack[0] === "(" ? stack.slice(1, -1) : stack;
      return stack.replace(/(:\d+)?:\d+$/i, ""); //去掉行号与或许存在的出错字符起始位置
    }
    // IE
    var nodes = head.getElementsByTagName("script");
    for (var i = 0, node; node = nodes[i++];) {
      if (node.readyState === 'interactive') {
        return node.src;
      }
    }
  }

  function getModuleName(url) {
    return url.substring(url.lastIndexOf('/') + 1, url.lastIndexOf('.js'));
  }

  function require(list, factory) {
    var loaded = 0;
    var requires = list.length;
    var args = [];
    //current id:
    var id = getCurrentScript(DOC);
    console.info('加载' + getModuleName(id) + '模块需要依赖' + list + '模块');

    //current module:
    var module = modules[id] ? modules[id] : getEmptyModule();
    module['factory'] = factory;

    //cache module:{ currentId:currentModule }
    modules[id] = module;

    for (var i = 0; i < list.length; i++) {
      var depId = basePath + list[i] + '.js';
      modules[depId] = modules[depId] ? modules[depId] : getEmptyModule();
      module['deps'].push(depId);
      if (modules[depId] && modules[depId].state === 2) {
        console.info(getModuleName(depId) + '依赖已提前加载完毕');
        modules[depId].offers.push(id);
        loaded++;
        args.push(modules[depId].exports);
        //此依赖模块正在被加载中
      } else if (modules[depId] && modules[depId].state === 1) {
        console.info(getModuleName(depId) + '依赖正在加载中');
        modules[depId].offers.push(id);
        //此依赖模块从未加载过
      } else {
        //loadJS加载模块js,模块js调用define,define又会require加载此模块需要的依赖
        //从而函数进入递归追踪并加载此模块所有直接和间接依赖
        console.info('第一次加载依赖模块' + getModuleName(depId));
        modules[depId].offers.push(id);
        loadJS(depId);
      }
    }
    if (loaded === requires) {
      module.factory.apply(null, args);
      module.state = 2;
    }
  }

  window.require = AS.require = require;

  function loadJS(url) {
    var module = modules[url];
    var node = DOC.createElement('script');
    node.onload = node.onreadystatechange = function () {
      if (/loaded|complete/i.test(node.readyState) || !node.readyState) {

      }
    };
    node.src = url;
    head.insertBefore(node, head.firstChild);
    module.state = 1;
    //console.info('正在加载模块'+getModuleName(url));
  }

  function findFishedModules(url) {
    var ret = [];
    var deped = modules[url];
    var moduleIds = deped.offers;
    for (var i = 0; i < moduleIds.length; i++) {
      var id = moduleIds[i];
      var deps = modules[id].deps;
      var flag = false;
      for (var j = 0; j < deps.length; j++) {
        var dep = modules[deps[j]];
        if (dep.state == 2 || deps[j] == url) {
          flag = true;
        }
        if (dep.state != 2) {
          flag = false;
          break;
        }
      }
      if (flag) {
        //console.info('模块' + getModuleName(id) + '已可用');
        ret.push(id);
      }
    }
    return ret;
  }

  function fireFactory(root) {
    console.info('查找依赖于' + getModuleName(root) + '模块的模块安装情况');
    var finshedIds = findFishedModules(root);
    for (var i = 0; i < finshedIds.length; i++) {
      var module = modules[finshedIds[i]];
      console.info(getModuleName(finshedIds[i]) + '模块所有依赖已经可以安装完毕,可以执行回调函数');
      var exports = module.factory.apply(null, getDepsModules(module.deps));
      module.state = 2;
      if (exports) {
        module.exports = exports;
        console.info('导入' + getModuleName(finshedIds[i]) + '模块');
      } else {
        break;
      }
      fireFactory(finshedIds[i]);
    }
  }

  function getDepsModules(deps) {
    var args = [];
    for (var i = 0; i < deps.length; i++) {
      var dep = deps[i];
      args.push(modules[dep].exports);
    }
    return args;
  }

  function define(deps, factory) {
    var id = getCurrentScript(DOC);
    //如果此模块没有依赖立即安装该模块
    if (deps.length == 0) {
      modules[id].exports = factory.apply(null);
      modules[id].state = 2;
      //从依赖的叶子一直往上找一系列的触发安装
      console.info('模块' + getModuleName(id) + '加载完毕');
      fireFactory(id);
      return;
    }
    require(deps, function () {
      var _deps = [];
      for (var i = 0; i < deps.length; i++) {
        _deps.push(basePath + deps[i] + '.js');
      }
      modules[id].exports = factory.apply(null, getDepsModules(_deps));
      modules[id].state = 2;
      console.info('模块' + getModuleName(id) + '加载完毕');
      fireFactory(id);
    });
  }

  window.define = AS.define = define;
  /*AMD模块结束*/

  // 暴露AS函数
  w.$ = w.AS = AS;

})(self, self.document);
