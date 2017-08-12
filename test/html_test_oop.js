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
    Mixin2,
  ],
  statics: {
    static1: 1233,
    status: 'loading',
    init: function () {
      console.log('static init!');
    }
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
