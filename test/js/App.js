nx.define([
  './modules/mod1',
  '../css/style.css',
  './index-view/'
], function (mod1,_,view) {
  return nx.declare({
    methods: {
      start: function () {
        console.log(view);
        console.log('App start!');
      }
    }
  });
});


