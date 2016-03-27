// 通过Ajax来异步加载模块
function backgroundReadFile(url, callback) {
    var req = new XMLHttpRequest();
    req.open("GET", url, true);
    req.addEventListener("load", function () {
        if (req.status < 400)
            callback(req.responseText);
    });
    req.send(null);
}


// module.js 的部分内容
var defineCache = Object.create(null);
var currentMod = null;
function getModule(name) {
    if (name in defineCache) {
        return defineCache[name];
    }
    var module = {
        exports: null,
        loaded: false,
        onLoad: []
    };
    defineCache[name] = module;
    backgroundReadFile(name, function (code) {
        currentMod = module;
        //eval the loaded code:
        new Function("", code)();
    });
    return module;
}


// module.js 的部分内容
function define(depNames, moduleFunction) {
    var myMod = currentMod;
    var deps = depNames.map(getModule);
    deps.forEach(function (mod) {
        if (!mod.loaded) {
            mod.onLoad.push(whenDepsLoaded);
        }
    });
    // 用于检查是否所有的依赖模块都被成功加载了
    function whenDepsLoaded() {
        var allLoaded=deps.every(function (m) {
            return m.loaded;
        });
        if (!allLoaded) {
            return;
        }
        var args = deps.map(function (m) {
            return m.exports;
        });
        var exports = moduleFunction.apply(null, args);
        if (myMod) {
            myMod.exports = exports;
            myMod.loaded = true;
            myMod.onLoad.forEach(function (f) {
                f();
            });
        }
    }

    whenDepsLoaded();
}