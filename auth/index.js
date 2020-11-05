const jwt = require('jsonwebtoken');
const config = require('../config');
const error = require('../utils/error');
const store = require('../store/dummy');

const TABLE = 'tokens';
const { secret } = config.jwt;

function sign(data) {
  return jwt.sign(data, secret);
}

function verify(token) {
  try {
    return jwt.verify(token, secret);
  } catch (e) {
    throw error(e.message, 401);
  }
}

function getToken(auth) {
  if (!auth) {
    throw error('Invalid Token', 401);
  }

  if (auth.indexOf('Bearer ') === -1) {
    throw error('Invalid Token', 401);
  }

  const token = auth.replace('Bearer ', '');
  return token;
}

async function decodeHeader(req) {
  const authorization = req.headers.authorization || '';
  const token = getToken(authorization);
  const decoded = verify(token);
  req.user = decoded.user;
  const currentToken = await store.query(TABLE, {
    userId: req.user.id,
  });
  if (currentToken[0].token === token) {
    return decoded;
  }
  throw error('Invalid Token', 401);
}

const check = {
  logged: async function (req) {
    const decoded = await decodeHeader(req);
    return decoded;
  },
};

module.exports = {
  sign,
  verify,
  check,
};
