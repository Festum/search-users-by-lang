const request = require('superagent');
const CONFIG = require('./config.json');
const GITHUBAPIEP = CONFIG.github.url;
const GITHUBTOKEN = CONFIG.github.token;

function validFieldFilter(q, param) {
  if (q.hasOwnProperty('sort'))
    if (['stars', 'forks', 'updated'].includes(q.sort)) 
      param.sort = q.sort;
  if (q.hasOwnProperty('order'))
    if (['desc', 'asc'].includes(q.order)) 
      param.order = q.order;
  if (q.hasOwnProperty('page'))
    if (q.page>0)
      param.page = q.page;
  if (q.hasOwnProperty('per_page')) 
    if (q.per_page>10)
      param.per_page = q.per_page;
  return param;
}

function searchUsersByLang(req, res){

  let getUserPromise = function(username){
    return new Promise(function(resolve, reject) {
      getUser(username, (err, user) => {
        if(!err) 
          resolve({ 
            username: user.login,
            name: user.name,
            avatar_url: user.avatar_url,
            followers: user.followers
          });
      });
    });
  };

  let getUsersBylangPromise = function(q){
    return new Promise(function(resolve, reject) {
      getUsersBylang(q, (err, users) => {
        if(!err) {
          let promise = [], profiles =[];
          users.forEach( u => {
            promise.push(
              getUserPromise(u).then(v => {
                profiles.push(v);
              }).catch( v => {
                console.log(v);
              })
            );
          });
          Promise.all(promise).then(v => { 
            resolve(profiles); 
          }, reason => {
            console.log(reason);
            reject(reason);
          }).catch(err => {
            console.log(`Promise Rejected ${err}`);
            reject(err);
          });
        }
      });
    });
  };

  getUsersBylangPromise(validFieldFilter(req.query, {q: `language:${req.params.lang}`, sort: 'stars', order: 'desc'})).then(v => {
    res.send(200, v);
  }).catch( v => {
    console.log(v);
    res.send(500, v);
  });
}

let getUsersBylang = function(q, callback) {
  request
    .get(`${GITHUBAPIEP}/search/repositories`)
    .query(q)
    .set('Authorization', `token ${GITHUBTOKEN}`)
    .end(function(err, res) {
      if (!err) {
        let users = [];
        res.body.items.forEach(function(i) {
          if (i.owner.type === 'User')
            users.push(i.owner.login);
        });
        callback(null, Array.from(new Set(users)));
      } else {
        console.log(err);
        callback('Error Occurred!');
      }
    });
};

let getUser = function(username, callback) {
  request
    .get(`${GITHUBAPIEP}/users/${username}`)
    .set('Authorization', `token ${GITHUBTOKEN}`)
    .end(function(err, res) {
      if (!err) {
        callback(null, res.body);
      } else {
        console.log(err);
        callback('Error Occurred!');
      }
    });
};

module.exports.searchUsersByLang = searchUsersByLang;
module.exports.getUsersBylang = getUsersBylang;
module.exports.getUser = getUser;
module.exports.validFieldFilter = validFieldFilter;