'use strict';

/**
 * Redis store
 * https://github.com/NodeRedis/node_redis
 */
var redis = require('redis');

var blacklist = require('../');
var debug = require('../debug').log;

module.exports = function (store) {
  var host = store.host || '127.0.0.1';
  var port = store.port || 6379;
  var url = store.url;

  store.options = store.options || {};

  var client =
    store.client || url
      ? redis.createClient(url, store.options)
      : redis.createClient(port, host, store.options);
  client.on('error', error);

  return {
    set: function (key, value, lifetime, fn) {
      // Serialize array
      if (value[blacklist.TYPE.revoke]) {
        value[blacklist.TYPE.revoke] = value[blacklist.TYPE.revoke].toString();
      }
      client.hmset(key, value, fn);
      if (lifetime) client.expire(key, lifetime);
    },
    get: function (key, fn) {
      client.hgetall(key, function (err, res) {
        // De-serialize comma separated value, convert to numbers if necessary
        if (res && res[blacklist.TYPE.revoke]) {
          res[blacklist.TYPE.revoke] = res[blacklist.TYPE.revoke].split(',').map(function (i) {
            return isNaN(i) ? i : parseInt(i, 10);
          });
        }
        fn(err, res);
      });
    },
  };
};

function error(err) {
  debug('Redis: ' + err);
}
