var redis = require('redis');
var Promise = require('bluebird');
var config = require('nconf');
var uuid = require('uuid');

var JWT = require('./jwt');

Promise.promisifyAll(redis.RedisClient.prototype);

function KeyService() {
  this.client = redis.createClient(config.get('key_service:port'),
                                   config.get('key_service:host'));
  this.client.on('connect', function() {
    console.log('Redis connected.');
  });
  console.log('Connecting to Redis...');
};

KeyService.prototype.get = (sessionKey)=>{
  return this.client.getAsync(sessionKey);
};

KeyService.prototype.set = function(username, deviceId) {
  var userKey = uuid.v4();
  var issuedAt = new Date().getTime();
  var expiresAt = issuedAt + 3600;

  var token = JWT.generate(username, deviceId, userKey, issuedAt, expiresAt);
  var key = username + deviceId + issuedAt;

  var setKey = this.client.setAsync(key, userKey);
  var setExpiration = setKey.then(this.client.expireAsync(key, 3600));
  var getToken = setExpiration.then(function() {
    return token;
  });
  return getToken;
};

KeyService.prototype.delete = function(sessionKey) {
  return this.client.delAsync(sessionKey);
};

module.exports = new KeyService();
