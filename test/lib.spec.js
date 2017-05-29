const expect = require('chai').expect;
const nock = require('nock');
const search4Users = require('../lib').search4Users;
const validFieldFilter = require('../lib').validFieldFilter;
const getUsersBylang = require('../lib').getUsersBylang;
const getUser = require('../lib').getUser;


describe('Parameters', function() {
  it('skip invalid arguments', done => {
    let param = validFieldFilter({sort: 'error', order: 'tab', page: 0, per_page: 5000}, {});
    expect(param).to.not.have.property('sort');
    expect(param).to.not.have.property('order');
    expect(param).to.not.have.property('page');
    expect(param).to.have.property('per_page');
    expect(param.per_page).to.equal(5000);
    done();
  });
});

describe('GET user', function() {
  let username = 'Festum';
  beforeEach(function() {
    var repoResponse = {
        login: "Festum",
        type: "User"
    };
    nock('https://api.github.com')
      .get(`/users/${username}`)
      .reply(200, repoResponse);
  });
  it('returns user', done => {
    getUser(username, (err, user) => {
      expect(user).to.have.property('type');
      expect(user.type).to.be.a('string');
      expect(user.login).to.equal(username);
      done();
    });
  });
});

describe('GET users in repo', function() {
   beforeEach(function() {
    var repoResponse = { 
      items:[{ 
        owner: {
          login: "Festum",
          type: "User"
       }
      }, { 
      owner: {
        login: "nanocat",
        type: "User"
      }
      }]
    };
    nock('https://api.github.com')
      .get('/search/repositories')
      .query(true)
      .reply(200, repoResponse);
  });

  it('returns users', done => {
    let q = {q: `language: php`, sort: 'stars', order: 'desc'};
    getUsersBylang(q, (err, users) => {
      expect(Array.isArray(users)).to.equal(true);
      expect(users).to.have.length.above(1);
      users.forEach(function(user) {
        expect(user).to.be.a('string');
      });
      done();
    });
  });
});

