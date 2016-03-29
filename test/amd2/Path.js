(function (nx, global) {

  var DOT = '.',
    DOUBLE_DOT = '..',
    SLASH = '/';

  nx.declare('nx.amd.Path', {
    statics: {
      normalize: function (inPath) {
        var tokens = inPath.split(SLASH);
        var normalized = [], token, count = 0;

        for (var i = 0, len = tokens.length; i < len; i++) {
          token = tokens[i];
          if (token) {
            if (token === DOUBLE_DOT) {
              if (count > 0) {
                count--;
                normalized.pop();
              } else {
                normalized.push(DOUBLE_DOT);
              }
            } else if (token === DOT) {
              if (i === 0) {
                normalized.push(DOT);
              }
            } else {
              count++;
              normalized.push(token);
            }
          } else {
            if (count > 0 && i < len - 1) {
              normalized = normalized.slice(0, -count);
            } else {
              normalized.push('');
            }
          }
        }

        return normalized.join(SLASH);
      },
      parent: function (inPath) {
        return inPath.slice(0, inPath.lastIndexOf(SLASH) + 1);
      },
      last: function (inPath) {
        return inPath.slice(inPath.lastIndexOf(SLASH) + 1);
      },
      setExt: function (inPath, inExt) {
        var extLength = inExt.length;
        var end = inPath.slice(-extLength);

        if (end === inExt) {
          return inPath;
        } else if (end[extLength - 1] === SLASH) {
          return inPath + 'index' + DOT + inExt;
        } else {
          return inPath + DOT + inExt;
        }
      },
      getExt: function (inPath) {
        var slashIndex = inPath.lastIndexOf(SLASH);
        var dotIndex = inPath.lastIndexOf(DOT);

        if (dotIndex > slashIndex) {
          return inPath.slice(dotIndex + 1);
        } else {
          return 'js';
        }
      }
    }
  });

}(nx, nx.GLOBAL));
