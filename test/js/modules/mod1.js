nx.define(['./mod2'], function (mod2) {
  return nx.declare({
    methods: {
      init: function () {
        this._mod2 = mod2;
        console.log('I am mod1!');
      }
    }
  });
});
