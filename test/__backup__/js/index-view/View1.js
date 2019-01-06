(function (nx, global) {

  nx.define(function () {
    return nx.declare({
      module: 'View1',
      methods: {
        init: function () {
          console.log('view1 init!');
        }
      }
    });
  });

}(nx, nx.GLOBAL));
