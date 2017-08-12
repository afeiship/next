var coding = false;
var study = false;
var fly = false;
var superman_init = false;
var superFly = false;

var Programmer = nx.declare({
  methods: {
    coding: function () {
      coding = true;
    }
  }
});

var Student = nx.declare({
  methods: {
    study: function () {
      study = true;
    }
  }
});

var Bird = nx.declare({
  methods: {
    fly: function () {
      fly = true;
    }
  }
});


var SuperMan = nx.declare({
  mixins: [
    Programmer,
    Student,
    Bird
  ],
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
