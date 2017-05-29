const restify = require('restify');
const searchUsersByLang = require('./lib').searchUsersByLang;

const PORT = 8080;

const server = restify.createServer();

server.get('/search/:lang', searchUsersByLang);

server.listen(PORT, function() {
  console.log('%s listening at %s', server.name, server.url);
});