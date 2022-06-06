const express = require('express');

const userRoutes = express.Router();
const { celebrate, Joi } = require('celebrate');

const { reg } = require('../utils/constants');

const {
  getUsers,
  getUser,
  getUserId,
  updateUser,
  updateAvatar,
} = require('../controllers/users');

userRoutes.get('/', getUsers);

userRoutes.get('/me', getUser);

userRoutes.get('/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().required().length(24).hex(),
  }),
}), getUserId);

userRoutes.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
}), updateUser);

userRoutes.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().regex(reg),
  }),
}), updateAvatar);

module.exports = {
  userRoutes,
};
