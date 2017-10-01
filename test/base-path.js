var assert = require('assert');
var nx = require('../src/base');

describe('src/base-path', function () {

  it('nx.path - get from object array[0]', function () {
    var object = { 'a': [{ 'b': { 'c1': 3, 'c2': 5 } }] };
    var object_copy = { 'a': [{ 'b': { 'c1': 3, 'c2': 5 } }] };

    assert.equal(
      nx.path(object,'a[0].b.c1'), 3
    );

    assert.equal(
      nx.path(object,'a[0].b.c2'), 5
    );

    nx.path(object_copy,'a[0].b.c1','afei');
    assert.equal(
      nx.path(object_copy,'a[0].b.c1'), 'afei'
    );

  });



  it('nx.path - get from deep object', function () {
    var object = {
        obj1: {
            obj2: {
                data1: 213,
                data2: "1231",
                obj3: {
                    data: "milf"
                }
            }
        },
        obj4: {
            description: "toto"
        }
    };

    var object_copy = {
      obj1: {
          obj2: {
              data1: 213,
              data2: "1231",
              obj3: {
                  data: "milf"
              }
          }
      },
      obj4: {
          description: "toto"
      }
  };

    assert.equal(
      nx.path(object,'obj1.obj2.data1'), 213
    );


    nx.path(object_copy,'obj1.obj2.data1','afei');
    assert.equal(
      nx.path(object,'obj1.obj2.data1'), 'afei'
    );


  });


});
