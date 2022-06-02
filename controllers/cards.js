const Card = require('../models/card');

const NotFoundError = require('../errors/NotFoundError');
const ValidationError = require('../errors/ValidationError');
const ServerError = require('../errors/ServerErrror');

const getCards = async (_, res, next) => {
  try {
    const users = await Card.find({});
    res.status(200).send(users);
  } catch (err) {
    next(new ServerError('Произошла ошибка сервера'));
  }
};

const createCard = async (req, res, next) => {
  try {
    const { name, link } = req.body;
    res
      .status(201)
      .send(await Card.create({ name, link, owner: req.user._id }));
  } catch (err) {
    if (err.name === 'ValidationError') {
      next(new ValidationError('Ошибка введеных данных'));
      return;
    }
    next(new ServerError('Произошла ошибка сервера'));
  }
};

const deleteCardId = async (req, res, next) => {
  try {
    const cardId = await Card.findByIdAndRemove(req.params.cardId);
    if (!cardId) {
      next(new NotFoundError('Карточка не найдена'));
    }
    res.status(200).send(cardId);
  } catch (err) {
    if (err.name === 'CastError') {
      next(new ValidationError('Невалидный id'));
    }
    next(new ServerError('Произошла ошибка сервера'));
  }
};

const likeCard = async (req, res, next) => {
  try {
    const like = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    );
    if (!like) {
      next(new NotFoundError('Карточка не найдена'));
      return;
    }
    res.status(200).send({ data: like });
  } catch (err) {
    if (err.name === 'CastError') {
      next(new ValidationError('Переданы некорректные данные'));
      return;
    }
    next(new ServerError('Произошла ошибка сервера'));
  }
};

const dislikeCard = async (req, res, next) => {
  try {
    const dislike = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } },
      { new: true },
    );
    if (!dislike) {
      next(new NotFoundError('Карточка не найдена'));
      return;
    }
    res.status(200).send({ data: dislike });
  } catch (err) {
    if (err.name === 'CastError') {
      next(new ValidationError('Переданы некорректные данные'));
      return;
    }
    next(new ServerError('Произошла ошибка сервера'));
  }
};

module.exports = {
  getCards,
  createCard,
  deleteCardId,
  likeCard,
  dislikeCard,
};
