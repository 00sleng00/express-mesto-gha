const jwt = require('jsonwebtoken');

const JWT_SECRET_KEY = '1234567890987654321';
// eslint-disable-next-line no-return-await
const generateToken = async (id) => await jwt.sign({ id }, JWT_SECRET_KEY, { expiresIn: '7d' });

module.exports = {
  generateToken,
};
