(function (global) {

  var document = global.document;
  var modules = {};
  var define,require;

  //todo:rename to getAbsoluteUrl
  function getUrl(inPath) {
    var path = '';
    var baseUrl = require.config.base;
    if (inPath.indexOf('/') === 0 || inPath.indexOf('./') === 0) {
      //1.path=将:/ 或者 ./替换为空
      //2.将baseUrl + path
      path = baseUrl + inPath.replace(/^\//, '').replace(/^\.\//, '');
    } else if (inPath.indexOf('http:') === 0 || inPath.indexOf('https:') === 0) {
      //如果是cdn资源,http/https等，直接不作任何处理
      path = inPath;
    } else if (inPath.match(/^[a-zA-Z1-9]/)) {
      path = baseUrl + inPath;
    } else {
      throw new Error('valid path:' + inPath);
    }

    if (inPath.lastIndexOf('.js') === -1) {
      path += '.js';
    }
    return path;
  }


  function loadScript(inPath) {
    var path = getUrl(inPath);
    var scriptNode = document.createElement('script');
    var head = document.getElementsByTagName('head')[0];
    scriptNode.src = path;
    scriptNode.onload = function () {
      console.info('script tag is load, the url is : ' + inPath);
    };
    head.appendChild(scriptNode);
  }

  function getCurrentPath() {
    if (document.currentScript) {
      return document.currentScript.src; //FF,Chrome
    }
    var stack;
    try {
      a.b.c();
    } catch (e) {
      stack = e.stack;
      if (!stack && window.opera) {
        stack = String(e);
        if (!stack && window.opera) {
          stack = (String(e).match(/of linked script \S+/g) || []).join(" ");
        }
      }
    }
    if (stack) {
      stack = stack.split(/[@ ]/g).pop();
      stack = stack[0] === "(" ? stack.slice(1, -1) : stack;
      return stack.replace(/(:\d+)?:\d+$/i, "");
    }
    // IE
    var nodes = head.getElementsByTagName("script");
    for (var i = 0, node; node = nodes[i++];) {
      if (node.readyState === 'interactive') {
        return node.src;
      }
    }
  }

  function getBasePath() {
    var src = getCurrentPath();
    var index = src.lastIndexOf('/');
    return src.substring(0, index + 1);
  }


  function loadDpt(module) {
    var dp = '';
    for (var p = 0; p < module.deps.length; p++) {
      dp = getUrl(module.deps[p]);
      if (!modules[dp]) {
        loadScript(dp);
      }
    }
  }


  function checkDps() {
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
  }



  define=function(deps,fn,name){

  };

  require = function (deps, fn, name) {
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

  window.require=require;

}(window));
