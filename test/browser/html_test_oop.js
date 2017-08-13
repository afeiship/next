var coding = false;
var study = false;
var fly = false;
var superman_init = false;
var superFly = false;

var Programmer = nx.declare('PP', {
  properties: {
    pp1: 'pp1-value'
  },
  methods: {
    coding: function () {
      coding = true;
    }
  }
});

var Student = nx.declare('SS', {
  properties: {
    ss1: 'ss1-value'
  },
  methods: {
    study: function () {
      study = true;
    }
  }
});

var Bird = nx.declare('BB', {
  methods: {
    fly: function () {
      fly = true;
    }
  }
});

var SuperMan = nx.declare('SPM', {
  mixins: [
    Programmer,
    Student,
    Bird
  ],
  properties: {
    pp1: 'spm-pp1-value'
  },
  methods: {
    init: function () {
      superman_init = true;
      //console.log('I have many skills!');
    },
    fly: function () {
      this.base();
      superFly = true;
    }
  }
});

var superman = new SuperMan();
superman.coding();
superman.study();
superman.fly();
