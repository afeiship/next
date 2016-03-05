nx.define([
  './modules/mod1',
  '../css/style.css'
], function (mod1) {
  return nx.declare({
    methods: {
      start: function () {
        console.log('App start!');
      }
    }
  });
});


