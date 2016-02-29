var Class1 = nx.declare({
  properties: {
    prop1: {
      get: function () {
        return this._prop1;
      },
      set: function (inValue) {
        this._prop1 = inValue * 2;
      }
    }
  }
});

var Class2 = nx.declare({
  extend: Class1,
  properties: {
    prop1: {
      set: function (inValue) {
        this.base(inValue + 100);
      }
    }
  }
});
var cls2 = new Class2();
cls2.prop1 = 2;
