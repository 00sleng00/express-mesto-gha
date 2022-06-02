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
    password: Joi.string().required().length(24),
  }),
}), getUserId);
userRoutes.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
}), updateUser);
userRoutes.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required(reg),
  }),
}), updateAvatar);

module.exports = {
  userRoutes,
};
