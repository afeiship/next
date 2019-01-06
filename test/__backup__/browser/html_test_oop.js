var Class1 = nx.declare({
  statics: {
    instance: null,
    getInst: function() {
      console.log('get instance');
      return this.instance;
    }
  }
});

var Class2 = nx.declare({
  extends: Class1
});

var cls1 = new Class1();
var cls2 = new Class2();
