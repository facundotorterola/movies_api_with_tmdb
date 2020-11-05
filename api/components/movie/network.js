/* eslint-disable no-use-before-define */
const express = require('express');

const router = express.Router();
const Controller = require('./index');
const response = require('../../../network/response');
const secure = require('../middleware/secure');
// Router
router.get('/', secure('logged'), list);
router.post('/favorites', secure('logged'), addFavorite);
router.get('/favorites', secure('logged'), listFavorites);

function list(req, res, next) {
  Controller.list(req.query)
    .then((data) => {
      response.success(req, res, data, 200);
    })
    .catch(next);
}

function addFavorite(req, res, next) {
  Controller.addFavorite(req.user, req.body)
    .then((data) => {
      response.success(req, res, data, 200);
    })
    .catch(next);
}

function listFavorites(req, res, next) {
  Controller.listFavorites(req.user)
    .then((data) => {
      response.success(req, res, data, 200);
    })
    .catch(next);
}

module.exports = router;
