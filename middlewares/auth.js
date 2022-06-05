const jwt = require('jsonwebtoken');
const AuthorizationError = require('../errors/AuthorizationError');

const { NODE_ENV, JWT_SECRET } = process.env;

const authorization = (next) => {
  next(new AuthorizationError('Необходима авторизация'));
};

// eslint-disable-next-line consistent-return
module.exports = (req, _res, next) => {
  const token = req.cookies.jwt;
  if (!token) {
    return authorization(next);
  }

  let payload;

  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
  } catch (err) {
    return authorization(next);
  }

  req.user = payload;

  next();
};
