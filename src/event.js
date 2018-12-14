(function (nx, global) {

  nx.event = {
    init: function () {
      this.__listeners__ = {};
    },
    destroy: function () {
      this.__listeners__ = {};
    },
    on: function (inName, inHandler, inContext) {
      var map = this.__listeners__;
      var listeners = map[inName] = map[inName] || [];
      listeners.push({
        sender: this,
        handler: inHandler,
        context: inContext
      });
    },
    off: function (inName, inHandler, inContext) {
      var listeners = this.__listeners__[inName];
      var _listeners = nx.slice(listeners, 0);
      if (inHandler) {
        nx.each(listeners, function (index, listener) {
          if (listener.handler === inHandler && (!inContext || listener.context === inContext)) {
            _listeners.splice(index, 1);
          }
        });
        this.__listeners__[inName] = _listeners;
      } else {
        listeners.length = 0;
      }
    },
    fire: function (inName, inArgs) {
      var listeners = this.__listeners__[inName];
      if (listeners) {
        nx.each(listeners, function (_, listener) {
          if (listener && listener.handler) {
            if (listener.handler.call(listener.context || listener.sender, listener.sender, inArgs) === false) {
              return nx.BREAKER;
            }
          }
        });
      }
    }
  };

}(nx, nx.GLOBAL));
