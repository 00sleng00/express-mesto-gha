const User = require('../models/user');

const getUsers = async (_, res) => {
  try {
    const users = await User.find({});
    res.status(200).send(users);
  } catch (err) {
    res.status(500).send({
      message: 'Произошла ошибка сервера',
    });
  }
};

const getUserId = async (req, res) => {
  try {
    const userId = await User.findById(req.params.userId);
    if (!userId) {
      res.status(404).send({ message: 'Пользователь не найден' });
      return;
    }
    res.status(200).send({ data: userId });
  } catch (err) {
    if (err.name === 'CastError') {
      res.status(400).send({
        message: 'Пользователя с таким id нет',
      });
      return;
    }
    res.status(500).send({
      message: 'Произошла ошибка сервера',
    });
  }
};

const createUser = async (req, res) => {
  try {
    const { name, about, avatar } = req.body;
    const userCreate = new User({ name, about, avatar });
    res.status(201).send(await userCreate.save());
  } catch (err) {
    if (err.name === 'ValidationError') {
      res.status(400).send({
        message: `${Object.values(err.errors)
          .map((error) => error.message)
          .join(', ')}`,
      });
      return;
    }
    res.status(500).send({
      message: 'Произошла ошибка сервера',
    });
  }
};

const updateUser = async (req, res) => {
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
      res.status(400).send({
        message: `${Object.values(err.errors)
          .map((error) => error.message)
          .join(', ')}`,
      });
      return;
    }
    res.status(500).send({
      message: 'Произошла ошибка в работе сервера',
    });
  }
};

const updateAvatar = async (req, res) => {
  try {
    const { avatar } = req.body;
    const userId = await User.findByIdAndUpdate(
      req.user._id,
      { avatar },
      { new: true, runValidators: true },
    );
    res.status(200).send(userId);
  } catch (err) {
    if (err.name === 'ValidationError') {
      res.status(400).send({
        message: 'Переданы некорректные данные',
      });
      return;
    }
    res.status(500).send({
      message: 'Произошла ошибка сервера',
    });
  }
};

module.exports = {
  getUsers,
  getUserId,
  createUser,
  updateUser,
  updateAvatar,
};
