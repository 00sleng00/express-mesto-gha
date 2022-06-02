const jwt = require('jsonwebtoken');
const AuthorizationError = require('../errors/AuthorizationError');

module.exports = (req, _res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    next(new AuthorizationError('Необходима авторизация'));
    return;
  }

  const token = authorization;
  let payload;

  try {
    payload = jwt.verify(token, 'some-secret');
  } catch (err) {
    next(new AuthorizationError('Необходима авторизация'));
    return;
  }

  req.user = payload;
  next();
};
