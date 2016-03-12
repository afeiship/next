nx.declare('Class1', {
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
