const nx = require('../../dist/index');

describe('src/core/createOverload', function () {
  test('nx.createOverload', function () {
    var getUsers = nx.createOverload();
    var users = [
      { id: 1, name: 'fei' },
      { id: 2, name: 'lee' },
      { id: 3, name: 'zoe' },
      { id: 4, name: 'zoe' }
    ];

    // add impl
    // get by id
    getUsers.add({
      args: ['number'],
      fn: function (id) {
        return users.find((item) => item.id === id);
      }
    });

    // get all
    getUsers.add({
      args: [],
      fn: function () {
        return users;
      }
    });

    // get by name
    getUsers.add({
      args: ['string'],
      fn: function (name) {
        return users.filter((item) => item.name === name);
      }
    });

    // get by ids
    getUsers.add({
      args: ['array'],
      fn: function (ids) {
        return users.filter((item) => ids.includes(item.id));
      }
    });

    expect(getUsers(1)).toEqual({ id: 1, name: 'fei' });
    expect(getUsers()).toEqual(users);
    expect(getUsers('zoe')).toEqual([
      { id: 3, name: 'zoe' },
      { id: 4, name: 'zoe' }
    ]);

    expect(getUsers([1, 2])).toEqual([
      { id: 1, name: 'fei' },
      { id: 2, name: 'lee' }
    ]);
  });
});
