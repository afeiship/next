var Http = nx.declare({
  methods: {
    init: function () {
      this.koa = {
        req: 1234
      }
    }
  }
});

var Bussiness = nx.declare({
  extends:Http,
});

var Example = nx.declare({
  extends: Bussiness,
  methods:{
    say:function(){
      console.log(this.koa.req);
    }
  }
});

var ex = new Example();
