(function (nx, global) {

  nx.define(function () {
    return nx.declare({
      module: 'View2',
      methods: {
        init: function () {
          console.log('view2 init!');
        }
      }
    });
  });

}(nx, nx.GLOBAL));
