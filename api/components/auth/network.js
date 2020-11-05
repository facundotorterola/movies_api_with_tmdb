/* eslint-disable no-use-before-define */
const express = require('express');

const router = express.Router();
const Controller = require('./index');
const response = require('../../../network/response');
const secure = require('../middleware/secure');

router.delete('/logout', secure('logged'), logout);
router.post('/login', login);
router.post('/signup', signup);

function logout(req, res, next) {
  Controller.logout(req.user)
    .then((token) => {
      response.success(req, res, token, 200);
    })
    .catch(next);
}

function login(req, res, next) {
  Controller.login(req.body.email, req.body.password)
    .then((token) => {
      response.success(req, res, token, 200);
    })
    .catch(next);
}

function signup(req, res, next) {
  Controller.signup(req.body)
    .then((token) => {
      response.success(req, res, token, 201);
    })
    .catch(next);
}

module.exports = router;
