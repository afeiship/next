var Mixin1 = nx.declare({
  methods: {
    init: function () {
      console.log('mixin 1 init!');
    },
    say: function () {
      console.log('say!');
    }
  }
});

var Mixin2 = nx.declare({
  methods: {
    init: function () {
      console.log('mixin 2 init!');
    },
    hello: function () {
      console.log('hello!');
    }
  }
});


nx.declare('Class1', {
  mixins: [
    Mixin1,
    Mixin2
  ],
  statics: {
    static1: 1233,
    status: 'loading'
  },
  properties: {
    prop1: 1234,
    prop2: {
      value: {
        name: 'fei'
      }
    }
  },
  methods: {
    init: function () {
      console.log('method init!');
    }
  }
});


var cls1 = new Class1();


var Class11 = nx.declare({
  properties: {
    prop1: {
      get: function () {
        return this._prop1;
      },
      set: function (inValue) {
        this._prop1 = inValue * 2;
      }
    },
    prop2: 'love'
  }
});

var Class22 = nx.declare({
  extends: Class11,
  properties: {
    prop1: {
      set: function (inValue) {
        this.base(inValue + 100)
      }
    }
  }
});

var cl22 = new Class22();
cl22.prop1 = 2;

console.log(cl22.prop1);
console.log(cl22.prop2);
