var total = 2;
var Class1 = nx.declare({
  methods: {
    calc: function() {
      total++;
    }
  }
});

var Class2 = nx.declare({
  extends: Class1,
  methods: {
    calc: function() {
      this.parent('calc');
      total = total * 2;
    }
  }
});

var cls2 = new Class2();
cls2.calc();
