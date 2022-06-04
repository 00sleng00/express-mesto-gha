const bcrypt = require('bcryptjs');
const User = require('../models/user');
const { generateToken, isAuthorization } = require('../utils/jwt');

const NotFoundError = require('../errors/NotFoundError');
const ConflictError = require('../errors/ConflictError');
const AuthorizationError = require('../errors/AuthorizationError');
const ValidationError = require('../errors/ValidationError');
const ServerError = require('../errors/ServerErrror');

const createUser = async (req, res, next) => {
  const {
    email, password, name, about, avatar,
  } = req.body;
  if (!email || !password) {
    next(new AuthorizationError('Неверный логин или пароль'));
    return;
  }
  try {
    const hash = await bcrypt.hash(password, 10);
    const userCreate = new User({
      email,
      password: hash,
      name,
      about,
      avatar,
    });
    res.status(201).send(await userCreate.save());
  } catch (err) {
    if (err.name === 'ValidationError') {
      next(new ValidationError('Ошибка валидации'));
      return;
    }
    if ((err.code === 11000)) {
      next(new ConflictError('Такой пользователь уже существует'));
      return;
    }
    next(new ServerError('Произошла ошибка сервера'));
  }
};

const login = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    next(new ValidationError('Неверный логин или пароль'));
    return;
  }
  try {
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      next(new AuthorizationError('Неверный логин или пароль'));
      return;
    }
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      next(new AuthorizationError('Неверный логин или пароль'));
      return;
    }

    const token = await generateToken(user._id);
    res.status(200).send({ token });
  } catch (err) {
    next(new ServerError('Произошла ошибка сервера'));
  }
};

const getUsers = async (_req, res, next) => {
  try {
    const users = await User.find({});
    res.status(200).send(users);
  } catch (err) {
    next(new ServerError('Произошла ошибка сервера'));
  }
};

const getUser = async (req, res, next) => {
  const isAuth = await isAuthorization(req.headers.authorization);
  if (!isAuth) {
    next(new AuthorizationError('Нет доступа'));
    return;
  }
  try {
    const user = await User.findOne({ id: req.params.id });
    if (!user) {
      next(new NotFoundError('Пользователя нет в базе данных'));
      return;
    }
    res.status(200).send({ data: user });
  } catch (err) {
    if (err.name === 'CastError') {
      next(new ValidationError('Пользователь не найден'));
      return;
    }
    next(new ServerError('Произошла ошибка сервера'));
  }
};

const getUserId = async (req, res, next) => {
  const isAuth = await isAuthorization(req.headers.authorization);
  if (!isAuth) {
    next(new AuthorizationError('Нет доступа'));
    return;
  }
  try {
    const userId = await User.findById(req.params.userId);
    if (!userId) {
      next(new NotFoundError('Пользователя нет в базе данных'));
      return;
    }
    res.status(200).send({ data: userId });
  } catch (err) {
    if (err.name === 'CastError') {
      next(new ValidationError('Пользователя с таким id нет'));
      return;
    }
    next(new ServerError('Произошла ошибка сервера'));
  }
};

const updateUser = async (req, res, next) => {
  try {
    const { name, about } = req.body;
    const userUpdate = await User.findByIdAndUpdate(
      req.user._id,
      { name, about },
      { new: true, runValidators: true },
    );
    res.status(200).send(userUpdate);
  } catch (err) {
    if (err.name === 'ValidationError') {
      next(new ValidationError(`${Object.values(err.errors)
        .map((error) => error.message)
        .join(', ')}`));
      return;
    }
    next(new ServerError('Произошла ошибка сервера'));
  }
};

const updateAvatar = async (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => {
      if (!user) {
        return next(new NotFoundError('Переданы некорректные данные'));
      }
      return res.status(200).send({
        avatar: user.avatar,
      });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError('Переданы некорректные данные'));
      } else {
        next(err);
      }
    });
};

module.exports = {
  login,
  getUser,
  getUsers,
  getUserId,
  createUser,
  updateUser,
  updateAvatar,
};
