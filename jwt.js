var _ = require('underscore');
var jsrsasign = require('jsrsasign');
var config = require('nconf');

var JWT_ENCODING_ALGORITHM = 'HS256';
var JWT_SECRET_SEPARATOR = ':';

function JWT(){
  this.secretKey = 'workworkwork';
}

JWT.prototype.generate = function(username, deviceId, userkey, issuedAt, expiresAt){
  var header = {
    alg : JWT_ENCODING_ALGORITHM, typ : 'JWT'
  };

  var payload = {
    username: username,
    deviceId: deviceId,
    jti: username + deviceId + issuedAt,
    iat: issuedAt,
    exp: expiresAt
  };

  var secret = this.secret(userkey);
  var token = jsrsasign.jws.JWS.sign(JWT_ENCODING_ALGORITHM,
    JSON.stringify(header), JSON.stringify(payload), secret);

    return token;
};

JWT.prototype.verify = function(token, userKey) {
  var secret = this.secret(userKey);
  var isValid = jsrsasign.jws.JWS.verifyJWT(token,
                                            secret,
                                            {
                                              alg: [JWT_ENCODING_ALGORITHM],
                                              verifyAt: new Date().getTime()});
  return isValid;
};

JWT.prototype.secret = function(userkey){
  return this.secretKey + JWT_SECRET_SEPARATOR + userkey;
};

module.exports = new JWT();
