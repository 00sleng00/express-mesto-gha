const jwt = require('jsonwebtoken');

const JWT_SECRET_KEY = '1234567890987654321';
// eslint-disable-next-line no-return-await
const generateToken = async (id) => await jwt.sign({ id }, JWT_SECRET_KEY, { expiresIn: '7d' });

const isAuthorization = async (token) => {
  try {
    const decoded = await jwt.verify(token, JWT_SECRET_KEY);
    return !!decoded;
  } catch (err) {
    return false;
  }
};

module.exports = {
  generateToken,
  isAuthorization,
};
