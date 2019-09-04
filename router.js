var _ = require("underscore");
var express = require("express");
var router = express.Router();

const mockusername = "test";
const mockpassword = "test";
var KeyService = require("./keyService");

router.post("/session", (req, res, next) => {
  var params = _.pick(req.body, "username", "password", "deviceId");
  if (!params.username || !params.password || !params.deviceId) {
    return res
      .status(400)
      .send({
        error: "username, password, and deviceId are required parameters"
      });
  }
  // todo: remove mock and add db connection
  var passwordMatch = () => {
    return params.username == mockusername && params.password == mockpassword;
  };

  if (passwordMatch) {
    var token = KeyService.set(params.username, params.deviceId);

    return KeyService.set(params.username, params.deviceId)
        .then(function(token) {
          res.status(200).send({
            accessToken: token
          });
        });
  } else {
    return res.status(403).send({
        error: 'Incorrect password'
      });
  }
});

// Get Session
router.get("/sessions/:sessionKey", function(req, res, next) {
  var sessionKey = req.params.sessionKey;
  if (!sessionKey) {
    return res
      .status(400)
      .send({ error: "sessionKey is a required parameters" });
  }

  KeyService.get(sessionKey)
    .then(function(result) {
      if (_.isNull(result)) {
        return res
          .status(404)
          .send({
            error:
              "Session does not exist or has " +
              "expired. Please sign in to continue."
          });
      }
      res.status(200).send({ userKey: result });
    })
    .catch(function(error) {
      console.log(error);
      next(error);
    });
});

// Logout
router.delete("/sessions/:sessionKey", function(req, res, next) {
  var sessionKey = req.params.sessionKey;
  if (!sessionKey) {
    return res
      .status(400)
      .send({ error: "sessionKey is a required parameter" });
  }

  KeyService.delete(sessionKey)
    .then(function(result) {
      if (!result) {
        return res.status(404).send();
      }
      res.status(204).send();
    })
    .catch(function(error) {
      console.log(error);
      next(error);
    });
});

module.exports = router;
