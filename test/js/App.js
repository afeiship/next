nx.define([
  './modules/mod1',
  '../css/style.css',
  './index-view/'
], function (mod1, _, view) {
  return nx.declare({
    methods: {
      start: function () {
        console.dir(view[0]);
        console.dir(view[1]);
        console.log('App start!');
      }
    }
  });
});
