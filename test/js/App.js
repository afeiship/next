nx.define(['./modules/mod1'], function (mod1) {
  return nx.declare({
    methods: {
      start: function () {
        console.log('App start!');
      }
    }
  });
});
