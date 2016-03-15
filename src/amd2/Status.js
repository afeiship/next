(function (nx, global) {

  nx.declare('nx.amd.Status', {
    statics: {
      PENDING: 0,
      LOADING: 1,
      RESOLVING: 2,
      RESOLVED: 3
    }
  });

}(nx, nx.GLOBAL));
